import { createApp } from '@shared/config/app';
import productRoutes from './route';

const app = createApp('/api/products', productRoutes);

export default app;
