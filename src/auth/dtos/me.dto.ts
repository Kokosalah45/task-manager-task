import { Exclude } from 'class-transformer';

export class MeDTO {
  name: string;
  email: string;

  @Exclude()
  iat: number;

  @Exclude()
  exp: number;

  constructor(partial: Partial<MeDTO>) {
    Object.assign(this, partial);
  }
}
