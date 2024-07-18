import { HttpStatus } from '@nestjs/common';
import { BaseException } from './BaseException';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      'Please provide a valid email address and password',
      'INVALID_CREDENTIALS',
      HttpStatus.BAD_REQUEST,
    );
  }
}
