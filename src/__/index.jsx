import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as models from '../lib/models';
import * as utils from '../lib/utils';
import client from '../lib/client';
import { Slider } from './components';
import '../index.css';

class PreviewDemoListitem extends React.Component {
    render () {
        let { Title, A3x_Url, S_ImageUrl } = this.props.data;
        S_ImageUrl = S_ImageUrl ? S_ImageUrl : "http://3dnextstatic.oss-cn-hangzhou.aliyuncs.com/img/1530263028.png";
        console.log(this.props.data)
        return (
            <li>
                <a target="_blank" href={`http://www.real3d.cn/preview/index.html?url=${A3x_Url}`} style={{ backgroundImage:  `url(${S_ImageUrl})` }}>
                    <p>{ Title }</p>
                </a>
            </li>
        );
    }
}

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {index: 1, logs: null, previewDemoList: []};
    }
    componentWillMount() {
        const { index } = this.state;
        let _this = this, previewDemoList = [];
        $.ajax({
            url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=GetDemo",
            type: "POST",
            data: { index },
            success (d) {
                const { data, Count } = JSON.parse(d);
                if (Count <= 0 ) {
                    utils.Swal.tip('预览数据只有这么多了哦~');
                    return;
                }; 
                data.forEach((d, index) => {
                    previewDemoList.push(<PreviewDemoListitem key={index} data={d} />);
                });
                _this.setState({ previewDemoList });
            }
        });
    }
    refreshDemoHandler (index) {
        index = Math.max(index, 1);
        let _this = this, previewDemoList = [];
        $.ajax({
            url: "http://192.168.1.148:66/ajax/ProjectAjax.ashx?cmd=GetDemo",
            type: "POST",
            data: { index },
            success (d) {
                const { data, Count } = JSON.parse(d);
                if (Count <= 0 ) {
                    utils.Swal.tip('预览数据只有这么多了哦~');
                    return;
                };
                data.forEach((d, index) => {
                    previewDemoList.push(<PreviewDemoListitem key={index} data={d} />);
                });
                _this.setState({ index, previewDemoList });
            }
        });
    }
    componentDidMount() {
        client.users.getLogs(10, '用户登录', (err, res) => {
            this.state.logs = res;
            this.setState(this.state);
        });
    }    
    render() {
        const user = this.props.config.user || new models.User();
        const { index, previewDemoList }  =this.state;
        return (
          <div id="doc3" >
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
                        <div id="previewList">
                            <div className="left_btn btn" onClick={this.refreshDemoHandler.bind(this, index - 1)}>&lt;</div>
                            <ul>{previewDemoList}</ul>
                            <div className="right_btn btn" onClick={this.refreshDemoHandler.bind(this, index + 1)}>&gt;</div>
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