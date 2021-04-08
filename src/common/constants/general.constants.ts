export const resetPasswordLinkExpireHours = 1; // 1 hour
export const searchLinkExpireHours = 24 * 7; // 1 week
export const defaultSortFieldName = 'createdAt';
export const maxHttpBodySize = '50mb';

export const jwtConstants = {
  secret: 'nestjs-pg-boilerplate-security',
  expiresIn: '20d',
};
