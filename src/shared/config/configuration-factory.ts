export const configurationFactory = () => ({
  appPort: +(process.env.APP_PORT || 3000),
  logLvl: process.env.LOG_LVL || 'error',
});
