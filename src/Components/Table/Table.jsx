import { TableHead } from '../TableHead/index';
import { TableBody } from '../TableBody/index';

export const Table = ({ products, getSortOrderIcon, onSortClick }) => {
  return (
    <div className="box table-container">
      {(products.length === 0 && (
        <p data-cy="NoMatchingMessage">
          No products matching selected criteria
        </p>
      )) || (
        <table
          data-cy="ProductTable"
          className="table is-striped is-narrow is-fullwidth"
        >
          <TableHead
            getSortOrderIcon={getSortOrderIcon}
            onSortClick={onSortClick}
          />
          <TableBody products={products} />
        </table>
      )}
    </div>
  );
};
