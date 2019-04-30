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
  main: <StepsPg steps={['Complete the language revitalization checklist', 'Name your archive *', 'Select your language and language family *', 'Upload an archive logo', 'Add extra information to your archive', 'Select FirstVoices resources to add to your archive', 'Set a language administrator*', 'Create your archive *', 'Next Steps']}
        />,
  required: null,
};
var checklist = {
  title: 'Getting Started Checklist',
  intro: 'This checklist contains some common steps to complete before starting your FirstVoices archive. These steps make it more likely your language revitalization efforts and archive will be successful, but are not all necessary and may or may not be applicable to your dialect.',
  enabled: true,
  main: <ChecklistPg steps={['Discuss your language revitalization with FirstVoices', 'Apply for a First Peoples Cultural Council grant', 'Discuss language revitalization priorities with your community', 'Have an agreed upon alphabet for your dialect', 'Have language authority or band council resolution', 'Have some data ready to go ', 'Get fluent speakers willing to contribute to the archive']}/>,
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
  intro: "Based on your dialect name we think your dialect's language is {languageName} ",
  required: 'languageGuessAnswer',
  enabled: true,
  main: <GuessPg name='languageGuessAnswer' title="Would you like to set this as your dialect's language group?" subtitle='If not, you will be able to enter the correct language family.' options={['Yes, set this as my language', 'No, I would like to choose my own language']}/>,
}
var languagePick = {
  title: 'Langauge',
  intro: 'Choose one of the languages already on FirstVoices or enter a new one.',
  required: 'language',
  enabled: false,
  main: <PickPg name='language' title="Choose a language:" options={['access', 'values', 'from', 'backend', 'other']}/>,
}
var familyGuess = {
  title: 'Language Family',
  intro: "Based on your dialect name we think your dialect's language family is {languageFamilyName}",
  required: 'familyGuessAnswer',
  enabled: true,
  main: <GuessPg name='familyGuessAnswer' title="Would you like to set this as your archive's language family?" subtitle="If not, you will be able to enter the correct language family." options={["Yes, set this as my language family", "No, I would like to choose my own language family"]}/>,
}
var familyPick = {
  title: 'Language Family',
  intro: 'Choose one of the language families already on FirstVoices or enter a new one.',
  required: 'family',
  enabled: false,
  main: <PickPg name='family' title="Choose a language family:" options={['access', 'values', 'from', 'backend', 'other']}/>,
}
var logo = {
  title: 'Logo',
  intro: "This will be the picture used for your archive's thumbnail. If you have a logo ready please enter it below or else the default will be used for now. \n\n(This is optional. You will be able to enter or change your logo later)",
  enabled: true,
  main: <LogoPg title='Upload your logo:'/>,
  required: null,
}
var dialectInfo = {
  title: 'Dialect Information',
  intro: 'Please enter some basic information about your dialect/community. This information is optional and can be changed later.',
  enabled: true,
  main: <DialectInfoPg />,
  required: null,
}
var alphabetGuess = {
  title: 'Alphabet',
  intro: "Based on your dialect we think your language's alphabet is {alphabet}",
  required: null, // should this be the case 
  enabled: true,
  main: <GuessPg name='alphabetGuessAnswer' title="Would you like to add this alphabet to your archive?" options={['Yes, add these letters to my archive', 'No, do not add these letters to my archive']}/>,
}
var alphabetPick = {
  title: 'Alphabet',
  intro: 'If your alphabet is the same as an archive already on FirstVoices you can select it below to automatically add it to your archive.',
  enabled: false,
  main: <PickPg name='alphabet' title="FirstVoices Archives:" options={['access', 'values', 'from', 'backend', 'other']}/>,
  required: null,
}
var keyboards = {
  title: 'Keyboards',
  intro: 'If you would like to add a FirstVoices keyboard and/or keyboard installation guide to your archive you can select them below. If there is no keyboard for your language and you would like to create one _____. ',
  enabled: true,
  main: <KeyboardsPg  options={['access', 'values', 'from', 'backend', 'other']}/>, // what to do with double options ??
  required: null,
}
var langAdminAsk = {
  title: 'Langauge Administrator',
  intro: 'The language administrator of your archive controls who has access to the archive and what is published to the archive. They are also responsible for approving users to be able to add to the archive and to view the archive if it is private.',
  required: 'langAdminAskAnswer',
  enabled: true,
  main: <LangAdminAskPg title="Do you already have a FirstVoices account which you would like to set as the language administrator?" options={['Yes, I already have an account', 'No, I would like to create an account']}/>, 
}
var langAdminInput = {
  title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: 'langAdmin',
  enabled: false,
  main: <LangAdminInputPg title="Please enter the email of the account you would like to set as the language administrator below."/>,
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
  main: <NextStepsPg steps={['Editing Your Portal', 'Creating Your First Word', 'Batch Uploading Words and Phrases']}/>,
  required: null,
}
var editPortal = {
  title: 'Editing Your Archive',
  intro: 'Your portal is the main page of your archive. It will contain your welcome greeting, information on the country/region your archive is from, and is where you can change your archive visibility settings.',
  enabled: false,
  main: <FirstStepsPg steps={['Go to firstvoices.com', 'Login with the account you created before', 'Click on Choose A Language', 'Click on the Workspace tab in the top right', 'Go to your archive', 'From here you can click on the pencil next to each field to edit it or click on Edit Portal to change many fields at once', "Don't forget to click on the Save button when you're done making changes", 'To publish your changes for all community members to see, click on the Publish Changes button at the top of your portal']}/>,
  required: null,
}
var firstWord = {
  title: 'Create Your First Word',
  intro: 'To create your first word in your FirstVoices archive follow the steps below.',
  enabled: false,
  main: <FirstStepsPg steps={['Go to your Workspace editor', 'Click on Learn Our Language', "From here you can choose the correct tab what you're adding (Words, Phrases, Songs, Stories, or Alphabet). To create a word we will choose the Words button.", 'Click on the Create A New Word button in the top right corner', "Enter the information for your new word. You can fill in as many of the fields for the word as you want, but only the word and its part of speech are required", 'After you click the Save button the word will be added to your archive such that only contributors can see the changes', 'If your archive is enabled, you can publish any changes so that every community member can see them']}/>,
  required: null,
}
var batchUpload = {
  title: 'Batch Uploading',
  intro: 'Batch uploading allows you to upload many words or phrases all at once rather than one by one. This can be very useful if you already have information written down to upload or if you are able to have multiple recorders work on one file together. To batch upload words to your archive you have to create a csv file containing the information you want to upload. We have guides ___(link) on how to create and format your csv. When you are ready, email us at ___(email) and we will upload the entire list.',
  enabled: false,
  main: '',
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
      <EnterText name='community' title='Enter the name of your community:' subtitle= 'If multiple communities are collaborating on this archive please separate the names by a comma.' handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <EnterText name='dialect' title='Enter the name of your dialect:' subtitle= 'If you have a specific dialect, please enter it below.' handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <EnterText name='archiveName' title='Enter the name of your archive:  (*required)' subtitle= 'This will be the name displayed on the main page of your archive and may or may not include the name of your community.' handleChange={handler} />
    </div>
  );
}

function GuessPg(props){
  return <DropDown name={props.name} title={props.title} subtitle={props.subtitle} options={props.options} handleChange={handler} />;
}

function PickPg(props){
  return <DropDown name={props.name} title={props.title} subtitle={props.subtitle} options={props.options} handleChange={handler} />;
}
//EnterText other popup

function LogoPg(props){
  return <EnterText name='logo' title={props.title} type='file' handleChange={handler}/>;
}

function DialectInfoPg(props){
  return (
    <div>
      <DropDown name='country' title='Country' options={['Canada', 'United States', 'Australia', 'other']} handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <DropDown name='region' title='Region' options={['access', 'values', 'from', 'backend', 'other']} handleChange={handler}/>
    </div>
  );
}
//EnterText other popup

function KeyboardsPg(props) { 
  return(
    <div>
      <DropDown name='keyboard' title='FirstVoices Keyboards:' options={props.options} handleChange={handler}/>
      <div style={{marginTop:'20px'}}/>
      <DropDown name='keyboardGuide' title='FirstVoices Installation Guides:' options={props.options} handleChange={handler}/>
    </div>
  );
}
//multi select

function LangAdminAskPg(props) {
  return <DropDown name='langAdminAskAnswer' title={props.title} options={props.options} handleChange={handler} />;
}

function LangAdminInputPg(props) {
  return <EnterText name='langAdmin' title={props.title} handleChange={handler}/>;
}

function LangAdminRegisterPg(props) {
  return <div>embed registration page here</div>;
}

function CreationPg(props){
  return (
    <div>
      <p>Create Archive: Your archive will be created privately so that only you can see it. You will be able to now enter and edit your archive. It will remain active for 30 days and then will be removed from FirstVoices. If you would like to keep your archive longer than this or have others be able to access your archive please contact FirstVoices at support@fpcc.ca</p>
      <p>Cancel: Your archive will not be created and the information you have entered so far will be permanently lost</p>
      <SubmitButton onSubmit={submitHandler}/>
      <CancelButton onCancel={cancelHandler}/>
    </div>
    )
}

function NextStepsPg(props) {
  return(
    <div>
      <Checklist steps={props.steps}/>
      <p>If you feel confident using FirstVoices already, feel free to begin working on your archive now.</p>
      <ArchiveButton goToArchive={archiveHandler}/>
    </div>
  );
}

function FirstStepsPg(props){
  return <Steps steps={props.steps} />;
}

function DonePg(props){
  return(
    <div>
      <p>We hope this demo has been useful. If you have any further questions you can contact us at support@fpcc.ca.</p>
      <p>Your archive will be available for 30 days. If you wish to keep your archive longer than this or delete it sooner please contact us. If you have any further questions you can contact us at support@fpcc.ca.</p>
      <ArchiveButton goToArchive={archiveHandler}/>
    </div>
  );
}

export const pages = [start, steps, checklist, names, languageGuess, languagePick, familyGuess, familyPick, logo, dialectInfo, alphabetGuess, alphabetPick, keyboards, langAdminAsk, langAdminInput, langAdminRegister, creation, nextSteps, editPortal, firstWord, batchUpload, done]
//export const required = [names, languageGuess, languagePick, familyGuess, familyPick, langAdminAsk, langAdminInput, langAdminRegister, creation]
//export const pageMain = [StepsPg, ChecklistPg, NamesPg, GuessPg, PickPg, LogoPg, DialectInfoPg, KeyboardsPg, LangAdminAskPg, LangAdminInputPg, LangAdminRegisterPg, CreationPg, NextStepsPg, FirstStepsPg, DonePg]


