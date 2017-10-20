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
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';
import PageStats from 'views/pages/explore/dialect/page-stats';
import SearchBar from 'views/pages/explore/dialect/search-bar';

import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FlatButton from 'material-ui/lib/flat-button';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import EditorInsertChart from 'material-ui/lib/svg-icons/editor/insert-chart';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';

import RecentActivityList from 'views/components/Dashboard/RecentActivityList';
import Link from 'views/components/Document/Link';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';
import AuthenticationFilter from 'views/components/Document/AuthenticationFilter';

const portalNavigationStyles = {textShadow: '0 0 2px rgba(0,0,0,0.5)', color: '#fff', fontSize: '18px', fontWeight: 'bold', marginRight: 0}

/**
* Learn portion of the dialect portal
* TODO: Reduce the amount of queries this page runs.
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
    publishDialectOnly: PropTypes.func.isRequired,
    fetchResultSet: PropTypes.func.isRequired,
    computeResultSet: PropTypes.object.isRequired,
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

    this.state = {
      showStats: false
    };

    ['_onNavigateRequest', '_publishChangesAction'].forEach( (method => this[method] = this[method].bind(this)) );
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

    // Get count for language assets
    newProps.fetchResultSet('count_stories', {'query': 'SELECT COUNT(ecm:uuid) FROM FVBook WHERE fvbook:type="story" AND ecm:path STARTSWITH "' + newProps.routeParams.dialect_path + '/Stories & Songs" AND ecm:currentLifeCycleState <> "deleted"', 'language': 'nxql', 'sortOrder': 'ASC'});

    newProps.fetchResultSet('count_songs', {'query': 'SELECT COUNT(ecm:uuid) FROM FVBook WHERE fvbook:type="song" AND ecm:path STARTSWITH "' + newProps.routeParams.dialect_path + '/Stories & Songs" AND ecm:currentLifeCycleState <> "deleted"', 'language': 'nxql', 'sortOrder': 'ASC'});

    newProps.fetchResultSet('count_words', {'query': 'SELECT COUNT(ecm:uuid) FROM FVWord WHERE ecm:path STARTSWITH "' + newProps.routeParams.dialect_path + '/Dictionary" AND ecm:currentLifeCycleState <> "deleted"', 'language': 'nxql', 'sortOrder': 'ASC'});

    newProps.fetchResultSet('count_phrases', {'query': 'SELECT COUNT(ecm:uuid) FROM FVPhrase WHERE ecm:path STARTSWITH "' + newProps.routeParams.dialect_path + '/Dictionary" AND ecm:currentLifeCycleState <> "deleted"'});

    newProps.fetchCharacters(newProps.routeParams.dialect_path + '/Alphabet', '&sortOrder=asc&sortBy=fvcharacter:alphabet_order');

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

  /**
  * Toggle published dialect
  */
  _publishChangesAction() {
      this.props.publishDialectOnly(this.props.routeParams.dialect_path, { target: this.props.routeParams.language_path.replace('Workspaces', 'sections')}, null, "Portal published successfully!");
  } 

  _onCharAudioTouchTap(charAudioId) {
	  document.getElementById(charAudioId).play();
  }   
  
  render() {

    // TODO: Find out why the results sometimes in field1 and sometimes in field2?
    const COUNT_FIELD1 = 'response.entries[0].COUNT(ecm:uuid)';
    const COUNT_FIELD2 = 'response.entries[1].COUNT(ecm:uuid)';

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    }, {
      'id': this.props.routeParams.dialect_path + '/Portal',
      'entity': this.props.computePortal
    }])

    let computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');
    
    const computeCharacters = ProviderHelpers.getEntry(this.props.computeCharacters, this.props.routeParams.dialect_path + '/Alphabet');    


    const computeModifiedWords = ProviderHelpers.getEntry(this.props.computeModifiedWords, this.props.routeParams.dialect_path);
    const computeCreatedWords = ProviderHelpers.getEntry(this.props.computeCreatedWords, this.props.routeParams.dialect_path);
    const computeModifiedPhrases = ProviderHelpers.getEntry(this.props.computeModifiedPhrases, this.props.routeParams.dialect_path);
    const computeCreatedPhrases = ProviderHelpers.getEntry(this.props.computeCreatedPhrases, this.props.routeParams.dialect_path);
    const computeModifiedStories = ProviderHelpers.getEntry(this.props.computeModifiedStories, this.props.routeParams.dialect_path);
    const computeCreatedStories = ProviderHelpers.getEntry(this.props.computeCreatedStories, this.props.routeParams.dialect_path);
    const computeModifiedSongs = ProviderHelpers.getEntry(this.props.computeModifiedSongs, this.props.routeParams.dialect_path);
    const computeCreatedSongs = ProviderHelpers.getEntry(this.props.computeCreatedSongs, this.props.routeParams.dialect_path);    
    //const computeUserModifiedWords = ProviderHelpers.getEntry(this.props.computeUserModifiedWords, this.props.routeParams.dialect_path);

    
    const computeSongsCount = ProviderHelpers.getEntry(this.props.computeResultSet, 'count_songs');  
    const computeStoriesCount = ProviderHelpers.getEntry(this.props.computeResultSet, 'count_stories');  
    const computeWordsCount = ProviderHelpers.getEntry(this.props.computeResultSet, 'count_words');  
    const computePhrasesCount = ProviderHelpers.getEntry(this.props.computeResultSet, 'count_phrases');  

    const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');
    const computePhrases = ProviderHelpers.getEntry(this.props.computePhrases, this.props.routeParams.dialect_path + '/Dictionary');
    const computeBooks = ProviderHelpers.getEntry(this.props.computeBooks, this.props.routeParams.dialect_path + '/Stories & Songs');

    const isSection = this.props.routeParams.area === 'sections';

    const { updatePortal, updateDialect2, computeLogin, computeDocument, computeUserModifiedWords, computeUserCreatedWords, computeUserModifiedPhrases, 
    	computeUserCreatedPhrases, computeUserModifiedStories, computeUserCreatedStories, computeUserModifiedSongs, computeUserCreatedSongs} = this.props;
    //let dialect = computeDialect2.response;

    let wordCount = (selectn(COUNT_FIELD1, computeWordsCount) == undefined) ? '...' : selectn(COUNT_FIELD1, computeWordsCount) + selectn(COUNT_FIELD2, computeWordsCount);
    let phraseCount = (selectn(COUNT_FIELD1, computePhrasesCount) == undefined) ? '...' : selectn(COUNT_FIELD1, computePhrasesCount) + selectn(COUNT_FIELD2, computePhrasesCount);
    let songCount = (selectn(COUNT_FIELD1, computeSongsCount) == undefined) ? '...' : selectn(COUNT_FIELD1, computeSongsCount) + selectn(COUNT_FIELD2, computeSongsCount);
    let storyCount = (selectn(COUNT_FIELD1, computeStoriesCount) == undefined) ? '...' : selectn(COUNT_FIELD1, computeStoriesCount) + selectn(COUNT_FIELD2, computeStoriesCount);

    /**
     * Suppress Editing for Language Recorders with Approvers
     */
    let roles = selectn('response.contextParameters.dialect.roles', computeDialect2);

    if (roles && roles.indexOf('Manage') === -1 ) {
      computeDialect2 = Object.assign(
        computeDialect2, {
          response: Object.assign(computeDialect2.response, {
            contextParameters: Object.assign(computeDialect2.response.contextParameters, { permissions: ['Read'] })
          })
        });
    }

    return <PromiseWrapper computeEntities={computeEntities}>

            {(() => {
              if (this.props.routeParams.area == 'Workspaces') {
                
                if (selectn('response', computeDialect2))
                  return <PageToolbar
                            label="Language Portal"
                            computeEntity={computeDialect2}
                            actions={['publish']}
                            publishChangesAction={this._publishChangesAction}
                            {...this.props} />;
              }
            })()}

            <Header backgroundImage={selectn('response.contextParameters.portal.fv-portal:background_top_image.path', computePortal)}>
              {(() => {
                if (selectn("isConnected", computeLogin) || selectn('response.properties.fv-portal:greeting', computePortal) || selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)) {
                  return <h2 className="dialect-greeting-container">
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper className="fv-portal-greeting" isSection={isSection} computeEntity={computePortal} updateEntity={updatePortal} property="fv-portal:greeting" entity={selectn('response', computePortal)} />
                    </AuthorizationFilter>

                    {(selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)) ? 
                     <audio id="portalFeaturedAudio" src={ConfGlobal.baseURL + selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal).path} controls />
                    : ''}
                  </h2>;
                }
              })()}

              <AuthenticationFilter login={this.props.computeLogin} hideFromSections={true} routeParams={this.props.routeParams}>
                <div className={classNames('hidden-xs', {'invisible': !this.state.showStats})} style={{width: '50%', "background":"rgba(255, 255, 255, 0.7)","margin":"10px 25px","borderRadius":"10px","padding":"10px", position: 'absolute', top: '15px', right: '0'}}>
                  <PageStats dialectPath={this.props.routeParams.dialect_path} />
                </div>
              </AuthenticationFilter>

              <Toolbar className="dialect-navigation">

                <ToolbarGroup firstChild={true} float="left">
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, 'words')} label={"Words (" + wordCount + ")"} />
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, 'phrases')} label={"Phrases (" + phraseCount + ")"} />
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, 'songs')} label={"Songs (" + songCount + ")"} />
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, 'stories')} label={"Stories (" + storyCount + ")"} />
                </ToolbarGroup>

                <AuthenticationFilter login={this.props.computeLogin} hideFromSections={true} routeParams={this.props.routeParams}>
                  <ToolbarGroup className="hidden-xs" firstChild={false} float="right">
                    <FlatButton icon={<EditorInsertChart />} style={portalNavigationStyles} onTouchTap={(e) => {this.setState({showStats: !this.state.showStats})}} label={"Language Statistics"} />
                  </ToolbarGroup>
                </AuthenticationFilter>

              </Toolbar>

            </Header>

            <div className="row">
                      
              <div className={classNames('col-xs-12', 'col-md-8')}>
                <h1>About our Language</h1>

                <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                  <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="dc:description" entity={selectn('response', computeDialect2)} />
                </AuthorizationFilter>

              </div>

              <div className={classNames('col-xs-12', 'col-md-4')}>

                <div className="row">

                  <div className={classNames('col-xs-12')}>
                    {(() => {

                      const characters = selectn('response.entries', computeCharacters);

                      if (characters && characters.length > 0) {
                          return <div style={{marginBottom: '20px'}}>
                          <h3>Our Alphabet <a href="./learn/alphabet/print" target="_blank"><i className="material-icons">print</i></a></h3>
                          {selectn('response.entries', computeCharacters).map((char, i) =>
                            <Paper key={char.uid} style={{textAlign: 'center', margin: '5px', padding: '5px 10px', display: 'inline-block'}}>
                              <FlatButton onTouchTap={this._onNavigateRequest.bind(this, 'alphabet/' + char.path.split('/')[char.path.split('/').length-1])} label={char.title} style={{minWidth: 'inherit'}} />
                              {(char.contextParameters.character.related_audio[0]) ? 
                                <span>
                                <a className="glyphicon glyphicon-volume-up" onTouchTap={this._onCharAudioTouchTap.bind(this, 'charAudio' + char.uid)} />
                                  <audio id={'charAudio' + char.uid}  src={ConfGlobal.baseURL + char.contextParameters.character.related_audio[0].path} />
                                </span>
                              : ''}           
                            </Paper>
                          )}
                          </div>;
                        }

                    })()}
                  </div>

                  <div className={classNames('col-xs-12')}>
                    {(() => {
                      if (selectn('response.contextParameters.dialect.language_resources.length', computeDialect2) > 0 || !isSection) {
                        return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                                <div>
                                  <h3>Language Resources</h3>
                                  <EditableComponentHelper
                                    isSection={isSection}
                                    computeEntity={computeDialect2}
                                    updateEntity={updateDialect2}
                                    showPreview={true}
                                    previewType="FVLink"
                                    property="fvdialect:language_resources"
                                    sectionProperty="contextParameters.dialect.language_resources"
                                    entity={selectn('response', computeDialect2)} />
                                </div>
                              </AuthorizationFilter>;
                      }
                    })()}
                  </div>

                  <div className={classNames('col-xs-12')}>
                    {(() => {
                      if (selectn('response.contextParameters.dialect.keyboards.length', computeDialect2) > 0 || !isSection) {
                        return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                                <div>
                                  <h3>Our Keyboards</h3>
                                  <EditableComponentHelper
                                    isSection={isSection}
                                    computeEntity={computeDialect2}
                                    updateEntity={updateDialect2}
                                    showPreview={true}
                                    previewType="FVLink"
                                    property="fvdialect:keyboards"
                                    sectionProperty="contextParameters.dialect.keyboards"
                                    entity={selectn('response', computeDialect2)} />
                                </div>
                              </AuthorizationFilter>;
                      }
                    })()}
                  </div> 

                  <div className={classNames('col-xs-12')}>
                      {(() => {
                        if (selectn('response.properties.fvdialect:contact_information', computeDialect2) || !isSection) {
                          return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                                  <div>
                                    <h3>Contact Information</h3>
                                    <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="fvdialect:contact_information" entity={selectn('response', computeDialect2)} />
                                  </div>
                                </AuthorizationFilter>;
                        }
                      })()}

                  </div>

                </div>

              </div>

            </div>

            <div className="row">

                <div className={classNames('col-xs-12')}>
                
                  <h3>Recent Activity</h3>

                  <Tabs>
                    <Tab label="Words" id="recentActivityWords">
                        <div className="row" style={{paddingTop: '20px'}}>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeModifiedWords)} title="Recently Modified" docType="word" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeCreatedWords)} title="Recently Created" docType="word" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserModifiedWords)} title="My Recently Modified" docType="word" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserCreatedWords)} title="My Recently Created" docType="word" />	
                          </div>
                        </div>      
                    </Tab>
                    
                    <Tab label="Phrases" id="recentActivityPhrases">	      
                        <div className="row" style={{paddingTop: '20px'}}>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeModifiedPhrases)} title="Recently Modified" docType="phrase" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeCreatedPhrases)} title="Recently Created" docType="phrase" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserModifiedPhrases)} title="My Recently Modified" docType="phrase" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserCreatedPhrases)} title="My Recently Created" docType="phrase" />	
                          </div>
                        </div>                 			              		           		
                    </Tab>
                    
                    <Tab label="Songs" id="recentActivitySongs">
                        <div className="row" style={{paddingTop: '20px'}}>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeModifiedSongs)} title="Recently Modified" docType="song" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeCreatedSongs)} title="Recently Created" docType="song" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserModifiedSongs)} title="My Recently Modified" docType="song" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserCreatedSongs)} title="My Recently Created" docType="song" />	
                          </div>
                        </div> 		                			                
                    </Tab>
                    
                    <Tab label="Stories" id="recentActivityStories">
                        <div className="row" style={{paddingTop: '20px'}}>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeModifiedStories)} title="Recently Modified" docType="stories" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeCreatedStories)} title="Recently Created" docType="stories" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserModifiedStories)} title="My Recently Modified" docType="stories" />
                          </div>
                          <div className={classNames('col-xs-12', 'col-md-3')}>
                            <RecentActivityList data={selectn('response', computeUserCreatedStories)} title="My Recently Created" docType="stories" />	
                          </div>
                        </div> 	               			                
                    </Tab>	              		
                  </Tabs>	                	                

                </div>

            </div>


        </PromiseWrapper>;
  }
}