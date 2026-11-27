import { User } from '@shared/models';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import app from '../services/auth/src/app';
import { authRepo } from '../services/auth/src/repo/auth.repo';

jest.mock('../services/auth/src/repo/auth.repo');

const repo = jest.mocked(authRepo);

describe('Auth service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds to health checks', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('rejects an invalid login payload', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('badRequest');
    expect(res.body.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['email', 'password']),
    );
  });

  it('rejects a malformed JSON body', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Request body is not valid JSON');
  });

  it('rejects unknown credentials', async () => {
    repo.findByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever' });

    expect(res.status).toBe(401);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('sets an httpOnly session cookie and never returns the password', async () => {
    repo.findByEmail.mockResolvedValue(
      User.build({
        id: '3f0d2c6e-8b1a-4d5e-9c7f-2a4b6c8d0e1f',
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('secret-pass', 4),
        role: 'staff',
      }),
    );

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ' Test@Example.com ', password: 'secret-pass' });

    expect(res.status).toBe(200);
    expect(repo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(String(res.headers['set-cookie'])).toMatch(
      /^access_token=.+; HttpOnly/,
    );
    expect(res.body.data.user).toMatchObject({ email: 'test@example.com' });
    expect(res.body.data.user).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('accessToken');
  });

  it('requires a session for /me', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});
