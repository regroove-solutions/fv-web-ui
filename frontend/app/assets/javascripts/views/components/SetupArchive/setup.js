import React, { Component, PropTypes } from 'react'
import provide from 'react-redux-provide'
//import classNames from 'classnames'
import Autosuggest from 'react-autosuggest'
import {pages, setHandler} from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/pages.js'
//import pageMain from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/pages.js'
import {SubmitButton, Buttons, Title, Intro} from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/components.js'

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
    this.state = {page: pages[0], dialect:'', community:'',archiveName:'', languageGuessAnswer:'', 
    language:'',familyGuessAnswer:'', family:'', logo:'', countr:'', 
    region:'', alphabetGuessAnswer:'',alphabet:'', keyboard:'', keyboardGuide:'',
    langAdminAskAnswer:'', langAdmin:'', created:''}
    setHandler(this.handleChange)
  }

  toPrevPage() {
    let prevPage = this.state.page
    for (let i = pages.indexOf(prevPage) - 1;i >= 0;i--) {
      if (pages[i].enabled) {
      prevPage = pages[i]
      break
      }
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
      page: nextPage
    })
  }

  handleChange(e){
    const target = e.target;
    var name= target.getAttribute('name')
    this.setState({ [name]:target.value})

    
    if(name.endsWith('Answer')){
      if(name == 'langAdminAskAnswer'){
        pages[pages.indexOf(this.state.page)+1].enabled = target.value=='yes'? true:false
        pages[pages.indexOf(this.state.page)+2].enabled = !pages[pages.indexOf(this.state.page)+1].enabled
      }
      else{
        pages[pages.indexOf(this.state.page)+1].enabled = target.value == 'incorrect' ? true:false
      } 
    }
  }

  handleSubmit(e){
    e.preventDefault()
  }

  render() {
    const page = this.state.page
    var required = page.required? checkRequired(page.required, this.state):false
    return (
      <div style={{minHeight: '68vh', position:'relative'}}>
        <div className="row" style={{ marginTop: '25px' }} />
        <div className="col-xs-12" style={{marginBottom: '15px'}}/>
        <Title name={page.title}/>
        <Intro text={page.intro}/>
        <div>
          {page.main}
        </div>
        <Buttons
          required={required}
          start={page === pages[0]}
          end={page === pages[pages.length - 1]}
          onBackClick={this.toPrevPage}
          onNextClick={this.toNextPage}
        />
      </div>

    )
  }
}

function checkRequired(req, currentVals){
  if (!currentVals[req].trim()){
    return true
  }
  return false
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

/* function getMainPg(title, props){
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
} */
