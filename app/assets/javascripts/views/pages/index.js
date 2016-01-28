import React from 'react';
import classNames from 'classnames';

export default class Index extends React.Component {

  static inlineStyles = {
    marginRight: '25px'
  };

  static tableStyles = {
    marginRight: 'auto',
    marginLeft: 'auto'
  };

  render() {

    return <div>
            <div className="row">
              <div className={classNames('col-xs-12')}>
                Home Page coming soon (use the menu icon, top left, to navigate)
              </div> 
            </div> 
          </div>;
  }
}