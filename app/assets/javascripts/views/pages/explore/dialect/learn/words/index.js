import React from 'react';
import DocumentListView from 'views/components/DocumentListView';

import WordOperations from 'operations/WordOperations';

/**
* Learn words
*/
export default class LearnWords extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

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

    this._handleDataRequest = this._handleDataRequest.bind(this);
    this._handleNavigate = this._handleNavigate.bind(this);
  }

  _handleNavigate(id) {
    this.context.router.push('/explore/' + this.props.params.family + '/' + this.props.params.language + '/' + this.props.params.dialect + '/learn/words/' + id);
  }

  _handleDataRequest(childProps, page, pageSize, query = null) {
    return WordOperations.getWordsByDialect(
        childProps.client,
        childProps.dialect.get('dc:title'),
        query,
        {'X-NXproperties': 'dublincore, fv-word, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  render() {

    let content = this.props.children;

    // If no children, render main content.
    if (!this.props.children) {

      content = 'Loading...';

      if (this.props.dialect) {
        content = <div className="row">
                    <div className="col-xs-12">
                      <h1>{this.props.dialect.get('dc:title')} Words</h1>
                      <DocumentListView
                        onDataRequest={this._handleDataRequest}
                        onSelectionChange={this._handleNavigate}
                        columns={this.state.columns}
                        client={this.context.client}
                        className="browseDataGrid"
                        family={this.props.params.family} 
                        language={this.props.params.language}   
                        dialect={this.props.dialect} />
                    </div>
                  </div>
      }
    }

    return <div>
            {content}
        </div>;
  }
}