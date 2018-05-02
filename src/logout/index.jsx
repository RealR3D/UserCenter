import * as React from 'react';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Footer } from '../components';
import { loggedOut } from '../lib/actions/config';
import * as utils from '../lib/utils';
import client from '../lib/client';
import '../reg.css';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        client.users.logout(() => {
            this.props.loggedOut();
            const redirectUrl = utils.getQueryStringValue(this.props.location.search, 'redirectUrl');
            if (redirectUrl) {
                location.href = redirectUrl;
            }
            else {
                hashHistory.push('/');
            }
        });
    }
    render() {
        return (<div id="doc">
        <div className="reg-page">
          <div id="regHeader">
            <div className="header-content">
              <a href="#">
                <span className="logo" style={{ backgroundImage: 'url(' + this.props.config.logoUrl + ')' }}></span>
              </a>
              <span className="page-title">退出登录，请稍后...</span>
            </div>
          </div>

        </div>
        <Footer config={this.props.config}/>
      </div>);
    }
}
function mapStateToProps(state) {
    return {
        config: state.config
    };
}
function mapDispatchToProps(dispatch) {
    return {
        loggedOut: bindActionCreators(loggedOut, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);