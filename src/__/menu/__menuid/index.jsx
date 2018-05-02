import * as React from 'react';
import { connect } from 'react-redux';
import { Menu } from '../components';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }
    componentDidMount() {
    }
    render() {
        var menuInfo = null;
        if (this.props.config.menus) {
            var parentTaxis = parseInt(this.props.params.menuId.split('-')[0]);
            var menuTaxis = parseInt(this.props.params.menuId.split('-')[1]);
            let i = 0;
            for (let key in this.props.config.menus) {
                i++;
                if (i === parentTaxis) {
                    var menus = this.props.config.menus[key];
                    if (menus && menus.length > 0) {
                        let j = 0;
                        for (let menu of menus) {
                            j++;
                            if (menuTaxis === j) {
                                menuInfo = menu;
                            }
                        }
                    }
                }
            }
        }
        if (!menuInfo)
            return null;
        let iframe = '<iframe src="' + menuInfo.url + '" height="500px" width="100%" frameborder="0" style="width:100%"></iframe>';
        return (<div className="grid-2 clearfix">
        <Menu location={this.props.location} menuId={this.props.params.menuId} menuConfig={this.props.config.menus}/>
        <div className="article">
          <div className="mod-3">
            <div className="art-mod">
              <div className="art-hd clearfix" style={{ marginBottom: '20px' }}><h2>{menuInfo.title}</h2></div>
              <div dangerouslySetInnerHTML={{ __html: iframe }}/>
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