export const jwtConstants = {
  accessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ?? 'Kb0nuCQvX5vq98LvaqILch1oUiVfopR9',
  refreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ?? 'qpkbt19gSh0ywvQoov9tDYwoOacCJv',
  expiresIn: process.env.JWT_EXPIRED ?? '60s',
};

export const passwordHash = {
  saltRound: process.env.SALT_ROUND ?? 10,
};
