export const HEADER = {
  X_REQUEST_ID: 'x-ke-request-id',
  X_USER_ID: 'x-ke-user-id',
  X_SYSTEM_ID: 'x-ke-sys-id',
  REDACTED_VALUE: 'This is redacted',
  REDACTEDS: ['Authorization', 'authorization', 'AUTHORIZATION'],
  CONTENT_TYPE: 'Content-Type',
  MERGE_PATCH: 'application/merge-patch+json',
  APPLICATION_JSON: 'application/json',
};

export const GLOBAL_ROOT_PREFIX = 'customer';
export const ROOT_PATH = `/${GLOBAL_ROOT_PREFIX}`;
export const READ_ONLY_PATHS = [ROOT_PATH];
