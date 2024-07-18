export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 20;

export const REGEX = {
  NAME: /^[a-zA-Z0-9]{3,}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
};

export const MESSAGES = {
  EMAIL_INVALID: 'Invalid email format',
  NAME_INVALID: 'Invalid name format',
  PASSWORD_FORMAT_INVALID:
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  PASSWORD_LENGTH_INVALID: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long`,
};
