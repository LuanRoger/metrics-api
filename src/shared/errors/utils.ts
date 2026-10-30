import type { ZodError } from "zod";
import { ServiceRequestError, UnexpectedServiceResponseParseError } from ".";

export function formatValidationIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: issue.path.map((segment) =>
      typeof segment === "symbol" ? String(segment) : segment
    ),
  }));
}

export function formatServiceError(error: unknown) {
  if (error instanceof UnexpectedServiceResponseParseError) {
    return {
      code: "INVALID_SERVICE_RESPONSE",
      details: formatValidationIssues(error.validationError),
      message: `${error.serviceName} returned an invalid response.`,
    };
  }
  if (error instanceof ServiceRequestError) {
    return {
      code: "SERVICE_REQUEST_FAILED",
      message: `${error.serviceName} request failed.`,
    };
  }
}
