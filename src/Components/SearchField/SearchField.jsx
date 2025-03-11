import { DEFAULT_VALUE } from '../Constants';

export const SearchField = ({ query, onSearchChange }) => {
  return (
    <div className="panel-block">
      <p className="control has-icons-left has-icons-right">
        <input
          data-cy="SearchField"
          type="text"
          className="input"
          placeholder="Search"
          value={query}
          onChange={event => onSearchChange(event.target.value)}
        />

        <span className="icon is-left">
          <i className="fas fa-search" aria-hidden="true" />
        </span>

        {query && (
          <span className="icon is-right">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              data-cy="ClearButton"
              type="button"
              className="delete"
              onClick={() => onSearchChange(DEFAULT_VALUE.SEARCH_QUERY)}
            />
          </span>
        )}
      </p>
    </div>
  );
};
