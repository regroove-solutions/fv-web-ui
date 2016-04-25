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
    	           { name: 'type', title: 'Document Type'},
    	           { name: 'path', title: 'Document Path'}    	           
    	],
    	queryParam: "",
    	queryPath: ""
    };
        
    // Bind methods to 'this'
    ['_handleRefetch', '_handleSearchSubmit', '_getQueryParam', '_getQueryPath', '_handleSearchFieldChange'].forEach( (method => this[method] = this[method].bind(this)) ); 

  }

  fetchData(newProps) {	  
	  newProps.querySearchResults(this.state.queryParam, decodeURI(this.state.queryPath), 1, 10);	  
  }

  // Fetch data on initial render
  componentDidMount() {  
	  this.state.queryParam = this._getQueryParam();
	  this.state.queryPath = this._getQueryPath();
	  console.log(this.state.queryParam);	  
	  console.log(this.state.queryPath);	  

	  this.fetchData(this.props);
  }   

//  shouldComponentUpdate(newProps, newState) {
//
//    switch (true) {
//      case (newProps.computeDialect.response != this.props.computeDialect.response):
//        return true;
//      break;
//    }
//
//    return false;
//  }  
  componentDidUpdate(oldProps, oldState) {
	  if(oldProps.splitWindowPath.join("/") != this.props.splitWindowPath.join("/")) {
		  console.log("new path detected!");
		  
		  this.state.queryParam = this._getQueryParam();
		  this.state.queryPath = this._getQueryPath();		  
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
	  this.fetchData(this.props);
  }

  _handleSearchFieldChange() {
	  console.log(this.refs.searchTextField.getValue());
	  this.setState({queryParam: this.refs.searchTextField.getValue()});
  }  

  _getQueryPath(){
	  let path = "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length).join('/');
	  let queryPath = path.split("/search/")[0];
	  return queryPath;
  }

  _getQueryParam() {
	  let path = "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length).join('/');
	  let queryParam = path.split("/search/")[1];
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
			      data={this.props.computeSearchResults}
			      refetcher={this._handleRefetch}
			      onSelectionChange={this._onEntryNavigateRequest}
			      columns={this.state.columns}
			      className="browseDataGrid" />
			</div>
		</div>;
  }
}