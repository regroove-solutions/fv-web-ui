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
import classNames from 'classnames';
import provide from 'react-redux-provide';
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import ProviderHelpers from 'common/ProviderHelpers';

import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';

// Operations
import DocumentOperations from 'operations/DocumentOperations';
import DirectoryOperations from 'operations/DirectoryOperations';

import EditableComponent from 'views/components/Editor/EditableComponent';
import StatsPanel from 'views/components/Dashboard/StatsPanel';
import Link from 'views/components/Document/Link';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

/**
* Learn portion of the dialect portal
*/
@provide
export default class DialectLearn extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDialect: PropTypes.func.isRequired,
    updateDialect: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    fetchDialectStats: PropTypes.func.isRequired,
    computeDialectStats: PropTypes.object.isRequired,
    fetchCharacters: PropTypes.func.isRequired,
    computeCharacters: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    //this._handlePhrasesDataRequest = this._handlePhrasesDataRequest.bind(this);
    //this._handleWordsDataRequest = this._handleWordsDataRequest.bind(this);
    
    // Bind methods to 'this'
    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(path) {
    const destination = this.props.navigateTo(path);
    const newPathArray = this.props.splitWindowPath.slice();

    newPathArray.push(destination.path);

    this.props.pushWindowPath('/' + newPathArray.join('/'));
  }

  fetchData(newProps) {
    newProps.fetchDialect(newProps.routeParams.dialect_path);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');
    newProps.fetchDialectStats(newProps.routeParams.dialect_path, ["words","phrases","songs","stories"]);
    newProps.fetchCharacters(newProps.routeParams.dialect_path + '/Alphabet');
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }
  }

  _onCharAudioTouchTap(charAudioId) {
	  document.getElementById(charAudioId).play();
  }  
  
  render() {
    const { computeDialect, computePortal, computeDocument, computeDialectStats, computeCharacters } = this.props;      
    
    let dialect = computeDialect.response;

    let portal = computePortal.response;
    let dialectStats = computeDialectStats;
    let characters = computeCharacters.response;

    let keyboardLinks = [];

    if ( computeDialect.success && selectn('contextParameters.dialect.keyboards', dialect) ) {
    	keyboardLinks = selectn('contextParameters.dialect.keyboards', dialect);
    }
    
    let circularProgress = <CircularProgress mode="indeterminate" size={3} />;

    return <div>
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'words')} label={(selectn('response.words.total', dialectStats) == undefined) ? "Words (0)" : "Words (" + selectn('response.words.total', dialectStats) + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'phrases')} label={(selectn('response.phrases.total', dialectStats) == undefined) ? "Phrases (0)" : "Phrases (" + selectn('response.phrases.total', dialectStats) + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'stories-songs')} label={(selectn('response.stories.total', dialectStats) == undefined) ? "Stories (0)" : "Stories (" + selectn('response.stories.total', dialectStats) + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'stories-songs')} label={(selectn('response.songs.total', dialectStats) == undefined) ? "Songs (0)" : "Songs (" + selectn('response.songs.total', dialectStats) + ")"} secondary={true} /> 
                </div>
              </div>
            </div>

            <div className="row">
                      
              <div className={classNames('col-xs-12', 'col-md-8')}>
                <h1>About our Language</h1>

                <AuthorizationFilter filter={{permission: 'Write', entity: dialect}} renderPartial={true}>
                  <EditableComponent computeEntity={computeDialect} updateEntity={this.props.updateDialect} property="dc:description" />
                </AuthorizationFilter>

                <div className="row">
                  <div className={classNames('col-xs-12', 'col-md-6')}>
                    <h1>{(dialect) ? dialect.title : ''} Alphabet</h1>
                    {/* Display alphabet characters - move to separate component later */}
                    {(characters && characters.entries) ? characters.entries.map((char, i) => 
                  <div key={char.uid} className="col-xs-1">
                    <a href={'/explore' + char.path}>{char.title}</a>
                    <br />
                    {(char.contextParameters.character.related_audio[0]) ? 
                      <span>
                      <a className="glyphicon glyphicon-volume-up" onTouchTap={this._onCharAudioTouchTap.bind(this, 'charAudio' + char.uid)} />
                        <audio id={'charAudio' + char.uid}  src={ConfGlobal.baseURL + char.contextParameters.character.related_audio[0].path} />
                      </span>
                    : ''}           
                  </div>
                ) : circularProgress}
                </div>
                
                <div className={classNames('col-xs-12', 'col-md-6')}>
                  <h1>Keyboards</h1>
                  {(keyboardLinks) ? keyboardLinks.map((keyboardLink, i) =>
                    <Link key={i} data={keyboardLink} showDescription={true} />
                      ) : ''}           
                </div> 
              </div>
              <div className="row">
                <div className={classNames('col-xs-12', 'col-md-12')}>
                  <h1>Contact Information</h1>
                  <AuthorizationFilter filter={{permission: 'Write', entity: dialect}} renderPartial={true}>
                    <EditableComponent computeEntity={computeDialect} updateEntity={this.props.updateDialect} property="fvdialect:contact_information" />
                  </AuthorizationFilter>
                </div>
              </div>
              </div>
              <div className={classNames('col-xs-12', 'col-md-4')}>
                <h1>Dashboard</h1>
                {(dialectStats.success) ? 
                	<div>
		                <StatsPanel data={dialectStats} docType="words" headerText="Words" />
		                <StatsPanel data={dialectStats} docType="phrases" headerText="Phrases" />
		                <StatsPanel data={dialectStats} docType="songs" headerText="Songs" />
		                <StatsPanel data={dialectStats} docType="stories" headerText="Stories" />  
	                </div>
                : circularProgress}
              </div>
            </div>
        </div>;
  }
}