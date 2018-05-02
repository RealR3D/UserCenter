export class Files {
    constructor(request) {
        this.request = request;
    }
    getUploadSiteFilesUrl(siteId, uploadType) {
        return this.request.getURL(`/actions/uploadSiteFiles?siteId=${siteId}&uploadType=${uploadType}`);
    }
    getUploadAvatarUrl() {
        return this.request.getURL(`/actions/uploadAvatar`);
    }
    uploadAvatarResize(size, x, y, relatedUrl, cb) {
        this.request.post('/actions/uploadAvatarResize', {
            size, x, y, relatedUrl
        }, cb);
    }
}