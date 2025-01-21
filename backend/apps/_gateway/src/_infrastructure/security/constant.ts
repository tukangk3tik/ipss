export const jwtConstants = {
  accessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ?? 'Kb0nuCQvX5vq98LvaqILch1oUiVfopR9',
  refreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ?? 'qpkbt19gSh0ywvQoov9tDYwoOacCJv',
  expiresIn: process.env.JWT_EXPIRED ?? '1h',
  expiresInNumber: process.env.JWT_EXPIRED_NUMBER
    ? parseInt(process.env.JWT_EXPIRED_NUMBER)
    : 3600,
};

export const passwordHash = {
  saltRound: process.env.SALT_ROUND ?? 10,
};
