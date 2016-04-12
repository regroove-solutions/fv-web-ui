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
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import DocumentOperations from 'operations/DocumentOperations';

@provide
export default class PageDialectReports extends React.Component {

  static propTypes = {
	  splitWindowPath: PropTypes.array.isRequired
  };	
	
  constructor(props, context){
	  super(props, context);
  }

  _handleQueryDataRequest(queryOptions) {
	  
	let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');
	  
	return DocumentOperations.queryDocumentsByDialect(
		"/" + path,
		queryOptions,
	    {'X-NXproperties': 'dublincore, fv-word, fvcore'},
	    {'currentPageIndex': 0, 'pageSize': 20}
	);
  }  
  
  render() {
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>Reports</h1>
                <div className="col-xs-3">
                	<h2>Words</h2>
                	<List>
            			<ListItem primaryText="List of words in new status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='New'")} />               	
                		<ListItem primaryText="List of words in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled'")} />
                		<ListItem primaryText="List of words in published status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Published'")} />
                		<ListItem primaryText="List of words in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Disabled'")} />           			
                		
                		<ListItem primaryText="List of words without audio" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL")} />
                		<ListItem primaryText="List of words without images" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL")} />
                		<ListItem primaryText="List of words without video" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL")} />

            			<ListItem primaryText="List of children's words in new status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='New' AND fv:available_in_childrens_archive=1" )} />               	
                		<ListItem primaryText="List of children's words in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled' AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words in published status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Published' AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Disabled' AND fv:available_in_childrens_archive=1")} />           			
                		
                		<ListItem primaryText="List of children's words without audio" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words without images" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words without video" onTouchTap={this._handleQueryDataRequest.bind(this, " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL AND fv:available_in_childrens_archive=1")} />               		
                	</List>

                </div>
	            <div className="col-xs-3">
                	<h2>Phrases</h2>
                </div>
		        <div className="col-xs-3">
                	<h2>Songs</h2>
                </div>
			    <div className="col-xs-3">
                	<h2>Stories</h2>
                </div>		                
              </div>
            </div>
        </div>;
  }
}