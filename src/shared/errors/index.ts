export class ServiceRequestError extends Error {
  constructor(serviceName: string, error: Error) {
    super(error.message);
    this.name = "ServiceRequestError";
    this.message = `Service ${serviceName} failed: ${error.message}`;
  }
}

export class UnexpectedServiceResponseParseError extends Error {
  constructor(serviceName: string, error: Error) {
    super(error.message);
    this.name = "UnexpectedServiceResponseParseError";
    this.message = `Service ${serviceName} failed: ${error.message}`;
  }
}
