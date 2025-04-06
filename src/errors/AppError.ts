/* eslint-disable @typescript-eslint/no-explicit-any */
export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly variables?: any;

  constructor(
    message: string,
    statusCode = 400,
    errorCode = "",
    variables = {},
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.variables = variables;
  }
}
