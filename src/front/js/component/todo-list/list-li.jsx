import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaListUl, FaTrash, FaUserFriends } from 'react-icons/fa';
import '../../../styles/components/todo-list/list-li.scss';
import { ConfirmPopup } from '../../component/confirm-popup.jsx';
import { Context } from '../../store/appContext.js';
import { List } from './list.jsx';

export const ListLi = props => {
    const { store, actions } = useContext(Context);

    return (
        <li className='list-li' key={props.list.id} style={{ borderColor: props.list.color }}>
            <button
                onClick={() => {
                    actions.popup.setPopup(<List list={props.list} />);
                }}
            >
                <div className='color-mark' style={{ color: props.list.color }}>
                    <FaListUl />
                </div>
                {props.list.name}
                {props.list.share ? (
                    <small className='share-icon'>
                        <FaUserFriends />
                    </small>
                ) : (
                    ''
                )}
                {props.list.todos && props.list.todos.length ? (
                    <small className='completed-tasks'>
                        {props.list.todos.filter(element => element.complete).length}/
                        {props.list.todos.length}
                    </small>
                ) : (
                    <small className='completed-tasks'>0/0</small>
                )}
            </button>
            <IconContext.Provider value={{ className: 'icon-delete' }}>
                <button
                    className='btn-delete'
                    onClick={() => {
                        actions.popup.setPopup(
                            <ConfirmPopup
                                func={() => props.deleteList(props.list.id)}
                                data={{
                                    title: `Delete List ${props.list.name}?`,
                                    message:
                                        'This will delete all Tasks linked to the list. Are you sure?',
                                    confirm: 'Yes, Delete',
                                    style: 'danger',
                                }}
                            />,
                            true,
                            'small'
                        );
                    }}
                >
                    <FaTrash />
                </button>
            </IconContext.Provider>
        </li>
    );
};
ListLi.propTypes = {
    list: PropTypes.object.isRequired,
    deleteList: PropTypes.func.isRequired,
};
