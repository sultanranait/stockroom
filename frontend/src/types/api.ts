export interface FieldError {
  path: string;
  msg: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
