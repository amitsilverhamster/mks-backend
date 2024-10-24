export class PaginationHelper {
  static paginate(items: any[], totalItems: number, page: number, itemsPerPage: number) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const currentPage = page > totalPages ? totalPages : page;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice items to return paginated data
    const paginatedItems = items.slice(0, items.length);

    return {
      items: paginatedItems,
      meta: {
        totalItems,
        itemsPerPage,
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  static buildPaginationQuery(page: number, itemsPerPage: number) {
    return {
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    };
  }

  static parsePaginationParams(queryParams: any) {
    const page = queryParams.page ? parseInt(queryParams.page, 10) : 1;
    const itemsPerPage = queryParams.itemsPerPage ? parseInt(queryParams.itemsPerPage, 10) : 10;

    return { page, itemsPerPage };
  }
}
