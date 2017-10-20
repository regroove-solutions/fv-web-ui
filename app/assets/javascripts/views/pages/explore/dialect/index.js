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
import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

// Views
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';

import Toggle from 'material-ui/lib/toggle';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import Preview from 'views/components/Editor/Preview';

import GridView from 'views/pages/explore/dialect/learn/base/grid-view';

const defaultStyle = {width: '100%', overflowY: 'auto', marginBottom: 24};

import EditableComponent, {EditableComponentHelper} from 'views/components/Editor/EditableComponent';

import Link from 'views/components/Document/Link';
import TextHeader from 'views/components/Document/Typography/text-header';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import Kids from './kids';

const portalNavigationStyles = {textShadow: '0 0 2px rgba(0,0,0,0.5)', color: '#fff', fontSize: '18px', fontWeight: 'bold', marginRight: 0}

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
    routeParams: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      showArchiveInfoMobile: false
    };

    // Bind methods to 'this'
    ['_onNavigateRequest', '_handleDialectSearchSubmit', '_onSwitchAreaRequest', '_enableToggleAction', '_publishToggleAction', '_publishChangesAction', '_handleGalleryDropDownChange', '_handleSelectionChange'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path);
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal', 'Fetching community portal.', null, 'Problem fetching community portal it may be unpublished or offline.');
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

  _handleSelectionChange(itemId, item) {
    this.props.pushWindowPath('/' + this.props.routeParams.theme + selectn('properties.path', item).replace('Dictionary', 'learn/words'));
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

    let computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);
    const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');

    const isSection = this.props.routeParams.area === 'sections';
    const isKidsTheme = this.props.routeParams.theme === 'kids';

    // Render kids view
    if (isKidsTheme && computePortal) {
      return <PromiseWrapper computeEntities={computeEntities}>
        <Kids {...this.props} portal={computePortal} />
      </PromiseWrapper>;
    }

    let featuredWords = selectn('response.contextParameters.portal.fv-portal:featured_words', computePortal) || [];

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
                
                if (selectn('response', computeDialect2)) {
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
              }
            })()}

            <Header backgroundImage={selectn('response.contextParameters.portal.fv-portal:background_top_image.path', computePortal)}>

              <div style={{position: 'absolute', bottom: '80px', right: 0, width: '442px'}}>

			        {(() => {
                if (selectn("isConnected", computeLogin) || selectn('response.properties.fv-portal:greeting', computePortal) || selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)) {
                  return <h1 className={classNames('display', 'dialect-greeting-container')}>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper className="fv-portal-greeting" isSection={isSection} computeEntity={computePortal} updateEntity={updatePortal} property="fv-portal:greeting" entity={selectn('response', computePortal)} />
                    </AuthorizationFilter>

                    {(selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal)) ? 
                     <audio id="portalFeaturedAudio" src={ConfGlobal.baseURL + selectn('response.contextParameters.portal.fv-portal:featured_audio', computePortal).path} controls />
                    : ''}
                  </h1>;
                }
              })()}

              <div className={classNames('dialect-info-banner')}>

                <div className={classNames('dib-header', 'visible-xs')}>
                  <FlatButton label={(this.state.showArchiveInfoMobile) ? 'Info' : 'Info'} labelPosition="before" onTouchTap={(e) => {this.setState({showArchiveInfoMobile: !this.state.showArchiveInfoMobile}); e.preventDefault(); }} icon={<FontIcon className="material-icons">{(this.state.showArchiveInfoMobile) ? 'info_outline' : 'info'}</FontIcon>} style={{float: 'right', lineHeight: 1}} />
                </div>

                <div className={classNames('dib-body', {'hidden-xs': !this.state.showArchiveInfoMobile})} style={{zIndex: (this.state.showArchiveInfoMobile) ? 99 : 0}}>

                  <div className="dib-body-row">
                    <strong>Name of Archive: </strong>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="dc:title" entity={selectn('response', computeDialect2)} />
                    </AuthorizationFilter>
                  </div>

                  <div className="dib-body-row">
                    <strong>Country: </strong>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="fvdialect:country" entity={selectn('response', computeDialect2)} />
                    </AuthorizationFilter>
                  </div>

                  <div className="dib-body-row">
                    <strong>Region: </strong>
                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                      <EditableComponentHelper isSection={isSection} computeEntity={computeDialect2} updateEntity={updateDialect2} property="fvdialect:region" entity={selectn('response', computeDialect2)} />
                    </AuthorizationFilter>
                  </div>

                </div>

                </div>

              </div>

              <Toolbar className="dialect-navigation">

                <ToolbarGroup firstChild={true}>
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn')} label="Learn Our Language" /> 
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/play')} label="Play a Game" /> 
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/gallery')} label="Photo Gallery" /> 
                  <FlatButton style={portalNavigationStyles} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath.replace('explore', 'kids'))} label="Kids Portal" /> 
                </ToolbarGroup>

              </Toolbar>

            </Header>

            <div className={classNames('row', 'dialect-body-container')} style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-12', 'col-md-7')}>
                <div>
                  <TextHeader title="ABOUT US" tag="h2" properties={this.props.properties} />
                  <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                    <EditableComponentHelper className="fv-portal-about" isSection={isSection} computeEntity={computePortal} updateEntity={updatePortal} property="fv-portal:about" entity={selectn('response', computePortal)} />
                  </AuthorizationFilter>
                </div>

                <div>
                    {(() => {
                      if (selectn('response.properties.fv-portal:news', computePortal) || !isSection) {
                        return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeDialect2)}} renderPartial={true}>
                                <div>
                                  <h3>News</h3>
                                  <EditableComponentHelper isSection={isSection} computeEntity={computePortal} updateEntity={updatePortal} property="fv-portal:news" entity={selectn('response', computePortal)} />
                                </div>
                              </AuthorizationFilter>;
                      }
                    })()}

                </div>

              </div>

              <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-1')}>

                  {(featuredWords.length > 0) ? <TextHeader tag="h2" title="FIRST WORDS" properties={this.props.properties} /> : ''}

                  <GridView
                    action={this._handleSelectionChange}
                    cols={3}
                    cellHeight={194}
                    type="FVWord"
                    className="grid-view-first-words"
                    metadata={selectn('response', computeDialect2)}
                    items={featuredWords.map(function(word){
                      return {contextParameters: {
                        word: {
                          related_pictures: [selectn('fv:related_pictures[0]', word)],
                          related_audio: [selectn('fv:related_audio[0]', word)]
                        }}, properties: word};
                    })} />


                  <div>
                    {(() => {
                      if (selectn('response.contextParameters.portal.fv-portal:related_links.length', computePortal) > 0 || !isSection) {
                        return <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computePortal)}} renderPartial={true}>
                                <div>
                                  <TextHeader tag="h2" title="RELATED LINKS" properties={this.props.properties} />
                                  <EditableComponentHelper
                                    isSection={isSection}
                                    computeEntity={computePortal}
                                    updateEntity={updatePortal}
                                    context={computeDialect2}
                                    showPreview={true}
                                    previewType="FVLink"
                                    property="fv-portal:related_links"
                                    sectionProperty="contextParameters.portal.fv-portal:related_links"
                                    entity={selectn('response', computePortal)} />
                                </div>
                              </AuthorizationFilter>;
                      }
                    })()}
                  </div>

              </div>

          </div>
        </PromiseWrapper>;
  }
};