import * as React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

class Item extends React.Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange () {
        let {name, value} = this.props;
        value = !value;
        name && this.props.onStateChange(name, value);
    }
    render () {
        let {to, name, title, value, iconName} = this.props,
            classNameA = "nav-link tpl-left-nav-link-list " + (value ? "active" : ""),
            classNameI = "am-icon-angle-right tpl-left-nav-more-ico am-fr am-margin-right " + (value ? "tpl-left-nav-more-ico-rotate" : "");
        classNameI = name ? classNameI : "";
        return (
            <Link className={classNameA} onClick={this.handleChange} to={to}>
                <i className={iconName}></i>
                <span>{title}</span>
                <i className={classNameI}></i>
            </Link>
        )
    }
}
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        const {active, userName } = props;
        this.state = {
            userName,
            item0: false,
            item1: false,
            item2: false,
            item3: false,
            item4: false,
            item5: false,
            ["item" + active]: true
        }

        this.handleChange = this.handleChange.bind(this);
    }
    handleChange (key, value) {
        this.setState({[key]: value});
    }
    componentDidMount () {
        this.props.userlevel !== "2" && this.usermanage.parentNode.removeChild(this.usermanage);
        this.props.userlevel !== "1" && this.dronemanage.parentNode.removeChild(this.dronemanage);
    }
    render() {

        const {item0, item1, item2, item3, item4, item5} = this.state,
            state1 = item1 ? "block" : "none",
            state2 = item2 ? "block" : "none",
            state3 = item3 ? "block" : "none",
            state4 = item4 ? "block" : "none";
        return (
        <div className="tpl-left-nav tpl-left-nav-hover" id="left-nav">
            <div className="tpl-left-nav-title">用户中心</div>
            <div className="tpl-left-nav-list">
                <ul className="tpl-left-nav-menu">
                    <li className="tpl-left-nav-item">
                        <Item value={item0} title="首页" iconName="am-icon-home" to="/" />
                    </li>
                    <li className="tpl-left-nav-item">
                        <Item name="item1" value={item1} title="项目管理" iconName="iconfont icon-gongnengguanli" onStateChange={this.handleChange} />
                        <ul className="tpl-left-nav-sub-menu" style={{"display": state1}}>
                            <li>
                            <Link to="/projectmanage/createProject" className="nav-link">
                                <i className="am-icon-angle-right"></i><span>创建项目</span>
                            </Link>
                            <Link to="/projectmanage/projectList" className="nav-link">
                                <i className="am-icon-angle-right"></i><span>项目列表</span>
                            </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="tpl-left-nav-item">
                        <Item name="item2" value={item2} title="个人信息" iconName="iconfont icon-iconfontgerenzhongxin" onStateChange={this.handleChange} />
                        <ul className="tpl-left-nav-sub-menu" style={{"display": state2}}>
                            <li>
                                <Link to="/info/profile" className="nav-link">
                                    <i className="am-icon-angle-right"></i><span>基本信息</span>
                                </Link>
                                <Link to="/info/password" className="nav-link">
                                    <i className="am-icon-angle-right"></i><span>密码修改</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li id="usermanage" ref={ele => this.usermanage = ele} className="tpl-left-nav-item">
                        <Item name="item3" value={item3} title="用户管理" iconName="am-icon-cogs" onStateChange={this.handleChange} />
                        <ul className="tpl-left-nav-sub-menu" style={{"display": state3}}>
                            <li>
                                <Link to="usermanage/createuser" className="nav-link">
                                    <i className="am-icon-angle-right"></i><span>创建用户</span>
                                </Link>
                                <Link to="/usermanage/userlist" className="nav-link">
                                    <i className="am-icon-angle-right"></i><span>用户列表</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li ref={ele => this.dronemanage = ele} className="tpl-left-nav-item">
                        <Item name="item4" value={item4} title="无人机管理" iconName="am-icon-paper-plane" onStateChange={this.handleChange} />
                        <ul className="tpl-left-nav-sub-menu" style={{"display": state4}}>
                            <li>
                                <Link to="dronemanage/createdrone" className="nav-link">
                                    <i className="am-icon-angle-right"></i><span>添加无人机</span>
                                </Link>
                                <Link to="/dronemanage/dronelist" className="nav-link">
                                    <i className="am-icon-angle-right"></i><span>无人机列表</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="tpl-left-nav-item">
                        <Item to="/tutorial/" value={item5} title="在线教程" iconName="iconfont am-icon-book" onStateChange={this.handleChange} />
                    </li>
                </ul>
            </div>
        </div>);
    }
}