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
import React, {Component, PropTypes} from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base';
import AlphabetListView from 'views/pages/explore/dialect/learn/alphabet/list-view';

import GridTile from 'material-ui/lib/grid-list/grid-tile';

class AlphabetGridTile extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <GridTile key={selectn('uid', this.props.tile)} style={{border: '3px solid #e0e0e0', borderRadius: '5px', textAlign: 'center', paddingTop: '15px'}}>
      <span style={{fontSize: '2em'}}>{selectn('properties.fvcharacter:upper_case_character', this.props.tile)} {selectn('properties.dc:title', this.props.tile)}</span><br/><br/>
      <strong style={{fontSize: '1.3em'}}>{selectn('contextParameters.character.related_words[0].dc:title', this.props.tile)}</strong><br/>
      {selectn('contextParameters.character.related_words[0].fv:definitions[0].translation', this.props.tile) || selectn('contextParameters.character.related_words[0].fv:literal_translation[0].translation', this.props.tile)}
    </GridTile>;
  }
}

/**
* Learn alphabet
*/
@provide
export default class PageDialectLearnAlphabet extends PageDialectLearnBase {

  static defaultProps = {
    print: false
  }

  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired, 
    computeLogin: PropTypes.object.isRequired, 
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    print: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    // Bind methods to 'this'
    //['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchDocument(newProps.routeParams.dialect_path + '/Dictionary');
  }

  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }])

    const computeDocument = ProviderHelpers.getEntry(this.props.computeDocument, this.props.routeParams.dialect_path + '/Dictionary');
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

    const alphabetListView = <AlphabetListView pagination={false} routeParams={this.props.routeParams} dialect={selectn('response', computeDialect2)} />;

    if (this.props.print) {
      return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <div className="row">
                <div className={classNames('col-xs-8', 'col-xs-offset-2')}>
                {React.cloneElement(alphabetListView, { gridListView: true, gridListTile: AlphabetGridTile, dialect: selectn('response', computeDialect2) })}
                </div>
            </div>
            
            </PromiseWrapper>;
    }

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
              <div className="row">
                <div className={classNames('col-xs-12')}>
                  <h1>{selectn('response.title', computeDialect2)} Alphabet</h1>
                  {alphabetListView}
                </div>
              </div>
        </PromiseWrapper>;
  }
}