import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET, SALT } = process.env;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

const saltRounds = SALT ?? 11;

const jwtOptions = {
  secret: JWT_SECRET,
  alg: 'HS256' as const,
  expTime: 31 * 24 * 60 * 60,
};

export { jwtOptions, saltRounds };
