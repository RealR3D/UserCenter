export function loadConfig(config) {
    return {
        type: 'action/LOAD_CONFIG',
        data: config
    };
}
export function login(user, group) {
    return {
        type: 'action/LOGIN',
        data: {
            user: user,
            group: group
        }
    };
}
export function register(user, group) {
    return {
        type: 'action/LOGIN',
        data: {
            user: user,
            group: group
        }
    };
}
export function loggedOut() {
    return {
        type: 'action/LOGGED_OUT'
    };
}
export function update(user, group) {
    return {
        type: 'action/UPDATE',
        data: {
            user: user,
            group: group
        }
    };
}