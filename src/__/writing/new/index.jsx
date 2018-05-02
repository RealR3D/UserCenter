import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Loading } from '../../../components';
import { Attributes } from '../components';
import client from '../../../lib/client';
import * as utils from '../../../lib/utils';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            site: null,
            channels: null,
            channel: null
        };
    }
    componentDidMount() {
        let site = null;
        for (let ps of this.props.sites) {
            if (this.props.config.group.lastWritingSiteId === ps.id) {
                site = ps;
            }
        }
        if (!site)
            site = this.props.sites[0];
        this.loadSite(site);
    }
    loadSite(site) {
        if (this.state.site && site.id === this.state.site.id)
            return;
        client.writing.getChannels(site.id, (err, res) => {
            this.state.site = site;
            this.state.channels = res;
            if (res.length > 0) {
                this.state.channel = res[0];
            }
            this.setState(this.state);
        });
    }
    render() {
        if (!this.state.channels)
            return <Loading />;
        let sitesEl = null;
        if (this.props.sites.length > 0) {
            const options = this.props.sites.map((site) => {
                return { value: site.id, label: site.siteName };
            });
            sitesEl = (<Select clearable={false} value={this.state.site.id} options={options} onChange={(item) => {
                const site = utils.find(this.props.sites, (site) => {
                    return site.id === item.value;
                });
                this.loadSite(site);
            }}/>);
        }
        let channelsEl = null;
        if (this.state.channels.length > 0) {
            const options = this.state.channels.map((channel) => {
                return { value: channel.id, label: channel.channelName };
            });
            channelsEl = (<Select clearable={false} value={this.state.channel.id} options={options} onChange={(item) => {
                this.state.channel = {
                    id: item.value,
                    channelName: item.label
                };
                this.setState(this.state);
            }}/>);
        }
        let attributesEl = null;
        if (this.state.site && this.state.channel) {
            attributesEl = <Attributes siteId={this.state.site.id} channelId={this.state.channel.id}/>;
        }
        return (<div className="article">
        <div className="mod-3">
          <div className="art-mod">
            <div className="art-hd clearfix"><h2>发表稿件</h2></div>
            <div className="form form-1" style={{ marginTop: 25 }}>
              <ul>
                <li className="fm-item">
                  <label htmlFor="#" className="k">投稿站点：</label>
                  <span className="v" style={{ width: 365 }}>
                    {sitesEl}
                  </span>
                </li>
                <li className="fm-item">
                  <label htmlFor="#" className="k">投稿栏目：</label>
                  <span className="v" style={{ width: 365 }}>
                    {channelsEl}
                  </span>
                </li>
                <li className="fm-item">
                  <hr className="hr"/>
                </li>
              </ul>
            </div>
            {attributesEl}
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