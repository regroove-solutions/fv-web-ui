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
import React, { Component, PropTypes } from 'react';
import Immutable, { List } from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

import ProviderHelpers from 'common/ProviderHelpers';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import Map from 'views/components/Geo/map';

import TextField from 'material-ui/lib/text-field';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

/**
* Explore Archive page shows all the families in the archive
*/
@provide
export default class PageHome extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    queryPage: PropTypes.func.isRequired,
    computePage: PropTypes.object.isRequired,
    fetchPortals: PropTypes.func.isRequired,
    computePortals: PropTypes.object.isRequired
  };

  /*static contextTypes = {
      muiTheme: React.PropTypes.object.isRequired
  };*/

  constructor(props, context) {
    super(props, context);

    this.state = {
      mapVisible: false,
      pagePath: '/' + this.props.properties.domain + '/sections/Site/Resources/',
      dialectsPath: '/' + this.props.properties.domain + '/sections/',
    };

    ['_onNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  componentDidMount() {
    this.props.queryPage(this.state.pagePath,
    ' AND fvpage:url LIKE \'/home/\'' + 
    '&sortOrder=ASC' +
    '&sortBy=dc:title');

    this.props.fetchPortals(this.state.dialectsPath);
  }
  

  _onNavigateRequest(path) {
    this.props.pushWindowPath(path);
  }

  render() {

    const homePageStyle = {
      position: 'relative',
      minHeight: '155px',
      //height: '650px',
      backgroundColor: 'transparent',
      //backgroundSize: '115%',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundImage: 'url("/assets/images/homepage.jpg")',
      //backgroundPosition: '-280px -500px',
      overflow: 'hidden'
    }

    const computeEntities = Immutable.fromJS([{
      'id': this.state.pagePath,
      'entity': this.props.computePage
    },
    {
      'id': this.state.dialectsPath,
      'entity': this.props.computePortals
    }])

    const computePage = ProviderHelpers.getEntry(this.props.computePage, this.state.pagePath);
    const computePortals = ProviderHelpers.getEntry(this.props.computePortals, this.state.dialectsPath);

    const page = selectn('response.entries[0].properties', computePage);
    const dialects = selectn('response.entries', computePortals);

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
      <div className="row" style={homePageStyle}>
            <div style={{position: 'relative', height: '650px'}}>
              <div className={classNames('col-xs-12')} style={{height: '100%'}}>

                <div style={{position: 'absolute', right: '25px', top: '25px', width: '40%'}} className={classNames({'hidden': !this.state.mapVisible})}>
                  <Map dialects={dialects} />
                </div>

                <div style={{width: '35%', position: 'absolute', bottom: '15%', left: '10%', padding: '0 15px 15px 25px', color: '#ffffff', textShadow: '#000 2px 0 15px', fontSize: '1.5em', background: 'rgba(0,0,0,0.5)', borderRadius: '4px'}}>
                  <h2>{selectn('fvpage:blocks[0].title', page)}</h2>
                  <p dangerouslySetInnerHTML={{__html: selectn('fvpage:blocks[0].text', page)}} style={{fontSize: '0.9em'}}></p>
                  <div style={{textAlign: 'right'}}>
                    <RaisedButton label="Explore Our Languages" onTouchTap={this._onNavigateRequest.bind(this, '/explore/FV/sections/Data/')} style={{marginRight: '10px'}} /> 
                    <RaisedButton label="Language Map" onTouchTap={() => this.setState({mapVisible: !this.state.mapVisible})} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{backgroundColor: '#923110', padding: '20px', borderTop: '1px rgba(213, 160, 92, 0.29) solid', borderBottom: '1px rgba(213, 160, 92, 0.29) solid', marginBottom: '20px', boxShadow: 'rgba(0, 0, 0, 0.49) 0 0 20px 0px', height: '90px'}}>
              <div className={classNames('col-xs-12')}>
                <TextField underlineFocusStyle={{borderColor: '#000'}} underlineStyle={{width:'95%', borderColor: '#923110'}} style={{width: '100%', fontSize: '1.3em', height: '46px', backgroundColor: '#fff', padding: '0 15px'}} hintText="Search FirstVoices (word, phrase, language name):" ref="navigationSearchField" onEnterKeyDown={(e, v) => this._onNavigateRequest('/explore/FV/sections/Data/search/' + e.currentTarget.value)} />
              </div>
            </div>
            </div>

            <div className={classNames('row')} style={{marginTop:'15px'}}>
              {(selectn('fvpage:blocks', page) || []).map(function(block, i) {

                if (i == 0) {
                  return;
                }

                return <div key={i} className={classNames('col-xs-12', 'col-md-6')}>
                        <Paper style={{backgroundColor: '#f8f5ec', minHeight: '150px', padding: '15px'}}>
                        <h4>{selectn('title', block)}</h4>
                        <p dangerouslySetInnerHTML={{__html: selectn('text', block)}}></p>
                        </Paper>
                      </div>;
              })}

            </div>

            </PromiseWrapper>;
  }
}