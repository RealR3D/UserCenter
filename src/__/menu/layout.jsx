import * as React from 'react';
export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div>
        <div id="doc3">
          <div id="bd">
            {this.props.children}
          </div>
        </div>
      </div>);
    }
}