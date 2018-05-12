import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Slider } from '../../components';

function Item (props) {
    const {Email, Mobile, UserName, DisplayName, CountOfLogin, LastActivityDate} = props.data;
    return (
        <tr>
            <td>{UserName}</td>
            <td className="am-hide-sm-only">{DisplayName}</td>
            <td className="am-hide-sm-only">{Mobile}</td>
            <td className="am-hide-sm-only">{Email}</td>
            <td className="am-hide-sm-only">{CountOfLogin}</td>
            <td className="am-hide-sm-only">{new Date(parseInt(LastActivityDate.match(/\d+/))).toLocaleString()}</td>
            <td className="am-hide-sm-only">
                <button className="am-btn am-btn-default am-btn-xs am-text-secondary">
                    <Link to={"/usermanage/userinfo?name=" + UserName} >
                        <span className="am-icon-pencil-square-o"></span>&nbsp;修改
                    </Link>
                </button>
            </td>
        </tr>
    );
}

class UserListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {arr: [], keys: "", index: 1, Counts: 0, Superior: props.config.user.userName, pageList: [], pageListNumber: 0};
        this.searchUser = this.searchUser.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
    }
    searchUser () {
        const keys = this.searchoption.value;
        this.updateUserList.bind(this, keys, 1)();
    }
    updateUserList (keys, index) {
        const _this = this, {Superior} = _this.state;
        $.ajax({
            url: "http://192.168.1.148:66/ajax/UserCheck.ashx?cmd=GetAllUser",
            type: "POST",
            data: {keys, index, UserName: Superior},
            success (data) {
                data = JSON.parse(data);
                const arr = [], list = data.data, Counts = data.Counts, len = list.length, pageList = [], pageListNumber = Math.ceil(Counts / 10),
                    pageCount = pageListNumber <= 5 ? pageListNumber : 5, minusIndex = Math.floor(pageCount / 2);
                for (let i = 0; i < len; i ++) {
                    arr.push(<Item key={i} data={list[i]} Superior={Superior} />);
                };
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
                if (Counts !== 0) {
                    pageList.push(<li key={pageIndex - 1}>
                        <a onClick={_this.updateUserList.bind(_this, keys, Math.max(index - 1, 1))}>&lt;</a>
                    </li>);
                    for (let i = 0; i < pageCount; i ++) {
                        const nowPageNumber = i + pageIndex;
                        pageList.push(<li key={nowPageNumber} className={nowPageNumber === index ? "am-active" : ""}>
                            <a onClick={_this.updateUserList.bind(_this, keys, nowPageNumber)}>{nowPageNumber}</a>
                        </li>);
                    };
                    pageList.push(<li key={pageListNumber + 1}>
                        <a onClick={_this.updateUserList.bind(_this, keys, Math.min(index + 1, pageListNumber))}>&gt;</a>
                    </li>);
                };
                _this.setState({arr, keys, index, Counts, pageList, pageListNumber});
            }
        });
    }
    keydownHandler (ev) {
        const keyCode = ev.keyCode;
        if (keyCode === 13) {
            this.updateUserList.bind(this, this.searchoption.value, 1)();
        } else if (keyCode === 27) {
            this.updateUserList.bind(this, "", 1)();
        };
    }
    componentDidMount () {
        this.updateUserList.bind(this, "", 1)();
        document.addEventListener("keydown", this.keydownHandler, false);
    }
    componentWillUnmount () {
        document.removeEventListener("keydown", this.keydownHandler, false);
    }
    render(){
        const {keys, index, Counts, pageList, pageListNumber} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">用户列表</div>
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
                                                <th className="table-title">用户名</th>
                                                <th className="table-title">真实姓名</th>
                                                <th className="table-author am-hide-sm-only">手机号</th>
                                                <th className="table-author am-hide-sm-only">邮箱地址</th>
                                                <th className="table-author am-hide-sm-only">登录次数</th>
                                                <th className="table-author am-hide-sm-only">最后登录时间</th>
                                                <th className="table-author am-hide-sm-only">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>{this.state.arr}</tbody>
                                    </table>
                                </form>
                            </div>
                        </div>
                        <nav id="nav">
                            <span>共{Counts}名用户</span>
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
export default connect(mapStateToProps, null)(UserListPage);