import React from 'react';

/**
* Community Slideshow
*/
export default class CommunitySlideshow extends React.Component {

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
                <h1>{this.props.params.dialect} Community Slideshow</h1>
                Community Slideshow browser.
              </div>
            </div>
        </div>;
  }
}