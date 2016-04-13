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

import DocumentListView from 'views/components/Document/DocumentListView';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

@provide
export default class PageDialectReports extends React.Component {

  static propTypes = {
	  
//	  properties: PropTypes.object.isRequired,
//	  windowPath: PropTypes.string.isRequired,
	  
	  splitWindowPath: PropTypes.array.isRequired,
  	  fetchReportDocuments: PropTypes.func.isRequired,
      computeReportDocuments: PropTypes.object.isRequired,
      
      fetchWordsInPath: PropTypes.func.isRequired,
      computeWordsInPath: PropTypes.object.isRequired,

      getReport: PropTypes.func.isRequired,
      computeReport: PropTypes.object.isRequired
     
  };	
	
  constructor(props, context){
	  super(props, context);
	  
	    // Expose 'this' to columns functions below
	    let _this = this;    

	    this.state = {
	      columns : [
	        { name: 'title', title: 'Word', render: function(v, data, cellProps){
	          //return <a key={data.id} onTouchTap={_this._handleNavigate.bind(this, data.id)}>{v}</a>
	          return v;
	        }}
	      ]
	    };	  
	  
  }

  _handleQueryDataRequest(queryName, queryOptions) {
	  
	let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');

	this.state.queryName = queryName;
	this.state.queryOptions = queryOptions;
	
//	return DocumentOperations.queryDocumentsByDialect(
//		"/" + path,
//		queryOptions,
//	    {'X-NXproperties': 'dublincore, fv-word, fvcore'},
//	    {'currentPageIndex': 0, 'pageSize': 20}
//	);
	
	this.props.fetchReportDocuments(path, queryOptions);
	
//	this.props.fetchWordsInPath('/' + path, '&currentPageIndex=' + DEFAULT_PAGE + '&pageSize=' + DEFAULT_PAGE_SIZE, { 'X-NXenrichers.document': 'ancestry', 'X-NXproperties': 'dublincore, fv-word, fvcore' });
	
	//this.props.getReport(path, queryOptions);
	
	//console.log(this.props.computeReport);
	
	//console.log(this.props.properties);
	//console.log(this.props.windowPath);
  }  
  
  render() {

	const { computeReportDocuments } = this.props;
	
	if(computeReportDocuments.success) {

		console.log(this.state.queryOptions);
		
		return <div className="row">
        <div className="col-xs-12">
        <h1>Report - {this.state.queryName}</h1>
        <DocumentListView
          objectDescriptions="words" 
          data={this.props.computeReportDocuments}
          refetcher={this._handleRefetch}
          onSelectionChange={this._onEntryNavigateRequest}
          columns={this.state.columns}
          className="browseDataGrid" />
       </div>
      </div>  
	}  
	  
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>Reports</h1>
                <div className="col-xs-3">
                	<h2>Words</h2>

                	<List>
            			<ListItem primaryText="List of words in new status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words in new status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='New'")} />               	
                		<ListItem primaryText="List of words in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words in enabled status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled'")} />
                		<ListItem primaryText="List of words in published status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words in published status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Published'")} />
                		<ListItem primaryText="List of words in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words in disabled status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Disabled'")} />           			
                		
                		<ListItem primaryText="List of words without audio" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without audio", " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL")} />
                		<ListItem primaryText="List of words without images" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without images", " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL")} />
                		<ListItem primaryText="List of words without video" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without video", " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL")} />
                		<ListItem primaryText="List of words without source" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without source", " AND ecm:primaryType='FVWord' AND fv:source/* IS NULL")} />               		

                		<ListItem primaryText="List of words without categories" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without categories", " AND ecm:primaryType='FVWord' AND fv-word:categories/* IS NULL")} />               		         		                		
                		<ListItem primaryText="List of words without part of speech" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without part of speech", " AND ecm:primaryType='FVWord' AND fv-word:part_of_speech=''")} />               		
                		<ListItem primaryText="List of words without pronunciation" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without pronunciation", " AND ecm:primaryType='FVWord' AND fv-word:pronunciation=''")} />               		
                		<ListItem primaryText="List of words without related phrases" onTouchTap={this._handleQueryDataRequest.bind(this, "List of words without related phrases", " AND ecm:primaryType='FVWord' AND fv-word:related_phrases/* IS NULL")} />               		         		
                		
            			<ListItem primaryText="List of children's words in new status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words in new status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='New' AND fv:available_in_childrens_archive=1" )} />               	
                		<ListItem primaryText="List of children's words in enabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words in enabled status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Enabled' AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words in published status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words in published status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Published' AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words in disabled status" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words in disabled status", " AND ecm:primaryType='FVWord' AND ecm:currentLifeCycleState='Disabled' AND fv:available_in_childrens_archive=1")} />           			
                		
                		<ListItem primaryText="List of children's words without audio" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words without audio", " AND ecm:primaryType='FVWord' AND fv:related_audio/* IS NULL AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words without images" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words without images", " AND ecm:primaryType='FVWord' AND fv:related_pictures/* IS NULL AND fv:available_in_childrens_archive=1")} />
                		<ListItem primaryText="List of children's words without video" onTouchTap={this._handleQueryDataRequest.bind(this, "List of children's words without video", " AND ecm:primaryType='FVWord' AND fv:related_videos/* IS NULL AND fv:available_in_childrens_archive=1")} />               		
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