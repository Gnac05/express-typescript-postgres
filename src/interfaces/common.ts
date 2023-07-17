export type PaginationResult<T> = {
  datas: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type SortByOrder = 'ASC' | 'DESC';
