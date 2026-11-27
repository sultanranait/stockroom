import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError, fieldErrors } from './api';

const mockFetch = (status: number, body: unknown) => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api client', () => {
  it('unwraps the response envelope', async () => {
    mockFetch(200, { status: 'success', statusCode: 200, data: { id: '1' } });

    await expect(api.get('/api/products/1')).resolves.toEqual({ id: '1' });
  });

  it('sends JSON bodies', async () => {
    const fetchMock = mockFetch(201, { data: null });

    await api.post('/api/products', { name: 'Lamp' });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/products',
      expect.objectContaining({ method: 'POST', body: '{"name":"Lamp"}' }),
    );
  });

  it('throws an ApiError carrying field errors', async () => {
    mockFetch(400, {
      error: 'badRequest',
      message: 'Validation errors',
      statusCode: 400,
      details: [{ path: 'sku', msg: 'SKU is invalid' }],
    });

    const error: unknown = await api.post('/api/products', {}).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400 });
    expect(fieldErrors(error)).toEqual({ sku: 'SKU is invalid' });
  });

  it('copes with error responses that are not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Bad Gateway', { status: 502 })),
    );

    await expect(api.get('/api/products')).rejects.toMatchObject({
      status: 502,
      message: 'Something went wrong',
    });
  });
});
