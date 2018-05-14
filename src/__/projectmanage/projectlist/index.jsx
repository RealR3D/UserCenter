import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Slider } from '../../components';
import * as utils from '../../../lib/utils';

function StarItem (props) {
    return (
        <i className={props.className} style={props.style} onClick={props.onClick}></i>
    );
}

class Item extends React.Component {
    constructor (props) {
        super(props);
        this.delProject = this.delProject.bind(this);
        this.updateProject = this.updateProject.bind(this);
    }
    delProject (ev) {
        ev.preventDefault();
        const _this = this,
            isDelProject = window.confirm("确定删除此项目？");
        isDelProject && $.ajax({
            url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=Del",
            type: "post",
            data: {Pro_ID: _this.props.data.Id},
            success (data) {
                data = JSON.parse(data);
                data.code === "0"
                    ? _this.props.delChildren(_this.props.index)
                    : utils.Swal.error(new Error(data.msg));
            }
        });
    }
    updateProject () {
        const _this = this, {Id, State, Mx_Url, Fbx_Url, A3x_Url, Message, UserName, isSendEmail} = _this.props.data, index = _this.props.index;
        if (State === 2) {
            $.ajax({
                url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=ModState",
                type: "POST",           
                data: {ProID: Id},
                success (data) {
                    data = JSON.parse(data);
                    data.code === "0"
                        ? (_this.props.data.State = 3,
                            _this.stateTd.innerHTML = "正在建模",
                            _this.editBtn.lastElementChild.innerHTML = "上传")
                        : utils.Swal.error(new Error(data.msg));
                }
            });
        } else {
            this.props.updateChild(this.props.data, index);
        };
    }
    render () {
        let StarsList = [], {State, Title, UserName, Id, Create_Time, Stars} = this.props.data,
            {userlevel} = this.props, editBtn = "", state = ["未上传", "", "空三运算", "正在建模", "建模完成"][State];
        Create_Time = new Date(parseInt(Create_Time.match(/\d+/))).toLocaleString();
        state = State === -1 ? "建模失败" : state;
        if (userlevel === "1") {
            if (State === 0 || State === 1) {
                editBtn = null;
            } else if (State === 2) {
                editBtn = <button ref={ele => this.editBtn = ele} className="am-btn am-btn-default am-btn-xs am-text-secondary" onClick={this.updateProject}>
                    <span className="am-icon-pencil-square-o"></span>&nbsp;<span>建模</span>
                </button>;
            } else if (State === 3) {
                editBtn = <button ref={ele => this.editBtn = ele} className="am-btn am-btn-default am-btn-xs am-text-secondary" onClick={this.updateProject}>
                    <span className="am-icon-pencil-square-o"></span>&nbsp;<span>上传</span>
                </button>;
            } else {
                editBtn = <button ref={ele => this.editBtn = ele} className="am-btn am-btn-default am-btn-xs am-text-secondary" onClick={this.updateProject}>
                    <span className="am-icon-pencil-square-o"></span>&nbsp;<span>修改</span>
                </button>;
            };
        };
        for (let i = 0; i < 5; i ++) {
            const className = "am-icon-star" + (i < Stars ? " star" : "-o");
            StarsList.push(
                <StarItem key={i} className={className} />
            );
        };
        return (
            <tr>
                <td><input type="checkbox" /></td>
                <td><Link to={`/projectmanage/projectProfile?ID=${Id}`}>{Title}</Link></td>
                <td className="am-hide-sm-only item-state-td" ref={ele => this.stateTd = ele}>{state}</td>
                <td className="am-hide-sm-only">{UserName}</td>
                <td className="am-hide-sm-only">{Create_Time}</td>
                <td className="am-hide-sm-only">{StarsList}</td>
                <td>
                    <div className="am-btn-toolbar">
                        <div className="am-btn-group am-btn-group-xs">
                            <button className="am-btn am-btn-default am-btn-xs am-text-secondary">
                                <Link to={`/projectmanage/projectProfile?ID=${Id}`}>
                                    <span className="am-icon-file-text-o"></span>&nbsp;详细
                                </Link>
                            </button>
                            {editBtn}
                            <button onClick={this.delProject} className="am-btn am-btn-default am-btn-xs am-text-danger am-hide-sm-only">
                                <span className="am-icon-trash-o"></span>&nbsp;删除
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}
class PageList extends React.Component {
    constructor (props) {
        super(props);
        const {Counts, select, index, updateDataList} = props;
        this.state = {list: [], Counts, select, index, updateDataList};
    }
    componentDidMount () {
        const {list, Counts, select, index, updateDataList} = this.state,
            pageCount = Counts <= 5 ? Counts : 5, minusIndex = Math.floor(pageCount / 2);
        let pageIndex = index;
        if (Counts > 5) {
            if (pageIndex <= minusIndex) {
                pageIndex = 1;
            } else if (Counts - pageIndex <= minusIndex) {
                pageIndex = Counts - pageCount + 1;
            } else {
                pageIndex = pageIndex - minusIndex;
            };
        } else {
            pageIndex = 1;
        };
        for (let i = 0; i < pageCount; i ++) {
            const nowPageNumber = i + pageIndex;
            list.push(<li key={nowPageNumber} className={nowPageNumber === index ? "am-active" : ""}><a onClick={updateDataList(select, nowPageNumber)}>{nowPageNumber}</a></li>);
        };
        this.setState({list});
    }
    render () {
        const {list, Counts, select, index, updateDataList} = this.state;
        return (
            <ul id="page-list" className="am-pagination tpl-pagination">
                <li><a onClick={updateDataList(select, Math.max(index - 1, 1))}>&lt;</a></li>
                {list}
                <li><a onClick={updateDataList(select, Math.min(index + 1, Counts))}>&gt;</a></li>
            </ul>
        );
    }
}
class UpdateProject extends React.Component {
    constructor (props) {
        super(props);
        this.state = utils.assign(props.data, {index: props.index, userName: props.userName, workState: true, isSendEmail: true, State: 4});
        this.changeHandler = this.changeHandler.bind(this);
        this.updateProjectHandler = this.updateProjectHandler.bind(this);
    }
    clickHandler (j) {
        const StarsList = [];
        for (let i = 0; i < 5; i ++) {
            const className = "am-icon-star" + (i < (j + 1) ? " star" : "-o");
            StarsList.push(
                <StarItem key={i}
                    className={className} onClick={() => this.clickHandler(i)}
                    style={{fontSize: '24px', margin: '0 5px', cursor: 'point'}} />
            );
        };
        this.setState({StarsList, Stars: j + 1});
    }
    changeHandler (ev) {
        let State = this.state.State,
            target = ev.target,
            {name, type} = target,
            value = type === "checkbox" ? target.checked : target.value;
        if (name === "workState") {
            State = value ? 4 : -1;
        };
        this.setState({State, [name]: value});
    }
    updateProjectHandler () {
        let _this = this, {Id, index, State, Stars, Mx_Url, A3x_Url, Fbx_Url, Message, userName, isSendEmail} = _this.state;
        Mx_Url = (Mx_Url ? Mx_Url : "").replace("http://3mxdata.oss-cn-hangzhou.aliyuncs.com/", "");
        Fbx_Url = (Fbx_Url ? Fbx_Url : "").replace("http://fbxdata.oss-cn-hangzhou.aliyuncs.com/", "");
        $.ajax({
            url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=Upload",
            type: "POST",
            data: {
                State, Message, UserName: userName, isSendEmail, Stars,
                a3x_url: A3x_Url, ProID: Id, mx_url: Mx_Url, fbx_url: Fbx_Url, 
            },
            success (data) {
                if (JSON.parse(data).code === "1") {utils.Swal.error(new Error(data.msg));return;};
                _this.props.delChild();
                _this.props.updateInfo();
            }
        });
    }
    componentWillMount () {
        const StarsList = [];
        for (let i = 0; i < 5; i ++) {
            const className = "am-icon-star" + (i < this.props.data.Stars ? " star" : "-o");
            StarsList.push(
                <StarItem key={i}
                    className={className} onClick={() => this.clickHandler(i)}
                    style={{fontSize: '24px', margin: '0 5px', cursor: 'point'}} />
            );
        };
        this.setState({StarsList});
    }
    render () {
        let {Id, State, Mx_Url, Fbx_Url, A3x_Url, Message, workState, isSendEmail, StarsList} = this.state;
        A3x_Url = A3x_Url ? A3x_Url : "";
        Message = Message ? Message : "";
        Mx_Url = Mx_Url ? Mx_Url : "";
        Fbx_Url = Fbx_Url ? Fbx_Url : "";
        Mx_Url = Mx_Url.replace("http://3mxdata.oss-cn-hangzhou.aliyuncs.com/", "");
        Fbx_Url = Fbx_Url.replace("http://fbxdata.oss-cn-hangzhou.aliyuncs.com/", "");
        return (
            <div className="update-project">
                <div className="update-project-item">
                    <label className="update-project-label">DAE文件下载链接</label>
                    <input className="update-project-input" type="text" name="Fbx_Url" value={Fbx_Url} onChange={this.changeHandler} placeholder="请输入dae模型文件名" />
                </div>
                <div className="update-project-item">
                    <label className="update-project-label">3MX文件下载链接</label>
                    <input className="update-project-input" type="text" name="Mx_Url" value={Mx_Url} onChange={this.changeHandler} placeholder="请输入3mx模型文件名" />
                </div>
                <div className="update-project-item">
                    <label className="update-project-label">A3X文件预览链接</label>
                    <input className="update-project-input" type="text" name="A3x_Url" value={A3x_Url} onChange={this.changeHandler} placeholder="请输入a3x模型文件名"  />
                </div>
                <div className="update-project-item">
                    <label className="update-project-label">评分</label>
                    {StarsList}
                </div>
                <div className="update-project-item">
                    <label className="update-project-label update-project-label-small">建模成功</label>
                    <input className="update-project-checkbox" type="checkbox" name="workState" checked={workState} onChange={this.changeHandler} />
                </div>
                <div className="update-project-item">
                    <label className="update-project-label update-project-label-small">邮件提醒</label>
                    <input className="update-project-checkbox" type="checkbox" name="isSendEmail" checked={isSendEmail} onChange={this.changeHandler} />
                </div>
                <div className="update-project-item">
                    <label className="update-project-label">反馈内容</label>
                    <textarea className="update-project-textarea" name="Message" value={Message} onChange={this.changeHandler} />
                </div>
                <div className="update-project-item">
                    <button className="am-btn am-btn-primary update-project-btn" onClick={this.updateProjectHandler}>确定</button>
                </div>
                <div className="update-project-close-layer" onClick={this.props.delChild}>X</div>
            </div>
        );
    }
}
class ProjectPage extends React.Component {
    constructor(props) {
        super(props);
        const {userlevel, userName} = this.props.config.user;
        this.state = {
            userName, userlevel, index: 1, Counts: 0, select: "",
            child: null, totalPages: 0, pageList: [] ,children: [], 
        };
        this.delChild = this.delChild.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updateChild = this.updateChild.bind(this);
        this.delChildren = this.delChildren.bind(this);
        this.searchProject = this.searchProject.bind(this);
        this.clickToDelete = this.clickToDelete.bind(this);
        this.updateDataList = this.updateDataList.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
    }
    delChild () {
        this.setState({child: null});
        document.body.removeEventListener("click", this.clickToDelete, false);
    }
    updateInfo () {
        const {index, select} = this.state;
        this.delChild();
        this.updateDataList(select, index)();
    }
    updateChild (data, index) {
        document.addEventListener("click", this.clickToDelete, false);
        this.setState({
            child: <UpdateProject
                data={data} index={index} updateInfo={this.updateInfo}
                delChild={this.delChild} userName={this.state.userName} />
        });
    }
    delChildren (index) {
        let {Counts} = this.state,
            pageCount = Math.ceil((Counts - 1) / 10);
        index = Math.max(Math.min(index, pageCount), 1);
        this.updateDataList("", index)();
    }
    clickToDelete (ev) {
        if (ev.target.nodeName === "A") {this.delChild()};
    }
    searchProject () {
        const select = this.searchoption.value;
        this.updateDataList(select, 1)();
    }
    updateDataList (select, index) {
        return () => {
            const _this = this, reg = /\d+/g, {userName, userlevel} = _this.state, children = [], pageList = [];
            $.ajax({
                url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=GetAll",
                type: "POST",
                data: {UserName: userName, index, select},
                success (data) {
                    data = JSON.parse(data);
                    const Counts = data.Counts, totalPages = Math.ceil(Counts / 10), list = data.data, len = list.length,
                        pageCount = totalPages > 5 ? 5 : totalPages, minusIndex = Math.floor(pageCount / 2);
                    for (let i = 0; i < len; i ++) {
                        children.push(<Item key={i} index={i} data={list[i]} index={index} userlevel={userlevel} delChildren={_this.delChildren} updateChild={_this.updateChild} />);
                    };
                    if (Counts !== 0) {
                        let pageIndex = index;
                        if (totalPages > 5) {
                            if (pageIndex <= minusIndex) {
                                pageIndex = 1;
                            } else if (totalPages - pageIndex <= minusIndex) {
                                pageIndex = totalPages - pageCount + 1;
                            } else {
                                pageIndex = pageIndex - minusIndex;
                            };
                        } else {
                            pageIndex = 1;
                        };
                        pageList.push(<li key={pageIndex - 1}>
                            <a onClick={_this.updateDataList(select, Math.max(index - 1, 1))}>&lt;</a>
                        </li>);
                        for (let i = 0; i < pageCount; i ++) {
                            const nowPageNumber = i + pageIndex;
                            pageList.push(<li key={nowPageNumber} className={nowPageNumber === index ? "am-active" : ""}>
                                <a onClick={_this.updateDataList(select, nowPageNumber)}>{nowPageNumber}</a>
                            </li>);
                        };
                        pageList.push(<li key={totalPages + 1}>
                            <a onClick={_this.updateDataList(select, Math.min(index + 1, totalPages))}>&gt;</a>
                        </li>);
                    };
                    _this.setState({Counts, select, children, index, totalPages, pageList});
                }
            });
        }
    }
    keydownHandler (ev) {
        const keyCode = ev.keyCode;
        if (keyCode === 13) {
            this.updateDataList(this.searchoption.value1, 1)();
        } else if (keyCode === 27) {
            this.updateDataList("", 1)();
        };
    }
    componentDidMount () {
        this.updateDataList("", 1)();
        document.addEventListener("keydown", this.keydownHandler, false);
    }
    componentWillUnmount () {
        document.removeEventListener("click", this.clickToDelete, false);
        document.removeEventListener("keydown", this.keydownHandler, false);
    }
    render(){
        const {Counts, child, select, children, pageList, totalPages, index} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">我的项目</div>
                        <div className="tpl-portlet-input tpl-fz-ml">
                            <div className="portlet-input input-small input-inline">
                                <div className="input-icon right">
                                    <i className="am-icon-search" onClick={this.searchProject}></i>
                                    <input type="text" ref={ele => this.searchoption = ele} className="form-control form-control-solid" placeholder="搜索..." />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tpl-block">
                        <div className="am-g">
                            <div className="am-u-sm-12">
                                <form className="am-form">
                                    <table className="am-table am-table-striped am-table-hover table-main" style={{marginBottom: 0}}>
                                        <thead>
                                            <tr>
                                                <th className="table-check"></th>
                                                <th className="table-title">项目名称</th>
                                                <th className="table-author am-hide-sm-only">状态</th>
                                                <th className="table-author am-hide-sm-only">上传用户</th>
                                                <th className="table-date am-hide-sm-only">创建日期</th>
                                                <th className="table-date am-hide-sm-only">评分</th>
                                                <th className="table-set">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>{children}</tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                        <nav id="nav">
                            <span>共{Counts}个项目</span>
                            <ul id="page-list" className="am-pagination tpl-pagination">{pageList}</ul>
                        </nav>
                    </div>
                </div>
                {child}
            </div>);
    }
}
function mapStateToProps(state) {
    return {
        config: state.config
    };
}
export default connect(mapStateToProps, null)(ProjectPage);