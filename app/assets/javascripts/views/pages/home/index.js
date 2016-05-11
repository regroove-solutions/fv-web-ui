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
      height: '600px',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundImage: 'url("http://localhost:3001/images/homepage.jpg")',
      backgroundPosition: '0 0',
    }

    return <div className="row">
            <div className="jumbotron" style={homePageStyle}>
            </div>
          </div>;
  }
}