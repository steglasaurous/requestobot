import { DataSource } from 'typeorm';
import { typeORMAppConfig } from './typeorm.config';

export default new DataSource(typeORMAppConfig);
