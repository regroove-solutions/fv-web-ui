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

import DocumentListView from 'views/components/Document/DocumentListView';

// Models
import Word from 'models/Word';
import Words from 'models/Words';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 20;

/**
* Learn words
*/
@provide
export default class PageDialectLearnWords extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    fetchWordsInPath: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    computeWordsInPath: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Expose 'this' to columns functions below
    let _this = this;    

    this.state = {
      columns : [
        { name: 'title', title: 'Word', render: function(v, data, cellProps){
          return <a key={data.id} onTouchTap={_this._handleNavigate.bind(this, data.id)}>{v}</a>
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
    }

    this._handleNavigate = this._handleNavigate.bind(this);
    this._handleWordsDataRequest = this._handleWordsDataRequest.bind(this);
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

  _handleWordsDataRequest(childProps, page = 1, pageSize = 20) {
    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
    return this.props.fetchWordsInPath('/' + path, '&currentPageIndex=' + page + '&pageSize=' + pageSize, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fv-word, fvcore' });
  }

  _handleNavigate(id) {
    //this.context.router.push('/explore/' + this.props.dialect.get('parentLanguageFamily').get('dc:title') + '/' + this.props.dialect.get('parentLanguage').get('dc:title') + '/' + this.props.dialect.get('dc:title') + '/learn/words/' + id);
  }

  render() {

    const { computeDialect, computeWordsInPath } = this.props;

    let dialect = computeDialect.response;

    return <div>
              <div className="row">
                <div className="col-xs-12">
                  <h1>{dialect.get('dc:title')} Words</h1>
                  <DocumentListView
                    objectDescriptions="words" 
                    onDataRequest={this._handleWordsDataRequest}
                    onSelectionChange={this._handleNavigate}
                    columns={this.state.columns}
                    className="browseDataGrid" 
                    dialect={dialect} />
                </div>
              </div>
        </div>;
  }
}