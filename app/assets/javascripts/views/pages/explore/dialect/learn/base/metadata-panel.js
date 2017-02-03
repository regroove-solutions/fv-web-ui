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
import MetadataList from 'views/components/Browsing/metadata-list';

/**
* Metadata panel for word or phrase views.
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

    let metadata = [];

    /**
     * Categories
     */
    let categories = [];
      
    {(selectn('response.contextParameters.word.categories', computeEntity) || []).map(function(category, key) {
      categories.push(<div key={key}>{selectn('dc:title', category)}</div>);
    })};
    
    metadata.push({
      label: 'Categories',
      value: categories
    });

    /**
     * Cultural notes
     */
    let cultural_notes = [];
    
    {(selectn('response.properties.fv:cultural_note', computeEntity) || []).map(function(cultural_note, key) {
      cultural_notes.push(<div key={key}>{cultural_note}</div>);
    })};
    
    metadata.push({
      label: 'Cultural Notes',
      value: cultural_notes
    });

    /**
     * Reference
     */
    metadata.push({
      label: 'Reference',
      value: selectn('response.properties.fv:reference', computeEntity)
    });

    /**
     * Sources
     */
    let sources = [];
    
    {(selectn('response.contextParameters.word.sources', computeEntity) || []).map(function(source, key) {
      sources.push(<Preview expandedValue={source} key={key} type="FVContributor" />);
    })};
    
    metadata.push({
      label: 'Sources',
      value: sources
    });

    /**
     * Date created
     */
    metadata.push({
      label: 'Date Created',
      value: selectn("response.properties.dc:created", computeEntity)
    });

    /**
     * Status
     */
    metadata.push({
      label: 'Status',
      value: selectn("response.state", computeEntity)
    });

    /**
     * Version
     */
    metadata.push({
      label: 'Version',
      value: selectn("response.properties.uid:major_version", computeEntity) + '.' + selectn("response.properties.uid:minor_version", computeEntity)
    });

    return  <div>
              <div style={{margin: '15px', width: '80%'}} className={classNames('panel', 'panel-default')}>
                  <MetadataList metadata={metadata} style={{overflow: 'auto', maxHeight: '100%'}} />
              </div>
            </div>;
  }
}
