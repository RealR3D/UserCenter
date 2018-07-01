import * as React from 'react';
import './ImgCropping.css';
import './cropper.min.css';

class ThumbnailPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = { thumbnali: '' };
        this.closeTailor = this.closeTailor.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }
    componentDidMount () {
        const { thumbnali } = this.props;
        if (!thumbnali) {
            this.chooseImg.click();
        };
        $('#tailoringImg').cropper({
            aspectRatio: 1/1,
            preview: '.previewImg',
            guides: false,
            autoCropArea: 0.5,
            movable: false,
            dragCrop: true,
            movable: true,
            resizable: true,
            zoomable: false,
            mouseWheelZoom: false,
            touchDragZoom: true,
            rotatable: true,
            crop: function(e) {}
        });
    }
    closeTailor () {
        $(".tailoring-container").toggle();
    }
    changeImage (ev) {
        const { files } = ev.target;
        if (!files || !files[0]){
            return;
        }
        var reader = new FileReader();
        reader.onload = function (evt) {
            var replaceSrc = evt.target.result;
            $('#tailoringImg').cropper('replace', replaceSrc, false);
        }
        reader.readAsDataURL(files[0]);
    }
    clickHandler () {
        if ($("#tailoringImg").attr("src") === null ) {
            return false;
        } else {
            var cas = $('#tailoringImg').cropper('getCroppedCanvas');
            var base64url = cas.toDataURL('image/png');
            // $("#finalImg").prop("src", base64url);
            this.closeTailor();
            // this.setState({ thumbnali: base64url });
            this.props.postImgUrl(base64url);
        };
    }
    render () {
        return (
            <div className="tailoring-container">
                <div className="black-cloth" onClick={this.closeTailor}></div>
                <div className="tailoring-content">
                    <div className="tailoring-content-one">
                        <div className="tailoring-box-parcel">
                            <img id="tailoringImg" />
                        </div>
                    </div>
                    <div className="tailoring-content-two">
                        <label title="上传图片" htmlFor="chooseImg" className="l-btn choose-btn">
                            <input ref={ ele => this.chooseImg = ele } type="file" accept="image/jpg,image/jpeg,image/png" name="file" id="chooseImg" className="hidden" onChange={this.changeImage} />
                            选择图片
                        </label>
                        <button className="l-btn choose-btn confrim-upload" id="sureCut" onClick={this.clickHandler}>确认上传</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ThumbnailPage;