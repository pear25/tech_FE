import { action, createStore } from 'easy-peasy';

const store = createStore({
    status: 'initial',
    mapData: { "map": "data" },
    setStatus: action((state, payload) => {
        state.status = payload
    }),
    setMapData: action((state, payload) => {
        if (state.status === "success") {
            state.mapData = payload
        }
    })
});

export default store