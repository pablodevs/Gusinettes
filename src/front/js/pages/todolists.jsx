import React, { useContext, useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { BsPlusLg } from 'react-icons/bs';
import '../../styles/pages/todo-list.scss';
import { BottomTabs } from '../component/todo-list/bottom-tabs.jsx';
import { AddList } from '../component/todo-list/add-list.jsx';
import { ListLi } from '../component/todo-list/list-li.jsx';
import { List } from '../component/todo-list/list.jsx';
import { Context } from '../store/appContext';

export const TodoLists = () => {
    const { store, actions } = useContext(Context);

    const [listOfLists, setListOfLists] = useState([<li key={0}>Loading...</li>]);
    const [share, setShare] = useState(false);

    useEffect(() => {
        getLists();
    }, []);

    useEffect(() => {
        if (store.todoLists.length) {
            let newListOfLists = store.todoLists.filter(list => list.share === share);
            if (!newListOfLists.length) {
                setListOfLists([
                    <li key={-1}>Todavía no tienes listas {share ? 'compartidas' : 'privadas'}</li>,
                ]);
            } else {
                setListOfLists(
                    newListOfLists.map(list => (
                        <ListLi key={list.id} list={list} deleteList={deleteList} />
                    ))
                );
            }
        } else {
            setListOfLists([<li key={-1}>Todavía no tienes listas.</li>]);
        }
    }, [store.todoLists, share]);

    const getLists = () => actions.user.getTodoListsOfUser();

    const addList = data => {
        actions.addNewList(data).then(list => {
            actions.popup.setPopup(<List list={list} />);
            getLists();
        });
    };

    const deleteList = listId => {
        actions.deleteTodoList(listId).then(resp => {
            if (resp) {
                getLists();
                actions.popup.closePopup();
            }
        });
    };

    const showSharedLists = share => setShare(share);

    return (
        <div className='todo-lists center flex-col'>
            <h1 className='todo-lists__title'>Tus Listas</h1>
            <button
                className='todo-lists__add-btn'
                onClick={() =>
                    actions.popup.setPopup(<AddList addList={addList} />, true, 'medium')
                }
            >
                <IconContext.Provider value={{ className: 'btn-icon btn-icon--plus' }}>
                    <div className='flex'>
                        <BsPlusLg />
                    </div>
                </IconContext.Provider>
            </button>
            <ul className='todo-lists__lists'>{listOfLists}</ul>
            <BottomTabs showSharedLists={showSharedLists} />
        </div>
    );
};
