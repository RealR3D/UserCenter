import * as React from 'react';
import { Slider } from '../components';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {videoList: [
            {to:'/tutorial/1',title:'飞行器介绍',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/1.mp4'},
            {to:'/tutorial/2',title:'遥控器介绍',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/2.mp4'},
            {to:'/tutorial/3',title:'遥控器天线介绍',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/3.mp4'},
            {to:'/tutorial/4',title:'如何飞行',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/4.mp4'},
            {to:'/tutorial/5',title:'首次飞行',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/5.mp4'},
            {to:'/tutorial/6',title:'智能返航介绍',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/6.mp4'},
            {to:'/tutorial/7',title:'兴趣点环绕',videoSrc:'https://3dvideodata.oss-cn-beijing.aliyuncs.com/video/7.mp4'},
        ]};
        this.state.curVideo = null
        // this.handleChange = this.handleChange.bind(this);

    }
    handleClick(index){
        // console.log(p,"hhhhh")
        return e => {
            this.state.curVideo = this.state.videoList[index].videoSrc
            this.setState({"curVideo": this.state.curVideo});
            setTimeout(()=>{
                document.getElementById("tutorial-video").play()
            })
            // console.log("点击了",this.state.curVideo,e)
        }

    }
    // handleChange (ev) {
    //     console.log("状态改变",ev,ev.target.value)
    //     this.setState({"curVideo":this.state.curVideo});
    // }
    hideLayer(){
        return e => {

            this.state.curVideo = null
            this.setState({"curVideo": this.state.curVideo});
            setTimeout(()=>{
                document.getElementById("tutorial-video").pause()
            })
            // console.log("隐藏",this.state.curVideo,e)
        }
    }
    render() {
        let value = this.state.curVideo
        // console.log("渲染",value)
        let styleLayer = "display:block;";
        var videoList = () => {
            var res = [];
            for(var i = 0; i < 7; i++) {
                res.push(<div>
                    <div className="am-u-sm-12 am-u-md-6 am-u-lg-4">
                        <div className="tpl-table-images-content">
                            <div className="tpl-i-title" style={{fontSize: 18}}>
                            {this.state.videoList[i].title}
                            </div>
                                <div className="nav-link tpl-table-images-content-i" onClick={this.handleClick()}>

                                    <span className="tpl-table-images-content-i-shadow">
                                    </span>
                                    <img src={`assets/img/video-cover/cover${i+1}.png`} alt=""/>
                                </div>

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
        <div className="tpl-content-wrapper tpl-content-wrapper-hover" id="content-page">
            <div className="tpl-portlet-components">
                <div className="portlet-title">
                    <div className="caption font-green bold">在线教程</div>
                </div>
                <div className="tpl-block">

                    <div className="am-g">
                        <div className="tpl-table-images">

                            {videoList()}
                           
                        </div>

                    </div>
                </div>
            </div>
            <div className="player-layer"  style={{display: value? "block":"none"}} onClick={this.hideLayer()}>

                <div className="am-g">
                    <div className="am-u-sm-12 am-u-md-9">
                        <video id="tutorial-video" src={this.state.curVideo}  controls="controls" style={{width: "100%"}}>当前浏览器不支持video标签</video>
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