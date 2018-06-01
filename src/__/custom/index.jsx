import * as React from 'react';
import { Slider } from '../components';
import { connect } from 'react-redux';
import * as utils from '../../lib/utils';

class IndexPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            ID: '',
            Titie: '',
            Logo_Img: '',
            Href_Url: '',
            UserName: props.config.user.userName,
        };
        this.logoChange = this.logoChange.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }
    changeHandler (ev) {
        const {name, value} = ev.target;
        this.setState({[name]: value});
    }
    logoChange (ev) {
        const fr = new FileReader(),
            file = ev.target.files[0],
            {size} = file;
        size > 3 * 2 ** 20  // 图片大小限制为3MB
            ? utils.Swal.error(new Error("请选择3MB以下的图片。"))
            : (fr.addEventListener('loadend',  (ev) => {
                const Logo_Img = ev.target.result;
                this.logoImg.src = Logo_Img;
                this.setState({Logo_Img});
            }, false), fr.readAsDataURL(file));
    }
    clickHandler (ev) {
        ev.preventDefault();
        const {ID, UserName, Title, Href_Url, Logo_Img, isAdd} = this.state, _this = this,
            oldData = {UserName, Title, Logo_Img, Href_Url},
            data = isAdd ? oldData : utils.assign(oldData, {ID}),
            url = `../ajax/Site_ManageAjax.ashx?cmd=${isAdd ? "Add" : "Mod"}`;
        $.ajax({
            url,
            type: "POST",
            data,
            success (data) {
                const {msg, code} = JSON.parse(data);
                code === "0"
                    ? (utils.Swal.success(msg), _this.setState({isAdd: false, UserName, Title, Logo_Img, Href_Url}))
                    : utils.Swal.error(new Error(msg));
            }
        });
    }
    componentWillMount () {
        const {UserName} = this.state, _this = this;
        $.ajax({
            url: "../ajax/Site_ManageAjax.ashx?cmd=Get",
            type: "POST",
            data: {UserName},
            success (data) {
                const {Id, Title, Logo_Img, Href_Url} = JSON.parse(data).data,
                    isAdd = !Logo_Img && !Title && !Href_Url ? true : false;
                _this.setState({
                    ID: Id,
                    isAdd: isAdd,
                    Title: Title ? Title : "",
                    Href_Url: Href_Url ? Href_Url : "",
                    Logo_Img: Logo_Img ? Logo_Img : "",
                });
            }
        });
    }
    render() {
        const {Logo_Img, Title, Href_Url} = this.state,
            show = Logo_Img ? "1" : '0';
        return (
            <div id="content-page">
                <div className="tpl-portlet-components">
                    <div className="portlet-title">
                        <div className="caption font-green bold">自定义设置</div>
                    </div>
                    <div className="tpl-block ">
                        <div className="am-g tpl-amazeui-form">
                            <div className="am-u-sm-12 am-u-md-9">
                                <form className="am-form am-form-horizontal">
                                    <div className="am-form-group" style={{marginBottom: "14px", height: "65px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label" style={{paddingTop: "1.5em"}}>Logo</label>
                                        <div className="am-u-sm-9" style={{height: "65px"}}>
                                            <label htmlFor="logo" className="am-btn am-btn-primary">点击更换</label>  
                                            <input id='logo' type="file" size="5 * 1024 * 1024" accept=".jpg, .jpeg, .png" name="Logo" style={{display: 'none'}} onChange={this.logoChange} /> 
                                            <img ref={ele => this.logoImg = ele} src={Logo_Img} alt="logo" height="65px" style={{opacity: show,maxWidth: 'calc(100% - 150px)',margin: '0 20px'}} />
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">标题</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Title" placeholder="请输入平台标题名称" value={Title} onChange={this.changeHandler} /> 
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <label htmlFor="#" className="am-u-sm-3 am-form-label">域名</label>
                                        <div className="am-u-sm-9">
                                            <input type="text" name="Href_Url" placeholder="请输入平台域名" value={Href_Url} onChange={this.changeHandler} /> 
                                        </div>
                                    </div>
                                    <div className="am-form-group" style={{marginBottom: "14px"}}>
                                        <div className="am-u-sm-9 am-u-sm-push-3">
                                            <button type="button" className="am-btn am-btn-primary" onClick={this.clickHandler}>保存</button>
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
export default connect(mapStateToProps, null)(IndexPage);