const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            popup: {},
            token: localStorage.getItem('newtoken') || '',
            user: {
                todoLists: [
                    { color: '#5300eb', name: 'Lista 1' },
                    { color: '#008b02', name: 'Lista 2' },
                    { color: '#b80000', name: 'Lista 3' },
                ],
            },
        },
        actions: {
            // ⚠️Backlog: Estas 2 funciones dejarán de servir y se reemplazarán por llamadas a la base de datos
            addNewList: newList => {
                const store = getStore();
                setStore({
                    user: {
                        ...store.user,
                        todoLists: [...store.user.todoLists, newList],
                    },
                });
            },
            deleteTodoList: indexToDelete => {
                const store = getStore();

                let restOfItems = [...store.user.todoLists];
                restOfItems.splice(indexToDelete, 1);
                setStore({
                    user: {
                        ...store.user,
                        todoLists: restOfItems,
                    },
                });
            },

            // Remove message from store
            cleanMessage: () =>
                setStore({ message: { message: '', status: '' } }),

            // Popup functions
            popup: {
                // Open Popup
                setPopup: (reactComponent, closable = true) => {
                    setStore({
                        popup: {
                            component: reactComponent,
                            icClosable: closable,
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
                        const response = await fetch(
                            process.env.BACKEND_URL + '/api/token',
                            {
                                method: 'POST',
                                body: JSON.stringify({
                                    name: name,
                                    password: password,
                                }),
                                headers: {
                                    'Content-type': 'application/json',
                                },
                            }
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
                        } else {
                            setStore({
                                token: data.token,
                                message: null,
                            });
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
                                // ⚠️Backlog: Esto no será así, las todolist también vendrán del back
                                ...store.user,
                                id: data.id,
                                name: data.name,
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
                    const actions = getActions();
                    const options = {
                        method: 'PUT',
                        body: JSON.stringify({ imageUrl: store.randomImage }),
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
                            message: {
                                message: data.message,
                                status: data.status,
                            },
                        });
                        return data;
                    } catch (error) {
                        return false;
                    }
                },
            },

            // Get images from Cloudinary by tag using admin api
            getImagesByTag: () => {
                let store = getStore();
                fetch(
                    `${process.env.BACKEND_URL}/api/images/${store.user.name}`
                )
                    .then(response => response.json())
                    .then(data => {
                        let actions = getActions();
                        setStore({ images: data });
                        actions.getRandomImage();
                    })
                    .catch(error => console.error(error));
            },

            // Get a random image from the array of images
            getRandomImage: () => {
                let store = getStore();
                setStore({
                    randomImage:
                        store.images[
                            Math.floor(Math.random() * store.images.length)
                        ],
                });
            },
        },
    };
};

export default getState;
