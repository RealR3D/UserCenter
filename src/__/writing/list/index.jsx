import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Select from 'react-select';
import cx from 'classnames';
import { Loading } from '../../../components';
import client from '../../../lib/client';
import * as utils from '../../../lib/utils';
class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            site: null,
            channels: null,
            channel: null,
            contents: null,
            currentPage: 1,
            totalPage: 1,
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
            this.setState(this.state);
            this.loadContents(site.id, site.id, 1);
        });
    }
    loadContents(siteId, channelId, page) {
        this.state.currentPage = page;
        this.state.contents = null;
        this.setState(this.state);
        const searchType = '';
        const keyword = '';
        const dateFrom = '';
        const dateTo = '';
        client.writing.getContents(siteId, channelId, searchType, keyword, dateFrom, dateTo, page, (err, res) => {
            if (!err) {
                this.state.contents = res.results;
                this.state.totalPage = res.totalPage;
                this.setState(this.state);
                if (page > 1) {
                }
                this.setState(this.state);
            }
        });
    }
    onPageClick(page) {
        this.loadContents(this.state.site.id, this.state.channel ? this.state.channel.id : this.state.site.id, page);
    }
    render() {
        if (!this.state.contents)
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
            channelsEl = (<Select placeholder="全部栏目" clearable={true} options={options} value={this.state.channel ? this.state.channel.id : 0} onChange={(item) => {
                if (item) {
                    this.state.channel = {
                        id: item.value,
                        channelName: item.label
                    };
                }
                else {
                    this.state.channel = null;
                }
                this.setState(this.state);
                this.loadContents(this.state.site.id, item ? item.value : this.state.site.id, 1);
            }}/>);
        }

        const contentsEl = this.state.contents.map((content) => {
            const channel = utils.find(this.state.channels, (n) => {
                return n.id === content.channelId;
            });
            if (!channel)
                return null;
            var siteId = content.siteId;
            var channelId = content.channelId;
            var id = content.id;
            var title = content.title;
            var addDate = content.addDate;
            var isChecked = content.isChecked;
            let state = '审核通过';
            let deleteEl = null;
            if (!isChecked) {
                state = '待审核';
                deleteEl = <a href="javascript:;" className="lnk" onClick={() => {
                    utils.Swal.confirm('此操作将删除稿件，确认吗？', (isConfirm) => {
                        if (isConfirm) {
                            client.writing.deleteContent(siteId, channelId, id, (err, res) => {
                                this.state.contents.splice(this.state.contents.indexOf(content), 1);
                                this.setState(this.state);
                            });
                        }
                    });
                }}>删除</a>;
            }
            return (<tr key={id}>
          <td>{title}</td>
          <td>{channel.channelName}</td>
          <td>{addDate}</td>
          <td style={{ color: isChecked ? '#4CAF50' : '#f00' }}>【{state}】</td>
          <td>
            <Link to={`/writing/edit/${siteId}/${channelId}/${id}`} className="lnk">编辑</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {deleteEl}
          </td>
        </tr>);
        });
        let pagerEl = null;
        if (this.state.totalPage > 1) {
            const prevEl = this.state.currentPage > 1 ? (<li className="button"><a href="javascript:;" onClick={this.onPageClick.bind(this, this.state.currentPage - 1)}>Prev</a></li>) : (<li className="button disabled"><a href="javascript:;">Prev</a></li>);
            const nextEl = this.state.currentPage !== this.state.totalPage ? (<li className="button"><a href="javascript:;" onClick={this.onPageClick.bind(this, this.state.currentPage + 1)}>Next</a></li>) : (<li className="button disabled"><a href="javascript:;">Next</a></li>);
            const n = 4;
            const keys = [];
            if (this.state.totalPage > 10) {
                for (let i = 1; i <= n; i++) {
                    if (keys.indexOf(i) === -1)
                        keys.push(i);
                }
                if (this.state.currentPage < (this.state.totalPage - 5)) {
                    if (this.state.currentPage > n + 1) {
                        if (this.state.currentPage > n + 3) {
                            keys.push(-1);
                        }
                        for (let i = this.state.currentPage - 2; i < this.state.currentPage; i++) {
                            if (keys.indexOf(i) === -1)
                                keys.push(i);
                        }
                    }
                    for (let i = this.state.currentPage; i <= this.state.currentPage + 2; i++) {
                        if (keys.indexOf(i) === -1)
                            keys.push(i);
                    }
                    keys.push(-2);
                    for (let i = this.state.totalPage - 1; i <= this.state.totalPage; i++) {
                        if (keys.indexOf(i) === -1)
                            keys.push(i);
                    }
                }
                else {
                    keys.push(-3);
                    for (let i = this.state.currentPage - 2; i < this.state.currentPage; i++) {
                        if (keys.indexOf(i) === -1)
                            keys.push(i);
                    }
                    for (let i = this.state.currentPage; i <= this.state.totalPage; i++) {
                        if (keys.indexOf(i) === -1)
                            keys.push(i);
                    }
                }
            }
            else {
                for (let i = 1; i <= this.state.totalPage; i++) {
                    if (keys.indexOf(i) === -1)
                        keys.push(i);
                }
            }
            const pagesEl = keys.map(i => {
                if (i > 0) {
                    return <li key={i}><a className={cx({ 'current': this.state.currentPage === i })} onClick={this.onPageClick.bind(this, i)} href="javascript:;">{i}</a></li>;
                }
                else {
                    return <li key={i}><span>...</span></li>;
                }
            });
            pagerEl = (<nav className="navigation">
          <ul className="cd-pagination custom-buttons">
            {prevEl}
            {pagesEl}
            {nextEl}
          </ul>
        </nav>);
        }
        return (<div className="article">
        <div className="mod-3">
          <div className="art-mod">
            <div className="art-hd clearfix"><h2>稿件管理</h2></div>
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
            <div className="mod-reslut-t2">
              <table className="table2" width="100%">
                <thead>
                  <tr>
                    <th>内容标题</th>
                    <th>栏目</th>
                    <th>投稿时间</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {contentsEl}
                </tbody>
              </table>
              {pagerEl}
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