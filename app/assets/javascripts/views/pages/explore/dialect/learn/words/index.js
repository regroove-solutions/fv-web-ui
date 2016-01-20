import React from 'react';
import DocumentListView from 'views/components/DocumentListView';

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
                        router={this.context.router}
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