import React, { Component, PropTypes } from 'react'
//import {CancelAlert, SubmitButton, Steps, Checklist, DropDown, EnterText} from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/components.js'


var start = {
  title: 'Start a FirstVoices Archive',
  intro: 'FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization.\n \nFirstVoices holds {numberOfDialects} dialect archives where communities are able to upload their alphabet, language, stories, songs, and resources for language learners to access. This guide will walk you through the process of creating your own archive on firstvoices.com.',
  enabled: true,
  main:'',
};
var steps = {
  title: 'Archive Creation Steps',
  intro: 'This guide will walk you through the steps to create a new archive on FirstVoices.  Required steps are marked with *.',
  enabled: true,
  main: {steps:["start", "enter info", "longer sentence that will hopefullly need to wrap around and potentially cause problems add stuff", "create"], form:'archive-creator'},
};
var checklist = {
  title: 'Getting Started Checklist',
  intro: 'This checklist contains some common steps to complete before starting your FirstVoices archive. These steps make it more likely your language revitalization efforts and archive will be successful, but are not all necessary and may or may not be applicable to your dialect.',
  enabled: true,
  main: <ChecklistPg />,
};
var names = {
  title: 'Archive Name',
  intro: '',
  required: true,
  enabled: true,
  main: <NamesPg />,
}
var languageGuess = {
  title: 'Language',
  intro: '',
  required: true,
  enabled: true,
  main: <GuessPg />,
}
var languagePick = {
  title: 'Langauge',
  intro: 'Choose one of the languages already on FirstVoices or enter a new one.',
  required: true,
  enabled: false,
  main: <PickPg />,
}
var familyGuess = {
  title: 'Language Family',
  intro: '',
  required: true,
  enabled: true,
  main: <GuessPg />,
}
var familyPick = {
  title: 'Language Family',
  intro: 'Choose one of the language families already on FirstVoices or enter a new one.',
  required: true,
  enabled: false,
  main: <PickPg />,
}
var logo = {
  title: 'Logo',
  intro: "This will be the picture used for your archive's thumbnail. If you have a logo ready please enter it below or else the default will be used for now. \n\n(This is optional. You will be able to enter or change your logo later)",
  enabled: true,
  main: <LogoPg />,
}
var dialectInfo = {
  title: 'Dialect Information',
  intro: 'Please enter some basic information about your dialect/community. This information is optional and can be changed later.',
  enabled: true,
  main: <DialectInfoPg />,
}
var alphabetGuess = {
  title: 'Alphabet',
  intro: '',
  required: true, // should this be the case ???
  enabled: true,
  main: <GuessPg />,
}
var alphabetPick = {
  title: 'Alphabet',
  intro: 'If your alphabet is the same as an archive already on FirstVoices you can select it below to automatically add it to your archive.',
  enabled: false,
  main: <PickPg />,
}
var keyboards = {
  title: 'Keyboards',
  intro: 'If you would like to add a FirstVoices keyboard  and/or keyboard installation guide to your archive you can select them below. If there is no keyboard for your language and you would like to create one _____. ',
  enabled: true,
  main: <KeyboardsPg />,
}
var langAdminAsk = {
  title: 'Langauge Administrator',
  intro: 'The language administrator of your archive controls who has access to the archive and what is published to the archive. They are also responsible for approving users to be able to add to the archive and to view the archive if it is private.',
  required: true,
  enabled: true,
  main: <LangAdminAskPg />,
}
var langAdminInput = {
  title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: true,
  enabled: false,
  main: <LangAdminInputPg />,
}
var langAdminRegister = {
  title: 'Langauge Administrator',
  intro: 'Please complete the fields below to set up the language administrator account for your archive.',
  required: true,
  enabled: false,
  main: <LangAdminRegisterPg />,
}
var creation = {
  title: 'Archive Creation',
  intro: 'If you are ready to continue, please create your archive. To change any information after you have created your dialect go to your archive portal on firstvoices.com',
  required: true,
  enabled: true,
  main: <CreationPg />,
}
var nextSteps = {
  title: 'Next Steps',
  intro: 'Now that your archive is created, here are some of the next steps in getting your archive up and running.',
  enabled: false,
  main: <NextStepsPg />,
}
var editPortal = {
  title: 'Editing Your Archive',
  intro: 'Your portal is the main page of your archive. It will contain your welcome greeting, information on the country/region your archive is from, and is where you can change your archive visibility settings.',
  enabled: false,
  main: <FirstStepsPg />,
}
var firstWord = {
  title: 'Create Your First Word',
  intro: 'To create your first word in your FirstVoices archive follow the steps below.',
  enabled: false,
  main: <FirstStepsPg />,
}
var batchUpload = {
  title: 'Batch Uploading',
  intro: 'Batch uploading allows you to upload many words or phrases all at once rather than one by one. This can be very useful if you already have information written down to upload or if you are able to have multiple recorders work on one file together. To batch upload words to your archive you have to create a csv file containing the information you want to upload. We have guides ___(link) on how to create and format your csv. When you are ready, email us at ___(email) and we will upload the entire list.',
  enabled: false,
  main: <FirstStepsPg />,
}
var done = {
  title: 'Thank You',
  intro: 'Thank you for using our archive creator.  {message}',
  enabled: true,
  main: <DonePg />,
}

const pages = [start, steps, checklist, names, languageGuess, languagePick, familyGuess, familyPick, logo, dialectInfo, alphabetGuess, alphabetPick, keyboards, langAdminAsk, langAdminInput, langAdminRegister, creation, nextSteps, editPortal, firstWord, batchUpload, done]
//export const pageMain = [StepsPg, ChecklistPg, NamesPg, GuessPg, PickPg, LogoPg, DialectInfoPg, KeyboardsPg, LangAdminAskPg, LangAdminInputPg, LangAdminRegisterPg, CreationPg, NextStepsPg, FirstStepsPg, DonePg]

export default pages;