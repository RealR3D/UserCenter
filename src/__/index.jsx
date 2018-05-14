import * as React from 'react';
import cx from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as models from '../lib/models';
import * as utils from '../lib/utils';
import client from '../lib/client';
import { Slider } from './components';
import '../index.css';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {logs: null};
    }
    componentDidMount() {
        client.users.getLogs(10, '用户登录', (err, res) => {
            this.state.logs = res;
            this.setState(this.state);
        });
    }    
    render() {
        const user = this.props.config.user || new models.User();
        let logsEl = [];
        if (this.state.logs) {
            logsEl = this.state.logs.map((log) => {
                return (<tr key={log.id}>
            <td>{utils.toDateString(log.addDate)}</td>
            <td>{utils.toTimeString(log.addDate)}</td>
            <td>{log.ipAddress}</td>
          </tr>);
            });
        }
        let writingEl = null;
        if (this.props.config.group.isWriting) {
            writingEl = (<li>
          <h3><i className="ico ico-guard"/> 内容投稿</h3>
          <p><span className="fr"><Link to="/writing/new" className="lnk">投稿</Link></span> 发布稿件到对应的站点及栏目</p>
        </li>);
        }
        return (
          <div id="doc3">
            <div>
              <div>
                <Slider userName={user.userName} userlevel={user.userlevel}/>
                <div className="tpl-content-wrapper tpl-content-wrapper-hover" id="content-page">
                    <div className="row">
                        <div className="am-u-md-6 am-u-sm-12 row-mb">
                            <div className="tpl-portlet">
                                <div className="tpl-portlet-title">
                                    <div className="tpl-caption font-green ">
                                        <i className="am-icon-cloud-upload"></i>
                                        <span>创建项目</span>
                                    </div>
                                </div>
                                <div className="tpl-echarts" id="tpl-echarts-A" style={{background: "url(assets/img/fly1.jpg)",backgroundPosition: "center center"}}>
                                    <Link to="/projectmanage/createProject" className="am-btn am-btn-default tpl-echarts-btn" style={{background: "rgba(255, 255, 255, 0.5)"}} id="upload-btn">
                                        <h1 className="h1-fonts">创建项目</h1>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="am-u-md-6 am-u-sm-12 row-mb">
                            <div className="tpl-portlet">
                                <div className="tpl-portlet-title">
                                    <div className="tpl-caption font-red ">
                                        <i className="iconfont icon-wodexiangmu"></i>
                                        <span>我的项目</span>
                                    </div>
                                </div>
                                <div className="tpl-echarts" id="tpl-echarts-A" style={{background: "url('assets/img/32.jpg')"}}>
                                    <Link to="/projectmanage/projectlist" className="am-btn am-btn-default tpl-echarts-btn" style={{background: "rgba(255, 255, 255, 0.5)"}} id="project-btn">
                                        <h1 className="h1-fonts">我的项目</h1>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
      );
    }
}
function mapStateToProps(state) {
    return {
        config: state.config
    };
}
export default connect(mapStateToProps, null)(IndexPage);