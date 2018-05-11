import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';
import client from '../../../lib/client';
import { Slider } from '../../components';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        const {email, mobile} = utils.assign({}, props.config.user);
        this.state = {
            email,
            mobile,
            loading: false,
            errors: {}
        };
        this.updateInfo = this.updateInfo.bind(this);
        this.valueChange = this.valueChange.bind(this);
    }
    updateInfo (ev) {
        ev.preventDefault();
        let errors = {},
            _this = this,
            {email, mobile} = _this.state;
        if (!email || !utils.isEmail(email)) {
            errors['email'] = true;
        };
        if (!mobile || !utils.isMobile(mobile)) {
            errors['mobile'] = true;
        };
        _this.setState({errors});
        if (utils.keys(errors).length > 0) {
            if (errors['email']) {
                utils.Swal.error(new Error("邮箱未输入 / 格式不正确"));
            } else if (errors['mobile']) {
                utils.Swal.error(new Error("手机号未输入 / 格式不正确"));
            };
            return;
        };
        _this.loading(true);
        client.users.edit({
            email,
            mobile
        }, (err, res) => {
            _this.loading(false);
            if (!err) {
                _this.props.config.user.email = res.email;
                _this.props.config.user.mobile = res.mobile;
                _this.props.update(_this.props.config.user, _this.props.config.group);
                utils.Swal.success('基本资料修改成功', () => hashHistory.push('/'));
            } else {
                utils.Swal.error(err);
            }
        });
    }
    valueChange (ev) {
        this.setState({[ev.target.name]: ev.target.value});
    }
    loading (loading) {
        this.setState({loading});
    }
    render(){
        const {email, mobile} = this.state;
        return(
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title"><div className="caption font-green bold">基本信息</div></div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">电子邮件</label>
                                        <div className="am-u-sm-9">
                                            <input type="email" name="email" placeholder="输入你的电子邮件" value={email} onChange={this.valueChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">手机号</label>
                                        <div className="am-u-sm-9">
                                            <input type="tel" name="mobile" placeholder="输入你的手机号" value={mobile} onChange={this.valueChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button className="am-btn am-btn-primary" onClick={this.updateInfo}>保存修改</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);