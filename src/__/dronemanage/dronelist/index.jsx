import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Slider } from '../../components';

class Item extends React.Component {
    constructor (props) {
        super(props);
        this.state = {UserName: props.UserName};
        this.delDrone = this.delDrone.bind(this);
    }
    delDrone (ev) {
        ev.preventDefault();
        const _this = this,
            {Id} = _this.props.data, {UserName} = _this.state,
            isDelDrone = window.confirm("确定删除此架无人机？");
        isDelDrone && $.ajax({
            url: "http://192.168.1.148:66/ajax/Serial_NumberAjax.ashx?cmd=Del",
            type: "post",
            data: {ID: Id, UserName},
            success (data) {
                data = JSON.parse(data);
                data.code === "0" 
                    ? _this.props.delDrone(_this.props.index)
                    : utils.Swal.error(new Error(msg));
            }
        });
    }
    render () {
        const {Id, Title, Machine_Code, Register_Date} = this.props.data;
        return (
            <tr>
                <td>{Title}</td>
                <td className="am-hide-sm-only">{Machine_Code}</td>
                <td className="am-hide-sm-only">{Register_Date}</td>
                <td className="am-hide-sm-only">
                    <div className="am-btn-toolbar">
                        <div className="am-btn-group am-btn-group-xs">
                            <button className="am-btn am-btn-default am-btn-xs am-text-secondary">
                                <Link to={"/dronemanage/droneinfo?id=" + Id} >
                                    <span className="am-icon-pencil-square-o"></span>&nbsp;修改
                                </Link>
                            </button>
                            <button onClick={this.delDrone} className="am-btn am-btn-default am-btn-xs am-text-danger am-hide-sm-only">
                                <span className="am-icon-trash-o"></span>&nbsp;删除
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }
}

class DroneListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {arr: [], select: "", index: 1, Counts: 0, UserName: props.config.user.userName, pageList: [], pageListNumber: 0};
        this.delDrone = this.delDrone.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
    }
    delDrone (index) {
        let {Counts, select} = this.state,
            pageCount = Math.ceil((Counts - 1) / 10);
        index = Math.max(Math.min(index, pageCount), 1);
        this.updateDroneList.bind(this, select, index)();
    }
    searchUser () {
        const select = this.searchoption.value;
        this.updateDroneList.bind(this, select, 1)();
    }
    updateDroneList (select, index) {
        const _this = this, {UserName} = _this.state;
        $.ajax({
            url: "http://192.168.1.148:66/ajax/Serial_NumberAjax.ashx?cmd=Get",
            type: "POST",
            data: {index, select, UserName},
            success (data) {
                data = JSON.parse(data);
                const arr = [], list = data.data, Counts = data.Counts, len = list.length, pageList = [], pageListNumber = Math.ceil(Counts / 10),
                    pageCount = pageListNumber <= 5 ? pageListNumber : 5, minusIndex = Math.floor(pageCount / 2);
                for (let i = 0; i < len; i ++) {
                    arr.push(<Item key={i} data={list[i]} delDrone={_this.delDrone} index={index} UserName={UserName} />);
                };
                if (Counts !== 0) {
                    let pageIndex = index;
                    if (pageListNumber > 5) {
                        if (pageIndex <= minusIndex) {
                            pageIndex = 1;
                        } else if (pageListNumber - pageIndex <= minusIndex) {
                            pageIndex = pageListNumber - pageCount + 1;
                        } else {
                            pageIndex = pageIndex - minusIndex;
                        };
                    } else {
                        pageIndex = 1;
                    };             
                    pageList.push(<li key={pageIndex - 1}>
                        <a onClick={_this.updateDroneList.bind(_this, select, Math.max(index - 1, 1))}>&lt;</a>
                    </li>);
                    for (let i = 0; i < pageCount; i ++) {
                        const nowPageNumber = i + pageIndex;
                        pageList.push(<li key={nowPageNumber} className={nowPageNumber === index ? "am-active" : ""}>
                            <a onClick={_this.updateDroneList.bind(_this, select, nowPageNumber)}>{nowPageNumber}</a>
                        </li>);
                    };
                    pageList.push(<li key={pageListNumber + 1}>
                        <a onClick={_this.updateDroneList.bind(_this, select, Math.min(index + 1, pageListNumber))}>&gt;</a>
                    </li>);
                };
                _this.setState({arr, select, index, Counts, pageList, pageListNumber});
            }
        });
    }
    keydownHandler (ev) {
        const keyCode = ev.keyCode;
        if (keyCode === 13) {
            this.updateDroneList.bind(this, this.searchoption.value, 1)();
        } else if (keyCode === 27) {
            this.updateDroneList.bind(this, "", 1)();
        };
    }
    componentDidMount () {
        this.updateDroneList.bind(this, "", 1)();
        document.addEventListener("keydown", this.keydownHandler, false);
    }
    componentWillUnmount () {
        document.removeEventListener("keydown", this.keydownHandler, false);
    }
    render(){
        const {select, index, Counts, pageList, pageListNumber} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">无人机列表</div>
                        <div className="tpl-portlet-input tpl-fz-ml">
                            <div className="portlet-input input-small input-inline">
                                <div className="input-icon right">
                                    <i className="am-icon-search" onClick={this.searchUser}></i>
                                    <input type="text" ref={ele => this.searchoption = ele} className="form-control form-control-solid" placeholder="搜索..." />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tpl-block">
                        <div className="am-g">
                            <div className="am-u-sm-12">
                                <form className="am-form">
                                    <table className="am-table am-table-striped am-table-hover table-main">
                                        <thead>
                                            <tr>
                                                <th className="table-title">名称</th>
                                                <th className="table-title">序列号</th>
                                                <th className="table-title">出厂日期</th>
                                                <th className="table-author am-hide-sm-only">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>{this.state.arr}</tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                        <nav id="nav">
                            <span>共{Counts}台无人机</span>
                            <ul id="page-list" className="am-pagination tpl-pagination">{pageList}</ul>
                        </nav>
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

export default connect(mapStateToProps, null)(DroneListPage);