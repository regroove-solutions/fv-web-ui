import React from 'react';
import DocumentListView from 'views/components/DocumentListView';

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
  }

  render() {
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>{this.props.params.dialect} Phrases</h1>
                DocumentListView with Phrases
              </div>
            </div>
        </div>;
  }
}