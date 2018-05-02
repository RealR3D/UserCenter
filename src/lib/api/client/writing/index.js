import * as utils from '../../../utils';
export class Writing {
    constructor(request) {
        this.request = request;
    }
    createContent(siteId, channelId, content, cb) {
        this.request.post(`/actions/createContent`, utils.assign(content, {
            siteId, channelId
        }), cb);
    }
    deleteContent(siteId, channelId, id, cb) {
        this.request.post(`/actions/deleteContent`, {
            siteId, channelId, id
        }, cb);
    }
    editContent(siteId, channelId, id, content, cb) {
        this.request.post(`/actions/editContent`, utils.assign(content, {
            siteId, channelId, id
        }), cb);
    }
    getContent(siteId, channelId, id, cb) {
        this.request.post(`/actions/getContent`, {
            siteId, channelId, id
        }, cb);
    }
    getContents(siteId, channelId, searchType, keyword, dateFrom, dateTo, page, cb) {
        this.request.post(`/actions/getContents`, {
            siteId, channelId, searchType, keyword, dateFrom, dateTo, page
        }, cb);
    }
    getSites(cb) {
        this.request.post('/actions/getSites', null, cb);
    }
    getChannels(siteId, cb) {
        this.request.post(`/actions/getChannels`, {
            siteId
        }, cb);
    }
    getTableColumns(siteId, channelId, cb) {
        this.request.post(`/actions/getTableColumns`, {
            siteId, channelId
        }, cb);
    }
}