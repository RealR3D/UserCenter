import * as React from 'react';
import cx from 'classnames';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';
import client from '../../../lib/client';
import { Slider } from '../../components';

class UserInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: "",
            errors: {},
            Mobile: "",
            Password: "",
            DisplayName: "",
            loading: false,
            UserName: props.location.query.name,
            Superior: props.config.user.userName,
        };
        this.updateInfo = this.updateInfo.bind(this);
        this.infoChange = this.infoChange.bind(this);
    }
    updateInfo () {
        let errors = {},
            _this = this,
            {Email, Mobile, DisplayName, UserName, Superior, Password} = _this.state;
        if (!DisplayName) {
            errors['DisplayName'] = true;
        };
        if (!utils.isEmail(Email)) {
            errors['Email'] = true;
        };
        if (!utils.isMobile(Mobile)) {
            errors['Mobile'] = true;
        };
        if (Password.length < 6 || Password.length > 12) {
            errors['Length'] = true;
        };
        if (!/^(?!\d+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,12}$/.test(Password)) {
            errors['Password'] = true;
        };
        _this.setState({errors});
        if (utils.keys(errors).length > 0) {
            if (errors['DisplayName']) {
                utils.Swal.error(new Error("请输入真实姓名"));
            } else if (errors['Email']) {
                utils.Swal.error(new Error("邮箱格式不正确"));
            } else if (errors['Mobile']) {
                utils.Swal.error(new Error("手机号码格式不正确"));
            } else if(errors['Length']) {
                utils.Swal.error(new Error("登录密码长度必须大于6位"));
            } else if (errors['Password']) {
                utils.Swal.error(new Error("密码不符合规则，请包含字母和数字组合"));
            };
            return;
        };
        _this.loading(true);
        $.ajax({
            url: "http://192.168.1.148:66/ajax/UserCheck.ashx?cmd=Change",
            type: "POST",
            data: {Email, Mobile, DisplayName, UserName, Password, Superior},
            success (data) {
                JSON.parse(data).State && hashHistory.push("/usermanage/userlist");
            }
        });
    }
    infoChange (ev) {
        this.setState({[ev.target.name]: ev.target.value});
    }
    loading(loading) {
        this.state.loading = loading;
        this.setState(this.state);
    }
    componentWillMount () {
        const _this = this, {UserName, Superior} = _this.state;
        $.ajax({
            url: "http://192.168.1.148:66/ajax/UserCheck.ashx?cmd=GetUser",
            type: "POST",
            data: {UserName, Superior},
            success (data) {
                data = JSON.parse(data);
                const {Email, Mobile, Password, DisplayName} = data;
                _this.setState({Email, Mobile, Password, DisplayName});
            }
        });
    }
    render() {
        const {Email, Mobile, Password, DisplayName, UserName} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">信息修改</div>
                    </div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">用户名</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="UserName" value={UserName} disabled="disabled" /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">真实姓名</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="DisplayName" value={DisplayName} placeholder="请输入真实姓名" onChange={this.infoChange} /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">手机号码</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Mobile" value={Mobile} placeholder="请输入手机号" onChange={this.infoChange} /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">邮箱</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Email" placeholder="请输入邮箱" value={Email} onChange={this.infoChange} /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">密码</label>
                                        <div className="am-u-sm-9">
                                            <input type="password" name="Password" placeholder="请输入密码" value={Password} onChange={this.infoChange} /> 
                                            <small>6-12个数字或字母</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button type="button" className="am-btn am-btn-primary" onClick={this.updateInfo}>保存修改</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(UserInfoPage);