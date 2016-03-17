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

// Views
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import RaisedButton from 'material-ui/lib/raised-button';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import Paper from 'material-ui/lib/paper';
import {List, ListItem} from 'material-ui/lib/lists';

import Snackbar from 'material-ui/lib/snackbar';

import EditableComponent from 'views/components/Editor/Components/EditableComponent';

/**
* Dialect portal page showing all the various components of this dialect.
*/
@provide
export default class ExploreDialect extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    navigateTo: PropTypes.func.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    family: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    dialect: PropTypes.string.isRequired,
    fetchDialectAndPortal: PropTypes.func.isRequired,
    computeDialectAndPortal: PropTypes.object.isRequired,
    computeDialect: PropTypes.object.isRequired,
    computePortal: PropTypes.object.isRequired,
    saveField: PropTypes.bool.isRequired,
    dismissError: PropTypes.func.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);
    props.fetchDialectAndPortal(props.properties.domain + '/Workspaces/Data/' + props.family + '/' + props.language + '/' + props.dialect);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onRequestClose'].forEach( (method => this[method] = this[method].bind(this)) );

    this.state = { UISnackBarOpen: false };
  }

  _onNavigateRequest(path) {
    const destination = this.props.navigateTo(path);
    const newPathArray = this.props.splitWindowPath.slice();

    newPathArray.push(destination.path);

    this.props.pushWindowPath('/' + newPathArray.join('/'));
  }

  _onRequestClose() {
    this.props.dismissError();
  }

  render() {

    let debug = "";

    const { computeDialectAndPortal, computeDialect, computePortal, computeDocument } = this.props;

    let dialect = computeDialect.response;
    let portal = computePortal.response;

    // debug = <pre>{JSON.stringify(portal, null, 4)}</pre>;

    let portalBackgroundStyles = {
      position: 'relative',
      minHeight: 155,
      backgroundColor: 'transparent',
      backgroundImage: 'url(' + (portal.get('fv-portal:background_top_image') || 'http://lorempixel.com/1340/155/abstract/1/') + ')',
      backgroundPosition: '0 0',
    }

    let featuredWord = portal.get('fv-portal:featured_words') || [];
    let relatedLinks = dialect.get('fvdialect:related_links') || [];

    return <div>

            <h1>{dialect.get('dc:title')} Community Portal</h1>

            <div style={portalBackgroundStyles}>

              <h2 style={{position: 'absolute', bottom: 0, backgroundColor: 'rgba(255,255,255, 0.3)'}}>
                <EditableComponent property="fv-portal:greeting" /><br/>
                {portal.get('fv-portal:featured_audio')}
              </h2>

            </div>

            <Toolbar>

              <ToolbarGroup firstChild={true} float="left">
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'learn')} label="Learn" /> 
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'play')} label="Play" /> 
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'community-slideshow')} label="Community Slideshow" /> 
                <RaisedButton onTouchTap={this._onNavigateRequest.bind(this, 'art-gallery')} label="Art Gallery" /> 
              </ToolbarGroup>

              <ToolbarGroup firstChild={true} float="right">
                <IconMenu iconButtonElement={
                  <IconButton tooltip="More Options" touch={true}>
                    <NavigationExpandMoreIcon />
                  </IconButton>
                }>
                  <MenuItem primaryText="Edit Portal" />
                  <MenuItem primaryText="Contact" />
                </IconMenu>
              </ToolbarGroup>

            </Toolbar>

            <div className="row" style={{marginTop: '15px'}}>

              <div className={classNames('col-xs-3', 'col-md-2')}>
                <Paper style={{padding: '25px'}} zDepth={2}>

                  <div className="subheader">First Words</div>

                  <List>

                    {featuredWord.map(function(word, i) {
                      return (<ListItem key={i} primaryText={word} />);
                    })}

                  </List>

                </Paper>

              </div>

              {debug}

              <div className={classNames('col-xs-6', 'col-md-8')}>
                <div>
                  <h1>Portal</h1>
                  <EditableComponent property="fv-portal:about" />
                </div>
              </div>

              <div className={classNames('col-xs-3', 'col-md-2')}>

                <Paper style={{padding: '15px'}} zDepth={2}>

                  <div className="subheader">Status of our Langauge</div>

                  <p><strong>Name of Archive</strong><br/>{dialect.get('dc:title')}</p>
                  <hr/>
                  <p><strong>Country</strong><br/>{dialect.get('fvdialect:country')}</p>
                  <hr/>
                  <p><strong>Region</strong><br/>{dialect.get('fvdialect:region')}</p>
                  <hr/>
                  <p><strong># of Words Archived</strong><br/>{dialect.get('fvdialect:aaa')}</p>
                  <hr/>
                  <p><strong># of Phrases Archived</strong><br/>{dialect.get('fvdialect:aaaa')}</p>

                  <List>

                    {relatedLinks.map(function(word, i) {
                      return (<ListItem key={i} primaryText={word} />);
                    })}

                  </List>
                </Paper>

              </div>

          </div>

          <Snackbar
            open={(computePortal.isError && !computePortal.errorDismissed) || false}
            message={computePortal.error || ""}
            action="Close"
            onActionTouchTap={this._onRequestClose}
            onRequestClose={this._onRequestClose}
            autoHideDuration={3000}
          />

        </div>;
  }
}