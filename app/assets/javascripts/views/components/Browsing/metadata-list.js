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

import classNames from 'classnames';
import selectn from 'selectn';

import Preview from 'views/components/Editor/Preview';

/**
* Metadata list
*/
export default class MetadataList extends Component {

  static propTypes = {
    metadata: PropTypes.array.isRequired,
    style: PropTypes.object
  };

  constructor(props, context){
    super(props, context);
  }

  render() {

    const { metadata, style } = this.props;

    return <ul className="list-group" style={{overflow: 'scroll', maxHeight: '200px', ...style}}>

            {metadata.map(function(item, key) {

                let value = selectn("value", item);

                if (value && value.length > 0) {
                  return <li className="list-group-item" key={key}>

                  <strong className="list-group-item-heading">{selectn("label", item)}</strong>
                  
                  <div className="list-group-item-text">
                      {value}
                  </div>

                  </li>;
                }
            })}

          </ul>;
  }
}
