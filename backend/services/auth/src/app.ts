import { createApp } from '@shared/config/app';
import authRoutes from './route';

const app = createApp('/api/auth', authRoutes);

export default app;
