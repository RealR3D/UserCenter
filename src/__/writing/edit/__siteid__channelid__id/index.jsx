import * as React from 'react';
import { connect } from 'react-redux';
import { Loading } from '../../../../components';
import { Attributes } from '../../components';
import client from '../../../../lib/client';
import * as utils from '../../../../lib/utils';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null
        };
    }
    componentDidMount() {
        client.writing.getContent(utils.parseInt(this.props.params.siteId), utils.parseInt(this.props.params.channelId), utils.parseInt(this.props.params.id), (err, res) => {
            this.state.content = res.content;
            this.setState(this.state);
        });
    }
    render() {
        if (!this.state.content)
            return <Loading />;
        return (<div className="article">
        <div className="mod-3">
          <div className="art-mod">
            <div className="art-hd clearfix"><h2>编辑稿件</h2></div>
            <Attributes siteId={utils.parseInt(this.props.params.siteId)} channelId={utils.parseInt(this.props.params.channelId)} id={utils.parseInt(this.props.params.id)} content={this.state.content}/>
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