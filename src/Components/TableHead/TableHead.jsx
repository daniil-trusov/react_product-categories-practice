import cn from 'classnames';

export const TableHead = ({ getSortOrderIcon, onSortClick }) => {
  return (
    <thead>
      <tr>
        {['ID', 'Product', 'Category', 'User'].map(title => {
          const titleLower = title.toLowerCase();

          return (
            <th key={titleLower}>
              <span className="is-flex is-flex-wrap-nowrap">
                {title}
                <a href="#/" onClick={() => onSortClick(titleLower)}>
                  <span className="icon">
                    <i
                      data-cy="SortIcon"
                      className={cn('fas', getSortOrderIcon(titleLower))}
                    />
                  </span>
                </a>
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
