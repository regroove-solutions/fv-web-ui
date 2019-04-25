import React, { Component, PropTypes } from 'react'
import provide from 'react-redux-provide'
import selectn from 'selectn'
import FlatButton from 'material-ui/lib/flat-button'
import classNames from 'classnames'
import RaisedButton from 'material-ui/lib/raised-button'
import Colors from 'material-ui/lib/styles/colors'
import '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/themes/FirstVoicesTheme.js'
import Autosuggest from 'react-autosuggest'
import theme from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/themes/FirstVoicesTheme.js'

const start = {title: 'Start a FirstVoices Archive',
  intro: 'FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization.\n \nFirstVoices holds {numberOfDialects} dialect archives where communities are able to upload their alphabet, language, stories, songs, and resources for language learners to access. This guide will walk you through the process of creating your own archive on firstvoices.com.',
  enabled: true,
  main:'',
}
const steps = {title: 'Archive Creation Steps',
  intro: 'This guide will walk you through the steps to create a new archive on FirstVoices.  Required steps are marked with *.',
  enabled: true,
  main: <StepsPg />,
}
const checklist = {title: 'Getting Started Checklist',
  intro: 'This checklist contains some common steps to complete before starting your FirstVoices archive. These steps make it more likely your language revitalization efforts and archive will be successful, but are not all necessary and may or may not be applicable to your dialect.',
  enabled: true,
  main: <ChecklistPg />,
}
const names = {title: 'Archive Name',
  intro: '',
  required: true,
  enabled: true,
  main: <NamesPg />,
}
const languageGuess = {title: 'Language',
  intro: '',
  required: true,
  enabled: true,
  main: <GuessPg />,
}
const languagePick = {title: 'Langauge',
  intro: 'Choose one of the languages already on FirstVoices or enter a new one.',
  required: true,
  enabled: false,
  main: <PickPg />,
}
const familyGuess = {title: 'Language Family',
  intro: '',
  required: true,
  enabled: true,
  main: <GuessPg />,
}
const familyPick = {title: 'Language Family',
  intro: 'Choose one of the language families already on FirstVoices or enter a new one.',
  required: true,
  enabled: false,
  main: <PickPg />,
}
const logo = {title: 'Logo',
  intro: "This will be the picture used for your archive's thumbnail. If you have a logo ready please enter it below or else the default will be used for now. \n\n(This is optional. You will be able to enter or change your logo later)",
  enabled: true,
  main: <LogoPg />,
}
const dialectInfo = {title: 'Dialect Information',
  intro: 'Please enter some basic information about your dialect/community. This information is optional and can be changed later.',
  enabled: true,
  main: <DialectInfoPg />,
}
const alphabetGuess = {title: 'Alphabet',
  intro: '',
  required: true, // should this be the case ???
  enabled: true,
  main: <GuessPg />,
}
const alphabetPick = {title: 'Alphabet',
  intro: 'If your alphabet is the same as an archive already on FirstVoices you can select it below to automatically add it to your archive.',
  enabled: false,
  main: <PickPg />,
}
const keyboards = {title: 'Keyboards',
  intro: 'If you would like to add a FirstVoices keyboard  and/or keyboard installation guide to your archive you can select them below. If there is no keyboard for your language and you would like to create one _____. ',
  enabled: true,
  main: <KeyboardsPg />,
}
const langAdminAsk = {title: 'Langauge Administrator',
  intro: 'The language administrator of your archive controls who has access to the archive and what is published to the archive. They are also responsible for approving users to be able to add to the archive and to view the archive if it is private.',
  required: true,
  enabled: true,
  main: <AdminAskPg />,
}
const langAdminInput = {title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: true,
  enabled: false,
  main: <AdminInputPg />,
}
const langAdminRegister = {title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: true,
  enabled: false,
  main: <AdminRegisterPg />,
}
const creation = {title: 'Archive Creation',
  intro: 'If you are ready to continue, please create your archive. To change any information after you have created your dialect go to your archive portal on firstvoices.com',
  required: true,
  enabled: true,
  main: <CreationPg />,
}
const nextSteps = {title: 'Next Steps',
  intro: 'Now that your archive is created, here are some of the next steps in getting your archive up and running.',
  enabled: false,
  main: <NextStepsPg />,
}
const editPortal = {title: 'Editing Your Archive',
  intro: 'Your portal is the main page of your archive. It will contain your welcome greeting, information on the country/region your archive is from, and is where you can change your archive visibility settings.',
  enabled: false,
  main: <FirstStepsPg />,
}
const firstWord = {title: 'Create Your First Word',
  intro: 'To create your first word in your FirstVoices archive follow the steps below.',
  enabled: false,
  main: <FirstStepsPg />,
}
const batchUpload = {title: 'Batch Uploading',
  intro: 'Batch uploading allows you to upload many words or phrases all at once rather than one by one. This can be very useful if you already have information written down to upload or if you are able to have multiple recorders work on one file together. To batch upload words to your archive you have to create a csv file containing the information you want to upload. We have guides ___(link) on how to create and format your csv. When you are ready, email us at ___(email) and we will upload the entire list.',
  enabled: false,
  main: <FirstStepsPg />,
}
const done = {title: 'Thank You',
  intro: 'Thank you for using our archive creator.  {message}',
  enabled: true,
  main: <DonePg />,
}
const pages = [start, steps, checklist, names, languageGuess, languagePick, familyGuess, familyPick, logo, dialectInfo, alphabetGuess, alphabetPick, keyboards, langAdminAsk, langAdminInput, langAdminRegister, creation, nextSteps, editPortal, firstWord, batchUpload, done]

@provide
export default class ArchiveCreator extends Component { 
    static propTypes = {
      properties: PropTypes.object.isRequired,
      routeParams: PropTypes.object.isRequired,
      fetchPortal: PropTypes.func.isRequired,
      computePortal: PropTypes.object.isRequired,
    };

    constructor(props, context) {
      super(props, context)
    }

    render() {
      return <Page />
    }
}


class Page extends Component {

  constructor(props, context) {
    super(props, context)
    this.toNextPage = this.toNextPage.bind(this)
    this.toPrevPage = this.toPrevPage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {page: pages[0]}
  }

  toPrevPage() {
    let prevPage = this.state.page
    for (let i = pages.indexOf(prevPage) - 1;i >= 0;i--) {
      //if (pages[i].enabled) {
      prevPage = pages[i]
      break
      //}
    }
    this.setState({
      page: prevPage,
    })
  }

  toNextPage() {
    let nextPage = this.state.page
    for (let i = pages.indexOf(nextPage) + 1;i >= 0;i++) {
      //if (pages[i].enabled) {
      nextPage = pages[i]
      break
      //}
    }
    this.setState({
      page: nextPage,
    })
  }

  handleSubmit(){
    event.preventDefault()
  }

  render() {
    const page = this.state.page
    return (
      <div>
        <div className="row" style={{ marginTop: '25px' }} />
        <div className="col-xs-12" style={{marginBottom: '15px'}}>
          <Title name={page.title}/>
          <Intro text={page.intro}/>
          <div className="col-xs-12" />
            <form id="create-archive" onSubmit={this.handleSubmit}>
              
            </form>
            <Steps steps={['a', 'b', 'c a longger sentence ccccccc vvvvvvvv ddddddddd', 'd']}></Steps>
            <Buttons
              style = {{float: 'none'}} 
              //required={page.required}
              start={page === pages[0]}
              end={page === pages[pages.length - 1]}
              onBackClick={this.toPrevPage}
              onNextClick={this.toNextPage}
            />
        </div>
      </div>

    )
  }
}

/*
<DropDown options={['one', 'two', 'three']} title="choose one" form="create-archive" />
<EnterText title="Enter dialect:" form="create-archive" />
<EnterFile title="Upload image:" form="create-archive" />
<Checklist steps={['first', 'second', 'third', 'fourth']}/>
<SubmitButton form="create-archive"/>
<Steps steps={['a', 'b', 'c a longger sentence ccccccc vvvvvvvv ddddddddd', 'd']}></Steps>
<EnterText title="Enter dialect:" subtitle='this is very important' form="create-archive" />
*/

 const TextFieldStyle = {
  border: '1px solid',
  borderColor: '#a2291d',
  width: '100%',
  paddingLeft: '5px',
  height: '34px',
  lineHeight: '10px',
  fontSize: '14px',
}

function Intro(props) {
  return (
    <p>{props.text}</p>
  )
}

const headerStyle = {
  fontWeight: '500',
  margin: '15px 0 10px 0',
}

function Title(props) {
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

class Main extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <div>
                main
      </div>
    )
  }
}

//const style = {outlined:true}

class Buttons extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const next = this.props.end ? '' : <FlatButton disabled={this.props.required} onClick={this.props.onNextClick}>NEXT</FlatButton>
    const back = this.props.start ? '' : <FlatButton onClick={this.props.onBackClick}>BACK</FlatButton>
    return (
      <div>
        <div className="col-xs-6 text-left ">
          <div className="previous">
            {back}
          </div>
        </div>
        <div className="col-xs-6 text-right ">
          <div className="next">
            {next}
          </div>
        </div>
      </div>
    )
  }
}

class DropDown extends Component {
  constructor(props, context) {
    super(props, context)
  }

  /* jQuery('option').mousedown(function(e) {
  e.preventDefault();
  var originalScrollTop = $(this).parent().scrollTop();
  console.log(originalScrollTop);
  jQuery(this).prop('selected', $(this).prop('selected') ? false : true);
  var self = this;
  jQuery(this).parent().focus();
  setTimeout(function() {
      jQuery(self).parent().scrollTop(originalScrollTop);
  }, 0); */

  render() {
    var choices = this.props.options.map((opt, index)=>
    <option key={index}>{opt}</option>)
    return (
      <div>
        <label className="control-label">{this.props.title}</label>
        <div/>
        <input className='form-control' type='text' list='options' multiple='multiple'/>
        <datalist id='options' form={this.props.form}>{choices}</datalist>
      </div>
    )
  }
}


class EnterText extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    var sublabel = this.props.subtitle ? <h6>{this.props.subtitle}</h6>:''
    var enter = this.props.type=='file'? <input className='form-control' type='file' accept='image/*'form={this.props.form}/>:<input className='form-control' type='text' form={this.props.form}/>
    return(
      <div>
        <label className="control-label">
          {this.props.title}
          {sublabel}
        </label>
        {enter} 
      </div>
    )
  }
}

/* class EnterFile extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <div>
        <label className="control-label">{this.props.title}</label>
        
      </div>
    )
  }
} */
class Checklist extends Component{
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

class Steps extends Component{
  constructor(props, context) {
    super(props, context)
  }
  
  render(){
    var steps = this.props.steps
    var stepsList = []
    for (let i=0;i<steps.length;i++){
      stepsList.push(<div style={stepNumberStyle}>{i+1}</div>)
      stepsList.push(<div className='c' style={stepTextStyle}>{steps[i]}</div>) 
      stepsList.push(<div className='clearfix' />)
    }
    return (
      <div className='row' style={gridStyle}>
        {stepsList}
      </div>
    )
  }
}

var gridStyle = {
  display: 'grid',
  columnGap: '20px',
  gridTemplateColumns: '30px auto auto',
  gridTemplateRows: 'none',
  justify: 'left',
}

var stepTextStyle = {
  float:'left',
  fontSize: '14px',
  lineHeight: '30px',
  paddingTop: '9.5px', 
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
  margin: '10px', 
}

class SubmitButton extends Component{
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

class CancelAlert extends Component{
  constructor(props, context) {
    super(props, context)
  }

  render(){
    return(
      <div/>
    )
  }
}

function StepsPg() {
  return <Steps steps={["start", "enter info", "add stuff", "create"]}/>;
}

function ChecklistPg(){ 
  return <Checklist steps={["step one", 'step 2', 'step 3']}/>;
}

function NamesPg() {
  return (
    <div>
      <EnterText title='comm' subtitle= 'fseparate multiple w comma' form='ff'/>
      <EnterText title='dial' subtitle= 'optional if know' form='ff'/>
      <EnterText title='arch' subtitle= 'required, will be archive name' form='ff'/>
    </div>
  );
}

function GuessPg(){
  return <DropDown title='Is guess correct?' options={['correct', 'incorrect']} form='ff'/>;
}

function PickPg(){
  return <DropDown title='Please choose own' options={['generated', 'options', 'from', 'db']} form='ff'/>;
}
//EnterText other popup

function LogoPg(){
  return <EnterText title='please enter img' type='file' form='ff'/>;
}

function DialectInfoPg() {
  return (
    <div>
      <DropDown title='country' options={['generated', 'options', 'from', 'db']} form='ff'/>
      <DropDown title='region' options={['generated', 'options', 'from', 'db']} form='ff'/>
    </div>
  );
}
//EnterText other popup

function KeyboardsPg() { 
  return(
    <div>
      <DropDown title='keyboards' options={['generated', 'options', 'from', 'db']} form='ff'/>
      <DropDown title='keyboard guides' options={['generated', 'options', 'from', 'db']} form='ff'/>
    </div>
  );
}
  //multi select

function AdminAskPg() {
  return <DropDown title='Already have account?' options={['yes', 'no']} form='ff'/>;
}

function AdminInputPg() {
  return <EnterText title='please enter email of account' form='ff'/>;
}

function AdminRegisterPg() {
  return <div>embed registration page here</div>;
}

function CreationPg(){
  return <SubmitButton />;
}

function NextStepsPg() {
  return(
    <Checklist steps={["step one", 'step 2', 'step 3']}/>
  );
}
//<ArchiveButton />
//<CancelButton />

function FirstStepsPg(){
  return <Steps steps={["how", "to", "get", "started"]}/>;
}

function DonePg(){
  return(
    <div>archive button</div>
  );
}
//ArchiveButton
