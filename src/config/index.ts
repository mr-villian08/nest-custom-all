import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import mailConfig from './mail.config';
import fileConfig from './file.config';
import authConfig from './auth.config';
import cookieConfig from './cookie.config';

export default [
  appConfig,
  authConfig,
  cookieConfig,
  databaseConfig,
  fileConfig,
  jwtConfig,
  mailConfig,
];
