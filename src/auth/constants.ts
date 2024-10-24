if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing');
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};