import React, { Component, PropTypes } from 'react'
import theme from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/themes/FirstVoicesTheme.js'
import Colors from 'material-ui/lib/styles/colors'
import FlatButton from 'material-ui/lib/flat-button'
import RaisedButton from 'material-ui/lib/raised-button'

export function Intro(props) {
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

export class DropDown extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    var choices = this.props.options.map((opt, index)=>
    <option key={index}>{opt}</option>)
    var sublabel = this.props.subtitle ? <h6 style={{marginTop:'2', marginBottom:'2'}} >{this.props.subtitle}</h6>:''
    return (
      <div>
        <label className="control-label" >
          {this.props.title}
          {sublabel}
        </label>
        <div/>
        <select value={this.props.value} name={this.props.name} className='form-control' onChange={(e)=> {this.props.handleChange(e)}}>{choices}</select>
      </div>
    )
  }
}
        //<input value={this.props.value} name={this.props.name} className='form-control' type='text' list='options' multiple='multiple' onChange={(e)=> {this.props.handleChange(e)}}/>
        //<datalist id='options' form={this.props.form}>{choices}</datalist>

export class EnterText extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    var sublabel = this.props.subtitle ? <h6 style={{marginTop:'2', marginBottom:'2'}} >{this.props.subtitle}</h6>:''
    var enter = this.props.type=='file'? <input value={this.props.value} name={this.props.name} className='form-control' type='file' accept='image/*' form={this.props.form} onChange={(e)=> {this.props.handleChange(e)}}/>:<input value={this.props.value} name={this.props.name} className='form-control' type='text' form={this.props.form} onChange={(e)=> {this.props.handleChange(e)}}/>
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

export class Steps extends Component{
  constructor(props, context) {
    super(props, context)
  }
  
  render(){
    var steps = this.props.steps
    var stepsList = []
    for (let i=0;i<steps.length;i++){
      stepsList.push(<div keyclassName='round' style={stepNumberStyle}>{i+1}</div>)
      stepsList.push(<div className='instruct' style={stepTextStyle}>{steps[i]}</div>) 
      //stepsList.push(<div className='clearfix' />)
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
  paddingLeft: '5%',
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

export class SubmitButton extends Component{  //need to center
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <RaisedButton label='CREATE ARCHIVE' 
                    type='submit' 
                    form={this.props.form} 
                    style={{ marginRight: '10px', height: '50px' }}
                    backgroundColor={theme['palette']['primary1Color']}
                    labelColor={Colors.white} 
                    labelStyle={{ fontSize: '1.34em' }}/>
    )
  }
}

export class CancelAlert extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <div/>
    )
  }
}
