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
    querySearchResults: PropTypes.func.isRequired,
	computeSearchResults: PropTypes.object.isRequired
  };	
	
  constructor(props, context) {
    super(props, context);
    
    this.state = {
    	columns: [ 
    	           { name: 'title', title: 'Document Title', render: function(v, data, cellProps) { return v; } },
    	           { name: 'type', title: 'Document Type', render: function(v, data, cellProps) { return v; } },
    	           { name: 'path', title: 'Document Path', render: function(v, data, cellProps) { return v; } }
    	],
    	path : "/" + this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 1).join('/'),
    	queryParameter: ""
    };
        
    // Bind methods to 'this'
    ['_handleRefetch', '_handleTextFieldSubmit', '_handleTextFieldChange'].forEach( (method => this[method] = this[method].bind(this)) ); 

  }

  fetchData(newProps) {
    newProps.querySearchResults(this.state.queryParameter, this.state.path, 1, 10);	  
  }

  // Fetch data on initial render
  componentDidMount() {
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
  
  _handleRefetch(dataGridProps, page, pageSize) { 
    this.props.querySearchResults(this.state.queryParameter, this.state.path, page, pageSize);
  }    
  
  _handleTextFieldSubmit() {
	  console.log(this.refs.queryParamTextField.getValue());
	  //this.state.queryParameter = this.refs.queryParamTextField.getValue();
	  this.props.querySearchResults(this.state.queryParameter, this.state.path, 1, 10);
  }

  _handleTextFieldChange() {
	  console.log(this.refs.queryParamTextField.getValue());
	  this.setState({queryParameter: this.refs.queryParamTextField.getValue()});
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
	    			<TextField ref="queryParamTextField" hintText="Type a search value then press enter to perform the search..." onEnterKeyDown={this._handleTextFieldSubmit} onChange={this._handleTextFieldChange} value={this.state.queryParameter} fullWidth={true} />
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