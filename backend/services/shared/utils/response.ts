import constMessages from './constants';

export const success = <T>(message: string, data: T, statusCode = 200) => {
  return {
    status: constMessages.success,
    message,
    statusCode,
    data,
  };
};

export const paginated = <T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
) => {
  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};
