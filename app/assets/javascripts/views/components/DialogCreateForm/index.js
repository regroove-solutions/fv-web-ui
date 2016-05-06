import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import PageDialectPhrasesCreate from 'views/pages/explore/dialect/learn/phrases/create';
import PageDialectCategoryCreate from 'views/pages/explore/dialect/category/create';
import PageDialectContributorsCreate from 'views/pages/explore/dialect/contributors/create';

export default class DialogCreateForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      open: false
    };
    
    // Bind methods to 'this'
    ['_onDocumentCreated'].forEach( (method => this[method] = this[method].bind(this)) );    
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  shouldComponentUpdate(newProps, newState) {

    if (newState != this.state)
      return true;

    return false;
  }  
  
  _onDocumentCreated(document) {
	  console.log("_onDocumentCreated()");
	  if(document) {
		  this.props.onChange(event, document);
	  }
  }
  
  render() {
	let createForm = "";
	let createNewType = "";
	switch(this.props.formType) {
		case "FVPhrase":
			createForm = <PageDialectPhrasesCreate onDocumentCreated={this._onDocumentCreated} />;
		break;
			
		case "FVCategory":
			createForm = <PageDialectCategoryCreate onDocumentCreated={this._onDocumentCreated} />;
		break;
			
		case "FVContributor":
			createForm = <PageDialectContributorsCreate onDocumentCreated={this._onDocumentCreated} />;
		break;				
	}  

	// Show Create New button, unless otherwise specified
	let createNewButton = "";
	let createNewButtonLabel = "Create New " + this.props.formType.slice(2, this.props.formType.length);
	if(!this.props.disableCreateNewButton || this.props.disableCreateNewButton === false) {
		createNewButton = <RaisedButton label={createNewButtonLabel} onTouchTap={this.handleOpen} />;
	}
		
    return (		
      <div>
      	{createNewButton}
        <Dialog
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}	
        >  
        {createForm}

        </Dialog>

      </div>
    );
  }
}