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

import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';

// Models
import Word from 'models/Word';
import Words from 'models/Words';
import Phrase from 'models/Phrase';
import Phrases from 'models/Phrases';

// Operations
import DocumentOperations from 'operations/DocumentOperations';
import DirectoryOperations from 'operations/DirectoryOperations';

import EditableComponent from 'views/components/Editor/EditableComponent';
import StatsPanel from 'views/components/Dashboard/StatsPanel';
import Link from 'views/components/Document/Link';

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
    computeCharacters: PropTypes.object.isRequired
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
    let path = newProps.splitWindowPath.slice(1, newProps.splitWindowPath.length - 1).join('/');

    newProps.fetchDialect('/' + path);
    newProps.fetchPortal('/' + path + '/Portal');
    newProps.fetchDialectStats('/' + path, ["words","phrases","songs","stories"]);
    newProps.fetchCharacters('/' + path + '/Alphabet');
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

  _handlePhrasesDataRequest(childProps, page = 1, pageSize = 20) {
    return this.phraseOperations.getDocumentsByPath(
        '/sections/Data/' + this.state.dialectPath,
        {'X-NXproperties': 'dublincore, fv-phrase, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  _handleWordsDataRequest(childProps, page = 1, pageSize = 20) {
    return this.wordOperations.getDocumentsByPath(
        '/sections/Data/' + this.state.dialectPath,
        {'X-NXproperties': 'dublincore, fv-word, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  _navigate(page) {
    this.context.router.push('/explore/' + this.props.dialect.get('parentLanguageFamily').get('dc:title') + '/' + this.props.dialect.get('parentLanguage').get('dc:title') + '/' + this.props.dialect.get('dc:title') + '/learn/' + page );
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
    
    // Assign dialect prop, from parent, to all children
    let content = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, {
          dialect: this.props.dialect,
          handlePhrasesDataRequest: this._handlePhrasesDataRequest,
          handleWordsDataRequest: this._handleWordsDataRequest
        });
    }, this);

    // If no children, render main content.
    if (!this.props.children) {
      content = <div className="row">
                
        <div className={classNames('col-xs-12', 'col-md-8')}>
          <h1>About our Language</h1>
          <EditableComponent computeEntity={this.props.computeDialect} updateEntity={this.props.updateDialect} property="dc:description" />

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
		        <EditableComponent computeEntity={this.props.computeDialect} updateEntity={this.props.updateDialect} property="fvdialect:contact_information" />
		      </div>
	      </div>
        </div>
        <div className={classNames('col-xs-12', 'col-md-4')}>
          <h1>Dashboard</h1>
          <StatsPanel data={dialectStats} docType="words" headerText="Words" />
          <StatsPanel data={dialectStats} docType="phrases" headerText="Phrases" />
          <StatsPanel data={dialectStats} docType="songs" headerText="Songs" />
          <StatsPanel data={dialectStats} docType="stories" headerText="Stories" />     
        </div>
      </div>
    }

    return <div>
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'words')} label={(selectn('response.words.total', dialectStats) == undefined) ? "Words (0)" : "Words (" + selectn('response.words.total', dialectStats) + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'phrases')} label={(selectn('response.phrases.total', dialectStats) == undefined) ? "Phrases (0)" : "Phrases (" + selectn('response.phrases.total', dialectStats) + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'songs')} label="Songs" secondary={true} /> 
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'stories')} label="Stories" secondary={true} />
                  <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'reports')} label="Reports" secondary={true} />                 
                </div>
              </div>
            </div>

            {content}
        </div>;
  }
}