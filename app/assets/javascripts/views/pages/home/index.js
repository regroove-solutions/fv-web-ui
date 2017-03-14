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
import React, { Component, PropTypes } from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';

import Map from 'views/components/Geo/map';

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class PageHome extends Component {

  static propTypes = {
  };

  /*static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired
  };*/

  constructor(props, context){
    super(props, context);
  }

  render() {

    const homePageStyle = {
      position: 'relative',
      minHeight: '155px',
      height: '700px',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundImage: 'url("/assets/images/homepage.jpg")',
      backgroundPosition: '0 0',
      overflow: 'hidden'
    }

    return <div>
            <div className="row" style={homePageStyle}>
              <div className={classNames('col-xs-12')} style={{height: '100%', textAlign: 'right'}}>
                <Map style={{display:'none', position: 'absolute', right: '0', bottom: '0'}} />
              </div>
            </div>
            <div className={classNames('row', 'hidden')}>
              <div className={classNames('col-xs-12', 'col-md-3')}>
                <Paper>test</Paper>
              </div>
              <div className={classNames('col-xs-12', 'col-md-3')}>
                <Paper>test</Paper>
              </div>
              <div className={classNames('col-xs-12', 'col-md-3')}>
                <Paper>test</Paper>
              </div>
              <div className={classNames('col-xs-12', 'col-md-3')}>
                <Paper>test</Paper>
              </div>
                </div>
            </div>;
  }
}