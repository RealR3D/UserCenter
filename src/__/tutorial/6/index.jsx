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
        // this.areaChange = this.areaChange.bind(this);
    }

    render(){
        return(
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">飞行器介绍</div>
                    </div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <video src="https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/6.mp4"  controls="controls" style={{width: "100%"}}>dasdasdasd</video>
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