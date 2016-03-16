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

// Models
import {Document} from 'nuxeo';

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
import CircularProgress from 'material-ui/lib/circular-progress';

// Edit
import t from 'tcomb-form';
import AlloyEditorComponent from 'views/components/editor';

function test(value) {
  console.log(value);
}

// override just the renderTextarea partial of the default template
function renderTextarea(locals) {
  const attrs = {
    ...locals.attrs,
    className: classNames(locals.attrs.className)
  }

  const onContentChange = function (value) {
    console.log(value);
    locals.onChange(value);
  }

  return <AlloyEditorComponent content={locals.value} onContentChange={onContentChange} container="editable" />
}

const textboxTemplate = t.form.Form.templates.textbox.clone({ renderTextarea })

// here we are: the factory
class ReactQuillFactory extends t.form.Textbox {

  getTemplate() {
    return textboxTemplate
  }

}



















const fields = {
  portal : {
    'fv-portal:about': t.String,
    'fv-portal:greeting': t.String
  }
}

const Portal = t.struct(selectn('portal', fields));

Portal.prototype.toDoc = function () {
  console.log(this);
}

const options = {
  fields: {
    'fv-portal:about': {
      label: <i>Portal Introduction</i>,
      type: 'textarea',
      factory: ReactQuillFactory,
      attrs: {
        placeholder: 'Enter portal description here'
      }
    }
  }
};

const values = {
    'fv-portal:aaa': 'test'
};


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
    editMode: PropTypes.bool,
    requestSaveField: PropTypes.func.isRequired,
    saveField: PropTypes.bool.isRequired
  };

  static defaultProps = {
    editMode: false
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  /**
  * 
  */
  responseToObject(dialectResponse) {
    return selectn('response', dialectResponse);
  }

  constructor(props, context){
    super(props, context);
    props.fetchDialectAndPortal(props.properties.domain + '/Workspaces/Data/' + props.family + '/' + props.language + '/' + props.dialect);

    // Bind methods to 'this'
    ['_onNavigateRequest', '_onEditRequest', '_onRequestSaveField'].forEach( (method => this[method] = this[method].bind(this)) );
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

  _onRequestSaveField(e, property) {

    // Prevent default behaviour
    e.preventDefault();

    // FIX ME BELOW!!!!
    //let originPortalDoc = this.responseToObject(this.props.computePortal, 'portals');
    // FIX ME ^^
    
    // Create new document rather than modifying the original document
    // TODO: Find better way to construct object then accessing internal function
    let newDocument = new Document(this.props.computePortal.response, { 
      'repository': this.props.computePortal.response._repository,
      'nuxeo': this.props.computePortal.response._nuxeo
    });

    //let newDocument = Object.assign({}, );

    // Set property
    newDocument.set(this.refs["form_" + property].getValue());

    // Modified document
    const newDoc = this.props.requestSaveField(newDocument);

    console.log(newDoc);
  }

  /**
  * Allows an element to be rendered as regular text or as an editable form
  * Note: This will only work with 'properties' from the document as they are the only mutable fields.
  * @param {property} string - The property field id (used for Structs)
  * @param {entity} doc - The entitiy to derive current values from
  * @returns - Element to be rendered
  */
  _editableElement(property, entity) {

    let fieldForm, fieldSchema, newFormStruct, newValues = null;

    // Get current value from properties.
    const value = selectn("properties." + property, entity);

    // Create a form from a single field
    if (Portal.meta.props.hasOwnProperty(property)) {

      let fieldValue = selectn('portal', fields);

      // Create a sub-structure for this field
      let newSchema = {};
      newSchema[property] = fieldValue[property];
      newFormStruct = t.struct(newSchema);

      newValues = {};
      newValues[property] = value;
    }

    // Dynamic rendering
    if (this.props.computeDialectAndPortal.isFetching)
      return this.spin;

    if (this.props.editMode) {
      return <form onSubmit={e => this._onRequestSaveField(e, property)}>
              <t.form.Form ref={"form_" + property} value={newValues} type={newFormStruct} options={options} />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">Save</button> 
              </div>
             </form>;
    }

    return <div dangerouslySetInnerHTML={{__html: value}}></div>;
  }

  render() {

    let debug = "";

    const { computeDialectAndPortal, computeDialect, computePortal } = this.props;

    // debug = <pre>{JSON.stringify(portal, null, 4)}</pre>;

    let dialect = computeDialect.response;
    let portal = computePortal.response;

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
                {portal.get('fv-portal:greeting')}<br/>
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
                  {this._editableElement('fv-portal:about', portal)}
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

        </div>;
  }
}