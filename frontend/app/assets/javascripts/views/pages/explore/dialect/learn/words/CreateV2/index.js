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
import NavigationHelpers from 'common/NavigationHelpers'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'
// import fields from 'models/schemas/fields'
import options from 'models/schemas/options'
import IntlService from 'views/services/intl'

import Select from './Select'
import Text from './Text'
import Checkbox from './Checkbox'
import CreateAudio from './CreateAudio'
import CreatePicture from './CreatePicture'
import CreateVideo from './CreateVideo'
import FormContributors from './FormContributors'
import FormCulturalNotes from './FormCulturalNotes'
import FormDefinitions from './FormDefinitions'
import FormLiteralTranslations from './FormLiteralTranslations'

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
    }

    // Bind methods to 'this'
    ;['_onRequestSaveForm'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  fetchData(newProps) {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentWillReceiveProps(nextProps) {
    let currentWord
    let nextWord

    if (this.state.wordPath != null) {
      currentWord = ProviderHelpers.getEntry(this.props.computeWord, this.state.wordPath)
      nextWord = ProviderHelpers.getEntry(nextProps.computeWord, this.state.wordPath)
    }

    if (nextProps.windowPath !== this.props.windowPath) {
      this.fetchData(nextProps)
    }

    // 'Redirect' on success
    if (selectn('success', currentWord) != selectn('success', nextWord) && selectn('success', nextWord) === true) {
      NavigationHelpers.navigate(
        NavigationHelpers.generateUIDPath(nextProps.routeParams.theme, selectn('response', nextWord), 'words'),
        nextProps.replaceWindowPath,
        true
      )
    }
  }

  shouldComponentUpdate(newProps) {
    switch (true) {
      case newProps.windowPath != this.props.windowPath:
        return true

      case newProps.computeDialect2 != this.props.computeDialect2:
        return true

      case newProps.computeWord != this.props.computeWord:
        return true
      default: // Note: do nothing
    }

    return false
  }

  _onRequestSaveForm(e) {
    // Prevent default behaviour
    e.preventDefault()

    const formValue = this.refs.form_word_create.getValue()

    //let properties = '';
    const properties = {}

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key) && key) {
        if (formValue[key] && formValue[key] != '') {
          //properties += key + '=' + ((formValue[key] instanceof Array) ? JSON.stringify(formValue[key]) : formValue[key]) + '\n';
          properties[key] = formValue[key]
        }
      }
    }

    this.setState({
      formValue: properties,
    })

    // Passed validation
    if (formValue) {
      const now = Date.now()
      this.props.createWord(
        this.props.routeParams.dialect_path + '/Dictionary',
        {
          type: 'FVWord',
          name: now.toString(),
          properties: properties,
        },
        null,
        now
      )

      this.setState({
        wordPath: this.props.routeParams.dialect_path + '/Dictionary/' + now.toString() + '.' + now,
      })
    } else {
      //let firstError = this.refs["form_word_create"].validate().firstError();
      window.scrollTo(0, 0)
    }
  }

  render() {
    const FVWordOptions = Object.assign({}, selectn('FVWord', options))

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
    if (
      selectn('fields.fv:definitions.item.fields.language.attrs', FVWordOptions) &&
      selectn('response.properties.fvdialect:dominant_language', computeDialect2)
    ) {
      FVWordOptions.fields['fv:definitions'].item.fields.language.attrs.defaultValue = selectn(
        'response.properties.fvdialect:dominant_language',
        computeDialect2
      )
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

        {/* <form onSubmit={this._onRequestSaveForm}>
              <t.form.Form
                ref="form_word_create"
                type={t.struct(selectn('FVWord', fields))}
                context={selectn('response', computeDialect2)}
                value={this.state.formValue}
                options={FVWordOptions}
              />
              <div className="form-group">
                <button type="submit" className="btn btn-primary">
                  {intl.trans('save', 'Save', 'first')}
                </button>
              </div>
            </form> */}
        <div style={{ display: 'flex' }}>
          <form>
            {/* WORD --------------- */}
            <Text className="Create__Word" id="CreateWord__Word" labelText="Word" name="dc:title" value="" />

            {/* PARTOFSPEECH --------------- */}
            <Select
              className="Create__PartOfSpeech"
              id="CreateWord__PartOfSpeech"
              labelText="Part of speech"
              name="fv-word:part_of_speech"
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
              className="Create__Pronounciation"
              id="CreateWord__Pronounciation"
              labelText="Pronounciation"
              name="fv-word:pronunciation"
              value=""
            />

            {/* Definitions --------------- */}
            <FormDefinitions name="fv:definitions" />

            {/* Literal Translations --------------- */}
            <FormLiteralTranslations name="fv:literal_translation" />

            {/* RELATED AUDIO --------------- */}
            <fieldset>
              <legend>Related Audio</legend>
              <button type="button">Add Related Audio Item</button>

              {/* RELATED AUDIO > RELATED AUDIO ITEM --------------- */}
              <fieldset>
                <legend>Related Audio Item</legend>
                <input type="hidden" name="fv:related_audio[0]" value="49d81e97-8220-4e8f-bed2-b58bfc040868" />
                <div>[AUDIO COMPONENT HERE]</div>
                <button type="button">Remove Related Audio Item</button>
                <button type="button" aria-describedby="describedByRelatedAudioMove">
                  Move Related Audio Item left
                </button>
                <button type="button" aria-describedby="describedByRelatedAudioMove">
                  Move Related Audio Item right
                </button>
              </fieldset>

              {/* RELATED AUDIO > RELATED AUDIO ITEM --------------- */}
              <fieldset>
                <legend>Related Audio Item</legend>
                <input type="hidden" name="fv:related_audio[1]" value="" />
                <button type="button">Upload new audio</button>
                <button type="button" aria-describedby="describedbyRelatedAudioBrowse">
                  Select from existing audio
                </button>
                <button type="button">Remove Related Audio Item</button>
                <button type="button" aria-describedby="describedByRelatedAudioMove">
                  Move Related Audio Item left
                </button>
                <button type="button" aria-describedby="describedByRelatedAudioMove">
                  Move Related Audio Item right
                </button>
              </fieldset>

              {/* SCREEN READER DESCRIPTIONS --------------- */}
              <span id="describedbyRelatedAudioBrowse" className="visually-hidden">
                {'Select an audio sample from previously uploaded items'}
              </span>
              <span id="describedByRelatedAudioMove" className="visually-hidden">
                {`If you are adding multiple Related Audio Items, you can change the position of the item with
the 'Move Related Audio Item left' and 'Move Related Audio Item right' buttons`}
              </span>
            </fieldset>

            {/* Related Pictures --------------- */}
            <fieldset>
              <legend>Related Pictures</legend>
              <button type="button">Add Related Picture</button>

              {/* Related Pictures > RELATED PICTURE --------------- */}
              <fieldset>
                <legend>Related Picture</legend>
                <input type="hidden" name="fv:related_pictures[0]" value="23356f30-b75e-4965-a337-baa57e6404d4" />
                <div>[PICTURE COMPONENT HERE]</div>
                <button type="button">Remove Related Picture</button>
                <button type="button" aria-describedby="describedByRelatedPictureMove">
                  Move Related Picture left
                </button>
                <button type="button" aria-describedby="describedByRelatedPictureMove">
                  Move Related Picture right
                </button>
              </fieldset>

              {/* Related Pictures > RELATED PICTURE --------------- */}
              <fieldset>
                <legend>Related Picture</legend>
                <input type="hidden" name="fv:related_pictures[1]" value="" />
                <button type="button">Upload a new picture</button>
                <button type="button" aria-describedby="describedbyRelatedPictureBrowse">
                  Select an existing picture
                </button>
                <button type="button">Remove Related Picture</button>
                <button type="button" aria-describedby="describedByRelatedPictureMove">
                  Move Related Picture left
                </button>
                <button type="button" aria-describedby="describedByRelatedPictureMove">
                  Move Related Picture right
                </button>
              </fieldset>

              {/* SCREEN READER DESCRIPTIONS --------------- */}
              <span id="describedbyRelatedPictureBrowse" className="visually-hidden">
                {'Select a picture from previously uploaded items'}
              </span>
              <span id="describedByRelatedPictureMove" className="visually-hidden">
                {`If you are adding multiple Related Pictures, you can change the position of the Related Picture with
the 'Move Related Picture left' and 'Move Related Picture right' buttons`}
              </span>
            </fieldset>

            {/* Related Videos --------------- */}
            <fieldset>
              <legend>Related Videos</legend>
              <button type="button">Add Related Video</button>

              {/* Related Videos > RELATED VIDEO --------------- */}
              <fieldset>
                <legend>Related Video</legend>
                <input type="hidden" name="fv:related_videos[0]" value="e597182c-ea7b-4f2a-8666-192ac5d59d3c" />
                <div>[VIDEO COMPONENT HERE]</div>
                <button type="button">Remove Related Video</button>
                <button type="button" aria-describedby="describedByRelatedVideoMove">
                  Move Related Video left
                </button>
                <button type="button" aria-describedby="describedByRelatedVideoMove">
                  Move Related Video right
                </button>
              </fieldset>

              {/* Related Videos > RELATED VIDEO --------------- */}
              <fieldset>
                <legend>Related Video</legend>
                <input type="hidden" name="fv:related_videos[1]" value="" />
                <button type="button">Upload new video</button>
                <button type="button" aria-describedby="describedbyRelatedVideoBrowse">
                  Select from existing videos
                </button>
                <button type="button">Remove Related Video</button>
                <button type="button" aria-describedby="describedByRelatedVideoMove">
                  Move Related Video left
                </button>
                <button type="button" aria-describedby="describedByRelatedVideoMove">
                  Move Related Video right
                </button>
              </fieldset>

              {/* SCREEN READER DESCRIPTIONS --------------- */}
              <span id="describedbyRelatedVideoBrowse" className="visually-hidden">
                {'Select a video from previously uploaded items'}
              </span>
              <span id="describedByRelatedVideoMove" className="visually-hidden">
                {`If you are adding multiple Related Videos, you can change the position of the Related Video with
the 'Move Related Video left' and 'Move Related Video right' buttons`}
              </span>
            </fieldset>

            {/* Related Phrases --------------- */}
            <fieldset>
              <legend>Related Phrases</legend>
              <button type="button">Add Related Phrase</button>

              {/* Related Phrases > RELATED PHRASE --------------- */}
              <fieldset>
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
              </fieldset>

              {/* Related Phrases > RELATED PHRASE --------------- */}
              <fieldset>
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
              </fieldset>

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
            <fieldset>
              <legend>Categories</legend>
              <button type="button">Add Category</button>

              {/* CATEGORIES > CATEGORY --------------- */}
              <fieldset>
                <legend>Category</legend>
                <input type="hidden" name="fv-word:categories[0]" value="6cf2f049-8e33-438f-b9f0-720ddb8338b8" />
                <div>[CATEGORY HERE]</div>

                <button type="button">Remove Category</button>

                <button type="button" aria-describedby="describedByCategoryMove">
                  Move Category up
                </button>
                <button type="button" aria-describedby="describedByCategoryMove">
                  Move Category down
                </button>
              </fieldset>

              {/* CATEGORIES > CATEGORY --------------- */}
              <fieldset>
                <legend>Category</legend>
                <Text
                  className="Create__Category"
                  id="CreateWord__Category0"
                  labelText="Search existing Categories"
                  name="fv-word:categories[0]"
                  value=""
                />
                <button type="button">Select from existing Categories</button>

                <button type="button">Remove Category</button>

                <button type="button" aria-describedby="describedByCategoryMove">
                  Move Category up
                </button>
                <button type="button" aria-describedby="describedByCategoryMove">
                  Move Category down
                </button>
              </fieldset>

              {/* SCREEN READER DESCRIPTIONS --------------- */}
              <span id="describedByCategoryMove" className="visually-hidden">
                {`If you are adding multiple Categories, you can change the position of the Category with
the 'Move Category up' and 'Move Category down' buttons`}
              </span>
            </fieldset>

            {/* Cultural Notes --------------- */}
            <FormCulturalNotes name="fv:cultural_note" />

            {/* REFERENCE --------------- */}
            <Text
              className="Create__Reference"
              id="CreateWord__Reference1"
              labelText="Reference"
              name="fv:reference"
              ariaDescribedby="describedByReference"
              value=""
            />
            <span id="describedByReference">Origin of record (person, book, etc).</span>

            {/* Contributors --------------- */}
            <FormContributors textInfo="Contributors who helped create this record." name="fv:source" />

            {/* IN CHILDREN'S ARCHIVE --------------- */}
            <Checkbox
              className="Create__InKidsArchive"
              id="CreateWord__InKidsArchive0"
              labelText="Available in children's archive"
              name="fv:available_in_childrens_archive"
            />

            {/* IN GAMES --------------- */}
            <Checkbox
              className="Create__InGames"
              id="CreateWord__InGames0"
              labelText="Available in games"
              name="fv-word:available_in_games"
            />
          </form>
          {/* FLEX: Col 2 */}
          <div>
            {/* CreateAudio --------------- */}
            <CreateAudio />
            {/* CreatePicture --------------- */}
            <CreatePicture />
            {/* CreateVideo --------------- */}
            <CreateVideo />
          </div>
        </div>
      </PromiseWrapper>
    )
  }
}

export default provide(CreateV2)
