import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    readonly message = 'Something went wrong with the server. Please try again later.',
    readonly code = 'INTERNAL_SERVER_ERROR',
    readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        message,
        statusCode,
        code,
      },
      statusCode,
    );
  }
}
