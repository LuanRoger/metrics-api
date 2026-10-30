import type { ZodError } from "zod";

export class ServiceRequestError extends Error {
  readonly serviceName: string;

  constructor(serviceName: string, cause: unknown) {
    super(`${serviceName} request failed`, { cause });
    this.name = "ServiceRequestError";
    this.serviceName = serviceName;
  }
}

export class UnexpectedServiceResponseParseError extends Error {
  readonly serviceName: string;
  readonly validationError: ZodError;

  constructor(serviceName: string, error: ZodError) {
    super(`${serviceName} returned an invalid response`, { cause: error });
    this.name = "UnexpectedServiceResponseParseError";
    this.serviceName = serviceName;
    this.validationError = error;
  }
}
