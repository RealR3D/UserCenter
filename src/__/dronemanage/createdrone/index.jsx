import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Slider } from '../../components';
import client from '../../../lib/client';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';

class CreateDronePage extends React.Component {
    constructor(props) {
        super(props);
        const UserName = this.props.config.user.userName;
        this.state = {UserName, Title: "", Machine_Code: "", Register_Date: ""};
        this.createDrone = this.createDrone.bind(this);
        this.stateChange = this.stateChange.bind(this);
    }
    createDrone (ev) {
        ev.preventDefault();
        const _this = this;
        let errors = {}, {Title, Machine_Code, Register_Date, UserName} = _this.state;
        if (!Title) {
            errors['Title'] = true;
        };
        if (!Machine_Code) {
            errors['Machine_Code'] = true;
        };
        if (!Register_Date) {
            errors['Register_Date'] = true;
        };
        _this.setState({errors});
        if (utils.keys(errors).length > 0) {
            if (errors['Title']) {
                utils.Swal.error(new Error("请输入无人机名称"));
            } else if (errors['Machine_Code']) {
                utils.Swal.error(new Error("请输入无人机序列号"));
            } else if (errors['Register_Date']) {
                utils.Swal.error(new Error("请输入无人机出厂日期"));
            };
            return;
        };
        _this.loading(true);
        $.ajax({
            url: "http://192.168.1.148:66/ajax/Serial_NumberAjax.ashx?cmd=Add",
            type: "POST",
            data: {Title, UserName, Machine_Code, Register_Date},
            success (data) {
                data = JSON.parse(data);
                data.code === "0"
                    ? setTimeout(() => hashHistory.push("/dronemanage/dronelist"), 100)
                    : utils.Swal.error(new Error(data.msg));
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
        const {Title, Machine_Code, Register_Date} = this.state;
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title"><div className="caption font-green bold">添加无人机</div></div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">名称</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Title" placeholder="请输入无人机名称" value={Title} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">序列号</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Machine_Code" placeholder="请输入无人机序列号" value={Machine_Code} onChange={this.stateChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">出厂日期</label>
                                        <div className="am-u-sm-9">
                                            <input type="date" name="Register_Date" placeholder="请输入无人机出厂日期" value={Register_Date} onChange={this.stateChange} style={{width: '160px'}} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "30px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button className="am-btn am-btn-primary" onClick={this.createDrone}>创建</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateDronePage);