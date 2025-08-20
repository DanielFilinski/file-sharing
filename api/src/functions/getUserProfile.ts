import { app, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { OnBehalfOfUserCredential } from "@microsoft/teamsfx";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import config from "../config";

export async function getUserProfile(
  req: AuthenticatedRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  const body: any = {};

  // Put an echo into response body.
  body.receivedHTTPRequestBody = (await req.text()) || "";

  // User info from authentication middleware
  if (req.user) {
    body.userInfo = {
      displayName: req.user.displayName,
      preferredUserName: req.user.preferredUserName,
      objectId: req.user.objectId
    };
  }

  // Create a graph client with default scope to access user's Microsoft 365 data after user has consented.
  try {
    const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "").trim();
    if (!accessToken) {
      return {
        status: 400,
        body: JSON.stringify({
          error: "No access token was found in request header.",
        }),
      };
    }

    const oboCredential = new OnBehalfOfUserCredential(accessToken, {
      authorityHost: config.authorityHost,
      clientId: config.clientId,
      tenantId: config.tenantId,
      clientSecret: config.clientSecret,
    });

    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(oboCredential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    // Initialize Graph client instance with authProvider
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    body.graphClientMessage = await graphClient.api("/me").get();
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: JSON.stringify({
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      }),
    };
  }

  return {
    status: 200,
    body: JSON.stringify(body)
  };
}

app.http("getUserProfile", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireAuth(getUserProfile),
});

// You can replace the codes above from the function body with comment "Query user's information from the access token." to the end
// with the following codes to use application permission to get user profiles.
// Remember to get admin consent of application permission "User.Read.All".
/*
// Query user's information from the access token.
  let userName: string;
  try {
    const currentUser: UserInfo = await teamsfx.getUserInfo();
    console.log(currentUser);
    userName = currentUser.preferredUserName; // Will be used in app credential flow
    if (currentUser && currentUser.displayName) {
      res.body.userInfoMessage = `User display name is ${currentUser.displayName}.`;
    } else {
      res.body.userInfoMessage = "No user information was found in access token.";
    }
  } catch (e) {
    context.error(e);
    return {
      status: 400,
      body: {
        error: "Access token is invalid.",
      },
    };
  }

  // Use IdentityType.App + client secret to create a teamsfx
  const appAuthConfig: AppCredentialAuthConfig = {
    clientId: process.env.M365_CLIENT_ID,
    clientSecret: process.env.M365_CLIENT_SECRET,
    authorityHost: process.env.M365_AUTHORITY_HOST,
    tenantId: process.env.M365_TENANT_ID,
  };
  try {
    const appCredential = new AppCredential(appAuthConfig);
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: {
        error:
          "App credential error:" +
          "Failed to construct TeamsFx using your accessToken. " +
          "Ensure your function app is configured with the right Microsoft Entra App registration.",
      },
    };
  }

  // Create a graph client with default scope to access user's Microsoft 365 data after user has consented.
  try {
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(appCredential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    // Initialize the Graph client
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    const profile: any = await graphClient.api("/users/"+userName).get();
    res.body.graphClientMessage = profile;
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      },
    };
  }
*/
