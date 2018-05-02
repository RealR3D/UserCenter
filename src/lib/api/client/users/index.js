export class Users {
    constructor(request) {
        this.request = request;
    }
    loadConfig(cb) {
        this.request.post('/actions/loadConfig', {}, cb);
    }
    login(account, password, cb) {
        this.request.post('/actions/login', {
            account, password
        }, cb);
    }
    logout(cb) {
        this.request.post('/actions/logout', null, cb);
    }
    resetPassword(password, newPassword, confirmPassword, cb) {
        this.request.post('/actions/resetPassword', {
            password, newPassword, confirmPassword
        }, cb);
    }
    resetPasswordByToken(token, password, cb) {
        this.request.post('/actions/resetPasswordByToken', {
            token, password
        }, cb);
    }
    edit(data, cb) {
        this.request.post(`/actions/edit`, data, cb);
    }
    getLogs(totalNum, action, cb) {
        this.request.post(`/actions/getLogs`, {
            totalNum, action
        }, cb);
    }
    isMobileExists(mobile, cb) {
        this.request.post(`/actions/isMobileExists/`, {
            mobile
        }, cb);
    }
    isPasswordCorrect(password, cb) {
        this.request.post(`/actions/isPasswordCorrect/`, {
            password
        }, cb);
    }
    isCodeCorrect(mobile, code, cb) {
        this.request.post(`/actions/isCodeCorrect/`, {
            mobile, code
        }, cb);
    }
    sendSms(account, cb) {
        this.request.post(`/actions/sendSms/`, {
            account
        }, cb);
    }
    sendSmsOrRegister(mobile, password, userName, email, cb) {
        this.request.post(`/actions/sendSmsOrRegister/`, {
            mobile, password, userName, email
        }, cb);
    }
    registerWithCode(mobile, password, code, cb) {
        this.request.post(`/actions/registerWithCode/`, {
            mobile, password, code
        }, cb);
    }
    getCaptchaUrl(code) {
        return this.request.getURL(`/captcha/${code}`);
    }
}