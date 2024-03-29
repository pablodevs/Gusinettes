const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            popup: {},
            token: localStorage.getItem('newtoken') || '',
            todoLists: [],
            shareLists: false,
        },
        actions: {
            setShareLists: share =>
                setStore({
                    shareLists: share,
                }),

            // Create a new list
            addNewList: newList => {
                const store = getStore();

                const options = {
                    method: 'POST',
                    body: JSON.stringify(newList),
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                        'Content-type': 'application/json',
                    },
                };
                return fetch(`${process.env.BACKEND_URL}/api/list`, options)
                    .then(response => response.json())
                    .then(list => {
                        setStore({
                            todoLists: [...store.todoLists, list],
                        });
                        return list;
                    })
                    .catch(error => console.error(error));
            },

            // Update list in db
            updateTodoList: data => {
                const store = getStore();
                const actions = getActions();

                const options = {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                        'Content-type': 'application/json',
                    },
                };

                return fetch(`${process.env.BACKEND_URL}/api/list/${data.id}`, options)
                    .then(response => response.json())
                    .then(list => {
                        actions.setShareLists(!store.shareLists);
                        actions.user.getTodoListsOfUser(!store.shareLists);
                        return list;
                    })
                    .catch(error => console.error(error));
            },

            // Delete list in db
            deleteTodoList: listId => {
                const store = getStore();

                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                    },
                };

                return fetch(`${process.env.BACKEND_URL}/api/list/${listId}`, options)
                    .then(response => response.json())
                    .then(message => true)
                    .catch(error => console.error(error));
            },

            // Get all Todos linked to a TodoList
            getTodos: listId => {
                const store = getStore();
                fetch(`${process.env.BACKEND_URL}/api/lists/${listId}/todos`, {
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                    },
                })
                    .then(response => response.json())
                    .then(todos => {
                        let todoListsAux = [...store.todoLists];
                        todoListsAux.map(list => {
                            if (list.id === listId) {
                                list.todos = todos;
                            }
                        });
                        setStore({
                            todoLists: todoListsAux,
                        });
                    })
                    .catch(error => console.error(error));
            },

            // Drag & Drop Reorder Todos
            reorderTodos: ({ listId, sourceIndex, destinationIndex }) => {
                const store = getStore();
                const actions = getActions();

                const options = {
                    method: 'PUT',
                    body: JSON.stringify({ sourceIndex, destinationIndex }),
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                        'Content-type': 'application/json',
                    },
                };

                return fetch(`${process.env.BACKEND_URL}/api/list/${listId}/reorder`, options)
                    .then(response => response.json())
                    .then(resp => actions.getTodos(listId))
                    .catch(error => console.error(error));
            },

            // Send completed tasks to bottom
            sortTodosByComplete: async (listId) => {
                const store = getStore();
                const actions = getActions();

                const options = {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                        'Content-type': 'application/json',
                    },
                };

                await fetch(`${process.env.BACKEND_URL}/api/list/${listId}/sort`, options)
                    .then(response => response.json())
                    .then(resp => actions.getTodos(listId))
                    .catch(error => console.error(error));
            },

            // Create a new todo
            addTodo: (newTodo, listId) => {
                const store = getStore();
                const actions = getActions();

                const options = {
                    method: 'POST',
                    body: JSON.stringify(newTodo),
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                        'Content-type': 'application/json',
                    },
                };
                fetch(`${process.env.BACKEND_URL}/api/lists/${listId}/todo`, options)
                    .then(response => response.json())
                    .then(todo => actions.getTodos(listId))
                    .catch(error => console.error(error));
            },

            // Modify a todo
            updateTodo: (updatedTodo, listId) => {
                const store = getStore();
                const actions = getActions();

                const options = {
                    method: 'PUT',
                    body: JSON.stringify(updatedTodo),
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                        'Content-type': 'application/json',
                    },
                };
                fetch(`${process.env.BACKEND_URL}/api/todo/${updatedTodo.id}`, options)
                    .then(response => response.json())
                    .then(todo => actions.getTodos(listId))
                    .catch(error => console.error(error));
            },

            // Delete todo
            deleteTodo: (todoId, listId) => {
                const store = getStore();
                const actions = getActions();

                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + store.token,
                    },
                };

                fetch(`${process.env.BACKEND_URL}/api/todo/${todoId}`, options)
                    .then(response => response.json())
                    .then(message => {
                        // setStore({
                        //     message: {
                        //         message: message.message,
                        //         status: message.status,
                        //     },
                        // });
                        actions.getTodos(listId);
                    })
                    .catch(error => console.error(error));
            },

            // Remove message from store
            cleanMessage: () => setStore({ message: { message: '', status: '' } }),

            // Popup functions
            popup: {
                // Open Popup
                setPopup: (reactComponent, closable = true, size = '') => {
                    setStore({
                        popup: {
                            component: reactComponent,
                            icClosable: closable,
                            size: size,
                        },
                    });
                    return;
                },
                // Close Popup
                closePopup: () => setStore({ popup: {} }),
            },

            // User functions
            user: {
                // LOGIN
                generateToken: async (name, password) => {
                    const actions = getActions();
                    try {
                        const response = await fetch(process.env.BACKEND_URL + '/api/token', {
                            method: 'POST',
                            body: JSON.stringify({
                                name: name,
                                password: password,
                            }),
                            headers: {
                                'Content-type': 'application/json',
                            },
                        });
                        const data = await response.json();
                        if (!response.ok) {
                            setStore({
                                message: {
                                    message: data.message,
                                    status: 'danger',
                                },
                            });
                            throw Error(response);
                        } else {
                            setStore({ token: data.token });
                            localStorage.setItem('newtoken', data.token);
                            actions.user.getProfileData(data.token);
                            return data;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                },

                // Obtener la información del usuario en Dashboard (por ejemplo)
                getProfileData: async token => {
                    const actions = getActions();
                    const store = getStore();
                    const options = {
                        method: 'GET',
                        headers: {
                            Authorization: 'Bearer ' + token,
                        },
                    };
                    try {
                        const response = await fetch(
                            process.env.BACKEND_URL + '/api/user',
                            options
                        );
                        const data = await response.json();
                        if (!response.ok) {
                            setStore({
                                message: {
                                    message: data.message,
                                    status: 'danger',
                                },
                            });
                            throw Error(response);
                        }
                        setStore({
                            user: {
                                ...store.user,
                                id: data.id,
                                name: data.name,
                                profile_image_url: data.profile_image_url,
                            },
                        });
                        actions.popup.closePopup();
                        return data;
                    } catch (error) {
                        console.error(error);
                    }
                },

                // Set profile image
                setProfileImage: async () => {
                    const store = getStore();
                    const options = {
                        method: 'PUT',
                        body: JSON.stringify({
                            profile_image_url: store.randomImage,
                        }),
                        headers: {
                            Authorization: 'Bearer ' + store.token,
                            'Content-Type': 'application/json',
                        },
                    };
                    try {
                        const response = await fetch(
                            process.env.BACKEND_URL + '/api/user',
                            options
                        );
                        const user = await response.json();
                        if (!response.ok) {
                            throw Error(response);
                        }
                        setStore({
                            user: user,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                },

                // Get all TodoLists linked to the current user
                getTodoListsOfUser: share => {
                    const store = getStore();
                    const actions = getActions();
                    return fetch(`${process.env.BACKEND_URL}/api/user/lists/${share}`, {
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                        },
                    })
                        .then(response => response.json())
                        .then(todoLists => {
                            setStore({
                                todoLists: todoLists,
                            });
                            todoLists.forEach(list => actions.getTodos(list.id));
                            return todoLists.length;
                        })
                        .catch(error => console.error(error));
                },
            },

            // Get images from Cloudinary by tag using admin api
            getImagesByTag: () => {
                let store = getStore();
                fetch(`${process.env.BACKEND_URL}/api/images/${store.user.name}`)
                    .then(response => response.json())
                    .then(data => {
                        setStore({ images: data });
                    })
                    .catch(error => console.error(error));
            },

            // Get a random image from the array of images
            getRandomImage: () => {
                let store = getStore();
                setStore({
                    randomImage: store.images[Math.floor(Math.random() * store.images.length)],
                });
            },

            // Delete random image from the store
            cleanRandomImage: () => {
                setStore({
                    randomImage: '',
                });
            },
        },
    };
};

export default getState;
