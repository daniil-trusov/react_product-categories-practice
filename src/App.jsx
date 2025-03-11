/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import { SORT_BY, SORT_ORDER, DEFAULT_VALUE } from './Components/Constants';
import { FilterUser } from './Components/FilterUser';
import { SearchField } from './Components/SearchField/SearchField';
import { FilterCategory } from './Components/FilterCategory';
import { Table } from './Components/Table';
import { unionProducts, prepareProducts } from './Components/PrepareProducts';

const productsUprepared = unionProducts(
  productsFromServer,
  categoriesFromServer,
  usersFromServer,
);

export const App = () => {
  const [filterUserId, setFilterUserId] = useState(-1);
  const [filterCategoryIds, setFilterCategoryIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState(SORT_BY.ID);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.NONE);

  const productsPrepared = prepareProducts(
    productsUprepared,
    searchQuery,
    filterUserId,
    filterCategoryIds,
    sortBy,
    sortOrder,
  );

  function resetFilters() {
    setFilterUserId(DEFAULT_VALUE.USER_ID);
    setFilterCategoryIds(DEFAULT_VALUE.CATEGORY_IDS);
    setSearchQuery(DEFAULT_VALUE.SEARCH_QUERY);
  }

  function updateSortOrder(newCategory) {
    if (newCategory !== sortBy) {
      setSortBy(newCategory);
    }

    const sortOrders = Object.values(SORT_ORDER);
    let current = sortOrders.indexOf(sortOrder);

    if (current < 0) {
      current = 0;
    }

    const updated = (current + 1) % sortOrders.length;

    setSortOrder(sortOrders[updated]);
  }

  function updateCategoriesFilter(categoryIndex) {
    if (!categoryIndex) {
      setFilterCategoryIds(DEFAULT_VALUE.CATEGORY_IDS);

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

  function getSortOrderIcon(currentSortBy) {
    if (currentSortBy === sortBy) {
      switch (sortOrder) {
        case SORT_ORDER.ASK:
          return 'fa-sort-up';
        case SORT_ORDER.DESK:
          return 'fa-sort-down';
        default:
          return 'fa-sort';
      }
    }

    return 'fa-sort';
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <FilterUser
              users={usersFromServer}
              activeId={filterUserId}
              onUserClick={id => setFilterUserId(id)}
            />

            <SearchField query={searchQuery} onSearchChange={setSearchQuery} />

            <FilterCategory
              categories={categoriesFromServer}
              filterCategoryIds={filterCategoryIds}
              onCategoryClick={id => updateCategoriesFilter(id)}
            />

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

        <Table
          products={productsPrepared}
          getSortOrderIcon={title => getSortOrderIcon(title)}
          onSortClick={title => updateSortOrder(title)}
        />
      </div>
    </div>
  );
};
