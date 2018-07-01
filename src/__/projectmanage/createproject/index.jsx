import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import * as models from '../../../lib/models';
import { Slider } from '../../components';

class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", area: ""};
        this.areaChange = this.areaChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.createProject = this.createProject.bind(this);
    }
    nameChange (ev) {
        let {area} = this.state, name = ev.target.value, create_btn = this.create_btn;
        (name !== "" && area !== "")
            ? create_btn.classList.remove("am-disabled")
            : create_btn.classList.add("am-disabled");
        this.setState({name});
    }
    areaChange (ev) {
        let {name} = this.state, area = ev.target.value, create_btn = this.create_btn;
        (name !== "" && area !== "")
            ? create_btn.classList.remove("am-disabled")
            : create_btn.classList.add("am-disabled");
        this.setState({area});
    }
    createProject (ev) {
        ev.preventDefault();
        const {area, name} = this.state,
            UserName = this.props.config.user.userName;
        $.ajax({
            url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=Create",
            type: "POST",
            data: {area, pro_name: name, UserName},
            success (data) {
                data = JSON.parse(data);
                data.code === "0"
                    ? hashHistory.push(`/projectmanage/uploadfile?name=${name}&ID=${data.data}`)
                    : alert("项目创建失败。");
            }
        });
    }
    render(){
        return(
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">创建项目</div>
                    </div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group">
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">项目名称</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" value={this.state.name} placeholder="必填*" onChange={this.nameChange} />
                                            <small></small>
                                        </div>
                                    </div>
                                    <div className="am-form-group">
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">项目所在地</label>
                                        <div className="am-u-sm-9">
                                            <input type="tel" value={this.state.area} onChange={this.areaChange} />
                                        </div>
                                    </div>
                                    <div className="am-form-group">
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button className="am-btn am-disabled am-btn-primary" ref={(ele) => this.create_btn = ele} onClick={this.createProject}>创建项目</button>
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
export default connect(mapStateToProps, null)(UploadPage);