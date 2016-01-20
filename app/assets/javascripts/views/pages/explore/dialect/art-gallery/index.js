import React from 'react';

/**
* Play games
*/
export default class ArtGallery extends React.Component {

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
                <h1>{this.props.params.dialect} Art Gallery</h1>
                Art Gallery browser.
              </div>
            </div>
        </div>;
  }
}