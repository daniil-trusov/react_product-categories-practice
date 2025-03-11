/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const productsUprepared = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    ({ id }) => id === product.categoryId,
  );
  const user = usersFromServer.find(({ id }) => id === category.ownerId);

  return { ...product, user, category };
});

function prepareProducts(
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
        case 'name':
          return productA.name.localeCompare(productB.name);
        case 'category':
          return productA.category.title.localeCompare(productB.category.title);
        case 'user':
          return productA.user.name.localeCompare(productB.user.name);
        default:
          return productA.id - productB.id;
      }
    });
  }

  if (sortOrder === 'desk') {
    productsPrepared.reverse();
  }

  return productsPrepared;
}

export const App = () => {
  const [filterUserId, setFilterUserId] = useState(-1); // user id, -1 for 'All'
  const [filterCategoryIds, setFilterCategoryIds] = useState([]); // array of category IDs, [] for all categories
  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState('id'); // id, product, category, user
  const [sortOrder, setSortOrder] = useState(''); // desc (-1), none(0), asc (1)

  const productsPrepared = prepareProducts(
    productsUprepared,
    searchQuery,
    filterUserId,
    filterCategoryIds,
    sortBy,
    sortOrder,
  );

  function resetFilters() {
    setFilterUserId(-1);
    setFilterCategoryIds('');
    setSearchQuery('');
  }

  function updateSortOrder(newCategory) {
    if (newCategory !== sortBy) {
      setSortBy(newCategory);
    }

    let newOrder;

    switch (sortOrder) {
      case '':
        newOrder = 'ask';
        break;
      case 'ask':
        newOrder = 'desk';
        break;
      default:
        newOrder = '';
        setSortBy('');
        break;
    }

    setSortOrder(newOrder);
  }

  function updateCategoriesFilter(categoryIndex) {
    if (!categoryIndex) {
      setFilterCategoryIds([]);

      return;
    }

    const categories = [...filterCategoryIds];

    if (categories.includes(categoryIndex)) {
      const id = categories.indexOf(categoryIndex);

      categories.splice(id, 1);
    } else {
      categories.push(categoryIndex);
    }

    setFilterCategoryIds(categories);
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': filterUserId === -1 })}
                onClick={() => setFilterUserId(-1)}
              >
                All
              </a>

              {usersFromServer.map(({ id, name }) => (
                <a
                  key={id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': filterUserId === id })}
                  onClick={() => setFilterUserId(id)}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': filterCategoryIds !== -1,
                })}
                onClick={() => updateCategoriesFilter()}
              >
                All
              </a>

              {categoriesFromServer.map(({ id, title }) => (
                <a
                  key={id}
                  data-cy="Category"
                  href="#/"
                  className={cn('button mr-2 my-1', {
                    'is-info': filterCategoryIds.includes(id),
                  })}
                  onClick={() => updateCategoriesFilter(id)}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {(productsPrepared.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )) || (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {['ID', 'Product', 'Category', 'User'].map(title => {
                    const titleLower = title.toLowerCase();

                    return (
                      <th key={titleLower}>
                        <span className="is-flex is-flex-wrap-nowrap">
                          {title}
                          <a
                            href="#/"
                            onClick={() => updateSortOrder(titleLower)}
                          >
                            <span className="icon">
                              <i
                                data-cy="SortIcon"
                                className={cn(
                                  'fas',
                                  {
                                    'fa-sort': !sortOrder,
                                  },
                                  {
                                    'fa-sort-down':
                                      sortOrder === 'desk' &&
                                      sortBy === titleLower,
                                  },
                                  {
                                    'fa-sort-up':
                                      sortOrder === 'ask' &&
                                      sortBy === titleLower,
                                  },
                                )}
                              />
                            </span>
                          </a>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {productsPrepared.map(({ id, name, category, user }) => {
                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className="has-text-link"
                        style={{ color: user.sex === 'f' ? 'red' : 'blue' }}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
