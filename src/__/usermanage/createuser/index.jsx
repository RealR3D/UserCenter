import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Slider } from '../../components';
import client from '../../../lib/client';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';

class CreateUserPage extends React.Component {
    constructor(props) {
        super(props);
        const UserName = this.props.config.user.userName;
        this.state = {
            UserName,
            email: "",
            mobile: "",
            userName: "",
            DisplayName: "",
            password: "",
            passwordError: ""
        };
        this.createUser = this.createUser.bind(this);
        this.stateChange = this.stateChange.bind(this);
    }
    createUser (ev) {
        ev.preventDefault();
        const _this = this;
        let errors = {}, passwordError = "",
            {email, mobile, userName, DisplayName, password, UserName} = _this.state;
        if (!userName) {
            errors['userName'] = true;
        };
        if (!DisplayName) {
            errors['DisplayName'] = true;
        };
        if (!email || !utils.isEmail(email)) {
            errors['email'] = true;
        };
        if (!mobile || !utils.isMobile(mobile)) {
            errors['mobile'] = true;
        };
        if (!password) {
            errors['password'] = true;
            passwordError = '请输入登录密码';
        } else if (password.length < 6) {
            errors['password'] = true;
            passwordError = '登录密码长度必须大于6位';
        };
        _this.setState({errors, passwordError});
        if (utils.keys(errors).length > 0) {
            if (errors['userName']) {
                utils.Swal.error(new Error("请输入用户名"));
            } else if (errors['DisplayName']) {
                utils.Swal.error(new Error("请输入真实姓名"));
            } else if (errors['password']) {
                utils.Swal.error(new Error(passwordError));
            } else if (errors['email']) {
                utils.Swal.error(new Error("邮箱未输入 / 格式不正确"));
            } else if (errors['mobile']) {
                utils.Swal.error(new Error("手机号未输入 / 格式不正确"));
            };
            return;
        };
        _this.loading(true);
        $.ajax({
            url: "http://192.168.1.148:66/ajax/UserCheck.ashx?cmd=Reg",
            type: "POST",
            data: {
                DisplayName,
                Email: email,
                Mobile: mobile,
                Password: password,
                UserName: userName,
                Superior: UserName
            },
            success (data) {
                data = JSON.parse(data);
                _this.setState({email, mobile, password, userName});
                if (data.code === "0") {
                    setTimeout(() => hashHistory.push("/usermanage/userlist"), 100);
                } else if (data.code === "1") {
                    utils.Swal.error(new Error(data.msg));
                };
            }
        });
    }
    stateChange (ev) {
        this.setState({[ev.target.name]: ev.target.value});
    }
    loading (loading) {
        this.setState({loading});
    }
    render(){
        const {email, mobile, password, userName, DisplayName} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title"><div className="caption font-green bold">创建用户</div></div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="user-name" className="am-u-sm-3 am-form-label">用户名</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" id="user-name" name="userName" placeholder="用户名" value={userName} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="user-name" className="am-u-sm-3 am-form-label">真实姓名</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" id="display-name" name="DisplayName" placeholder="真实姓名" value={DisplayName} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="user-password" className="am-u-sm-3 am-form-label">密码</label>
                                        <div className="am-u-sm-9">
                                            <input type="password" id="user-password" name="password" placeholder="输入登录密码" value={password} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="user-email" className="am-u-sm-3 am-form-label">电子邮件</label>
                                        <div className="am-u-sm-9">
                                            <input type="email" id="user-email" name="email" placeholder="输入你的电子邮件" value={email} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="user-phone" className="am-u-sm-3 am-form-label">手机号</label>
                                        <div className="am-u-sm-9">
                                            <input type="tel" id="user-phone" name="mobile" placeholder="输入你的手机号" value={mobile} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button className="am-btn am-btn-primary" onClick={this.createUser}>创建</button>
                                        </div>
                                    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateUserPage);