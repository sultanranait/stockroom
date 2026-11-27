import { Role } from '@shared/interfaces/user.interface';
import { Product } from '@shared/models';
import { signAccessToken } from '@shared/utils/token';
import request from 'supertest';
import app from '../services/product/src/app';
import { productRepo } from '../services/product/src/repo/product.repo';

jest.mock('../services/product/src/repo/product.repo');

const repo = jest.mocked(productRepo);

const USER_ID = '9b2e4f6a-1c3d-4e5f-8a7b-0c1d2e3f4a5b';
const PRODUCT_ID = '6f1c2b8e-3d4a-4c5b-9e7f-1a2b3c4d5e6f';

const sessionCookie = (role: Role) => {
  const token = signAccessToken({
    id: USER_ID,
    email: `${role}@example.com`,
    role,
  });
  return `access_token=${token}`;
};

const validProduct = {
  name: 'Desk Lamp',
  sku: 'lmp-100',
  price: 24.5,
  quantity: 10,
};

describe('Product service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('requires a session', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Authentication required');
  });

  it('rejects a tampered token', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Cookie', 'access_token=not-a-real-token');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('passes sanitized filters to the repo and returns a page', async () => {
    repo.findAll.mockResolvedValue({ rows: [], count: 0 });

    const res = await request(app)
      .get('/api/products?page=2&limit=5&search=%20lamp%20&status=active')
      .set('Cookie', sessionCookie('staff'));

    expect(res.status).toBe(200);
    expect(repo.findAll).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      search: 'lamp',
      status: 'active',
    });
    expect(res.body.data.pagination).toEqual({
      total: 0,
      page: 2,
      limit: 5,
      totalPages: 0,
    });
  });

  it('rejects out of range pagination', async () => {
    const res = await request(app)
      .get('/api/products?limit=500')
      .set('Cookie', sessionCookie('staff'));

    expect(res.status).toBe(400);
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('validates the create payload', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', sessionCookie('staff'))
      .send({ name: 'X', price: -1 });

    expect(res.status).toBe(400);
    expect(res.body.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['name', 'sku', 'price']),
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('creates a product with a normalized SKU', async () => {
    repo.findBySku.mockResolvedValue(null);
    repo.create.mockImplementation(async (data) => Product.build(data));

    const res = await request(app)
      .post('/api/products')
      .set('Cookie', sessionCookie('staff'))
      .send(validProduct);

    expect(res.status).toBe(201);
    expect(repo.create).toHaveBeenCalledWith({
      name: 'Desk Lamp',
      sku: 'LMP-100',
      price: 24.5,
      quantity: 10,
      created_by: USER_ID,
    });
    expect(res.body.data).toMatchObject({ sku: 'LMP-100', price: 24.5 });
  });

  it('returns 409 when the SKU is taken', async () => {
    repo.findBySku.mockResolvedValue(
      Product.build({ ...validProduct, sku: 'LMP-100', created_by: USER_ID }),
    );

    const res = await request(app)
      .post('/api/products')
      .set('Cookie', sessionCookie('staff'))
      .send(validProduct);

    expect(res.status).toBe(409);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('updates only the fields sent and clears a blank description', async () => {
    const product = Product.build({
      ...validProduct,
      id: PRODUCT_ID,
      sku: 'LMP-100',
      description: 'Old text',
      created_by: USER_ID,
    });
    repo.findById.mockResolvedValue(product);

    const res = await request(app)
      .patch(`/api/products/${PRODUCT_ID}`)
      .set('Cookie', sessionCookie('staff'))
      .send({ price: '19.99', description: '   ' });

    expect(res.status).toBe(200);
    expect(repo.findBySku).not.toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalledWith(product, {
      price: 19.99,
      description: null,
    });
  });

  it('returns 404 for a missing product', async () => {
    repo.findById.mockResolvedValue(null);

    const res = await request(app)
      .get(`/api/products/${PRODUCT_ID}`)
      .set('Cookie', sessionCookie('staff'));

    expect(res.status).toBe(404);
  });

  it('does not let staff delete products', async () => {
    const res = await request(app)
      .delete(`/api/products/${PRODUCT_ID}`)
      .set('Cookie', sessionCookie('staff'));

    expect(res.status).toBe(403);
    expect(repo.remove).not.toHaveBeenCalled();
  });

  it('lets admins delete products', async () => {
    repo.remove.mockResolvedValue(1);

    const res = await request(app)
      .delete(`/api/products/${PRODUCT_ID}`)
      .set('Cookie', sessionCookie('admin'));

    expect(res.status).toBe(200);
    expect(repo.remove).toHaveBeenCalledWith(PRODUCT_ID);
  });
});
