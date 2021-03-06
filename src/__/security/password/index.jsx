import * as React from 'react';
import cx from 'classnames';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';
import client from '../../../lib/client';
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
    }
    loading(loading) {
        this.state.loading = loading;
        this.setState(this.state);
    }
    render() {
        return (<div className="article">
        <div className="mod-3">
          <div className="art-mod">
            <div className="art-hd clearfix"><h2>修改密码</h2></div>
            <div className="art-bd">
              <p className="f-s14">建议使用字母、数字与标点的组合，可以大幅提升帐号安全</p>
              <div className="form form-1 mod-reslut-t2">
                <ul style={{ marginBottom: 52 }}>
                  <li className="fm-item">
                    <label htmlFor="#" className="k">原密码：</label>
                    <span className="v">
                      <input value={this.state.password} onChange={(e) => {
            this.state.password = e.target.value;
            this.setState(this.state);
        }} type="password" className={cx('text input-xxl', { 'error': this.state.errors['password'] })}/>
                    </span>
                    <span className="text-error" style={{ display: this.state.errors['password'] ? '' : 'none' }}><i className="ico ico-err-2"/><em className="error-message">请输入原密码</em></span>
                  </li>
                  <li className="fm-item">
                    <label htmlFor="#" className="k">新密码：</label>
                    <span className="v">
                      <input value={this.state.newPassword} onChange={(e) => {
            this.state.newPassword = e.target.value;
            this.setState(this.state);
        }} type="password" className={cx('text input-xxl', { 'error': this.state.errors['newPassword'] })}/>
                    </span>
                    <span className="text-error" style={{ display: this.state.errors['newPassword'] ? '' : 'none' }}><i className="ico ico-err-2"/><em className="error-message">请输入新密码</em></span>
                  </li>
                  <li className="fm-item">
                    <label htmlFor="#" className="k">确认新密码：</label>
                    <span className="v">
                      <input value={this.state.confirmPassword} onChange={(e) => {
            this.state.confirmPassword = e.target.value;
            this.setState(this.state);
        }} type="password" className={cx('text input-xxl', { 'error': this.state.errors['confirmPassword'] })}/>
                    </span>
                    <span className="text-error" style={{ display: this.state.errors['confirmPassword'] ? '' : 'none' }}><i className="ico ico-err-2"/><em className="error-message">请确认新密码</em></span>
                  </li>
                </ul>
                <div className="btns">
                  <span className="btn btn-2 modify-basic-info-btn" onClick={() => {
            let errors = {};
            if (!this.state.password) {
                errors['password'] = true;
            }
            if (!this.state.newPassword) {
                errors['newPassword'] = true;
            }
            else {
                if (!this.state.confirmPassword) {
                    errors['confirmPassword'] = true;
                }
                else if (this.state.newPassword !== this.state.confirmPassword) {
                    errors['confirmPassword'] = true;
                }
            }
            this.state.errors = errors;
            this.setState(this.state);
            if (utils.keys(errors).length > 0)
                return;
            this.loading(true);
            client.users.resetPassword(this.state.password, this.state.newPassword, this.state.confirmPassword, (err, res) => {
                this.loading(false);
                if (!err) {
                    this.props.config.user.lastResetPasswordDate = res.lastResetPasswordDate;
                    this.props.update(this.props.config.user, this.props.config.group);
                    utils.Swal.success('密码修改成功', () => {
                        hashHistory.push('/');
                    });
                }
                else {
                    utils.Swal.error(err);
                }
            });
        }}>修改密码</span>
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
        update: bindActionCreators(update, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PasswordPage);