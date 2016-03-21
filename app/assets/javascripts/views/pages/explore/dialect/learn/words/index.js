/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import provide from 'react-redux-provide';

import RaisedButton from 'material-ui/lib/raised-button';

import DocumentListView from 'views/components/Document/DocumentListView';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

/**
* Learn words
*/
@provide
export default class PageDialectLearnWords extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    fetchWordsInPath: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    computeWordsInPath: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    // Expose 'this' to columns functions below
    let _this = this;    

    this.state = {
      columns : [
        { name: 'title', title: 'Word', render: function(v, data, cellProps){
          //return <a key={data.id} onTouchTap={_this._handleNavigate.bind(this, data.id)}>{v}</a>
          return v;
        }},
        {
          name: 'fv:definitions', title: 'Definitions', render: function(v, data, cellProps){

          if (v != undefined && v.length > 0) {
            var rows = [];

            for (var i = 0; i < v.length ; ++i) {
              rows.push(<tr><th>{v[i].language}</th><td>{v[i].translation}</td></tr>);
            }

            return  <div><table className="innerRowTable" border="1" cellspacing="5" cellpadding="5" id={data['dc:title']} key={data.id}>
                      <tbody>
                        {rows}
                      </tbody>
                    </table></div>
          }
        }},
        {
          name: 'fv:literal_translation', title: 'Literal Translation', render: function(v, data, cellProps){
          if (v != undefined && v.length > 0) {
            var rows = [];

            for (var i = 0; i < v.length ; ++i) {
              rows.push(<tr><th>{v[i].language}</th><td>{v[i].translation}</td></tr>);
            }

            return  <div><table className="innerRowTable" id={data['dc:title']} key={data.id}>
                      <tbody>
                        {rows}
                      </tbody>
                    </table></div>
          }
        }},
        {
          name: 'fv-word:part_of_speech', title: 'Part of Speech'
        },
        {
          name: 'fv-word:pronunciation', title: 'Pronunciation'
        },
        {
          name: 'fv-word:categories', title: 'Categories'
        }
      ]
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEntryNavigateRequest', '_handleWordsDataRequest', '_handleRefetch'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    let path = newProps.splitWindowPath.slice(1, newProps.splitWindowPath.length - 2).join('/');

    newProps.fetchDialect('/' + path);
    newProps.fetchWordsInPath('/' + path, '&currentPageIndex=' + DEFAULT_PAGE + '&pageSize=' + DEFAULT_PAGE_SIZE, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fv-word, fvcore' });
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }
  }

  _handleWordsDataRequest(dataGridProps, dataGridObj) {
    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
    this.props.fetchWordsInPath('/' + path, '&currentPageIndex=' + dataGridProps.page + '&pageSize=' + dataGridProps.pageSize, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fv-word, fvcore' });
  }

  _handleRefetch(dataGridProps, page, pageSize) {
    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
    this.props.fetchWordsInPath('/' + path, '&currentPageIndex=' + page + '&pageSize=' + pageSize, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fv-word, fvcore' });
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath + '/' + path);
  }

  _onEntryNavigateRequest(path) {
    this.props.pushWindowPath('/explore' + path);
  }

  render() {

    const { computeDialect, computeWordsInPath } = this.props;

    let dialect = computeDialect.response;

    return <div>
              <div className="row">
                <div className="col-xs-8">
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <RaisedButton label="New Word" onTouchTap={this._onNavigateRequest.bind(this, 'create')} primary={true} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <h1>{dialect.get('dc:title')} Words</h1>
                  <DocumentListView
                    objectDescriptions="words" 
                    data={this.props.computeWordsInPath}
                    refetcher={this._handleRefetch}
                    onSelectionChange={this._onEntryNavigateRequest}
                    columns={this.state.columns}
                    className="browseDataGrid" 
                    dialect={dialect} />
                </div>
              </div>
        </div>;
  }
}