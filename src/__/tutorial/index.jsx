import * as React from 'react';
import { Slider } from '../components';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {videoList: [
            {to:'/tutorial/1',title:'飞行器介绍'},
            {to:'/tutorial/2',title:'遥控器介绍'},
            {to:'/tutorial/3',title:'遥控器天线介绍'},
            {to:'/tutorial/4',title:'如何飞行'},
            {to:'/tutorial/5',title:'首次飞行'},
            {to:'/tutorial/6',title:'智能返航介绍'},
            {to:'/tutorial/7',title:'兴趣点环绕'},
        ]};
    }
    render() {
        var list = () => {
            var res = [];
            for(var i = 0; i < 7; i++) {
                res.push(<div key={i}>
                    <div className="am-u-sm-12 am-u-md-6 am-u-lg-4">
                        <div className="tpl-table-images-content">
                            <div className="tpl-i-title" style={{fontSize: 18}}>
                               {this.state.videoList[i].title}
                            </div>

                                <Link to={`/tutorial/${i+1}`} className="nav-link tpl-table-images-content-i">

                                    <span className="tpl-table-images-content-i-shadow">
                                    </span>
                                    <img src={`assets/img/video-cover/cover${i+1}.png`} alt=""/>
                                </Link>

                            {/* <div className="tpl-table-images-content-block">
                                <div className="tpl-i-font">
                                    你最喜欢的艺术作品，告诉大家它们的------名图画，色彩，交织，撞色，线条雕塑装置当代古代现代作品的照片。
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>)
            }
            return res
        }
        return (
        <div id="content-page">
            <div className="tpl-portlet-components">
                <div className="portlet-title">
                    <div className="caption font-green bold">在线教程</div>
                </div>
                <div className="tpl-block">

                    <div className="am-g">
                        <div className="tpl-table-images">

                            {/* <div className="am-u-sm-12 am-u-md-6 am-u-lg-4">
                                <div className="tpl-table-images-content">
                                    <div className="tpl-table-images-content-i-time">发布时间：2016-09-12</div>
                                    <div className="tpl-i-title">
                                        “你的旅行，是什么颜色？” 晒照片，换北欧梦幻极光之旅！
                                    </div>
                                    <Link className="tpl-table-images-content-i">
                                        <div className="tpl-table-images-content-i-info">
                                            <span className="ico">
                                 </span>
                                    </div>
                                        <Link to="/tutorial/1" className="nav-link">

                                            <span className="tpl-table-images-content-i-shadow">
                                            </span>
                                            <img src="assets/img/32.jpg" alt=""/>
                                        </Link>
                                    </Link>

                                    <div className="tpl-table-images-content-block">
                                        <div className="tpl-i-font">
                                            你最喜欢的艺术作品，告诉大家它们的------名图画，色彩，交织，撞色，线条雕塑装置当代古代现代作品的照片。
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {list()}


                        </div>

                    </div>
                </div>
            </div>
        </div>);
    }
}
class VideoList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {videoList: [
            {to:'/tutorial/1',title:'飞行器介绍',
            to:'/tutorial/2',title:'遥控器介绍'}
        ]};
    }
    componentDidMount () {

    }
    render () {
        const {videoList} = this.state;
        return (
            <div className="am-u-sm-12 am-u-md-6 am-u-lg-4">
                <div className="tpl-table-images-content">
                    {/* <div className="tpl-table-images-content-i-time">发布时间：2016-09-12</div> */}
                    <div className="tpl-i-title">
                        “你的旅行，是什么颜色？” 晒照片，换北欧梦幻极光之旅！
                    </div>
                    <Link className="tpl-table-images-content-i">
                        <div className="tpl-table-images-content-i-info">
                            <span className="ico">
                    </span>
                    </div>
                        <Link to="/tutorial/1" className="nav-link">

                            <span className="tpl-table-images-content-i-shadow">
                            </span>
                            <img src="assets/img/32.jpg" alt=""/>
                        </Link>
                    </Link>

                    <div className="tpl-table-images-content-block">
                        <div className="tpl-i-font">
                            你最喜欢的艺术作品，告诉大家它们的------名图画，色彩，交织，撞色，线条雕塑装置当代古代现代作品的照片。
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