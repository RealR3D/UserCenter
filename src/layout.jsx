import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadConfig } from './lib/actions/config';
import client from './lib/client';
import './base.css';
import './app.css';
import './react-select.css';
import './swal.css';
import './react-datetime.css';
class LayoutPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        client.users.loadConfig((err, res) => {
            if (!err) {
                this.props.loadConfig(res);
                if (res.title) {
                    document.title = res.title;
                }
            }
        });
    }
    render() {
        if (!this.props.config.homeUrl) {
            return null;
        };
        return this.props.children;
    }
}
function mapStateToProps(state) {
    return {
        config: state.config
    };
}
function mapDispatchToProps(dispatch) {
    return {
        loadConfig: bindActionCreators(loadConfig, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage);