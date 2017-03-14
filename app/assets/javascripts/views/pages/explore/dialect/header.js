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

import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

/**
* Header for dialect pages
*/
export default class Header extends Component {

  static propTypes = {
    backgroundImage: PropTypes.string
  };

  constructor(props, context){
    super(props, context);
  }

  render() {

    const { backgroundImage } = this.props;

    let portalBackgroundImagePath = "/assets/images/cover.png";

    if (backgroundImage && backgroundImage.length > 0) {
      portalBackgroundImagePath = ConfGlobal.baseURL + backgroundImage;
    }

    const portalBackgroundStyles = {
      position: 'relative',
      minHeight: '400px',
      backgroundColor: 'transparent',
      backgroundSize: 'cover',
      backgroundImage: 'url("' + portalBackgroundImagePath + '")',
      backgroundPosition: '0 -100',
    }

    return <div style={portalBackgroundStyles}>
              {this.props.children}
          </div>;
  }
}