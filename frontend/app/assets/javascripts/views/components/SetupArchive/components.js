import React, { Component, PropTypes } from 'react'
import theme from 'views/themes/FirstVoicesTheme.js'
import Colors from 'material-ui/lib/styles/colors'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'

export function Intro(props) { // need to get text to actually create new line
  return (
    <p>{props.text}</p>
  )
}
  
const headerStyle = {
  fontWeight: '500',
  margin: '15px 0 10px 0',
}
  
export function Title(props) {
  return (
    <div>
      <h1 style={headerStyle}>
        <span >{props.name}</span>
      </h1>
      <hr
        style={{backgroundColor: theme['palette']['primary1Color'], width: '100%', height: '2px', margin: '0 0 10px 0'}} /> 
    </div>
  )
}

/* Back and next buttons at bottom of page */
export class Buttons extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const next = this.props.end ? '' : <FlatButton disabled={this.props.required} onClick={this.props.onNextClick}>NEXT</FlatButton>
    const back = this.props.start ? '' : <FlatButton onClick={this.props.onBackClick} >BACK</FlatButton>
    return (
      <div> 
        <div className="col-xs-6 text-left " style={{paddingLeft:'0', marginTop: '10', position:'absolute', bottom:'0'}} >
          <div className="previous">
            {back}
          </div>
        </div>
        <div className="col-xs-6 text-right " style={{paddingRight:'0', marginTop: '10', position:'absolute', bottom:'0', left:'50%'}}>
          <div className="next">
            {next}
          </div>
        </div>
      </div>
    )
  }
}

/* Drop down with title and optional subtitle list where user picks an option.
   If user chooses option 'other' a new input field pops up for their answer. 
   
   Currently can only choose one, should add ability to choose multiple for things like keyboards.
   
   Also would be good to allow searching as user types (like with combined input and datalist) 
   but shouldn't let people just leave written answer in input field */
export class DropDown extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    var choices = []
    const opts=this.props.options
    for(let i=0;i<opts.length;i++){
      if(opts[i]==this.props.value){
        choices.push(<option key={i} selected>{opts[i]}</option>) // Is there a better way to handle this than with selected?
      }
      else{
        choices.push(<option key={i}>{opts[i]}</option>)
      }
    }

    var other = this.props.other? (<div style={{marginTop:'20px'}}>
                                     <label className="control-label">Please enter your {this.props.name}:</label>
                                      <input value={this.props.valueOther} name={this.props.name+'Other'} className='form-control' type={this.props.type} form={this.props.form} onChange={(e)=> {this.props.handleChange(e)}}/> 
                                    </div>):''

    var sublabel = this.props.subtitle ? <h6 style={{marginTop:'2', marginBottom:'2'}} >{this.props.subtitle}</h6>:''
    return (
      <div>
        <div>
          <label className="control-label" >
            {this.props.title}
            {sublabel}
          </label>
          <div/>
          <select name={this.props.name} className='form-control' onChange={(e)=> {this.props.handleChange(e)}}>{choices}</select>
        </div>
        {other}
      </div>
      
    )
  }
}
//<input value={this.props.value} name={this.props.name} className='form-control' type='text' list='options' multiple='multiple' onChange={(e)=> {this.props.handleChange(e)}}/>
//<datalist id='options' form={this.props.form}>{choices}</datalist>

/* input field with title and optional subtitle - currently handles text, email, and files 
    Need to fin a way for file to hold/show its value when navigating away from the page 
    Need to add verification of email */
export class EnterText extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    var sublabel = this.props.subtitle ? <h6 style={{marginTop:'2', marginBottom:'2'}} >{this.props.subtitle}</h6>:''
    var enter = this.props.type=='file'? <input name={this.props.name} className='form-control' type='file' accept='image/*' form={this.props.form} onChange={(e)=> {this.props.handleChange(e)}}/>:<input value={this.props.value} name={this.props.name} className='form-control' type={this.props.type} multiple={this.props.multiple} form={this.props.form} onChange={(e)=> {this.props.handleChange(e)}}/>
    return(
      <div>
        <label className="control-label" >
          {this.props.title}
          {sublabel}
        </label>
        {enter} 
      </div>

    )
  }
}

/* Basic list of steps provided
   Should probably expand to allow subtitles for each step, perhaps make it an actual checklist */
export class Checklist extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    var listSteps = this.props.steps.map((s, index)=>
    <li key={index}>{s}</li>)
    return(
      <ul stryle={{listStyleType:'circle'}}>{listSteps}</ul>
    )
  }
}

/* Numbered steps */
export class Steps extends Component{
  constructor(props, context) {
    super(props, context)
  }
  
  render(){
    var steps = this.props.steps
    var stepsList = []
    for (let i=0;i<steps.length;i++){
      stepsList.push(<div key={i+1} keyclassName='round' style={stepNumberStyle}>{i+1}</div>)  //what are better keys
      stepsList.push(<div key={steps[i]} className='instruct' style={stepTextStyle}>{steps[i]}</div>) 
    }
    return (
      <div className='r' style={gridStyle}>
        {stepsList}
      </div>
    )
  }
}

var gridStyle = {
  display: 'grid',
  columnGap: '10px',
  rowGap: '10px',
  gridTemplateColumns: '30px auto',
  gridTemplateRows: 'none',
  paddingLeft: '12%',
}

var stepTextStyle = {
  float:'left',
  fontSize: '14px',
  lineHeight: '30px',
}

var stepNumberStyle = {
  float:'left',
  width: '30px',
  height: '30px',
  lineHeight: '30px',
  borderRadius: '50%',
  textAlign: 'center',
  fontSize: '13px',
  border: '1px solid #666',
}

/* Button to submit and actually create archive and language admin if applicable */
export class SubmitButton extends Component{  
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <div className='row' style={{ textAlign:'center', marginTop:'20px'}}>
      <RaisedButton label='CREATE ARCHIVE' 
                    type='submit' 
                    form={this.props.form} 
                    style={{ marginRight: '10px', height: '50px', }}
                    backgroundColor={theme['palette']['primary1Color']}
                    labelColor={Colors.white} 
                    labelStyle={{ fontSize: '1.34em' }}
                    onClick={this.props.onSubmit}/>
      </div>
    )
  }
}


export class CancelButton extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <div className='row' style={{ textAlign:'center', marginTop:'10px'}}>
      <FlatButton onClick={this.props.onCancel}>CANCEL</FlatButton>
      </div>
    )
  }
}

export class ArchiveButton extends Component{  
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <div className='row' style={{ textAlign:'center', marginTop:'20px'}}>
      <RaisedButton label='GO TO YOUR ARCHIVE' 
                    type='button'  
                    style={{ marginRight: '10px', height: '50px', }}
                    backgroundColor={theme['palette']['primary1Color']}
                    labelColor={Colors.white} 
                    labelStyle={{ fontSize: '1.34em' }}
                    onClick={this.props.goToArchive}/>
      </div>
    )
  }
}