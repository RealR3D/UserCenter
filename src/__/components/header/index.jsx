import * as React from 'react';
import { IndexLink, Link } from 'react-router';
import cx from 'classnames';
import * as models from '../../../lib/models';
import client from '../../../lib/client';
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        let {userlevel, userName} = props.config.user;
        if (userlevel === "0") {
            userName = "用户：" + userName;
        } else if (userlevel === "1") {
            userName = "建模人员：" + userName;
        } else if (userlevel === "2") {
            userName = "厂家：" + userName;
        };
        this.state = {
            userName,
            full: false,
            text: "开启全屏",
        };
        this.fullScreen = this.fullScreen.bind(this);
    }
    fullScreen () {
        let text = "",
            full = this.state.full,
            element = document.documentElement;
        full = !full;
        if (full) {
            text = "退出全屏";
            if (element.requestFullscreencreen) {
                element.requestFullScreen()
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen()
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen()
            } else if (element.msRequestFullScreen) {
                element.msRequestFullScreen()
            };
        } else {
            text = "开启全屏";
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            };
        };
        this.setState({full, text});
    }
    componentWillMount () {
        
    }
    render() {
        const {userName} = this.state;
        return (
        <div id="hd">
            <div className="uc-header">
                <h1 className="logo">
                    <IndexLink to="/" style={{ backgroundImage: 'url(' + this.props.config.logoUrl + ')' }}/>
                </h1>
                <div className="am-icon-list tpl-header-nav-hover-ico" id="tap-change" onClick={this.props.toggleLeftNav}>
                </div>
                <div className="nav-login">
                    <ul>
                        <li className="am-hide-sm-only">
                            <Link id="admin-fullscreen" className="tpl-header-list-link" onClick={this.fullScreen}>
                                <span className="am-icon-arrows-alt"></span>&nbsp;
                                <span className="admin-fullText">{this.state.text}</span>
                            </Link>
                        </li>
                        <li><Link className="avatar-img">{userName}</Link></li>
                        <li><Link to="/login" title="退出个人中心" className="lnk sign-out" onClick={() => client.users.logout(() => this.props.loggedOut())}><span className="am-icon-sign-out tpl-header-list-ico-out-size"></span></Link></li>
                    </ul>
                </div>
            </div>
      </div>);
    }
}