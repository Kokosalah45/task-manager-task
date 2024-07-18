import { Request } from 'express';
import { UserToken } from './UserToken';

export class RequestWithUser extends Request {
  user: UserToken;
}
