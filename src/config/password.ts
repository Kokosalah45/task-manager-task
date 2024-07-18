import { registerAs } from '@nestjs/config';

export default registerAs('password', () => ({
  saltOrRounds: 10,
}));
