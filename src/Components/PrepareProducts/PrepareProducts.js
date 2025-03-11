import { SORT_BY, SORT_ORDER } from '../Constants';

export function unionProducts(products, categories, users) {
  return products.map(product => {
    const category = categories.find(({ id }) => id === product.categoryId);
    const user = users.find(({ id }) => id === category.ownerId);

    return { ...product, user, category };
  });
}

export function prepareProducts(
  products,
  search,
  filterUserId,
  filterCategoryIds,
  sortBy,
  sortOrder,
) {
  let productsPrepared = [...products];

  if (search) {
    const searchFromatted = search.toLowerCase().trim();

    productsPrepared = productsPrepared.filter(product => {
      const nameFormatted = product.name.toLowerCase();

      return nameFormatted.includes(searchFromatted);
    });
  }

  if (filterUserId && filterUserId > -1) {
    productsPrepared = productsPrepared.filter(product => {
      return product.user.id === filterUserId;
    });
  }

  if (filterCategoryIds && filterCategoryIds.length > 0) {
    productsPrepared = productsPrepared.filter(product => {
      return filterCategoryIds.includes(product.category.id);
    });
  }

  if (sortBy) {
    productsPrepared.sort((productA, productB) => {
      switch (sortBy) {
        case SORT_BY.PRODUCT:
          return productA.name.localeCompare(productB.name);
        case SORT_BY.CATEGORY:
          return productA.category.title.localeCompare(productB.category.title);
        case SORT_BY.USER:
          return productA.user.name.localeCompare(productB.user.name);
        default:
          return productA.id - productB.id;
      }
    });
  }

  if (sortOrder === SORT_ORDER.DESK) {
    productsPrepared.reverse();
  }

  return productsPrepared;
}
