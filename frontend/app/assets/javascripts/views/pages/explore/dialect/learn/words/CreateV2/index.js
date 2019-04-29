/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component } from 'react'
import { PropTypes } from 'react'
import Immutable from 'immutable'
// import classNames from 'classnames'
import provide from 'react-redux-provide'
import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
// import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
// import fields from 'models/schemas/fields'
// import options from 'models/schemas/options'
import IntlService from 'views/services/intl'
import * as yup from 'yup'

import Select from './Select'
import Text from './Text'
import Checkbox from './Checkbox'
import FormContributors from './FormContributors'
import FormCulturalNotes from './FormCulturalNotes'
import FormDefinitions from './FormDefinitions'
import FormLiteralTranslations from './FormLiteralTranslations'
import FormRelatedAudio from './FormRelatedAudio'
import FormRelatedPictures from './FormRelatedPictures'
import FormRelatedVideos from './FormRelatedVideos'
import FormCategories from './FormCategories'
import StringHelpers from 'common/StringHelpers'
const intl = IntlService.instance
const { string, array, func, object } = PropTypes
/**
 * Create word entry
 */

export class CreateV2 extends Component {
  static propTypes = {
    windowPath: string.isRequired,
    splitWindowPath: array.isRequired,
    pushWindowPath: func.isRequired,
    replaceWindowPath: func.isRequired,
    fetchDialect2: func.isRequired,
    computeDialect2: object.isRequired,
    createWord: func.isRequired,
    computeWord: object.isRequired,
    routeParams: object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      formValue: null,
      wordPath: null,
      errors: [],
    }

    // NOTE: Using callback refs since on old React
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    this.form = null
    this.setFormRef = (element) => {
      this.form = element
    }

    this.createWordSchema = yup.object().shape({
      'dc:title': yup
        .string()
        .label('Name') // used when errored, message will say 'Name' instead of 'dc:title'
        .required(),
      'fv-word:part_of_speech': yup
        .string()
        .label('Part of speech')
        .required(),
      'fv-word:pronunciation': yup.string(),
      'fv-word:available_in_games': yup.string(),
      'fv:available_in_childrens_archive': yup.string(),
      'fv:cultural_note': yup.array().of(yup.string()),
      'fv:definitions': yup.array().of(yup.object().shape({ language: yup.string(), translation: yup.string() })),
      'fv:literal_translation': yup
        .array()
        .of(yup.object().shape({ language: yup.string(), translation: yup.string() })),
      'fv:reference': yup.string(),
      'fv:related_audio': yup.array().of(yup.string()),
      'fv:related_pictures': yup.array().of(yup.string()),
      'fv:source': yup.array().of(yup.string()),
    })
  }

  // Fetch data on initial render
  componentDidMount() {
    this._fetchData(this.props)
  }

  // Refetch data on URL change
  // componentWillReceiveProps(nextProps) {
  //   let currentWord
  //   let nextWord

  //   if (this.state.wordPath != null) {
  //     currentWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
  //     nextWord = ProviderHelpers.getEntry(nextProps.computeWord, this.state.wordPath)
  //   }

  //   if (nextProps.windowPath !== this.props.windowPath) {
  //     this._fetchData(nextProps)
  //   }

  //   // 'Redirect' on success
  //   if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
  //     NavigationHelpers.navigate(
  //       NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextWord), 'words'),
  //       nextProps.replaceWindowPath,
  //       true
  //     )
  //   }
  // }

  // shouldComponentUpdate(newProps) {
  //   switch (true) {
  //     case newProps.windowPath != this.props.windowPath:
  //       return true

  //     case newProps.computeDialect2 != this.props.computeDialect2:
  //       return true

  //     case newProps.computeWord != this.props.computeWord:
  //       return true
  //     default: // Note: do nothing
  //   }

  //   return false
  // }

  render() {
    // const FVWordOptions = Object.assign({}, selectn('FVWord', options))

    const computeEntities = Immutable.fromJS([
      {
        id: this.state.wordPath,
        entity: this.props.computeWord,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    // const computeWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    // Set default value on form
    // if (
    //   selectn('fields.fv:definitions.item.fields.language.attrs', FVWordOptions) &&
    //   selectn('response.properties.fvdialect:dominant_language', computeDialect2)
    // ) {
    //   FVWordOptions.fields['fv:definitions'].item.fields.language.attrs.defaultValue = selectn(
    //     'response.properties.fvdialect:dominant_language',
    //     computeDialect2
    //   )
    // }

    const { errors } = this.state

    let errorFeedback = null
    if (errors.length !== 0) {
      if (errors.length > 0) {
        const li = errors.map((error, i) => {
          return (
            <li key={i}>
              <label htmlFor={StringHelpers.clean(error.path, 'CLEAN_ID')}>{error.message}</label>
            </li>
          )
        })

        const intro = `Please correct the following ${errors.length > 1 ? 'items' : 'item'}:`
        errorFeedback = (
          <div className="alert alert-info">
            {intro}
            <ul>{li}</ul>
          </div>
        )
      }
    }
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <h1>
          {intl.trans(
            'views.pages.explore.dialect.learn.words.add_new_word_to_x',
            'Add New Word to ' + selectn('response.title', computeDialect2),
            null,
            [selectn('response.title', computeDialect2)]
          )}
        </h1>

        <form className="CreateV2" ref={this.setFormRef} onSubmit={this._onRequestSaveForm}>
          {/* WORD --------------- */}
          <Text
            className="Form__group"
            id={StringHelpers.clean('dc:title', 'CLEAN_ID')}
            labelText="Word"
            name="dc:title"
            value=""
            error={this._getError({ errors, fieldName: 'dc:title' })}
          />
          {/* PARTOFSPEECH --------------- */}
          <Select
            className="Form__group"
            id={StringHelpers.clean('fv-word:part_of_speech', 'CLEAN_ID')}
            labelText="Part of speech"
            name="fv-word:part_of_speech"
            value="basic"
          >
            {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
            <optgroup>
              <option value="basic">Basic</option>
              <option value="verb">Verb</option>
              <option value="noun">Noun</option>
              <option value="pronoun">Pronoun</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="interjection">Interjection</option>
              <option value="particle">Particle</option>
              <option value="advanced">Advanced</option>
              <option value="pronoun_personal">Pronoun - Personal</option>
              <option value="pronoun_reflexive">Pronoun - Reflexive</option>
              <option value="pronoun_reciprocal">Pronoun - Reciprocal</option>
              <option value="pronoun_demonstrative">Pronoun - Demonstrative</option>
              <option value="pronoun_relative">Pronoun - Relative</option>
              <option value="particle_postposition">Particle - Postposition</option>
              <option value="particle_quantifier">Particle - Quantifier</option>
              <option value="particle_article_determiner">Particle - Article/Determiner</option>
              <option value="particle_tense_aspect">Particle - Tense/Aspect</option>
              <option value="particle_modal">Particle - Modal</option>
              <option value="particle_conjunction">Particle - Conjunction</option>
              <option value="particle_auxiliary_verb">Particle - Auxiliary Verb</option>
              <option value="particle_adjective">Particle - Adjective</option>
              <option value="particle_adverb">Particle - Adverb</option>
              <option value="entity_noun_like_word">Entity (Noun-like word)</option>
              <option value="event_activity_verb_like_word">Event/Activity (Verb-like word)</option>
              <option value="event_activity_verb_like_word_transitive">
                Event/Activity (Verb-like word) - transitive
              </option>
              <option value="event_activity_verb_like_word_intransitive">
                Event/Activity (Verb-like word) - intransitive
              </option>
              <option value="event_activity_verb_like_word_reflexive">
                Event/Activity (Verb-like word) - reflexive
              </option>
              <option value="event_activity_verb_like_word_reciprocal">
                Event/Activity (Verb-like word) - reciprocal
              </option>
              <option value="suffix_prefix">Suffix / Prefix</option>
              <option value="question_word">Question word</option>
            </optgroup>
          </Select>
          {/* PRONOUNCIATION --------------- */}
          <Text
            className="Form__group"
            id={StringHelpers.clean('fv-word:pronunciation', 'CLEAN_ID')}
            labelText="Pronounciation"
            name="fv-word:pronunciation"
            value=""
            error={this._getError({ errors, fieldName: 'fv-word:pronunciation' })}
          />
          {/* Definitions --------------- */}
          <FormDefinitions className="Form__group" name="fv:definitions" />
          {/* Literal Translations --------------- */}
          <FormLiteralTranslations className="Form__group" name="fv:literal_translation" />
          {/* RELATED AUDIO --------------- */}
          <FormRelatedAudio className="Form__group" name="fv:related_audio" />
          {/* RELATED PICTURES --------------- */}
          <FormRelatedPictures className="Form__group" name="fv:related_pictures" />
          {/* RELATED VIDEOS --------------- */}
          <FormRelatedVideos className="Form__group" name="fv:related_pictures" />
          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyRelatedVideoBrowse" className="visually-hidden">
            {'Select a video from previously uploaded items'}
          </span>
          <span id="describedByRelatedVideoMove" className="visually-hidden">
            {`If you are adding multiple Related Videos, you can change the position of the Related Video with
the 'Move Related Video left' and 'Move Related Video right' buttons`}
          </span>
          {/* Related Phrases --------------- */}
          <fieldset className="Form__group">
            <legend>Related Phrases</legend>
            {/* <button type="button">Add Related Phrase</button> */}

            {/* Related Phrases > RELATED PHRASE --------------- */}
            {/* <fieldset className="Form__group">
                <legend>Related Phrase</legend>
                <input type="hidden" name="fv:related_phrases[0]" value="14869a80-b371-4e51-a458-1e1adf86e263" />
                <div>[PHRASE HERE]</div>

                <button type="button">Remove Related Phrase</button>

                <button type="button" aria-describedby="describedByRelatedPhraseMove">
                  Move Related Phrase up
                </button>
                <button type="button" aria-describedby="describedByRelatedPhraseMove">
                  Move Related Phrase down
                </button>
              </fieldset> */}

            {/* Related Phrases > RELATED PHRASE --------------- */}
            {/* <fieldset className="Form__group">
                <legend>Related Phrase</legend>
                <Text
                  className="Create__RelatedPhrase"
                  id="CreateWord__RelatedPhrase0"
                  labelText="Search existing phrases"
                  name="fv:related_phrases[1]"
                  value=""
                />
                <button type="button">Create new phrase</button>
                <button type="button" aria-describedby="describedbyRelatedPhraseBrowse">
                  Select from existing phrases
                </button>

                <button type="button">Remove Related Phrase</button>

                <button type="button" aria-describedby="describedByRelatedPhraseMove">
                  Move Related Phrase up
                </button>
                <button type="button" aria-describedby="describedByRelatedPhraseMove">
                  Move Related Phrase down
                </button>
              </fieldset> */}

            {/* SCREEN READER DESCRIPTIONS --------------- */}
            <span id="describedbyRelatedPhraseBrowse" className="visually-hidden">
              {'Select a video from previously uploaded items'}
            </span>
            <span id="describedByRelatedPhraseMove" className="visually-hidden">
              {`If you are adding multiple Related Phrases, you can change the position of the Related Phrase with
the 'Move Related Phrase up' and 'Move Related Phrase down' buttons`}
            </span>
          </fieldset>
          {/* CATEGORIES --------------- */}
          <FormCategories className="Form__group" name="fv-word:categories" />

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedByCategoryMove" className="visually-hidden">
            {`If you are adding multiple Categories, you can change the position of the Category with
the 'Move Category up' and 'Move Category down' buttons`}
          </span>
          {/* Cultural Notes --------------- */}
          <FormCulturalNotes className="Form__group" name="fv:cultural_note" />
          {/* REFERENCE --------------- */}
          <div className="Form__group">
            <Text
              className=""
              id="CreateWord__Reference1"
              labelText="Reference"
              name="fv:reference"
              ariaDescribedby="describedByReference"
              value=""
            />
            <span id="describedByReference">Origin of record (person, book, etc).</span>
          </div>
          {/* Contributors --------------- */}
          <FormContributors
            className="Form__group"
            textInfo="Contributors who helped create this record."
            name="fv:source"
          />
          {/* IN CHILDREN'S ARCHIVE --------------- */}
          <Checkbox
            className="Form__group"
            id="CreateWord__InKidsArchive0"
            labelText="Available in children's archive"
            name="fv:available_in_childrens_archive"
          />
          {/* IN GAMES --------------- */}
          <Checkbox
            className="Form__group"
            id="CreateWord__InGames0"
            labelText="Available in games"
            name="fv-word:available_in_games"
          />

          <button type="submit">Create new word</button>

          {errorFeedback}
        </form>
      </PromiseWrapper>
    )
  }

  _fetchData = (newProps) => {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  _onRequestSaveForm = async (e) => {
    // Prevent default behaviour
    e.preventDefault()
    const formData = this._getFormData()
    const formValidation = await this._validateForm(formData)
    if (formValidation.valid) {
      // console.log('IS VALID. WOULD SUBMIT FORM!')
      // const now = Date.now()
      // this.props.createWord(
      //   this.props.routeParams.dialect_path + '/Dictionary',
      //   {
      //     type: 'FVWord',
      //     name: now.toString(),
      //     properties: this._getFormData(),
      //   },
      //   null,
      //   now
      // )
      this.setState({
        errors: [],
      })
    } else {
      this.setState({
        errors: formValidation.errors,
      })
    }
    // this.setState({
    //   formValue: formDataFormatted,
    // })
    // Passed validation
    // if (formValue) {

    // const now = Date.now()
    // this.props.createWord(
    //   this.props.routeParams.dialect_path + '/Dictionary',
    //   {
    //     type: 'FVWord',
    //     name: now.toString(),
    //     properties: formDataFormatted,
    //   },
    //   null,
    //   now
    // )

    // Passed validation
    // if (formValue) {
    // this.setState({
    //   wordPath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now,
    // })
    // } else {
    // window.scrollTo(0, 0)
    // }
  }
  _getFormData = () => {
    const formDataFormatted = {}
    const formData = new FormData(this.form)

    for (const value of formData.entries()) {
      // parse any stringify-ed array/objects
      const name = value[0]
      const data = value[1]
      const isLiteralTranslation = /^fv:literal_translation/.test(name)
      const isDefinition = /^fv:definitions/.test(name)
      const isRelatedAudio = /^fv:related_audio/.test(name)
      const isRelatedPicture = /^fv:related_pictures/.test(name)
      const isCulturalNote = /^fv:cultural_note/.test(name)
      const isSource = /^fvm:source/.test(name)
      if (isLiteralTranslation || isDefinition || isRelatedAudio || isRelatedPicture || isCulturalNote || isSource) {
        formDataFormatted[name] = JSON.parse(data)
        continue
      }

      // TODO: check for file blobs!
      // formData.append(name, value, filename);

      formDataFormatted[name] = data
    }
    return formDataFormatted
  }
  _validateForm = async (formData) => {
    // Note: When `abortEarly === true` then `{ path, type } = invalid` is defined.
    // When `abortEarly === false` then `{ path, type } = invalid` is not defined! Data is found in `invalid.errors[]`.
    const validation = await this.createWordSchema.validate(formData, { abortEarly: false }).then(
      () => {
        return {
          valid: true,
          errors: [],
        }
      },
      (invalid) => {
        const { inner } = invalid
        const errors = inner.map((error) => {
          const { message, path, type } = error
          return {
            message,
            path,
            type,
          }
        })
        return {
          valid: false,
          errors,
        }
      }
    )
    return validation
  }
  _validateField = async ({ name, data }) => {
    // const formDataFormatted = this._getFormData()
    const results = await this._validateForm(data)
    const { valid, errors } = results

    if (valid === false) {
      const fieldErrored = errors.filter((error) => {
        return error.path === name
      })
      if (fieldErrored.length !== 0) {
        const fieldData = fieldErrored[0]
        fieldData.valid = false
        return fieldData
      }
    }
    return {
      valid: true,
    }
  }
  _getError = ({ errors, fieldName }) => {
    const error = errors.filter((errorItem) => {
      return errorItem.path === fieldName
    })
    if (error.length === 1) {
      return error[0]
    }
    return {}
  }
}

export default provide(CreateV2)
