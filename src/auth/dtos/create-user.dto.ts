import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  MESSAGES,
  MIN_PASSWORD_LENGTH,
  REGEX,
} from 'src/users/constants/user.validation';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: MESSAGES.EMAIL_INVALID,
    },
  )
  email: string;

  @IsNotEmpty()
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: MESSAGES.PASSWORD_LENGTH_INVALID,
  })
  @Matches(REGEX.PASSWORD, {
    message: MESSAGES.PASSWORD_FORMAT_INVALID,
  })
  password: string;

  @IsNotEmpty()
  @Matches(REGEX.NAME, {
    message: MESSAGES.NAME_INVALID,
  })
  name: string;
}
