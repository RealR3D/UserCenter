import * as React from 'react';
import { Slider } from '../components';
import { connect } from 'react-redux';

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div id="content-page">
            <div className="tpl-portlet-components">
                <div className="portlet-title">
                    <div className="caption font-green bold">技术支持</div>
                </div>
                <div className="tpl-block ">
                    <p style={{lineHeight: "60px"}}>QQ: 181617116</p>
                    <p style={{lineHeight: "60px"}}>技术支持联系电话: 15706805691</p>
                    <p style={{lineHeight: "60px"}}>数据支持联系电话: 18867807636</p>
                    <p style={{lineHeight: "60px"}}>邮箱: support@vrplanner.cn</p>
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
export default connect(mapStateToProps, null)(IndexPage);