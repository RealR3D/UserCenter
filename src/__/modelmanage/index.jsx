import * as React from 'react';
import { connect } from 'react-redux';
import * as utils from '../../lib/utils';
import ThumbnailPage from './ThumbnailPage';

class IndexPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            Title: '',
            files: null,
            Type: 'Build',
            UserName: this.props.config.user.userName,
            directory: '',
            thumbnali: '',
            image_url: '',
            childPage: null,
            files: null
        };
        this.postImgUrl = this.postImgUrl.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.changeFilesHandler = this.changeFilesHandler.bind(this);
        this.changeModelTypeHandler = this.changeModelTypeHandler.bind(this);
        this.changeThumbnaliHandler = this.changeThumbnaliHandler.bind(this);
        this.changeModelSoureceFilesHandler = this.changeModelSoureceFilesHandler.bind(this);
    }
    postImgUrl (image_url) {
        this.setState({ childPage: null, image_url });
    }
    changeHandler (ev) {
        this.setState({ [ev.target.name]: ev.target.value });
    }
    changeFilesHandler (ev) {
        this[ev.target.name].click();
    }
    changeThumbnaliHandler () {
        const { thumbnali } = this.state;
        this.setState({ childPage: <ThumbnailPage thumbnali={thumbnali} postImgUrl={this.postImgUrl} /> });
    }
    changeModelSoureceFilesHandler (ev) {
        const { files } = ev.target;
        let directory = files[0].webkitRelativePath.split('/')[0];
        if (directory.includes(' ')) {
            utils.Swal.error(new Error('文件命名不能包含空格'));
            return;
        };
        this.setState({ directory, files });
    }
    clickHandler () {
        const { Type, files, Title, UserName, image_url } = this.state,
            FileName = files[0].webkitRelativePath;
        if (Title === "") {
            utils.Swal.error(new Error('未输入模型名称！'));
            return;
        } else if (!image_url) {
            utils.Swal.error(new Error('未选择模型缩略图！'));
            return;
        } else if (files.length === 0) {
            utils.Swal.error(new Error('未选择模型源文件！'));
            return;
        };
        let index = 0, { length } = files;
        $.ajax({
            url: "http://192.168.1.148:66/ajax/Model_LibAjax.ashx?cmd=Add",
            type: "POST",
            data: {
                Title,
                UserName,
                image_url,
                FileName,
                Type
            },
            success (data) {
                console.log(data)
                let { ID, code }  = JSON.parse(data);
                if (!parseInt(code)) {
                    for (let i = 0; i < length; i ++) {
                        let form = new FormData();
                        form.append("file", files[i]);
                        form.append("FileName", files[i].webkitRelativePath);
                        form.append("ID", ID);
                        form.append("UserName", UserName);
                        $.ajax({
                            url: "http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=UploadImg",
                            type: "POST",
                            data: form,
                            processData: false,
                            contentType: false,
                            success: function (d) {
                                let { code } = JSON.parse(d);
                                console.log(d)
                                index ++;
                                if (index === length && code === "0") {
                                    $.ajax({
                                        url: "http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=IsLast",
                                        type: "POST",
                                        data: {
                                            ID,
                                            UserName,
                                            Pro_ID: 289,
                                            Type,
                                            FileName: files[index - 1].webkitRelativePath,
                                        },
                                        success: function (_data) {
                                            console.log(_data)
                                            let data = { ID, UserName, post: "User" },
                                                _intervar = setInterval(function () {
                                                    $.ajax({
                                                        url: 'http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=CallBack',
                                                        type: "POST",
                                                        async: true,
                                                        data,
                                                        success: function (d) {
                                                            console.log(d)
                                                            let { code } = JSON.parse(d);
                                                            if (!parseInt(code)) {
                                                                clearInterval(_intervar);
                                                            };
                                                        }
                                                    });
                                                }, 4000);
                                        }
                                    })
                                };
                            }
                        });
                    };
                };
            }
        });
    }
    changeModelTypeHandler (ev) {
        console.log(ev.target.selectedOptions[0].value)
        this.setState({ Type: ev.target.selectedOptions[0].value });
    }
    componentDidMount () {
        const { files } = this;
        files.setAttribute('directory', '');
        files.setAttribute('webkitdirectory', '');
    }
    render() {
        const { Title, childPage, directory } = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">模型上传</div>
                    </div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "40px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">模型名称</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Title" placeholder="请输入模型名称" value={Title} onChange={this.changeHandler} /> 
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "40px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">模型缩略图</label>
                                        <div className="am-u-sm-9">
                                            <button type="button" className="am-btn am-btn-primary" name="thumbnail" onClick={this.changeThumbnaliHandler}>点击添加缩略图</button>
                                            <input type="file" ref={ele => this.thumbnail = ele} accept="image/png, image/jpeg, image/jpg" id="thumbnail" style={{ display: 'none' }} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "40px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">模型源文件</label>
                                        <div className="am-u-sm-9">
                                            <button type="button" className="am-btn am-btn-primary" name="files" onClick={this.changeFilesHandler}>点击添加源文件</button>
                                            <input type="file" multiple="multiple" ref={ele => this.files = ele} id="files" onChange={this.changeModelSoureceFilesHandler} style={{ display: 'none' }} />
                                            <span style={{ padding: '0 1rem' }}>{ directory }</span>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "40px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">模型类别</label>
                                        <div className="am-u-sm-9">
                                            <select data-am-selected id="selectdown" onChange={this.changeModelTypeHandler}>
                                                <option value="Build">建筑类模型</option>
                                                <option value="Green">绿化类模型</option>
                                                <option value="Fac">设施类模型</option>
                                                <option value="White">白模型</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "40px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button type="button" className="am-btn am-btn-primary" onClick={this.clickHandler}>上传</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                { childPage }
            </div>);
    }
}
function mapStateToProps(state) {
    return {
        config: state.config
    };
}
export default connect(mapStateToProps, null)(IndexPage);