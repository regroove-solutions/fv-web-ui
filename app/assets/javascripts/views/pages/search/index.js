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

import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';

import DocumentListView from 'views/components/Document/DocumentListView';

@provide
export default class Search extends React.Component {

  static propTypes = {
	splitWindowPath: PropTypes.array.isRequired,
	replaceWindowPath: PropTypes.array.isRequired,	
    querySearchResults: PropTypes.func.isRequired,
	computeSearchResults: PropTypes.object.isRequired
  };	
	
  constructor(props, context) {
    super(props, context);
    
    this.state = {
    	columns: [ 
    	           { name: 'title', title: 'Document Title'},
    	           { name: 'type', title: 'Document Type', 
    	        	   render: function(v) {
    	        		   return v.replace("FV", "");
    	        	   }
    	           },
    	           { name: 'path', title: 'Document Location',
    	        	   render: function(v) {
    	        		   return (v.includes("/Workspaces/") ? "Workspace" : "Section");
    	        	   }
    	           },
    	           { name: 'ancestry_family_title', title: 'Family'},
    	           { name: 'ancestry_language_title', title: 'Language'},    	               	           
    	           { name: 'ancestry_dialect_title', title: 'Dialect'}    	               	               	           
    	],
    	queryParam: "",
    	queryPath: ""
    };
        
    // Bind methods to 'this'
    ['_handleRefetch', '_handleSearchSubmit', '_computeQueryParam', '_computeQueryPath', '_handleSearchFieldChange',  '_onEntryNavigateRequest'].forEach( (method => this[method] = this[method].bind(this)) ); 

  }

  fetchData(newProps) {
	  if(this.state.queryParam != "") {
		  newProps.querySearchResults(this.state.queryParam, decodeURI(this.state.queryPath), 1, 10);
		  this.refs.searchDocumentListView.resetPage();
	  }
  }

  // Fetch data on initial render
  componentDidMount() {  
	  this.state.queryParam = this._computeQueryParam();
	  this.state.queryPath = this._computeQueryPath();
//	  console.log(this.state.queryParam);	  
//	  console.log(this.state.queryPath);	  
	  this.fetchData(this.props);
  }   

  componentDidUpdate(oldProps, oldState) {
	  // If url has changed, either the queryParam or queryPath is different - need to refetch
	  if(oldProps.splitWindowPath.join("/") != this.props.splitWindowPath.join("/")) {
//		  console.log("new path detected!");		  
		  this.state.queryParam = this._computeQueryParam();
		  this.state.queryPath = this._computeQueryPath();		  
		  this.fetchData(this.props);
	  }
  }
	  
  _handleRefetch(dataGridProps, page, pageSize) { 
    this.props.querySearchResults(this.state.queryParam, decodeURI(this.state.queryPath), page, pageSize);
  }    
  
  _handleSearchSubmit() {
	  let newQueryParam = this.refs.searchTextField.getValue();
	  this.state.queryParam = newQueryParam;	  
	  this.props.replaceWindowPath('/explore' + this.state.queryPath + '/search/' + this.state.queryParam);
//	  this.fetchData(this.props);
//	  this.refs.searchDocumentListView.resetPage();
  }

  _handleSearchFieldChange() {
//	  console.log(this.refs.searchTextField.getValue());
	  this.setState({queryParam: this.refs.searchTextField.getValue()});
  }  

  _onEntryNavigateRequest(path) {  
	  this.props.replaceWindowPath('/explore' + path);
  }  
  
  _computeQueryPath() {
	  let path = "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length).join('/');
	  // Extract the query path
	  let queryPath = path.split("/search")[0];
	  //console.log("queryPath:" + queryPath);	  
	  return queryPath;
  }

  _computeQueryParam() {
	  let path = "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length).join('/');
	  //console.log(this.props.splitWindowPath);
	  let lastPathSegment = this.props.splitWindowPath[this.props.splitWindowPath.length - 1];
	  
	  let queryParam = "";
	  if(lastPathSegment != "search") {
		  queryParam = lastPathSegment;
		  //console.log("queryParam:" + queryParam);		  
	  }
	  return queryParam;
  }  
  
  render() {
	  
	const { computeSearchResults } = this.props;

	if(computeSearchResults.isFetching) {
		return <CircularProgress mode="indeterminate" size={3} />;
	}	
	  
    return <div>
    		<h1>Search</h1>
    		
    		<div className="row">
	    		<div className="col-xs-6">
	    			<TextField ref="searchTextField" hintText="Type a search value then press enter to perform the search..." onEnterKeyDown={this._handleSearchSubmit} onChange={this._handleSearchFieldChange} value={this.state.queryParam} fullWidth={true} />
	    		</div>
    		</div>
    		
		    <div className="col-xs-12">
			    <DocumentListView
			      ref="searchDocumentListView"
			      data={this.props.computeSearchResults}
			      refetcher={this._handleRefetch}
			      onSelectionChange={this._onEntryNavigateRequest}
			      columns={this.state.columns}
			      className="browseDataGrid" />
			</div>
		</div>;
  }
}