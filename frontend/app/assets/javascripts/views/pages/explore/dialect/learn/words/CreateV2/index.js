import React, { Component } from 'react'
import Select from './Select'
import Text from './Text'
import Checkbox from './Checkbox'
// import { PropTypes } from 'react'
// const { string } = PropTypes

export class CreateV2 extends Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
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
            <option value="event_activity_verb_like_word_reflexive">Event/Activity (Verb-like word) - reflexive</option>
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

        {/* DEFINITIONS --------------- */}
        <fieldset>
          <legend>Definitions</legend>
          <p className="alert alert-info">Describe what the word actually means</p>
          <button type="button">Add a Definition</button>

          {/* DEFINITIONS > DEFINITION --------------- */}
          <fieldset>
            <legend>Definition</legend>
            <Select
              ariaDescribedby="describedbyLanguage"
              className="DefinitionLanguage"
              id="CreateWord__DefinitionLanguage0"
              labelText="Language"
              name="fv:definitions[0][language]"
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="mandarin">Mandarin</option>
              </optgroup>
            </Select>
            <Text
              className="Create__DefinitionTranslation"
              ariaDescribedby="describedByTranslation"
              id="CreateWord__DefinitionTranslation0"
              labelText="Translation"
              name="fv:definitions[0][translation]"
            />
            <button type="button">Remove Definition</button>
            <button aria-describedby="describedByDefinitionMove" type="button">
              Move Definition up
            </button>
            <button aria-describedby="describedByDefinitionMove" type="button">
              Move Definition down
            </button>
          </fieldset>

          {/* DEFINITIONS > DEFINITION --------------- */}
          <fieldset>
            <legend>Definition</legend>
            <Select
              ariaDescribedby="describedbyLanguage"
              className="DefinitionLanguage"
              id="CreateWord__DefinitionLanguage1"
              labelText="Language"
              name="fv:definitions[1][language]"
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="mandarin">Mandarin</option>
              </optgroup>
            </Select>
            <Text
              className="Create__DefinitionTranslation"
              ariaDescribedby="describedByTranslation"
              id="CreateWord__DefinitionTranslation1"
              labelText="Translation"
              name="fv:definitions[1][translation]"
            />
            <button type="button">Remove Definition</button>
            <button aria-describedby="describedByDefinitionMove" type="button">
              Move Definition up
            </button>
            <button aria-describedby="describedByDefinitionMove" type="button">
              Move Definition down
            </button>
          </fieldset>

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyLanguage" className="visually-hidden">
            You are adding a Definition for the new word. Please specify the Language of the Definition.
          </span>
          <span id="describedByTranslation" className="visually-hidden">
            You are adding a Definition for the new word. Please type a Translation of the Definition in the selected
            Language.
          </span>
          <span id="describedByDefinitionMove" className="visually-hidden">
            {`If you are adding multiple Definitions, you can change the position of the Definition with the 'Move
            Definition up' and 'Move Definition down' buttons`}
          </span>
        </fieldset>

        {/* LITERAL TRANSLATIONS --------------- */}
        <fieldset>
          <legend>Literal Translations</legend>
          <p className="alert alert-info">Describe what the word translates to regardless of context</p>
          <button type="button">Add a Literal Translation</button>

          {/* LITERAL TRANSLATIONS > LITERAL TRANSLATION --------------- */}
          <fieldset>
            <legend>Literal Translation</legend>
            <Select
              ariaDescribedby="describedbyLanguageLiteralTranslation"
              className="LiteralTranslationLanguage"
              id="CreateWord__LiteralTranslationLanguage0"
              labelText="Language"
              name="fv:literal_translation[0][language]"
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="mandarin">Mandarin</option>
              </optgroup>
            </Select>
            <Text
              className="Create__LiteralTranslationTranslation"
              ariaDescribedby="describedByTranslationLiteralTranslation"
              id="CreateWord__LiteralTranslationTranslation0"
              labelText="Translation"
              name="fv:literal_translation[0][translation]"
            />
            <button type="button">Remove Literal Translation</button>
            <button aria-describedby="describedByLiteralTranslationMove" type="button">
              Move Literal Translation up
            </button>
            <button aria-describedby="describedByLiteralTranslationMove" type="button">
              Move Literal Translation down
            </button>
          </fieldset>

          {/* LITERAL TRANSLATIONS > LITERAL TRANSLATION --------------- */}
          <fieldset>
            <legend>Literal Translation</legend>
            <Select
              ariaDescribedby="describedbyLanguageLiteralTranslation"
              className="LiteralTranslationLanguage"
              id="CreateWord__LiteralTranslationLanguage1"
              labelText="Language"
              name="fv:literal_translation[1][language]"
            >
              {/* Note: Using optgroup until React 16 when can use Fragments, eg: <React.Fragment> or <> */}
              <optgroup>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="mandarin">Mandarin</option>
              </optgroup>
            </Select>
            <Text
              ariaDescribedby="describedByTranslationLiteralTranslation"
              className="Create__LiteralTranslationTranslation"
              id="CreateWord__LiteralTranslationTranslation1"
              labelText="Translation"
              name="fv:literal_translation[1][translation]"
            />
            <button type="button">Remove Literal Translation</button>
            <button aria-describedby="describedByLiteralTranslationMove" type="button">
              Move Literal Translation up
            </button>
            <button aria-describedby="describedByLiteralTranslationMove" type="button">
              Move Literal Translation down
            </button>
          </fieldset>

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyLanguageLiteralTranslation" className="visually-hidden">
            You are adding a Literal Translation for the new word. Please specify the Language of the Literal
            Translation.
          </span>
          <span id="describedByTranslationLiteralTranslation" className="visually-hidden">
            You are adding a Literal Translation for the new word. Please type a Translation of the Literal Translation
            in the selected Language.
          </span>
          <span id="describedByLiteralTranslationMove" className="visually-hidden">
            {`If you are adding multiple Literal Translations, you can change the position of the Literal Translation with
    the 'Move Literal Translation up' and 'Move Literal Translation down' buttons`}
          </span>
        </fieldset>

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

        {/* RELATED PICTURES --------------- */}
        <fieldset>
          <legend>Related Pictures</legend>
          <button type="button">Add Related Picture</button>

          {/* RELATED PICTURES > RELATED PICTURE --------------- */}
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

          {/* RELATED PICTURES > RELATED PICTURE --------------- */}
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

        {/* RELATED VIDEOS --------------- */}
        <fieldset>
          <legend>Related Videos</legend>
          <button type="button">Add Related Video</button>

          {/* RELATED VIDEOS > RELATED VIDEO --------------- */}
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

          {/* RELATED VIDEOS > RELATED VIDEO --------------- */}
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

        {/* RELATED PHRASES --------------- */}
        <fieldset>
          <legend>Related Phrases</legend>
          <button type="button">Add Related Phrase</button>

          {/* RELATED PHRASES > RELATED PHRASE --------------- */}
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

          {/* RELATED PHRASES > RELATED PHRASE --------------- */}
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

        {/* CULTURAL NOTES --------------- */}
        <fieldset>
          <legend>Cultural Notes</legend>
          <button type="button">Add Cultural Note</button>

          {/* CULTURAL NOTES > CULTURAL NOTE --------------- */}
          <fieldset>
            <legend className="visually-hidden">Cultural Note</legend>
            <Text
              className="Create__CulturalNote"
              id="CreateWord__CulturalNote0"
              labelText="Cultural Note"
              name="fv:cultural_note[0]"
              value=""
            />
            <button type="button">Remove Cultural Note</button>

            <button type="button" aria-describedby="describedByCulturalNoteMove">
              Move Cultural Note up
            </button>
            <button type="button" aria-describedby="describedByCulturalNoteMove">
              Move Cultural Note down
            </button>
          </fieldset>

          {/* CULTURAL NOTES > CULTURAL NOTE --------------- */}
          <fieldset>
            <legend className="visually-hidden">Cultural Note</legend>
            <Text
              className="Create__CulturalNote"
              id="CreateWord__CulturalNote1"
              labelText="Cultural Note"
              name="fv:cultural_note[1]"
              value=""
            />
            <button type="button">Remove Cultural Note</button>

            <button type="button" aria-describedby="describedByCulturalNoteMove">
              Move Cultural Note up
            </button>
            <button type="button" aria-describedby="describedByCulturalNoteMove">
              Move Cultural Note down
            </button>
          </fieldset>

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedByCulturalNoteMove" className="visually-hidden">
            {`If you are adding multiple Cultural Notes, you can change the position of the Cultural Note with
the 'Move Cultural Note up' and 'Move Cultural Note down' buttons`}
          </span>
        </fieldset>

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

        {/* CONTRIBUTORS --------------- */}
        <fieldset>
          <legend>Contributors</legend>
          <p className="alert alert-info">Contributor(s) who helped create this record.</p>
          <button type="button">Add Contributor</button>

          {/* CONTRIBUTORS > CONTRIBUTOR --------------- */}
          <fieldset>
            <legend>Contributor</legend>
            <input type="hidden" name="fv:source[0]" value="6b295938-1415-42e2-9b40-feb4663c3516" />
            <div>[CONTRIBUTOR HERE]</div>

            <button type="button">Edit Contributor</button>
            <button type="button">Remove Contributor</button>

            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor up
            </button>
            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor down
            </button>
          </fieldset>

          {/* CONTRIBUTORS > CONTRIBUTOR --------------- */}
          <fieldset>
            <legend>Contributor</legend>

            <Text
              className="Create__Contributor"
              id="CreateWord__Contributor0"
              labelText="Search existing Contributors"
              name="fv:source[1]"
              value=""
            />
            <button type="button">Create new Contributor</button>
            <button type="button" aria-describedby="describedbyContributorBrowse">
              Select from existing Contributors
            </button>
            <button type="button">Remove Contributor</button>

            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor up
            </button>
            <button type="button" aria-describedby="describedByContributorMove">
              Move Contributor down
            </button>
          </fieldset>

          {/* SCREEN READER DESCRIPTIONS --------------- */}
          <span id="describedbyContributorBrowse" className="visually-hidden">
            {'Select a Contributor from previously created Contributors'}
          </span>
          <span id="describedByContributorMove" className="visually-hidden">
            {`If you are adding multiple Contributors, you can change the position of the Contributor with
the 'Move Contributor up' and 'Move Contributor down' buttons`}
          </span>
        </fieldset>
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
    )
  }
}
