import * as React from 'react';
import { Slider } from '../components';
import { connect } from 'react-redux';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
      const {userlevel, userName} = this.props.config.user;
      return (
        <div id="doc3">
          <div>
            <div>
              <div id="grid">
                <Slider userName={userName} userlevel={userlevel} />
                {this.props.children}
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