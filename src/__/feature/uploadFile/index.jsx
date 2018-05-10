import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Slider } from '../../components';

class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        const userName = props.config.user.userName,
            {ID, name} = props.location.query;
        this.state = {ID, name, userName, tip_info: "", error_info: "", tip_className: "", error_className: ""};
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
                    mime_types: [
                        { title: "Image files", extensions: "jpg,gif,png,bmp" }, 
                        { title: "Zip files", extensions: "zip,rar" }
                    ],
                    max_file_size : '10mb',
                    prevent_duplicates : true
                },
                init: {
                    PostInit: function() {
                        oFileslist.innerHTML = '';
                        oPostfiles.onclick = function() {
                            set_upload_param(uploader, '', false, ID, name, userName);
                            return false;
                        };
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
                            len = files.length,
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
                        if (id === files[len - 1].id && isSuccess) {
                            $.ajax({
                                url: "http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=finish",
                                type: "POST",
                                data: {ProID: ID, UserName: userName},
                                success (data) {
                                    JSON.parse(data).code === "0"
                                        ? hashHistory.push(`/feature/projectProfile?ID=${ID}`)
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
    render(){
        const {tip_info, error_info, tip_className, error_className} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">文件上传
                            <small style={{marginLeft: ".5rem", fontSize: "12px"}}>支持的文件格式：jpg, gif, png, bmp</small>
                        </div>
                    </div>
                    <div id="btn-group">
                        <button id="selectfiles" className="am-btn am-btn-primary">选择上传文件</button>
                        <button id="postfiles" className="am-btn am-btn-primary">开始上传</button>
                        <span id="tip-info"><i className={tip_className}></i>{tip_info}</span>
                        <span id="error-info"><i className={error_className}></i>{error_info}</span>
                    </div>
                    <div id="fileslist"></div>
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