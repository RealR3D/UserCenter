import * as React from 'react';
import cx from 'classnames';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';
import client from '../../../lib/client';
import { Slider } from '../../components';

class PasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            password: '',
            newPassword: '',
            confirmPassword: '',
            errors: {}
        };
        this.updatePassword = this.updatePassword.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }
    updatePassword () {
        let errors = {},
            _this = this,
            {password, newPassword, confirmPassword} = _this.state;
        if (!password) {
            errors['password'] = true;
        };
        if (!newPassword) {
            errors['newPassword'] = true;
        } else if (!confirmPassword || newPassword !== confirmPassword) {
            errors['confirmPassword'] = true;
        };
        _this.setState({errors});
        if (utils.keys(errors).length > 0) {
            if (errors['password']) {
                utils.Swal.error(new Error("请输入原密码"));
            } else if (errors['newPassword']) {
                utils.Swal.error(new Error("请输入新密码"));
            } else if (errors['confirmPassword']) {
                utils.Swal.error(new Error("请再次输入密码 / 两次密码输入不一致"));
            };
            return;
        };
        _this.loading(true);
        client.users.resetPassword(password, newPassword, confirmPassword, (err, res) => {
            _this.loading(false);
            if (!err) {
                _this.props.config.user.lastResetPasswordDate = res.lastResetPasswordDate;
                _this.props.update(_this.props.config.user, _this.props.config.group);
                utils.Swal.success('密码修改成功', () => hashHistory.push('/'));
            } else {
                utils.Swal.error(err);
            };
        });
    }
    passwordChange (ev) {
        this.setState({[ev.target.name]: ev.target.value});
    }
    loading(loading) {
        this.state.loading = loading;
        this.setState(this.state);
    }
    render() {
        const {password, newPassword, confirmPassword} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">密码修改</div>
                    </div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="user-name" className="am-u-sm-3 am-form-label">原密码</label>
                                        <div className="am-u-sm-9">
                                            <input type="password" id="old-password" name="password" value={password} placeholder="输入原密码" onChange={this.passwordChange} /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="user-email" className="am-u-sm-3 am-form-label">新密码</label>
                                        <div className="am-u-sm-9">
                                            <input type="password" id="new-password" name="newPassword" placeholder="输入新密码" value={newPassword} onChange={this.passwordChange} /> 
                                            <small>6-12个数字或字母</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="user-phone" className="am-u-sm-3 am-form-label">确认密码</label>
                                        <div className="am-u-sm-9">
                                            <input type="password" id="confirm-password" name="confirmPassword" placeholder="再次输入新密码" value={confirmPassword} onChange={this.passwordChange} /> 
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button type="button" className="am-btn am-btn-primary" onClick={this.updatePassword}>保存修改</button>
                                        </div>
                                    </div>
                                    <input id="res" name="res" type="reset" style={{display: "none"}} /> 
                                </form>
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
        update: bindActionCreators(update, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PasswordPage);