import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential, UserInfo } from "@microsoft/teamsfx";
import config from "../config";

export interface AuthenticatedRequest extends HttpRequest {
  user?: UserInfo;
}

export async function authenticateRequest(
  req: HttpRequest,
  context: InvocationContext
): Promise<{ success: boolean; user?: UserInfo; error?: string }> {
  try {
    const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "").trim();
    
    if (!accessToken) {
      return { success: false, error: "No access token provided" };
    }

    const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
      authorityHost: config.authorityHost,
      clientId: config.clientId,
      tenantId: config.tenantId,
      clientSecret: config.clientSecret,
    };

    const oboCredential = new OnBehalfOfUserCredential(accessToken, oboAuthConfig);
    const userInfo = await oboCredential.getUserInfo();

    return { success: true, user: userInfo };
  } catch (error) {
    context.error('Authentication error:', error);
    return { success: false, error: "Invalid access token" };
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest, context: InvocationContext) => Promise<HttpResponseInit>) {
  return async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const authResult = await authenticateRequest(req, context);
    
    if (!authResult.success) {
      return {
        status: 401,
        body: JSON.stringify({ error: authResult.error || "Authentication required" })
      };
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = authResult.user;
    
    return handler(authenticatedReq, context);
  };
}
