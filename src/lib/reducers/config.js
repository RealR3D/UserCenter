import { Config } from '../models';
const initialState = new Config();
export default function config(state = initialState, action) {
    if (action.type === 'action/LOAD_CONFIG') {
        return action.data;
    }
    else if (action.type === 'action/LOGIN') {
        var config = state;
        config.user = action.data.user || state.user;
        config.group = action.data.group || state.group;
        return config;
    }
    else if (action.type === 'action/LOGGED_OUT') {
        var config = state;
        config.user = null;
        config.group = null;
        return config;
    }
    else if (action.type === 'action/UPDATE') {
        var config = state;
        config.user = action.data.user || state.user;
        config.group = action.data.group || state.group;
        return config;
    }
    else if (action.type === 'persist/REHYDRATE' && action.payload) {
        return action.payload;
    }
    return state;
}