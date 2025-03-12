/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import {
  SORT_ORDER,
  DEFAULT_VALUE,
  SORT_ORDER_ICON,
} from './Components/Constants';
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
  const [filterUserId, setFilterUserId] = useState(DEFAULT_VALUE.USER_ID);
  const [filterCategoryIds, setFilterCategoryIds] = useState(
    DEFAULT_VALUE.CATEGORY_IDS,
  );
  const [searchQuery, setSearchQuery] = useState(DEFAULT_VALUE.SEARCH_QUERY);

  const [sortBy, setSortBy] = useState(DEFAULT_VALUE.SORT_BY);
  const [sortOrder, setSortOrder] = useState(DEFAULT_VALUE.SORT_ORDER);

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
      setSortOrder(SORT_ORDER.ASK);

      return;
    }

    switch (sortOrder) {
      case SORT_ORDER.ASK:
        setSortOrder(SORT_ORDER.DESK);
        break;
      case SORT_ORDER.NONE:
        setSortOrder(SORT_ORDER.ASK);
        break;
      default:
        setSortBy(DEFAULT_VALUE.SORT_BY);
        setSortOrder(SORT_ORDER.NONE);
        break;
    }
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
          return SORT_ORDER_ICON.ASK;
        case SORT_ORDER.DESK:
          return SORT_ORDER_ICON.DESK;
        default:
          return SORT_ORDER_ICON.NONE;
      }
    }

    return SORT_ORDER_ICON.NONE;
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
