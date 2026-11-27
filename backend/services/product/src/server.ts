import config from '@shared/config';
import { startServer } from '@shared/config/app';
import app from './app';

startServer(app, config.ports.product, 'Product');
