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
import selectn from 'selectn';
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
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import ListItem from 'material-ui/lib/lists/list-item';
import CircularProgress from 'material-ui/lib/circular-progress';

// Edit
import TCombForm from 'tcomb-form';

/**
* Dialect portal page showing all the various components of this dialect.
*/
@provide
export default class ExploreDialect extends Component {

  static elements = {
    spin: <CircularProgress mode="indeterminate" size={0.5} />
  };

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
    requestEdit: PropTypes.func.isRequired,
    editMode: PropTypes.bool
  };

  static defaultProps = {
    editMode: false
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);
    props.fetchDialectAndPortal(props.properties.domain + '/Workspaces/Data/' + props.family + '/' + props.language + '/', props.dialect);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEditRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _onNavigateRequest(path) {
    const destination = this.props.navigateTo(path);
    const newPathArray = this.props.splitWindowPath.slice();

    newPathArray.push(destination.path);

    this.props.pushWindowPath('/' + newPathArray.join('/'));
  }

  _onEditRequest(itemToEdit) {
    this.props.requestEdit();
  }

  _editableElement(str) {

    if (this.props.computeDialectAndPortal.isFetching)
      return this.spin;

    if (this.props.editMode)
      return <textarea defaultValue={str}></textarea>;

    return str;
  }

  render() {

    let debug = "";

    const { computeDialectAndPortal, computeDialect, computePortal } = this.props;

    let dialect = selectn('response.entities.dialects' + '.' + computeDialect.response.result, computeDialect);
    let portal = selectn('response.entities.portals' + '.' + computePortal.response.result, computePortal);

    // debug = <pre>{JSON.stringify(portal, null, 4)}</pre>;

    //if (computeDialectAndPortal.isFetching) {
    //  spin = <CircularProgress mode="indeterminate" size={0.5} />;
    //}

    let portalBackgroundStyles = {
      position: 'relative',
      minHeight: 155,
      backgroundColor: 'transparent',
      backgroundImage: 'url(' + (selectn('properties.fv-portal:background_top_image', portal) || 'http://lorempixel.com/1340/155/abstract/1/') + ')',
      backgroundPosition: '0 0',
    }

    let featuredWord = selectn('properties.fv-portal:featured_words', portal) || [];
    let relatedLinks = selectn('properties.fvdialect:related_links', dialect) || [];

    return <div>

            <h1>{selectn('properties.dc:title', dialect)} Community Portal</h1>

            <div style={portalBackgroundStyles}>

              <h2 style={{position: 'absolute', bottom: 0, backgroundColor: 'rgba(255,255,255, 0.3)'}}>
                {selectn('properties.fv-portal:greeting', portal)}<br/>
                {selectn('properties.fv-portal:featured_audio', portal)}
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
                  <MenuItem onTouchTap={this._onEditRequest.bind(this, 'portal')} primaryText="Edit Portal" />
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
                  <p>{this._editableElement(selectn('properties.fv-portal:about', portal))}</p>
                  
                </div>
              </div>

              <div className={classNames('col-xs-3', 'col-md-2')}>

                <Paper style={{padding: '15px'}} zDepth={2}>

                  <div className="subheader">Status of our Langauge</div>

                  <p><strong>Name of Archive</strong><br/>{selectn('properties.dc:title', dialect)}</p>
                  <hr/>
                  <p><strong>Country</strong><br/>{selectn('properties.fvdialect:country', dialect)}</p>
                  <hr/>
                  <p><strong>Region</strong><br/>{selectn('properties.fvdialect:region', dialect)}</p>
                  <hr/>
                  <p><strong># of Words Archived</strong><br/>{selectn('properties.fvdialect:aaa', dialect)}</p>
                  <hr/>
                  <p><strong># of Phrases Archived</strong><br/>{selectn('properties.fvdialect:aaaa', dialect)}</p>

                  <List>

                    {relatedLinks.map(function(word, i) {
                      return (<ListItem key={i} primaryText={word} />);
                    })}

                  </List>
                </Paper>

              </div>

          </div>

        </div>;
  }
}