import * as React from 'react';
import cx from 'classnames';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { update } from '../../../lib/actions/config';
import * as utils from '../../../lib/utils';
import client from '../../../lib/client';
import { Slider } from '../../components';

class DroneInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            Title: "",
            Machine_Code: "",
            Register_Date: "", 
            loading: false,
            ID: props.location.query.id,
            UserName: props.config.user.userName,
        };
        this.updateInfo = this.updateInfo.bind(this);
        this.infoChange = this.infoChange.bind(this);
    }
    updateInfo () {
        let errors = {},
            _this = this,
            {ID, Title, Machine_Code, Register_Date, UserName} = _this.state;
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
            url: "../ajax/Serial_NumberAjax.ashx?cmd=Mod",
            type: "POST",
            data: {ID, Title, Machine_Code, Register_Date, UserName},
            success (data) {
                data = JSON.parse(data);
                data.code === "0" 
                    ? hashHistory.push("/dronemanage/dronelist")
                    : utils.Swal.error(new Error(data.msg));
            }
        });
    }
    infoChange (ev) {
        this.setState({[ev.target.name]: ev.target.value});
    }
    loading(loading) {
        this.setState({loading});
    }
    componentWillMount () {
        const _this = this, {ID, UserName} = _this.state;
        $.ajax({
            url: "../ajax/Serial_NumberAjax.ashx?cmd=Current",
            type: "POST",
            data: {ID, UserName},
            success (data) {
                data = JSON.parse(data);
                let {msg, code} = data, Title = "", Machine_Code = "", Register_Date = "";
                code === "0"
                    ? ({Title, Machine_Code, Register_Date} = data.data, _this.setState({Title, Machine_Code, Register_Date}))
                    : utils.Swal.error(new Error(msg));
            }
        });
    }
    render() {
        const {Title, Machine_Code, Register_Date} = this.state;
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
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">名称</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Title" value={Title} placeholder="请输入无人机名称" onChange={this.infoChange} /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">序列号</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Machine_Code" value={Machine_Code} placeholder="请输入无人机序列号" onChange={this.infoChange} /> 
                                            <small>&nbsp;</small>
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">出厂日期</label>
                                        <div className="am-u-sm-9">
                                            <input type="date" name="Register_Date" value={Register_Date} placeholder="请输入无人机出厂日期" onChange={this.infoChange} style={{width: '180px'}} /> 
                                            <small>&nbsp;</small>
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
export default connect(mapStateToProps, mapDispatchToProps)(DroneInfoPage);