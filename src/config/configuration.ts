import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export const configuration: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    CRYPT_SALT: Joi.number().required(),
    JWT_SECRET_KEY: Joi.string().required(),
    JWT_SECRET_REFRESH_KEY: Joi.string().required(),
    TOKEN_EXPIRE_TIME: Joi.string().required(),
    TOKEN_REFRESH_EXPIRE_TIME: Joi.string().required(),
    DICTIONARY_API_URL: Joi.string().required(),
  }),
};
