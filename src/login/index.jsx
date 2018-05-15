import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Footer } from '../components';
import { login } from '../lib/actions/config';
import * as utils from '../lib/utils';
import client from '../lib/client';
import '../login.css';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            controls: {}
        };
    }
    componentDidMount() {
    }
    submit() {
        if (!this.state.account) {
            this.state.controls.error = '请输入登录帐号';
            this.setState(this.state);
        }
        else if (!this.state.password) {
            this.state.controls.error = '请输入登录密码';
            this.setState(this.state);
        }
        else {
            this.state.controls.submitting = true;
            this.setState(this.state);
            client.users.login(this.state.account, this.state.password, (err, res) => {
                if (err) {
                    this.state.controls.submitting = false;
                    this.state.controls.error = err.message || '账号或密码错误，请重新输入';
                    this.setState(this.state);
                }
                else {
                    this.props.login(res.user, res.group);
                    const redirectUrl = utils.getQueryStringValue(this.props.location.search, 'redirectUrl');
                    if (redirectUrl) {
                        location.href = redirectUrl;
                    }
                    else {
                        hashHistory.push('/');
                    }
                }
            });
        }
    }
    render() {
        const redirectUrl = utils.getQueryStringValue(this.props.location.search, 'redirectUrl') || this.props.config.homeUrl;
        const weiboUrl = this.props.config.weiboUrl ? this.props.config.weiboUrl + '?redirectUrl=' + encodeURIComponent(redirectUrl) : '';
        const weixinUrl = this.props.config.weixinUrl ? this.props.config.weixinUrl + '?redirectUrl=' + encodeURIComponent(redirectUrl) : '';
        const qqUrl = this.props.config.qqUrl ? this.props.config.qqUrl + '?redirectUrl=' + encodeURIComponent(redirectUrl) : '';
        return (<div>
        <div id="doc">
          <div className="login-page">
            <div id="loginHeader"><img src="assets/img/logo.png" title="login_logo" /><p style={{fontSize: "2.5rem",lineHeight: "6rem"}}>人工智能云平台 全自动别墅建模</p></div>
            <div className="login-content">
              <div className="center_content">
                <div className="content-layout">
                  <div id="loginWrap">
                    <div className="mod-qiuser-pop quc-qiuser-panel">
                      <div className="login-wrapper quc-wrapper quc-page">
                        <div className="quc-mod-sign-in quc-mod-normal-sign-in">
                          <div className="quc-tip-wrapper"><p className="quc-tip quc-tip-error">{this.state.controls.error}</p></div>
                          <div className="quc-main">
                            <form className="quc-form">
                              <p className={cx({ "quc-field quc-field-account quc-input-long": true, "input-focus": this.state.controls.account })}>
                                <span className="quc-fixIe6margin"><label className="quc-label"></label></span>
                                <span className="quc-input-bg">
                                  <input autoFocus onFocus={() => {
            this.state.controls.account = true;
            this.setState(this.state);
        }} onBlur={() => {
            this.state.controls.account = false;
            this.setState(this.state);
        }} onChange={(e) => {
            this.state.account = e.target.value;
            this.setState(this.state);
        }} onKeyUp={(e) => {
            e.keyCode === 13 && this.submit();
        }} value={this.state.account} className="quc-input quc-input-account" type="text" name="account" placeholder="请输入手机号/邮箱/用户名" autoComplete="off" style={{width: "100%"}}/>
                                </span>
                              </p>
                              <p className={cx({ "quc-field quc-field-password quc-input-long": true, "input-focus": this.state.controls.password })}>
                                <span className="quc-fixIe6margin"><label className="quc-label"></label></span>
                                <span className="quc-input-bg">
                                  <input onFocus={() => {
            this.state.controls.password = true;
            this.setState(this.state);
        }} onBlur={() => {
            this.state.controls.password = false;
            this.setState(this.state);
        }} onChange={(e) => {
            this.state.password = e.target.value;
            this.setState(this.state);
        }} onKeyUp={(e) => {
            e.keyCode === 13 && this.submit();
        }} value={this.state.password} className="quc-input quc-input-password" type="password" name="password" placeholder="输入个密码把" autoComplete="off"  style={{width: "100%"}}/>
                                </span>
                              </p>
                              <p className={cx({ "quc-field quc-field-submit": true, "disabled": this.state.controls.submitting })}>
                                <a href="javascript:;" className="quc-submit quc-button quc-button-sign-in" onClick={(e) => {
            this.submit();
        }}>{this.state.controls.submitting ? '登录中...' : '登录'}</a>
                              </p>
                              <p className="quc-field quc-field-third-part" style={{ display: (weiboUrl || weixinUrl || qqUrl) ? '' : 'none' }}>
                                <span>第三方帐号登录：</span>
                                <span className="quc-third-part">
                                  <a href={weiboUrl} style={{ display: weiboUrl ? '' : 'none' }} className="quc-third-part-icon quc-third-part-icon-sina" title="新浪微博登录"/>
                                  <a href={weixinUrl} style={{ display: weixinUrl ? '' : 'none' }} className="quc-third-part-icon quc-third-part-icon-weixin" title="微信登录"/>
                                  <a href={qqUrl} style={{ display: qqUrl ? '' : 'none' }} className="quc-third-part-icon quc-third-part-icon-tencent" title="QQ登录"/>
                                </span>
                              </p>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);