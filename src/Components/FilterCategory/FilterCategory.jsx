import cn from 'classnames';

export const FilterCategory = ({
  categories,
  filterCategoryIds,
  onCategoryClick,
}) => (
  <div className="panel-block is-flex-wrap-wrap">
    <a
      href="#/"
      data-cy="AllCategories"
      className={cn('button is-success mr-6', {
        'is-outlined': filterCategoryIds.length
      })}
      onClick={() => onCategoryClick()}
    >
      All
    </a>

    {categories.map(({ id, title }) => (
      <a
        key={id}
        data-cy="Category"
        href="#/"
        className={cn('button mr-2 my-1', {
          'is-info': filterCategoryIds.includes(id),
        })}
        onClick={() => onCategoryClick(id)}
      >
        {title}
      </a>
    ))}
  </div>
);
