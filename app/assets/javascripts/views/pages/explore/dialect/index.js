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
import SearchBar from 'views/pages/explore/dialect/search-bar';

// Views
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import RaisedButton from 'material-ui/lib/raised-button';
import Toggle from 'material-ui/lib/toggle';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import Preview from 'views/components/Editor/Preview';

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';
import Link from 'views/components/Document/Link';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import Kids from './kids';

/**
* Dialect portal page showing all the various components of this dialect.
*/
@provide
export default class ExploreDialect extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    fetchDialect2: PropTypes.func.isRequired,
    computeDialect2: PropTypes.object.isRequired,
    updateDialect2: PropTypes.func.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    publishPortal: PropTypes.func.isRequired,
    unpublishPortal: PropTypes.func.isRequired,
    publishDialect: PropTypes.func.isRequired,
    publishDialectOnly: PropTypes.func.isRequired,
    unpublishDialect: PropTypes.func.isRequired,
    enableDialect: PropTypes.func.isRequired,
    disableDialect: PropTypes.func.isRequired,
    computeDialectUnpublish: PropTypes.object.isRequired,
    computePublish: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    fetchGalleries: PropTypes.func.isRequired,
    computeGalleries: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleDialectSearchSubmit', '_onSwitchAreaRequest', '_enableToggleAction', '_publishToggleAction', '_publishChangesAction', '_handleGalleryDropDownChange'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal', 'Fetching community portal.', null, 'Problem fetching community portal it may be unpublished or offline.');
    newProps.fetchGalleries(newProps.routeParams.dialect_path + '/Portal');
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props);
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    //console.log(JSON.stringify(nextProps, null, '\t'));

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps);
    }

    else if (nextProps.computeLogin.success !== this.props.computeLogin.success) {
      this.fetchData(nextProps);
    }
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  _onSwitchAreaRequest(e, index, value) {
    this._onNavigateRequest(this.props.windowPath.replace((value == 'sections') ? 'Workspaces' : 'sections', value));
  }

  /**
  * Toggle dialect (enabled/disabled)
  */
  _enableToggleAction(toggled) {
    if (toggled) {
      this.props.enableDialect(this.props.routeParams.dialect_path, null, null, "Dialect enabled!");
    } else {
      this.props.disableDialect(this.props.routeParams.dialect_path, null, null, "Dialect disabled!");
    }
  }

  /**
  * Toggle published dialect
  */
  _publishChangesAction() {
      this.props.publishPortal(this.props.routeParams.dialect_path + '/Portal', null, null, "Portal published successfully!");
      this.props.publishDialectOnly(this.props.routeParams.dialect_path, { target: this.props.routeParams.language_path.replace('Workspaces', 'sections')}, null, null);
  } 

  /**
  * Toggle published dialect
  */
  _publishToggleAction(toggled) {
    if (toggled) {
      this.props.publishDialect(this.props.routeParams.dialect_path, null, null, "Dialect published successfully!");
    } else {
      this.props.unpublishDialect(this.props.routeParams.dialect_path, null, null, "Dialect unpublished successfully!");
    }
  }

  _handleDialectSearchSubmit() {
	  let queryParam = this.refs.dialectSearchField.getValue();	    
      // Clear out the input field
      //this.refs.dialectSearchField.setValue("");
	  this.props.replaceWindowPath(this.props.windowPath + '/search/' + queryParam); 
  }   
  
  _handleGalleryDropDownChange(event, key, payload) {
	  //console.log(payload);
	  if(payload !== "dropDownLabel") {
		  this.props.pushWindowPath(payload); 		  
	  }
  }

  
  render() {

  	const { computeLogin, updatePortal, updateDialect2} = this.props;

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path,
      'entity': this.props.computeDialect2
    },{
      'id': this.props.routeParams.dialect_path + '/Portal',
      'entity': this.props.computePortal
    }])

    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');
    const computeGalleries = ProviderHelpers.getEntry(this.props.computeGalleries, this.props.routeParams.dialect_path + '/Portal');

    const isSection = this.props.routeParams.area === 'sections';
    const isKidsTheme = this.props.routeParams.theme === 'kids';

    // Render kids view
    if (isKidsTheme && computePortal) {
      return <PromiseWrapper computeEntities={computeEntities}>
        <Kids {...this.props} portal={computePortal} />
      </PromiseWrapper>;
    }

    return <PromiseWrapper computeEntities={computeEntities}>

            <PageHeader title="Community Portal" portalLogo={selectn('response.contextParameters.portal.fv-portal:logo.path', computePortal)} dialectName={selectn('response.title', computeDialect2)} />

            {(() => {
              if (this.props.routeParams.area == 'Workspaces') {
                
                if (selectn('response', computeDialect2))
                  return <PageToolbar
                            label="Portal"
                            handleNavigateRequest={this._onNavigateRequest}
                            computeEntity={computeDialect2}
                            actions={['edit', 'publish-toggle', 'enable-toggle', 'publish', 'more-options']}
                            publishToggleAction={this._publishToggleAction}
                            publishChangesAction={this._publishChangesAction}
                            enableToggleAction={this._enableToggleAction}
                            {...this.props} />;
              }
            })()}

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

              <div className="pull-right" style={{"width":"200px","height":"175px","background":"rgba(255, 255, 255, 0.7)","margin":"10px 25px","borderRadius":"10px","padding":"10px"}}>
                <div>
                  <strong>Name of Archive</strong>: 
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="dc:title" entity={selectn('response', computeDialect2)} />
                    </AuthorizationFilter>
                  </div>

                  <hr style={{margin: "5px 0"}} />

                  <div>
                    <strong>Country</strong><br/>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="fvdialect:country" entity={selectn('response', computeDialect2)} />
                    </AuthorizationFilter>
                  </div>

                  <hr style={{margin: "5px 0"}} />

                  <div>
                    <strong>Region</strong><br/>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="fvdialect:region" entity={selectn('response', computeDialect2)} />
                    </AuthorizationFilter>
                  </div>

              </div>
            </Header>

            <Toolbar>

              <ToolbarGroup firstChild={true} float="left">
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn')} label="Learn Our Language" /> <ToolbarSeparator />
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/play')} label="Play a Game" /> <ToolbarSeparator />
                <FlatButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/gallery')} label="Photo Gallery" /> <ToolbarSeparator />
              </ToolbarGroup>

              <ToolbarGroup float="right">
              	<SearchBar />
              </ToolbarGroup>

            </Toolbar>

            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-9', 'col-md-9')}>
                <div>
                  <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                    <EditableComponentHelper className="fv-portal-about" isSection={isSection} computeEntity={computePortal} updateEntity={updatePortal} property="fv-portal:about" entity={selectn('response', computePortal)} />
                  </AuthorizationFilter>
                </div>
              </div>

              <div className={classNames('col-xs-3', 'col-md-3')}>

                {(() => {

                  const featuredWords = selectn('response.contextParameters.portal.fv-portal:featured_words', computePortal);

                  if (featuredWords && featuredWords.length > 0) {

                      return <div style={{padding: '25px'}}>

                            <ListUI subheader="First Words" zDepth={2}>

                              {(featuredWords || []).map(function (word, i) {
                              
                                let pathArray = selectn('path', word).split('/');
                                let name = pathArray[pathArray.length-1];

                                return <ListItem onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn/words/' + name)} key={i} style={{backgroundColor: (i % 2) ? '#f7f7f7' : '#fff'}}>
                                  <Preview id={word.uid} expandedValue={{contextParameters: {word: {related_audio: [selectn('fv:related_audio[0]', word)]}}, properties: word}} type="FVWord" />
                                </ListItem>;
                                }.bind(this)
                              )} 

                             </ListUI>
                            
                          </div>;
                    }

                  })()}

                  {(() => {

                    const relatedLinks = selectn('response.contextParameters.portal.fv-portal:related_links', computePortal);

                    if (relatedLinks && relatedLinks.length > 0) {

                        return <Paper style={{padding: '25px', marginBottom: '20px'}} zDepth={2}>

                              <strong><span>Related Links</span></strong><br />

                              {(relatedLinks || []).map((link, i) =>
                                <Link key={i} data={link} showDescription={false} />
                              )} 
                              
                            </Paper>;
                      }

                  })()}

              </div>

          </div>
        </PromiseWrapper>;
  }
};