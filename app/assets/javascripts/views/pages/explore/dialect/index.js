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

// Views
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Paper from 'material-ui/lib/paper';
import {List, ListItem} from 'material-ui/lib/lists';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

import EditableComponent from 'views/components/Editor/EditableComponent';
import Link from 'views/components/Document/Link';

class EditableComponentHelper extends Component {
  render() {
    if (this.props.isSection) {
      return <div dangerouslySetInnerHTML={{__html: this.props.entity.get(this.props.property)}}></div>;
    }

    return <EditableComponent {...this.props} />;
  }
}

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
    fetchDialect: PropTypes.func.isRequired,
    computeDialect: PropTypes.object.isRequired,
    updateDialect: PropTypes.func.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
    updatePortal: PropTypes.func.isRequired,
    fetchDirectory: PropTypes.func.isRequired,
    computeDirectory: PropTypes.object.isRequired,
    
    publishDocument: PropTypes.func.isRequired,
    computePublish: PropTypes.object.isRequired    
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_publishPortal', '_handleDialectSearchSubmit'].forEach( (method => this[method] = this[method].bind(this)) );

    this.state = { UISnackBarOpen: false };
  }

  fetchData(newProps) {
    let path = newProps.splitWindowPath.slice(1).join('/');

    newProps.fetchDialect('/' + path);
    newProps.fetchPortal('/' + path + '/Portal');
    newProps.fetchDirectory('fv_countries');
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

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  //_onRequestClose() {
  //  this.props.dismissError();
  //}

  // Publish the portal
  _publishPortal() {
	  let workspaceDialectPath = "/" + this.props.splitWindowPath.slice(1).join('/');
	  workspaceDialectPath = decodeURI(workspaceDialectPath);
	  console.log("workspaceDialectPath: " + workspaceDialectPath);

	  let workspaceDocPath = workspaceDialectPath + "/Portal";
	  console.log("workspaceDocPath: " + workspaceDocPath);
	  
	  let sectionTargetPath = workspaceDialectPath.replace('Workspaces', 'sections');
	  console.log("sectionTargetPath: " + sectionTargetPath);
	  
	  this.props.publishDocument(workspaceDocPath, sectionTargetPath);
  }  

  _handleDialectSearchSubmit() {
	  let queryParam = this.refs.dialectSearchField.getValue();	  
	  console.log(queryParam);	  
      // Clear out the input field
      //this.refs.dialectSearchField.setValue("");
	  this.props.replaceWindowPath(this.props.windowPath + '/search/' + queryParam); 
  }   
  
  render() {

    const { computeDialect, computePortal, splitWindowPath, computePublish } = this.props;
    const isSection = splitWindowPath.includes('sections');

    let dialect = computeDialect.response;
    let portal = computePortal.response;

    //debug = <pre>{JSON.stringify(portal, null, 4)}</pre>;
console.log(computeDialect);
console.log(computePortal);
console.log(portal);
    if (computeDialect.isFetching || computePortal.isFetching || portal.contextParameters == undefined) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }

    if (computePublish.isFetching) {
        return <CircularProgress mode="indeterminate" size={5} />;
    }    
    
    let portalContextParams = portal.contextParameters.portal;
    
    let portalBackgroundImagePath = "";
    if(portalContextParams['fv-portal:background_top_image']) {
    	portalBackgroundImagePath = ConfGlobal.baseURL + portalContextParams['fv-portal:background_top_image'].path;
    }
    
    let portalBackgroundStyles = {
    	position: 'relative',
    	minHeight: 155,
    	backgroundColor: 'transparent',
    	backgroundImage: 'url(' + portalBackgroundImagePath + ')',
    	backgroundPosition: '0 0',
    }    

    return <div>

            <h1>{dialect.get('dc:title')} Community Portal</h1>
                     
            <div style={portalBackgroundStyles}>

            	{(portalContextParams['fv-portal:logo']) ? 
                	<img style={{float: 'left'}} src={ConfGlobal.baseURL + portalContextParams['fv-portal:logo'].path} />
                  : ''
              }
            
              <h2 style={{float: 'left', backgroundColor: 'rgba(255,255,255, 0.3)'}}>
                <EditableComponentHelper isSection={isSection} computeEntity={computePortal} updateEntity={this.props.updatePortal} property="fv-portal:greeting" entity={portal} />
              </h2>

            </div>
            
            <div>
            	{(portalContextParams['fv-portal:featured_audio']) ? 
		  			   <audio id="portalFeaturedAudio" src={ConfGlobal.baseURL + portalContextParams['fv-portal:featured_audio'].path} controls />
  			      : ''}
            </div>
            
            <Toolbar>

              <ToolbarGroup firstChild={true} float="left">
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/learn')} label="Learn" /> 
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/play')} label="Play" /> 
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/gallery/Community Slideshow')} label="Community Slideshow" /> 
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/gallery/Art Gallery')} label="Art Gallery" />
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/reports')} label="Reports" />               
                
                {/*<RaisedButton onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath + '/search')} label="Search Within Dialect" /> */}
                <TextField ref="dialectSearchField" hintText="Search dialect..." onEnterKeyDown={this._handleDialectSearchSubmit} />

              </ToolbarGroup>

              <ToolbarGroup firstChild={true} float="right">
              	<RaisedButton label="Publish" style={{marginRight: '5px', marginLeft: '0'}} secondary={true} onTouchTap={this._publishPortal} />
                <RaisedButton label="Inline Edit" style={{marginRight: '5px', marginLeft: '0'}} primary={true} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath.replace('sections', 'Workspaces'))} />
                <RaisedButton label="Form Edit" style={{marginRight: '5px', marginLeft: '0'}} primary={true} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath.replace('sections', 'Workspaces') + '/edit')} />
                <RaisedButton label="Public Version" style={{marginRight: '5px', marginLeft: '0'}} primary={true} onTouchTap={this._onNavigateRequest.bind(this, this.props.windowPath.replace('Workspaces', 'sections'))} />

                <ToolbarSeparator />

                <IconMenu iconButtonElement={
                  <IconButton tooltip="More Options" touch={true}>
                    <NavigationExpandMoreIcon />
                  </IconButton>
                }>
                  <MenuItem primaryText="Contact (TBD)" />
                </IconMenu>
              </ToolbarGroup>

            </Toolbar>

            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-3', 'col-md-2')}>
                <Paper style={{padding: '25px'}} zDepth={2}>

                  <strong><span>First Words</span></strong><br />

                  {portalContextParams['fv-portal:featured_words'].map((word, i) =>                     
                  	<div key={i}>
                  		<strong><a href={'/explore' + word.path}>{word['dc:title']}</a></strong>
                  		{(word['fv:related_audio'][0]) ? 
                  				<audio src={ConfGlobal.baseURL + word['fv:related_audio'][0].path} controls />
      			    	    : ''}
                  		<br />
                  		<span>{word['fv-word:part_of_speech']}</span><br />
                  		{word['fv:literal_translation'].map((wordTranslation, j) =>
                  			<span key={j}>
                  				{wordTranslation.language}<br />
                  				{wordTranslation.translation}
                  			</span>
                  		)}
                  		<br /><br />
                  	</div>
                  )}   
                  
                </Paper>

              </div>

              <div className={classNames('col-xs-6', 'col-md-8')}>
                <div>
                  <h1>Portal</h1>
                  <EditableComponentHelper isSection={isSection} computeEntity={computePortal} updateEntity={this.props.updatePortal} property="fv-portal:about" entity={portal} />
                </div>
              </div>

              <div className={classNames('col-xs-3', 'col-md-2')}>

                <Paper style={{padding: '15px'}} zDepth={2}>

                  <div className="subheader">Status of our Langauge</div>

                  <div>
                    <strong>Name of Archive</strong><br/>
                    <EditableComponentHelper isSection={isSection} computeEntity={computeDialect} updateEntity={this.props.updateDialect} property="dc:title" entity={dialect} />
                  </div>

                  <hr/>

                  <div>
                    <strong>Country</strong><br/>
                    <EditableComponentHelper isSection={isSection} computeEntity={computeDialect} updateEntity={this.props.updateDialect} property="fvdialect:country" entity={dialect} />
                  </div>

                  <hr/>

                  <p><strong>Region</strong><br/>{dialect.get('fvdialect:region')}</p>

                  <hr/>

                  <p><strong># of Words Archived</strong><br/>{dialect.get('fvdialect:aaa')}</p>

                  <hr/>

                  <p><strong># of Phrases Archived</strong><br/>{dialect.get('fvdialect:aaaa')}</p>
                  
                  <strong>Related Links</strong>
                  {portalContextParams['fv-portal:related_links'].map((link, i) =>
                  	<Link key={i} data={link} showDescription={false} />
                  )}                      	
                  
                </Paper>

              </div>
          </div>
        </div>;
  }
}

/*
          <Snackbar
            open={(computeDialect.isError && !computeDialect.errorDismissed) || false}
            message={computeDialect.error || ""}
            action="Close"
            onActionTouchTap={this._onRequestClose}
            onRequestClose={this._onRequestClose}
            autoHideDuration={3000}
          />*/