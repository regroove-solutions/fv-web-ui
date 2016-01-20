import React from 'react';

/**
* Learn stories
*/
export default class LearnStories extends React.Component {

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
                <h1>{this.props.params.dialect} Stories</h1>
                DocumentListView with Stories
              </div>
            </div>
        </div>;
  }
}