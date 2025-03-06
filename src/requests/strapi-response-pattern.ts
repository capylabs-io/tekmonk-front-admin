type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type StrapiMeta = {
  pagination: StrapiPagination;
};

export type StrapiResponse<T> = {
  data: T;
  meta: StrapiMeta;
};
