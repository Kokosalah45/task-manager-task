import { HttpStatus } from '@nestjs/common';
import { BaseException } from './BaseException';

export class AlreadyExistException extends BaseException {
  constructor(entity: string) {
    super(`${entity} already exists`, 'ALREADY_EXIST', HttpStatus.CONFLICT);
  }
}
