import React, { useContext, useState } from 'react';
import { IconContext } from 'react-icons';
import { BsThreeDots, BsSearch, BsArrowDownUp } from 'react-icons/bs';
import '../../../styles/components/todo-list/list-menu.scss';
import { Context } from '../../store/appContext';

export const ListMenu = ({ color, listId }) => {
  const { store, actions } = useContext(Context);
  const [menu, setMenu] = useState(false);

  return (
    <div className="menu">
      <button
        className='menu__btn-toggle'
        onClick={() => setMenu(!menu)}
      >
        <IconContext.Provider
          value={{
            className: `btn-icon btn-icon--menu ${menu ? 'active' : ''}`,
          }}
        >
          <div className='flex'>
            <BsThreeDots style={{ backgroundColor: `${menu ? 'var(--clr-dark-300)' : color}` }} />
          </div>
        </IconContext.Provider>
      </button>
      <div className={`menu__actions ${menu ? 'active' : ''}`}>
        <button
          className='menu__btn-search'
          onClick={() => console.log('searching')}
        >
          <IconContext.Provider
            value={{
              className: `btn-icon btn-icon--search ${menu ? 'active' : ''}`,
            }}
          >
            <div className='flex'>
              <BsSearch style={{ backgroundColor: color }} />
            </div>
          </IconContext.Provider>
        </button>
        <button
          className='menu__btn-sort'
          onClick={async () => await actions.sortTodosByComplete(listId)}
        >
          <IconContext.Provider
            value={{
              className: `btn-icon btn-icon--sort ${menu ? 'active' : ''}`,
            }}
          >
            <div className='flex'>
              <BsArrowDownUp style={{ backgroundColor: color }} />
            </div>
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
};
