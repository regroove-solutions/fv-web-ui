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
import Immutable from 'immutable';

import classNames from 'classnames';
import provide from 'react-redux-provide';
import ConfGlobal from 'conf/local.json';
import selectn from 'selectn';

import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import Header from 'views/pages/explore/dialect/header';
import PageHeader from 'views/pages/explore/dialect/page-header';
import SearchBar from 'views/pages/explore/dialect/search-bar';

import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FlatButton from 'material-ui/lib/flat-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';

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
    fetchDialect2: PropTypes.func.isRequired,
    updateDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    fetchDialectStats: PropTypes.func.isRequired,
    computeDialectStats: PropTypes.object.isRequired,
    
    queryModifiedWords: PropTypes.func.isRequired,
    computeModifiedWords: PropTypes.object.isRequired,
    queryCreatedWords: PropTypes.func.isRequired,
    computeCreatedWords: PropTypes.object.isRequired,     
    queryUserModifiedWords: PropTypes.func.isRequired,
    computeUserModifiedWords: PropTypes.object.isRequired,
    queryUserCreatedWords: PropTypes.func.isRequired,
    computeUserCreatedWords: PropTypes.object.isRequired,
    queryModifiedPhrases: PropTypes.func.isRequired,
    computeModifiedPhrases: PropTypes.object.isRequired,
    queryCreatedPhrases: PropTypes.func.isRequired,
    computeCreatedPhrases: PropTypes.object.isRequired,
    queryUserModifiedPhrases: PropTypes.func.isRequired,
    computeUserModifiedPhrases: PropTypes.object.isRequired,
    queryUserCreatedPhrases: PropTypes.func.isRequired,
    computeUserCreatedPhrases: PropTypes.object.isRequired,
    queryModifiedStories: PropTypes.func.isRequired,
    computeModifiedStories: PropTypes.object.isRequired,
    queryCreatedStories: PropTypes.func.isRequired,
    computeCreatedStories: PropTypes.object.isRequired,    
    queryModifiedSongs: PropTypes.func.isRequired,
    computeModifiedSongs: PropTypes.object.isRequired,
    queryCreatedSongs: PropTypes.func.isRequired,
    computeCreatedSongs: PropTypes.object.isRequired,   
    queryUserModifiedStories: PropTypes.func.isRequired,
    computeUserModifiedStories: PropTypes.object.isRequired,
    queryUserCreatedStories: PropTypes.func.isRequired,
    computeUserCreatedStories: PropTypes.object.isRequired,
    queryUserModifiedSongs: PropTypes.func.isRequired,
    computeUserModifiedSongs: PropTypes.object.isRequired,
    queryUserCreatedSongs: PropTypes.func.isRequired,
    computeUserCreatedSongs: PropTypes.object.isRequired,    
    
    fetchCharacters: PropTypes.func.isRequired,
    computeCharacters: PropTypes.object.isRequired,
    computeLogin: PropTypes.object.isRequired,
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
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal');
    newProps.fetchDialectStats(newProps.routeParams.dialect_path, {'dialectPath': newProps.routeParams.dialect_path, 'docTypes': ["words","phrases","songs","stories"]});

    newProps.queryModifiedWords(newProps.routeParams.dialect_path);
    newProps.queryCreatedWords(newProps.routeParams.dialect_path);    
    newProps.queryUserModifiedWords(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));
    newProps.queryUserCreatedWords(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));

    newProps.queryModifiedPhrases(newProps.routeParams.dialect_path);
    newProps.queryCreatedPhrases(newProps.routeParams.dialect_path);
    newProps.queryUserModifiedPhrases(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));
    newProps.queryUserCreatedPhrases(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));    

    newProps.queryModifiedStories(newProps.routeParams.dialect_path);
    newProps.queryCreatedStories(newProps.routeParams.dialect_path);
    newProps.queryUserModifiedStories(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));
    newProps.queryUserCreatedStories(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));    
    
    newProps.queryModifiedSongs(newProps.routeParams.dialect_path);
    newProps.queryCreatedSongs(newProps.routeParams.dialect_path);  
    newProps.queryUserModifiedSongs(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin));
    newProps.queryUserCreatedSongs(newProps.routeParams.dialect_path, selectn("response.properties.username", newProps.computeLogin)); 
    
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
    
    if(selectn("response.properties.username", this.props.computeLogin) != selectn("response.properties.username", nextProps.computeLogin)) {
    	nextProps.queryUserModifiedWords(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    	nextProps.queryUserCreatedWords(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    	nextProps.queryUserModifiedPhrases(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
    	nextProps.queryUserCreatedPhrases(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin)); 
        nextProps.queryUserModifiedStories(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
        nextProps.queryUserCreatedStories(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));  
        nextProps.queryUserModifiedSongs(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));
        nextProps.queryUserCreatedSongs(nextProps.routeParams.dialect_path, selectn("response.properties.username", nextProps.computeLogin));     	
    }        
  }

  _onCharAudioTouchTap(charAudioId) {
	  document.getElementById(charAudioId).play();
  }  
  
  // Convert timestamps in the format "2016-05-19T16:56:27.43Z" to "2016-05-19 16:56:27"
  _formatDate(date) {
	  const dateString = date.slice(0, 10);
	  const timeString = date.slice(11, 19);
	  return dateString + " " + timeString;
  }

  // Convert Nuxeo paths to webui links
  _formatLink(path, docType) {
	  
	  switch(docType) {
	  	case "word":
	  		path = path.replace("/Dictionary/", "/learn/words/");
	  		return "/explore" + path;
	  	break;
	  	
	  	case "phrase":
	  		path = path.replace("/Dictionary/", "/learn/phrases/");
	  		return "/explore" + path;
	  	break;

	  	case "song":
	  		path = path.replace("/Stories & Songs/", "/learn/songs/");
	  		return "/explore" + path;
	  	break;
	  		
	  	case "story":
	  		path = path.replace("/Stories & Songs/", "/learn/stories/");
	  		return "/explore" + path;
	  	break;	  			  		
	  }
  }  
  
  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }, {
      'id': this.props.routeParams.dialect_path + '/Portal',
      'entity': this.props.computePortal
    }])

    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');
    const computeDialectStats = ProviderHelpers.getEntry(this.props.computeDialectStats, this.props.routeParams.dialect_path);
    
    const computeModifiedWords = ProviderHelpers.getEntry(this.props.computeModifiedWords, this.props.routeParams.dialect_path);
    const computeCreatedWords = ProviderHelpers.getEntry(this.props.computeCreatedWords, this.props.routeParams.dialect_path);
    const computeModifiedPhrases = ProviderHelpers.getEntry(this.props.computeModifiedPhrases, this.props.routeParams.dialect_path);
    const computeCreatedPhrases = ProviderHelpers.getEntry(this.props.computeCreatedPhrases, this.props.routeParams.dialect_path);
    const computeModifiedStories = ProviderHelpers.getEntry(this.props.computeModifiedStories, this.props.routeParams.dialect_path);
    const computeCreatedStories = ProviderHelpers.getEntry(this.props.computeCreatedStories, this.props.routeParams.dialect_path);
    const computeModifiedSongs = ProviderHelpers.getEntry(this.props.computeModifiedSongs, this.props.routeParams.dialect_path);
    const computeCreatedSongs = ProviderHelpers.getEntry(this.props.computeCreatedSongs, this.props.routeParams.dialect_path);    
    //const computeUserModifiedWords = ProviderHelpers.getEntry(this.props.computeUserModifiedWords, this.props.routeParams.dialect_path);

    
    const isSection = this.props.routeParams.area === 'sections';

    const { updatePortal, computeLogin, computeDocument, computeCharacters, computeUserModifiedWords, computeUserCreatedWords, computeUserModifiedPhrases, 
    	computeUserCreatedPhrases, computeUserModifiedStories, computeUserCreatedStories, computeUserModifiedSongs, computeUserCreatedSongs} = this.props;      
    //let dialect = computeDialect2.response;

    let characters = computeCharacters.response;

    let circularProgress = <CircularProgress mode="indeterminate" size={3} />;

    return <PromiseWrapper computeEntities={computeEntities}>

            <PageHeader title="Language Area" portalLogo={selectn('response.contextParameters.portal.fv-portal:logo.path', computePortal)} dialectName={selectn('response.title', computeDialect2)} />

            <Header backgroundImage={selectn('response.contextParameters.portal.fv-portal:background_top_image.path', computePortal)}>
              {(() => {
                if (selectn("isConnected", computeLogin) || selectn('response.properties.fv-portal:greeting', computePortal) || selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)) {
                  return <h2 style={{padding: '10px 30px', position: 'absolute', bottom: '20px', backgroundColor: 'rgba(255,255,255, 0.3)'}}>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper className="fv-portal-greeting" isSection={isSection} computeEntity={computePortal} updateEntity={updatePortal} property="fv-portal:greeting" entity={selectn('response', computePortal)} />
                    </AuthorizationFilter>

                    {(selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)) ? 
                     <audio id="portalFeaturedAudio" src={ConfGlobal.baseURL + selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal).path} controls />
                    : ''}
                  </h2>;
                }
              })()}
            </Header>

            <Toolbar>

              <ToolbarGroup firstChild={true} float="left">
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, 'words')} label={(selectn('response.words.total', computeDialectStats) == undefined) ? "Words (0)" : "Words (" + selectn('response.words.total', computeDialectStats) + ")"} /> <ToolbarSeparator />
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, 'phrases')} label={(selectn('response.phrases.total', computeDialectStats) == undefined) ? "Phrases (0)" : "Phrases (" + selectn('response.phrases.total', computeDialectStats) + ")"} /> <ToolbarSeparator />
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, 'stories')} label={(selectn('response.stories.total', computeDialectStats) == undefined) ? "Stories (0)" : "Stories (" + selectn('response.stories.total', computeDialectStats) + ")"} /> <ToolbarSeparator />
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, 'songs')} label={(selectn('response.songs.total', computeDialectStats) == undefined) ? "Songs (0)" : "Songs (" + selectn('response.songs.total', computeDialectStats) + ")"} /> <ToolbarSeparator />             
              </ToolbarGroup>

              <ToolbarGroup float="right">
                <SearchBar />
              </ToolbarGroup>

            </Toolbar>

            <div className="row">
                      
              <div className={classNames('col-xs-12', 'col-md-8')}>
                <h1>About our Language</h1>

                <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                  <EditableComponent computeEntity={computeDialect2} updateEntity={this.props.updateDialect2} property="dc:description" />
                </AuthorizationFilter>

                <div className="row" style={{marginTop: '15px'}}>

                  <div className={classNames('col-xs-12', 'col-md-6')}>

                    {(() => {
                      if (selectn('characters.entries.length', characters) > 0) {
                        return <Paper style={{padding: '25px', marginBottom: '20px'}} zDepth={2}>
                          <h3>Our Alphabet</h3>
                          {characters.entries.map((char, i) =>
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
                          )}
                        </Paper>;
                      }
                    })()}

                  </div>

                <div className={classNames('col-xs-12', 'col-md-6')}>
                  {(() => {
                    if (selectn('response.contextParameters.dialect.keyboards.length', computeDialect2) > 0) {
                      return <Paper style={{padding: '25px', marginBottom: '20px'}} zDepth={2}>
                        <h3>Our Keyboards</h3>
                        {(selectn('response.contextParameters.dialect.keyboards', computeDialect2) || []).map((keyboardLink, i) =>
                          <Link key={i} data={keyboardLink} showDescription={true} />
                        )}  
                      </Paper>;
                    }
                  })()}
                </div> 
              </div>

              </div>

              <div className={classNames('col-xs-12', 'col-md-4')}>

	          <Tabs> 
	              <Tab label="Recent Activity" id="recentActivity"> 	              
	              	<Tabs>
	              		<Tab label="Words" id="recentActivityWords">
	              			{(selectn('response', computeModifiedWords)) ?                
			                	<div>
				                	<p><strong>Most Recently Modified Words:</strong></p>
				                	<ul>
				        			{(selectn('response', computeModifiedWords)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "word")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                
		
			                {(selectn('response', computeCreatedWords)) ?                
			                	<div>
				                	<p><strong>Most Recently Created Words:</strong></p>
				                	<ul>
				        			{(selectn('response', computeCreatedWords)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "word")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                  
			                
			                {(selectn('response.entries', computeUserModifiedWords)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Modified Words:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserModifiedWords)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "word")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                   
		
			                {(selectn('response.entries', computeUserCreatedWords)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Created Words:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserCreatedWords)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "word")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress} 	              			              		
	              		</Tab>
	              		
	              		<Tab label="Phrases" id="recentActivityPhrases">
			                {(selectn('response', computeModifiedPhrases)) ?                
			                	<div>
				                	<p><strong>Most Recently Modified Phrases:</strong></p>
				                	<ul>
				        			{(selectn('response', computeModifiedPhrases)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "phrase")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                
		
			                {(selectn('response', computeCreatedPhrases)) ?                
			                	<div>
				                	<p><strong>Most Recently Created Phrases:</strong></p>
				                	<ul>
				        			{(selectn('response', computeCreatedPhrases)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "phrase")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                  
		
			                {(selectn('response.entries', computeUserModifiedPhrases)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Modified Phrases:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserModifiedPhrases)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "phrase")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                   
		
			                {(selectn('response.entries', computeUserCreatedPhrases)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Created Phrases:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserCreatedPhrases)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "phrase")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}  	              		           		
	              		</Tab>
	              		
	              		<Tab label="Songs" id="recentActivitySongs">
              				{(selectn('response', computeModifiedSongs)) ?                
			                	<div>
				                	<p><strong>Most Recently Modified Songs:</strong></p>
				                	<ul>
				        			{(selectn('response', computeModifiedSongs)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "song")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                
		
			                {(selectn('response', computeCreatedSongs)) ?                
			                	<div>
				                	<p><strong>Most Recently Created Songs:</strong></p>
				                	<ul>
				        			{(selectn('response', computeCreatedSongs)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "song")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}  
			                
			                {(selectn('response.entries', computeUserModifiedSongs)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Modified Songs:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserModifiedSongs)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "song")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                   
		
			                {(selectn('response.entries', computeUserCreatedSongs)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Created Songs:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserCreatedSongs)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "song")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress} 			                
			                
	              		</Tab>
	              		
	              		<Tab label="Stories" id="recentActivityStories">
	              			{(selectn('response', computeModifiedStories)) ?                
			                	<div>
				                	<p><strong>Most Recently Modified Stories:</strong></p>
				                	<ul>
				        			{(selectn('response', computeModifiedStories)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "story")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                
		
			                {(selectn('response', computeCreatedStories)) ?                
			                	<div>
				                	<p><strong>Most Recently Created Stories:</strong></p>
				                	<ul>
				        			{(selectn('response', computeCreatedStories)).entries.map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "story")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}
			                
			                {(selectn('response.entries', computeUserModifiedStories)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Modified Stories:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserModifiedStories)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "story")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:modified'])} by {document.properties['dc:lastContributor']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}                   
		
			                {(selectn('response.entries', computeUserCreatedStories)) ?                
			                   	<div>
				                	<p><strong>My Most Recently Created Stories:</strong></p>
				                	<ul>
				        			{(selectn('response.entries', computeUserCreatedStories)).map((document, i) => 
				        				<li key={document['uid']}><a href={this._formatLink(document['path'], "story")}>{document['title']}</a> <br />
					        				{this._formatDate(document.properties['dc:created'])} by {document.properties['dc:creator']}
				        				</li>
				        	    	)}
				        			</ul>
			        			</div>
			                : circularProgress}			                
			                
			           </Tab>	              		
	              	</Tabs>	                	                
	              </Tab> 
	              
	              <Tab label="Statistics" id="statistics"> 	              
	                  <Tabs>
	              		<Tab label="Words" id="statisticsWords">
	              			{(selectn('response', computeDialectStats)) ? 
		    		        	<StatsPanel data={selectn('response', computeDialectStats)} docType="words" headerText="Words" />
			                : circularProgress}	              		
	              		</Tab>              		
	              		
	              		<Tab label="Phrases" id="statisticsPhrases">
	          				{(selectn('response', computeDialectStats)) ? 
		    		            <StatsPanel data={selectn('response', computeDialectStats)} docType="phrases" headerText="Phrases" />
			                : circularProgress}		              		
	              		</Tab>
	              		
	              		<Tab label="Songs" id="statisticsSongs">
	          				{(selectn('response', computeDialectStats)) ? 
		    		            <StatsPanel data={selectn('response', computeDialectStats)} docType="songs" headerText="Songs" />
			                : circularProgress}		              		
	              		</Tab>
	              		
	              		<Tab label="Stories" id="statisticsStories">
	          				{(selectn('response', computeDialectStats)) ? 
	          					<StatsPanel data={selectn('response', computeDialectStats)} docType="stories" headerText="Stories" />  
			                : circularProgress}		              		
	              		</Tab>
	              	</Tabs>	
	              </Tab>	
              	</Tabs>		              
	              
                <div>


                  <h4>Contact Information</h4>

                  <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                    <EditableComponent computeEntity={computeDialect2} updateEntity={this.props.updateDialect2} property="fvdialect:contact_information" />
                  </AuthorizationFilter>

                </div>

              </div>

            </div>
        </PromiseWrapper>;
  }
}