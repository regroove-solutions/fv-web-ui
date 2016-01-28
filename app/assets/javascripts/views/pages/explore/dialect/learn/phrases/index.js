import React from 'react';
import DocumentListView from 'views/components/DocumentListView';

// Models
import Phrase from 'models/Phrase';
import Phrases from 'models/Phrases';

// Operations
import DocumentOperations from 'operations/DocumentOperations';

/**
* Learn phrases
*/
export default class LearnPhrases extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Create new operations object
    this.phraseOperations = new DocumentOperations(Phrase, Phrases);

    // Expose 'this' to columns functions below
    let _this = this;

    this.state = {
      columns : [
        { name: 'title', title: 'Phrase', render: function(v, data, cellProps){
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
          name: 'fv-Phrase:part_of_speech', title: 'Part of Speech'
        },
        {
          name: 'fv-Phrase:pronunciation', title: 'Pronunciation'
        },
        {
          name: 'fv-Phrase:categories', title: 'Categories'
        }
      ]
    }

    this._handleDataRequest = this._handleDataRequest.bind(this);
    this._handleNavigate = this._handleNavigate.bind(this);
  }

  _handleNavigate(id) {
    this.context.router.push('/explore/' + this.props.dialect.get('parentLanguageFamily').title + '/' + this.props.dialect.get('parentLanguage').title + '/' + this.props.dialect.get('dc:title') + '/learn/phrases/' + id);
  }

  _handleDataRequest(childProps, page, pageSize, query = null) {
    return this.phraseOperations.getDocumentsByDialect(
        this.context.client,
        childProps.dialect,
        query,
        {'X-NXproperties': 'dublincore, fv-Phrase, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  render() {

    let content = this.props.children;

    // If no children, render main content.
    if (!this.props.children) {

      content = 'Loading...';

      if (this.props.dialect && this.props.handlesPhraseDataCountRequest) {
        content = <div className="row">
                    <div className="col-xs-12">
                      <h1>{this.props.dialect.get('dc:title')} Phrases</h1>
                      <DocumentListView
                        objectDescriptions="phrases" 
                        onDataRequest={this._handleDataRequest}
                        onDataCountRequest={this.props.handlesPhraseDataCountRequest}
                        onSelectionChange={this._handleNavigate}
                        columns={this.state.columns}
                        className="browseDataGrid"  
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