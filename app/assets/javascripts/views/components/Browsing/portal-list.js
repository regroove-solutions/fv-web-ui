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

import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import Colors from 'material-ui/lib/styles/colors';

import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';

import ProviderHelpers from 'common/ProviderHelpers';

export default class PortalList extends Component {

  static propTypes = {
    tiles: PropTypes.array.isRequired,
    action: PropTypes.func,
    cols: PropTypes.number
  };

  static defaultProps = {
    cols: 3
  }

  constructor(props, context){
    super(props, context);
  }

  render() {
    return <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                    <GridList
                      cols={this.props.cols}
                      cellHeight={146}
                      style={{width: '100%', overflowY: 'auto', marginBottom: 24}}
                      >
                        {(this.props.tiles).map(function (tile, i) { 

                          // Switch roles
                          let dialectRoles = selectn('contextParameters.dialect.roles', tile);
                          //let roleDesc = '';
                          let actionIcon = null;

                          if ( ProviderHelpers.isActiveRole(dialectRoles) ) {
                            actionIcon = <ActionGrade style={{margin: '0 15px'}} color={Colors.amber200} />;
                            //roleDesc = " ROLE(S): " + dialectRoles.join(", ")
                          }

                          // Dialect title
                          let title = selectn('contextParameters.ancestry.dialect.dc:title', tile);
                          let logoPath = selectn('contextParameters.portal.fv-portal:logo.path', tile);
                          let portalLogo = logoPath ? (ConfGlobal.baseURL + logoPath) : '/assets/images/cover.png';

                          return <GridTile
                            onTouchTap={this.props.action.bind(this, tile.path.replace('/Portal', ''))}
                            key={tile.uid}
                            title={title}
                            actionPosition="right"
                            actionIcon={actionIcon}
                            subtitle={(tile.description || '')}
                            ><img src={portalLogo} alt={title + ' Logo'} /></GridTile>
                        }.bind(this))}
                    </GridList>
                  </div>;
  }
}