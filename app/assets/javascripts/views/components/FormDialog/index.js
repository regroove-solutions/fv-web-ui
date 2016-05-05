import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import PageDialectPhrasesCreate from 'views/pages/explore/dialect/learn/phrases/create';


export default class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    
    // Bind methods to 'this'
    ['_onPhraseCreated'].forEach( (method => this[method] = this[method].bind(this)) );    
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
  
  _onPhraseCreated(phrase) {
	  console.log("_onPhraseCreated()");
	  if(phrase) {
		  this.props.onChange(event, phrase);
	  }
  }
  
  render() {

    return (
      <div>
        <RaisedButton label="Create New" onTouchTap={this.handleOpen} />
        <Dialog
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}	
        >  
        <PageDialectPhrasesCreate onPhraseCreated={this._onPhraseCreated} />

        </Dialog>

      </div>
    );
  }
}