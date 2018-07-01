import * as React from 'react';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header } from './components';
import { loggedOut } from '../lib/actions/config';
import * as utils from '../lib/utils';

class LayoutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {logo: '', title: '用户中心', userlevel: ''};
    }
    toggleLeftNav(){
        let oNav = document.getElementsByClassName('tpl-left-nav-hover')[0]
        let displayStyle = getComputedStyle(oNav,null).display || div.currentStyle.display;
        let isShow = displayStyle === 'block' ? true : false
        oNav.style.display = !isShow ? 'block' : 'none'
    } 
    componentWillMount() {
        const _this = this;
        if (!_this.props.config || !_this.props.config.user) {
            hashHistory.push('/login');
            return;
        };
        $.ajax({
            url: "http://192.168.1.148:66/ajax/UserCheck.ashx?cmd=isCheck",
            type: "POST",
            async: false,
            data: {UserName: _this.props.config.user.userName},
            success (data) {
                const {msg, logo, title} = JSON.parse(data);
                _this.setState({logo, title, userlevel: msg});
            }
        });
    }
    render() {        
        if (!this.props.config || !this.props.config.user) {
            return null;
        };
        this.props.config.user = utils.assign(this.props.config.user, this.state);
        return (<div>
            <Header location={this.props.location} config={this.props.config} loggedOut={this.props.loggedOut} toggleLeftNav={this.toggleLeftNav.bind(this)}/>
            {this.props.children}
        </div>);
    }
}
function mapStateToProps(state) {
    return {
        config: state.config,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        loggedOut: bindActionCreators(loggedOut, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage);