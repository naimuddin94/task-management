class AppError extends Error {
  public data: null;
  public success: boolean;
  constructor(
    public statusCode: number,
    public message: string = 'Something went wrong!',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public errors: any[] = [],
    public stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
