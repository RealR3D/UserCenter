import * as React from 'react';
import { Link, hashHistory } from 'react-router';
import cx from 'classnames';
import { Loading } from '../../../../components';
import client from '../../../../lib/client';
require('moment/locale/zh-cn');
import Datetime from 'react-datetime';
import * as utils from '../../../../lib/utils';
import { UEditor, ImageUpload } from '../../../components';
export default class Attributes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: utils.assign({}, props.content),
            tableColumns: null,
            errors: {}
        };
    }
    componentDidMount() {
        this.load(this.props.siteId, this.props.channelId);
    }
    componentWillReceiveProps(nextProps, nextState, nextContext) {
        if (nextProps.siteId !== this.props.siteId || nextProps.channelId !== this.props.channelId) {
            this.load(nextProps.siteId, nextProps.channelId);
        }
    }
    load(siteId, channelId) {
        client.writing.getTableColumns(siteId, channelId, (err, res) => {
            this.state.tableColumns = res;
            this.setState(this.state);
        });
    }
    isAttribute(tableColumn) {
        return !utils.findIgnoreCase(tableColumn.attributeName, [
            utils.ContentAttributeName.IsRecommend,
            utils.ContentAttributeName.IsHot,
            utils.ContentAttributeName.IsColor,
            utils.ContentAttributeName.IsTop,
            utils.ContentAttributeName.LinkUrl,
            utils.ContentAttributeName.VideoUrl,
            utils.ContentAttributeName.FileUrl,
            utils.ContentAttributeName.AddDate
        ]);
    }
    submit() {
        const content = this.state.content;
        let errors = {};
        for (let tableColumn of this.state.tableColumns) {
            if (this.isAttribute(tableColumn)) {
                if (tableColumn.inputStyle.inputType.value === utils.InputType.TextEditor) {
                    content[utils.toLower(tableColumn.attributeName)] = UE.getEditor(tableColumn.attributeName).getContent();
                }
                if (tableColumn.isRequired && !content[utils.toLower(tableColumn.attributeName)]) {
                    errors[tableColumn.attributeName] = true;
                }
            }
        }
        if (!content.content) {
            errors['Content'] = true;
        }
        this.state.errors = errors;
        this.setState(this.state);
        if (utils.keys(errors).length > 0)
            return;
        if (!this.props.content) {
            client.writing.createContent(this.props.siteId, this.props.channelId, content, (err, res) => {
                if (err) {
                    return utils.Swal.error(err);
                }
                return utils.Swal.success('稿件发表成功', () => {
                    hashHistory.push('/writing/list');
                });
            });
        }
        else {
            client.writing.editContent(this.props.siteId, this.props.channelId, this.props.id, content, (err, res) => {
                if (err) {
                    return utils.Swal.error(err);
                }
                return utils.Swal.success('稿件编辑成功', () => {
                    hashHistory.push('/writing/list');
                });
            });
        }
    }
    getField(tableColumn) {
        if (!this.isAttribute(tableColumn))
            return null;
        let value = '';
        if (this.props.id) {
            value = this.state.content[utils.toLower(tableColumn.attributeName)] || '';
        }
        else {
            value = this.state.content[utils.toLower(tableColumn.attributeName)] || tableColumn.defaultValue || '';
        }
        const isError = this.state.errors[tableColumn.attributeName];
        let inputEl = null;
        if (tableColumn.inputStyle.inputType.value === utils.InputType.Text || tableColumn.inputStyle.inputType.value === utils.InputType.TextEditor) {
            inputEl = <input value={value} onChange={(e) => {
                this.state.content[utils.toLower(tableColumn.attributeName)] = e.target.value;
                this.setState(this.state);
            }} type="text" className={cx('text input-xxl', { 'error': isError })}/>;
        }
        else if (tableColumn.inputStyle.inputType.value === utils.InputType.TextArea) {
            inputEl = <textarea value={value} onChange={(e) => {
                this.state.content[utils.toLower(tableColumn.attributeName)] = e.target.value;
                this.setState(this.state);
            }} className={cx('textarea input-xxl', { 'error': isError })}/>;
        }
        else if (tableColumn.inputStyle.inputType.value === utils.InputType.DateTime) {
            if (value === '{Current}') {
                value = new Date();
            }
            inputEl = <Datetime value={value} onChange={(date) => {
                this.state.content[utils.toLower(tableColumn.attributeName)] = date.format('YYYY-MM-DD hh:mm:ss');
                this.setState(this.state);
            }} className={cx('text input-xl', { 'error': isError })} timeFormat="HH:mm:ss"/>;
        }
        else if (tableColumn.inputStyle.inputType.value === utils.InputType.Image) {
            var extendAttributeName = utils.toLower(utils.ContentAttributeName.getExtendAttributeName(utils.ContentAttributeName.ImageUrl));
            var imageUrls = [];
            if (value) {
                imageUrls.push(value);
            }
            if (this.state.content[extendAttributeName]) {
                var urls = utils.trim(this.state.content[extendAttributeName], ',').split(',');
                for (var url of urls) {
                    imageUrls.push(url);
                }
            }
            inputEl = <ImageUpload siteId={this.props.siteId} imageUrls={imageUrls} onChange={(imageUrls) => {
                value = '';
                this.state.content[extendAttributeName] = '';
                if (imageUrls && imageUrls.length > 0) {
                    var i = 0;
                    for (var imageUrl of imageUrls) {
                        if (i === 0) {
                            this.state.content[utils.toLower(tableColumn.attributeName)] = imageUrl;
                        }
                        else {
                            this.state.content[extendAttributeName] += imageUrl + ',';
                        }
                        i++;
                    }
                }
                this.setState(this.state);
            }}/>;
        }
        if (!inputEl)
            return null;
        let errorEl = null;
        if (this.state.errors[tableColumn.attributeName]) {
            errorEl = <span className="text-error"><i className="ico ico-err-2"/><em className="error-message">请填写{tableColumn.inputStyle.userName}</em></span>;
        }
        if (tableColumn.inputStyle.inputType.value === 'TextEditor') {
            return (<li key={tableColumn.attributeName} className="fm-item" style={{ height: 'auto', marginLeft: 40 }}>
          <UEditor id={tableColumn.attributeName} height={350} value={value}/>
          <div style={{ textAlign: 'right', marginRight: 50 }}>{errorEl}</div>
        </li>);
        }
        else {
            return (<li key={tableColumn.attributeName} className="fm-item">
          <label htmlFor="#" className="k">{tableColumn.inputStyle.userName}：</label>
          <span className="v">
            {inputEl}
            {errorEl}
          </span>
        </li>);
        }
    }
    render() {
        if (!this.state.tableColumns)
            return <Loading />;

        const fields = this.state.tableColumns.map((tableColumn) => this.getField(tableColumn));
        return (<div className="form form-1">
        <ul>
          {fields}
        </ul>
        <div className="btns" style={{ margin: 20 }}>
          <span onClick={this.submit.bind(this)} href="javascript:;" className="btn btn-3">保存修改</span>
          <Link to="/writing/list" className="btn btn-4" style={{ marginLeft: 20 }}>返回列表</Link>
        </div>
      </div>);
    }
}