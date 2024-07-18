import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(private readonly configSerivce: ConfigService) {}
  async hashPassword(password: string): Promise<string> {
    const saltRound = this.configSerivce.get<number>('password.saltOrRounds');
    return await bcrypt.hash(password, saltRound);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
