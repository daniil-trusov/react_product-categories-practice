import cn from 'classnames';
import { DEFAULT_VALUE } from '../Constants';

export const FilterUser = ({ users, activeId, onUserClick }) => {
  const buttonInfos = [{ id: DEFAULT_VALUE.USER_ID, name: 'All' }, ...users];

  return (
    <p className="panel-tabs has-text-weight-bold">
      {buttonInfos.map(({ id, name }) => (
        <a
          key={id}
          data-cy="FilterUser"
          href="#/"
          className={cn({ 'is-active': id === activeId })}
          onClick={() => onUserClick(id)}
        >
          {name}
        </a>
      ))}
    </p>
  );
};
