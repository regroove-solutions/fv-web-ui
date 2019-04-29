import React, { Component, PropTypes } from 'react'
import provide from 'react-redux-provide'
//import classNames from 'classnames'
import Autosuggest from 'react-autosuggest'
import pages from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/pages.js'
//import pageMain from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/pages.js'
import {SubmitButton, Buttons, Title, Intro, CancelAlert, Steps, Checklist, DropDown, EnterText} from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/components.js'

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
    this.handleChange = this.handleChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
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
      if (pages[i].enabled) {
      nextPage = pages[i]
      break
      }
    }
    this.setState({
      page: nextPage,
    })
  }

  handleChange(event){
    console.log(event)
    const target = event.target;
    const value = target.value
    const name = target.name;

    if (value){
      console.log(value)
      var page = this.state.page
      if(page.required){
        page = page.required=false
        this.setState({
          page: page
        });
      }
    }  
  }

  handleSelect(event){
    
  }

  handleSubmit(event){
    event.preventDefault()
  }

  render() {
    const page = this.state.page
    var main = getMainPg(page.title, page.main)
    return (
      <div style={{minHeight: '68vh', position:'relative'}}>
        <div className="row" style={{ marginTop: '25px' }} />
        <div className="col-xs-12" style={{marginBottom: '15px'}}/>
        <Title name={page.title}/>
        <Intro text={page.intro}/>
        <div>
          {main}
        </div>
        <Buttons
          required={page.required}
          start={page === pages[0]}
          end={page === pages[pages.length - 1]}
          onBackClick={this.toPrevPage}
          onNextClick={this.toNextPage}
        />
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

function getMainPg(title, props){
  const nameToPage = {steps:StepsPg(props), checklist: ChecklistPg(props), 
                    names:NamesPg(props), languageGuess: GuessPg(props), 
                    languagePick:PickPg(props), familyGuess:GuessPg(props), 
                    familyPick:PickPg(props), logo:LogoPg(props), dialectInfo:DialectInfoPg(props), 
                    alphabetGuess:GuessPg(props), alphabetPick:PickPg(props), keyboards:KeyboardsPg(props), 
                    langAdminAsk:LangAdminAskPg(props), langAdminInput:LangAdminInputPg(props), 
                    langAdminRegister:LangAdminRegisterPg(props), creation: CreationPg(props), 
                    nextSteps:NextStepsPg(props), editPortal:FirstStepsPg(props), firstWord:FirstStepsPg(props), 
                    batchUpload: FirstStepsPg(props), done:DonePg(props)}

  if (!title in nameToPage.keys()){
    return ''
  }

  return nameToPage[title]
}

function StepsPg(props) {
  return <Steps steps={props.steps} form={props.form}/>;
}

function ChecklistPg(props){ 
  return <Checklist steps={["step one", 'step 2', 'step 3']}/>;
}

function NamesPg(props) {
  return (
    <div>
      <EnterText title='comm' subtitle= 'fseparate multiple w comma' form='archive-creator' handleChange={props.handleChange}/>
      <div style={{marginTop:'20px'}}/>
      <EnterText title='dial' subtitle= 'optional if know' form='archive-creator' handleChange={props.handleChange}/>
      <div style={{marginTop:'20px'}}/>
      <EnterText title='arch' subtitle= 'required, will be archive name' form='archive-creator' handleChange={props.handleChange}/>
    </div>
  );
}

function GuessPg(props){
  return <DropDown title='Is guess correct?' options={['correct', 'incorrect']} form='archive-creator' handleChange={props.handleChange}/>;
}

function PickPg(props){
  return <DropDown title='Please choose own' options={['generated', 'options', 'from', 'db', 'other']} form='archive-creator' handleChange={props.handleChange}/>;
}
//EnterText other popup

function LogoPg(props){
  return <EnterText title='please enter img' type='file' form='archive-creator' handleChange={props.handleChange}/>;
}

function DialectInfoPg(props) {
  return (
    <div>
      <DropDown title='country' options={['generated', 'options', 'from', 'db', 'other']} form='archive-creator' handleChange={props.handleChange}/>
      <div style={{marginTop:'20px'}}/>
      <DropDown title='region' options={['generated', 'options', 'from', 'db', 'other']} form='archive-creator' handleChange={props.handleChange}/>
    </div>
  );
}
//EnterText other popup

function KeyboardsPg(props) { 
  return(
    <div>
      <DropDown title='keyboards' options={['generated', 'options', 'from', 'db']} form='archive-creator' handleChange={props.handleChange}/>
      <div style={{marginTop:'20px'}}/>
      <DropDown title='keyboard guides' options={['generated', 'options', 'from', 'db']} form='archive-creator' handleChange={props.handleChange}/>
    </div>
  );
}
//multi select

function LangAdminAskPg(props) {
  return <DropDown title='Already have account?' options={['yes', 'no']} form='archive-creator' handleChange={props.handleChange}/>;
}

function LangAdminInputPg(props) {
  return <EnterText title='please enter email of account' form='archive-creator' handleChange={props.handleChange}/>;
}

function LangAdminRegisterPg(props) {
  return <div>embed registration page here</div>;
}

function CreationPg(props){
  return <SubmitButton />;
}

function NextStepsPg(props) {
  return(
    <Checklist steps={["step one", 'step 2', 'step 3']}/>
  );
}
//<ArchiveButton />
//<CancelButton />

function FirstStepsPg(props){
  return <Steps steps={["how", "to", "get", "started"]} form='archive-creator'/>;
}

function DonePg(props){
  return(
    <div>archive button</div>
  );
}
//ArchiveButton