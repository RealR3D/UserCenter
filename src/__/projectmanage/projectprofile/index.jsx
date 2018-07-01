import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

class UploadFile extends React.Component {
    constructor (props) {
        super(props);
        const {ID, name, State, userName} = props;
        this.state = {ID, name, State, userName, tip_info: "", error_info: "", tip_className: "", error_className: ""};
    }
    componentDidMount () {
        const _this = this,
            {ID, name, userName} = _this.state,
            oFileslist = document.getElementById('fileslist'),
            oPostfiles = document.getElementById('postfiles'),
            oBbtnGroup = document.getElementById('btn-group'),
            uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button: 'selectfiles', 
            container: oBbtnGroup,
            flash_swf_url: './plupload/Moxie.swf',
            silverlight_xap_url: './plupload/Moxie.xap',
            url: 'http://oss.aliyuncs.com',
            filters: {
                mime_types: [{ title: "Image files", extensions: "jpg,gif,png,bmp" }],
                max_file_size : '100gb',
                prevent_duplicates : true
            },
            init: {
                PostInit: function() {
                    oFileslist.innerHTML = '';
                    oPostfiles.onclick = function() {set_upload_param(uploader, '', false, ID, name, userName)};
                },
                FilesAdded: function(up, files) {
                    plupload.each(files, function(file) {
                        const oItem = document.createElement("div"),
                            oSpan = document.createElement("span"),
                            oB = document.createElement("b"),
                            oProgress = document.createElement("div"),
                            oProgressBar = document.createElement("div");
                        oItem.id = file.id;
                        oItem.className = "file-item";
                        oSpan.innerHTML = file.name;
                        oSpan.setAttribute("title", file.name);
                        oSpan.className = "file-item-span";
                        oB.className = "file-item-b";
                        oProgress.className = "progress";
                        oProgressBar.className = "progress-bar";
                        oProgressBar.style.width = "0%";
                        oProgress.appendChild(oProgressBar);
                        oItem.appendChild(oSpan);
                        oItem.appendChild(oB);
                        oItem.appendChild(oProgress);
                        oFileslist.appendChild(oItem);
                    });
                    _this.setState({tip_className: "am-icon-warning",tip_info: "上传过程请勿离开本页面，否则上传失败，需重新上传。"});
                },
                BeforeUpload: function(up, file) {
                    _this.props.progressChange(false);
                    set_upload_param(up, file.name, true);
                },
                UploadProgress: function(up, file) {
                    let {id, percent} = file,
                        d = document.getElementById(id),
                        prog = d.getElementsByTagName('div')[0],
                        progBar = prog.getElementsByTagName('div')[0];
                    d.getElementsByTagName('b')[0].innerHTML = '<span>' + percent + "%</span>";
                    progBar.style.width = 2.25 * file.percent + 'px';
                    progBar.setAttribute('aria-valuenow', percent);
                },
                FileUploaded: function(up, file, info) {
                    const id = file.id,
                        files = up.files,
                        len = files.length - 1,
                        isSuccess = info.status === 200,
                        oB = document.getElementById(id).getElementsByTagName('b')[0];
                    oB.innerHTML = "";
                    oB.classList.add(isSuccess ? "am-icon-check" : "am-icon-times");
                    if (id === files[0].id && isSuccess) {
                        let form = new FormData();
                        form.append("ProID", ID);
                        form.append("UserName", userName);
                        form.append("file", file.getNative());
                        $.ajax({
                            url: "http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=GetImgInfo",
                            type: "POST",
                            data: form,
                            processData: false,
                            contentType: false
                        });
                    };
                    if (id === files[len].id && isSuccess) {
                        $.ajax({
                            url: "http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=finish",
                            type: "POST",
                            data: {ProID: ID, UserName: userName},
                            success (data) {
                                data = JSON.parse(data);
                                const upload = _this.upload;
                                data.code === "0"
                                    ? (_this.props.progressChange(true), upload.parentNode.removeChild(upload))
                                    : alert(data.msg);
                            }
                        });
                    };
                },
                Error: function(up, err) {
                    let {error_info, error_className} = _this.state,
                        obj = document.getElementById(err.file.id);
                    if (obj) {
                        let oB = obj.getElementsByTagName('b')[0];
                        oB.innerHTML = "";
                        oB.classList.add("am-icon-times");
                    };
                    if (err.code === -600) {
                        error_info = "请上传小于10 MB的图片。";
                    } else if (err.code === -601) {
                        error_info = "请上传正确的图片类型。";
                    } else if (err.code === -602) {
                        error_info = "文件重复上传。";
                    } else {
                        error_info = "未知错误信息。";
                    };
                    error_className = error_info ? "am-icon-warning" : "";
                    _this.setState({error_info, error_className});
                }
            }
        });
        uploader.init();
    }
    render () {
        const {userlevel} = this.props,
            {State, tip_info, error_info, tip_className, error_className} = this.state;
        if (userlevel === "1" || State !== 0) {return null};
        return (
            <div className="am-tabs" data-am-tabs="{noSwipe: 1}" id="doc-tab-demo-1" ref={ele => this.upload = ele}>
                <div className="am-tabs-bd">
                    <div className="am-tab-panel am-active" style={{paddingBottom: 0}}>
                        <div id="btn-group">
                            <button id="selectfiles" className="am-btn am-btn-primary">选择上传文件</button>
                            <button id="postfiles" className="am-btn am-btn-primary">开始上传</button>
                            <span id="tip-info"><i className={tip_className}></i>{tip_info}</span>
                            <span id="error-info"><i className={error_className}></i>{error_info}</span>
                        </div>
                        <div id="fileslist" className="fileslist-small"></div>
                    </div>
                </div>
            </div>
        );
    }
}
class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "",
            State: "",
            title: "",
            mx_url: "",
            editUrl: "",
            fbx_url: "",
            userName: "",
            preview_url: "",
            Message: "暂无反馈",
            progress: "开始上传",
            ID: props.location.query.ID,
            userlevel: props.config.user.userlevel
        };
        this.progressChange = this.progressChange.bind(this);
    }
    progressChange (isUploadend) {
        const {step, State} = this.state,
            curStep = isUploadend ? 3 : 2;
        State === -1
            ? this.setState({step: new SetStep({curStep, content: ".stepCont"})})
            : (step.__proto__.setProgress.call(step, step.stepContainer, curStep, 5), isUploadend && this.setState({State: curStep}));
    }
    componentWillMount () {
        let editUrl = null, _this = this, Pro_ID = _this.state.ID;
        $.ajax({
            url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=GetCurrent",
            type: "post",
            async: false,
            data: { Pro_ID },
            success (data) {
                data = JSON.parse(data);
                let { Title, State, Mx_Url, Fbx_Url, A3x_Url, Message, UserName } = data,
                    isOwner = UserName === _this.props.config.user.userName;
                if (A3x_Url) { A3x_Url = `/preview/index.html?url=${A3x_Url}` };
                if (Mx_Url && isOwner) { editUrl = `/vrplanner/index.html?Pro_ID=${Pro_ID}` };
                _this.setState({
                    State,
                    Message,
                    title: Title,
                    editUrl,
                    fbx_url: Fbx_Url,
                    userName: UserName,
                    mx_url: Mx_Url,
                    preview_url: A3x_Url
                });
            }
        });
    }
    componentDidMount () {
        let { State, mx_url, editUrl, fbx_url, preview_url } = this.state, state = State === -1, step = null;
        State = state ? 5 : State === 0 ? State + 1 : State;
        if (mx_url) { this.mxUrl.classList.remove("am-disabled") };
        if (fbx_url) { this.fbxUrl.classList.remove("am-disabled") };
        if (editUrl) { this.editUrl.classList.remove("am-disabled") };
        if (preview_url) { this.previewUrl.classList.remove("am-disabled") };
        step = state
            ? new SetFailStep({curStep: State, content: ".stepCont"})
            : new SetStep({curStep: State, content: ".stepCont"});
        this.setState({step});
    }
    render(){
        const {ID, title, State, userlevel, userName, mx_url, editUrl, fbx_url, Message, preview_url} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">{title}</div>
                    </div>
                    <div className="tpl-block ">
                        <h1>项目进度</h1>
                        <div className="stepCont stepCont2">
                            <div className='ystep-container ystep-lg ystep-blue'></div>
                        </div>
                        <br />
                        <section className="am-panel am-panel-default am-panel-secondary" style={{"width": "50%","marginLeft": "auto","marginRight": "auto"}}>
                            <header className="am-panel-hd" style={{"textAlign": "center"}}><h3 className="am-panel-title">反馈信息</h3></header>
                            <div className="am-panel-bd">{Message}</div>
                        </section>
                        <div style={{"textAlign": "center"}}>
                            <a href={fbx_url} ref={(ele) => this.fbxUrl = ele} download={title} className="am-btn am-disabled am-btn-primary">DAE模型下载<i className="am-icon-cloud-download"></i></a>&nbsp;
                            <a href={mx_url} ref={ele => this.mxUrl = ele} download={title} className="am-btn am-disabled am-btn-primary">3MX模型下载<i className="am-icon-cloud-download"></i></a>&nbsp;
                            <a href={preview_url} ref={ele => this.previewUrl = ele} target="_blank" className="am-btn am-disabled am-btn-primary">在线预览<i className="iconfont icon-yanjing"></i></a>&nbsp;
                            <a href={editUrl} ref={ele => this.editUrl = ele} target="_blank" className="am-btn am-disabled am-btn-primary">在线编辑<i className="iconfont icon-yanjing"></i></a>
                        </div>
                        <div className="caption font-green bold" style={{display: (userlevel === "1" || State !== 0 ) ? "none" : "block"}}>文件上传</div>
                        <UploadFile ID={ID} name={title} State={State} userName={userName} userlevel={userlevel} progressChange={this.progressChange} />
                    </div>
                </div>
            </div>);
    }
}
function mapStateToProps(state) {
    return {
        config: state.config
    };
}
export default connect(mapStateToProps, null)(ProjectPage);