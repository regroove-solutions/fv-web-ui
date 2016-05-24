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
* Metadata panel for view
*/
export default class MetadataPanel extends Component {

  static propTypes = {
    computeEntity: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);
  }

  render() {

    const { computeEntity } = this.props;

    return  <div>
      <div style={{marginTop: '25px'}} className={classNames('panel', 'panel-default')}>

        <div className="panel-heading">Metadata</div>

          <ul className="list-group">

            {(() => {
              
              if (selectn('response.contextParameters.word.categories.length', computeEntity) > 0) {

              return <li className="list-group-item">

                <strong className="list-group-item-heading">Categories</strong>

                <div className="list-group-item-text">
                {(selectn('response.contextParameters.word.categories', computeEntity) || []).map(function(category, key) {
                  return <div>{selectn('dc:title', category)}</div>;
                })}
                </div>

              </li>;

              }

            })()}

            {(() => {
              
              if (selectn('response.properties.fv:cultural_note.length', computeEntity) > 0) {

              return <li className="list-group-item">

              <strong className="list-group-item-heading">Cultural Notes</strong>
              
              <div className="list-group-item-text">
                {(selectn('response.properties.fv:cultural_note', computeEntity) || []).map(function(cultural_note, key) {
                  return <div>{cultural_note}</div>;
                })}
              </div>

              </li>;

              }

            })()}

            {(() => {
              
              if (selectn('response.properties.fv:reference', computeEntity)) {

              return <li className="list-group-item">

                <strong className="list-group-item-heading">Reference</strong>

                <div className="list-group-item-text">
                  {selectn('response.properties.fv:reference', computeEntity)}
                </div>

              </li>;

              }

            })()}

            {(() => {
              
              if (selectn('response.contextParameters.word.sources.length', computeEntity) > 0) {

              return <li className="list-group-item">

                <strong className="list-group-item-heading">Sources</strong>
                
                <div className="list-group-item-text">
                  {(selectn('response.contextParameters.word.sources', computeEntity) || []).map(function(source, key) {
                    return <Preview expandedValue={source} key={key} type="FVContributor" />;
                  })}
                </div>

              </li>;

              }

            })()}

            <li className="list-group-item">

              <strong className="list-group-item-heading">Date Created</strong>
              
              <div className="list-group-item-text">
                {selectn("response.properties.dc:created", computeEntity)}
              </div>

            </li>

            <li className="list-group-item">

              <strong className="list-group-item-heading">Status</strong>
              
              <div className="list-group-item-text">
                {selectn("response.state", computeEntity)}
              </div>

            </li>

            <li className="list-group-item">

              <strong className="list-group-item-heading">Version</strong>
              
              <div className="list-group-item-text">
                {selectn("response.properties.uid:major_version", computeEntity)}.{selectn("response.properties.uid:minor_version", computeEntity)} 
              </div>

            </li>

          </ul>

      </div>

    </div>;
  }
}
