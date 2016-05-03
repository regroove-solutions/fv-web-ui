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
import selectn from 'selectn';

import ProviderHelpers from 'common/ProviderHelpers';

import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';

import RaisedButton from 'material-ui/lib/raised-button';

import DocumentListView from 'views/components/Document/DocumentListView';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LANGUAGE = 'english';

/**
* Learn phrases
*/
@provide
export default class PageDialectLearnPhrases extends PageDialectLearnBase {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    fetchPhrasesInPath: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    computePhrasesInPath: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      columns : [
        { name: 'title', title: 'Phrase', render: function(v, data, cellProps){
          //return <a key={data.id} onTouchTap={_this._handleNavigate.bind(this, data.id)}>{v}</a>
          return v;
        }},
        { name: 'fv:definitions', title: 'Definitions', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('properties.' + cellProps.name, data), function (entry, i) {
              if (entry.language == DEFAULT_LANGUAGE && i < 2) {
                return <li key={i}>{entry.translation}</li>;
              }
            });
          }.bind(this)
        },
        { name: 'fv-phrase:phrase_books', title: 'Categories', render: function(v, data, cellProps) {
            return this.renderComplexArrayRow(selectn('contextParameters.phrase.phrase_books', data), function (entry, i) {
                return <li key={i}>{selectn('dc:title', entry)}</li>;
            });
          }.bind(this)
        },
        { name: 'state', title: 'State' }
      ]
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEntryNavigateRequest', '_handleRefetch'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    let dialectPath = ProviderHelpers.getDialectPathFromURLArray(newProps.splitWindowPath).join('/');

    newProps.fetchDialect('/' + dialectPath);
    newProps.fetchPhrasesInPath('/' + dialectPath + '/Dictionary/', '&currentPageIndex=' + DEFAULT_PAGE + '&pageSize=' + DEFAULT_PAGE_SIZE, { 'X-NXenrichers.document': 'ancestry,phrase', 'X-NXproperties': 'dublincore, fv-phrase, fvcore' });
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

  _handleRefetch(dataGridProps, page, pageSize) {
    let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
    this.props.fetchPhrasesInPath('/' + path, '&currentPageIndex=' + page + '&pageSize=' + pageSize, { 'X-NXenrichers.document': 'ancestry,phrase', 'X-NXproperties': 'dublincore, fv-phrase, fvcore' });
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath + '/' + path);
  }

  _onEntryNavigateRequest(item) {
    // Get path name from path
    let splitPath = item.path.split('/');
    this.props.pushWindowPath(this.props.windowPath + '/' + splitPath[splitPath.length - 1]);
  }

  render() {

    const { computeDialect, computePhrasesInPath } = this.props;

    let dialect = computeDialect.response;

    return <div>
              <div className="row">
                <div className="col-xs-8">
                </div>
                <div className={classNames('col-xs-4', 'text-right')}>
                  <RaisedButton label="New Phrase" onTouchTap={this._onNavigateRequest.bind(this, 'create')} primary={true} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <h1>{dialect.get('dc:title')} Phrases</h1>
                  <DocumentListView
                    objectDescriptions="phrases" 
                    data={this.props.computePhrasesInPath}
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