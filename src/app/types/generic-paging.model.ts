export class GenericPaging<T> {
  constructor(
    public data: T[],
    public meta: Meta
  ) {}
}

export class Meta {
  constructor(
    public pagination: Pagination
  ) {}
}

export class Pagination {
  constructor(
    public total: number,
    public count: number,
    public per_page: number,
    public current_page: number,
    public total_pages: number
  ) {}
}
