import React, { Component, PropTypes } from 'react'
import {ArchiveButton, CancelButton, SubmitButton, Steps, Checklist, DropDown, EnterText} from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/components.js'

var handler 
var submitHandler
var cancelHandler 
var archiveHandler 

export function setHandler(handleChange, handleSubmit, handleCancel, handleArchive){
  handler = handleChange
  submitHandler = handleSubmit 
  cancelHandler = handleCancel
  archiveHandler = handleArchive
}

var start = {
  title: 'Start a FirstVoices Archive',
  intro: 'FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization. \n \n \n FirstVoices holds {numberOfDialects} dialect archives where communities are able to upload their alphabet, language, stories, songs, and resources for language learners to access. This guide will walk you through the process of creating your own archive on firstvoices.com.',
  enabled: true,
  main:'',
  required: null,
};
var steps = {
  title: 'Archive Creation Steps',
  intro: 'This guide will walk you through the steps to create a new archive on FirstVoices.  Required steps are marked with *.',
  enabled: true,
  main: <StepsPg steps={['Complete the language revitalization checklist', 'Name your archive *', 'Select your language and language family *']}
        />,
  required: null,
};
var checklist = {
  title: 'Getting Started Checklist',
  intro: 'This checklist contains some common steps to complete before starting your FirstVoices archive. These steps make it more likely your language revitalization efforts and archive will be successful, but are not all necessary and may or may not be applicable to your dialect.',
  enabled: true,
  main: <ChecklistPg steps={[]}/>,
  required: null,
};
var names = {
  title: 'Archive Name',
  intro: '',
  required: 'archiveName',
  enabled: true,
  main: <NamesPg />,
}
var languageGuess = {
  title: 'Language',
  intro: '',
  required: 'languageGuessAnswer',
  enabled: true,
  main: <GuessPg name='languageGuessAnswer' options={[]}/>,
}
var languagePick = {
  title: 'Langauge',
  intro: 'Choose one of the languages already on FirstVoices or enter a new one.',
  required: 'language',
  enabled: false,
  main: <PickPg name='language' options={[]}/>,
}
var familyGuess = {
  title: 'Language Family',
  intro: '',
  required: 'familyGuessAnswer',
  enabled: true,
  main: <GuessPg name='familyGuessAnswer' options={[]}/>,
}
var familyPick = {
  title: 'Language Family',
  intro: 'Choose one of the language families already on FirstVoices or enter a new one.',
  required: 'family',
  enabled: false,
  main: <PickPg name='family' options={[]}/>,
}
var logo = {
  title: 'Logo',
  intro: "This will be the picture used for your archive's thumbnail. If you have a logo ready please enter it below or else the default will be used for now. \n\n(This is optional. You will be able to enter or change your logo later)",
  enabled: true,
  main: <LogoPg />,
  required: null,
}
var dialectInfo = {
  title: 'Dialect Information',
  intro: 'Please enter some basic information about your dialect/community. This information is optional and can be changed later.',
  enabled: true,
  main: <DialectInfoPg options={[]}/>,
  required: null,
}
var alphabetGuess = {
  title: 'Alphabet',
  intro: '',
  required: null, // should this be the case ???
  enabled: true,
  main: <GuessPg name='alphabetGuessAnswer' options={[]}/>,
}
var alphabetPick = {
  title: 'Alphabet',
  intro: 'If your alphabet is the same as an archive already on FirstVoices you can select it below to automatically add it to your archive.',
  enabled: false,
  main: <PickPg name='alphabet' options={[]}/>,
  required: null,
}
var keyboards = {
  title: 'Keyboards',
  intro: 'If you would like to add a FirstVoices keyboard  and/or keyboard installation guide to your archive you can select them below. If there is no keyboard for your language and you would like to create one _____. ',
  enabled: true,
  main: <KeyboardsPg options={['ok', 'no']}/>,// what to do with double options ??

  required: null,
}
var langAdminAsk = {
  title: 'Langauge Administrator',
  intro: 'The language administrator of your archive controls who has access to the archive and what is published to the archive. They are also responsible for approving users to be able to add to the archive and to view the archive if it is private.',
  required: 'langAdminAskAnswer',
  enabled: true,
  main: <LangAdminAskPg options={['yes', 'no']}/>, 
}
var langAdminInput = {
  title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: 'langAdmin',
  enabled: false,
  main: <LangAdminInputPg />,
}
var langAdminRegister = {
  title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: 'langAdmin',
  enabled: false,
  main: <LangAdminRegisterPg />,
}
var creation = {
  title: 'Archive Creation',
  intro: 'If you are ready to continue, please create your archive. To change any information after you have created your dialect go to your archive portal on firstvoices.com',
  required: 'created',
  enabled: true,
  main: <CreationPg />,
}
var nextSteps = {
  title: 'Next Steps',
  intro: 'Now that your archive is created, here are some of the next steps in getting your archive up and running.',
  enabled: false,
  main: <NextStepsPg steps={[]}/>,
  required: null,
}
var editPortal = {
  title: 'Editing Your Archive',
  intro: 'Your portal is the main page of your archive. It will contain your welcome greeting, information on the country/region your archive is from, and is where you can change your archive visibility settings.',
  enabled: false,
  main: <FirstStepsPg steps={[]}/>,
  required: null,
}
var firstWord = {
  title: 'Create Your First Word',
  intro: 'To create your first word in your FirstVoices archive follow the steps below.',
  enabled: false,
  main: <FirstStepsPg steps={[]}/>,
  required: null,
}
var batchUpload = {
  title: 'Batch Uploading',
  intro: 'Batch uploading allows you to upload many words or phrases all at once rather than one by one. This can be very useful if you already have information written down to upload or if you are able to have multiple recorders work on one file together. To batch upload words to your archive you have to create a csv file containing the information you want to upload. We have guides ___(link) on how to create and format your csv. When you are ready, email us at ___(email) and we will upload the entire list.',
  enabled: false,
  main: <FirstStepsPg steps={[]}/>,
  required: null,
}
var done = {
  title: 'Thank You',
  intro: 'Thank you for using our archive creator.  {message}',
  enabled: true,
  main: <DonePg />,
  required: null,
}

function StepsPg(props) {
  return <Steps steps={props.steps} />;
}

function ChecklistPg(props){ 
  return <Checklist steps={props.steps}/>;
}

function NamesPg(props) {
  return (
    <div>
      <EnterText name='community' title='comm' subtitle= 'separate multiple w comma' handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <EnterText name='dialect' title='dial' subtitle= 'optional if know' handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <EnterText name='archiveName' title='arch' subtitle= 'required, will be archive name' handleChange={handler} />
    </div>
  );
}

function GuessPg(props){
  return <DropDown name={props.name} title='Is guess correct?' options={props.options} handleChange={handler} />;
}

function PickPg(props){
  return <DropDown name={props.name} title='Please choose own' options={props.options} handleChange={handler} />;
}
//EnterText other popup

function LogoPg(props){
  return <EnterText name='logo' title='please enter img' type='file' handleChange={handler}/>;
}

function DialectInfoPg(props){
  return (
    <div>
      <DropDown name='country' title='country' options={props.options} handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <DropDown name='region' title='region' options={props.options} handleChange={handler}/>
    </div>
  );
}
//EnterText other popup

function KeyboardsPg(props) { 
  return(
    <div>
      <DropDown name='keyboard' title='keyboards' options={props.options} handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <DropDown name='keyboardGuide' title='keyboard guides' options={props.options} handleChange={handler}/>
    </div>
  );
}
//multi select

function LangAdminAskPg(props) {
  return <DropDown name='langAdminAskAnswer' title='Already have account?' options={props.options} handleChange={handler} />;
}

function LangAdminInputPg(props) {
  return <EnterText name='langAdmin' title='please enter email of account' handleChange={handler}/>;
}

function LangAdminRegisterPg(props) {
  return <div>embed registration page here</div>;
}

function CreationPg(props){
  return (
    <div>
      <SubmitButton onSubmit={submitHandler}/>
      <CancelButton onCancel={cancelHandler}/>
    </div>
    )
}

function NextStepsPg(props) {
  return(
    <div>
      <Checklist steps={props.steps}/>
      <ArchiveButton goToArchive={archiveHandler}/>
    </div>
  );
}

function FirstStepsPg(props){
  return <Steps steps={props.steps} />;
}

function DonePg(props){
  return(
    <ArchiveButton goToArchive={archiveHandler}/>
  );
}

export const pages = [start, steps, checklist, names, languageGuess, languagePick, familyGuess, familyPick, logo, dialectInfo, alphabetGuess, alphabetPick, keyboards, langAdminAsk, langAdminInput, langAdminRegister, creation, nextSteps, editPortal, firstWord, batchUpload, done]
//export const required = [names, languageGuess, languagePick, familyGuess, familyPick, langAdminAsk, langAdminInput, langAdminRegister, creation]
//export const pageMain = [StepsPg, ChecklistPg, NamesPg, GuessPg, PickPg, LogoPg, DialectInfoPg, KeyboardsPg, LangAdminAskPg, LangAdminInputPg, LangAdminRegisterPg, CreationPg, NextStepsPg, FirstStepsPg, DonePg]


