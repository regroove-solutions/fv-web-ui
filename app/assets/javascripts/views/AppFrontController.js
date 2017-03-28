import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import provide from 'react-redux-provide';
import selectn from 'selectn';

import classNames from 'classnames';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

import {Link} from 'provide-page';

import FlatButton from 'material-ui/lib/flat-button';
import Navigation from 'views/components/Navigation';
import KidsNavigation from 'views/components/Kids/Navigation';
import Footer from 'views/components/Navigation/Footer';

import { PageHome, PageTest, PageKidsHome, PageExploreDialects, PageExploreArchive, PageExploreFamily, PageExploreLanguage, PageExploreDialect } from 'views/pages';

import { PageDialectLearn, PageDialectMedia, PageDialectPlay, PageDialectGalleryView, PageDialectGalleries, PageDialectReports, PageDialectUsers } from 'views/pages';

import { PageDialectLearnWords, PageDialectLearnPhrases, PageDialectLearnStoriesAndSongs, PageDialectViewDictionaryItem } from 'views/pages';

import { PageDialectViewWord, PageDialectViewPhrase, PageDialectViewBook, PageDialectViewCharacter, PageDialectViewMedia } from 'views/pages';

import { PageDialectViewAlphabet } from 'views/pages';

import { PageJigsawGame, PageColouringBook, PageWordSearch, PagePictureThis, PageConcentration, PageWordscramble, PageQuiz, PageHangman} from 'views/pages';

import { PageGetStarted, PageContribute, PagePlay, PageSearch, PageTasks, PageUsersProfile, PageUsersRegister, PageDialectLearnWordsCategories, PageDialectLearnPhrasesCategories } from 'views/pages';

import { PageExploreDialectEdit, PageDialectWordEdit, PageDialectAlphabetCharacterEdit, PageDialectEditMedia, PageDialectGalleryEdit, PageDialectPhraseEdit, PageDialectBookEdit, PageDialectBookEntryEdit } from 'views/pages/edit';
import {
  PageDialectWordsCreate, PageDialectPhrasesCreate, PageDialectStoriesAndSongsCreate,
  PageDialectGalleryCreate, PageDialectCategoryCreate, PageDialectPhraseBooksCreate,
  PageDialectContributorsCreate, PageDialectStoriesAndSongsBookEntryCreate } from 'views/pages/create';

/**
* Parameter matching class
*/
class paramMatch {
  constructor(id, matcher) {
    this.id = id;
    this.matcher = matcher;
  }
}

// Regex helper
const ANYTHING_BUT_SLASH = new RegExp(ProviderHelpers.regex.ANYTHING_BUT_SLASH);
const WORKSPACE_OR_SECTION = new RegExp(ProviderHelpers.regex.WORKSPACE_OR_SECTION);
const KIDS_OR_DEFAULT = new paramMatch('theme', RegExp(ProviderHelpers.regex.KIDS_OR_DEFAULT));

const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces', 'edit', 'search'];

const WORKSPACE_TO_SECTION_REDIRECT = {
  condition: function(params) { return (selectn("isConnected", params.props.computeLogin) === false && params.props.splitWindowPath[2] == 'Workspaces') },
  target: function(params) { return '/' + params.props.splitWindowPath.join('/').replace('Workspaces', 'sections'); }
};

class Redirecter extends Component {
  constructor(props, context) {
    super (props, context);
  }

  componentDidMount() {
    this.props.redirect();
  }
  

  render() {
    return <div style={{backgroundColor: '#fff', height: '100vh'}}>Redirecting...</div>;
  }
}

@provide
export default class AppFrontController extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    preferences: PropTypes.object,
    warnings: PropTypes.object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    windowPath: PropTypes.string.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    replaceWindowPath: PropTypes.func.isRequired,
    computeLogin: PropTypes.object.isRequired,
    changeTheme: PropTypes.func.isRequired,
    loadGuide: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = this._getInitialState();

    // Bind methods to 'this'
    ['_matchPath', '_route'].forEach( (method => this[method] = this[method].bind(this)) );
  }

  _getInitialState() {

    const routes = Immutable.fromJS([
      {
        path: [],
        page: <PageHome />,
        breadcrumbs: false,
        frontpage: true,
        redirects: [{
          // For any start page value other than a dialect, simple redirect to that start page
          condition: function(params) {
            return selectn('preferences.start_page', params.props) !== undefined && selectn('preferences.start_page', params.props) !== 'my_dialect' && selectn('preferences.start_page', params.props) !== 'my_kids_dialect';
          },
          target: function(params) {
            return UIHelpers.getPreferenceVal('start_page', params.props.preferences);
          }
        },{
          // Redirecting to a dialect (requires dialect_path to be provided)
          condition: function(params) {
            return selectn('preferences.primary_dialect_path', params.props) !== undefined;
          },
          target: function(params) {
            let start_page = selectn('preferences.start_page', params.props);
            let primary_dialect_path = selectn('preferences.primary_dialect_path', params.props);
            return '/' + (start_page == 'my_kids_dialect' ? 'kids' : 'explore') + selectn('preferences.primary_dialect_path', params.props);
          }
        }]
      },
      {
        path: ['home'],
        page: <PageHome />,
        title: 'Home',
        breadcrumbs: false,
        frontpage: true
      },
      {
        path: ['test'],
        page: <PageTest />
      },
      {
        path: [new paramMatch('theme', new RegExp("kids"))],
        page: <PageKidsHome />
      },
      {
        path: ['get-started'],
        page: <PageGetStarted />,
        title: 'Getting Started'
      },
      {
        path: ['contribute'],
        page: <PageContribute />
      },
      {
        path: ['play'],
        page: <PagePlay />
      },
      {
        path: ['tasks'],
        page: <PageTasks />
      },
      {
        path: ['register'],
        page: <PageUsersRegister />
      },
      {
        path: ['profile'],
        page: <PageUsersProfile />
      },
      {
        path: [KIDS_OR_DEFAULT],
        page: <PageExploreArchive />,
        redirects: [{
          condition: function(params) { return true; },
          target: function(params) { return '/explore/FV/sections/Data/'; }
        }]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data'],
        page: <PageExploreDialects />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', 'search', ANYTHING_BUT_SLASH],
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'search'],
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'register'],
        page: <PageUsersRegister />,
        disableWorkspaceSectionNav: true,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'search', ANYTHING_BUT_SLASH],
        page: <PageSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', new paramMatch('language_family', ANYTHING_BUT_SLASH)],
        page: <PageExploreFamily />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH ],
        page: <PageExploreLanguage />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        id: 'page_explore_dialect',
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH ],
        page: <PageExploreDialect />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        warnings: ['multiple_dialects']
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'edit' ],
        page: <PageExploreDialectEdit />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn' ],
        page: <PageDialectLearn />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'media' ],
        page: <PageDialectMedia />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'media', new paramMatch('media', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewMedia />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'media', new paramMatch('media', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectEditMedia />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'alphabet'],
        page: <PageDialectViewAlphabet />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'alphabet', 'print'],
        page: <PageDialectViewAlphabet print={true} />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'alphabet', new paramMatch('character', ANYTHING_BUT_SLASH)],
        page: <PageDialectViewCharacter />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'alphabet', new paramMatch('character', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectAlphabetCharacterEdit />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play' ],
        page: <PageDialectPlay />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'jigsaw' ],
        page: <PageJigsawGame />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'wordsearch' ],
        page: <PageWordSearch />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'colouringbook' ],
        page: <PageColouringBook />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'concentration' ],
        page: <PageConcentration />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'picturethis' ],
        page: <PagePictureThis />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'hangman' ],
        page: <PageHangman />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'wordscramble' ],
        page: <PageWordscramble />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play', 'quiz' ],
        page: <PageQuiz />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery' ],
        page: <PageDialectGalleries />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', 'create' ],
        page: <PageDialectGalleryCreate />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', new paramMatch('galleryName', ANYTHING_BUT_SLASH) ],
        page: <PageDialectGalleryView />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', new paramMatch('gallery', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectGalleryEdit />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'reports' ],
        page: <PageDialectReports />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'users' ],
        page: <PageDialectUsers />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words' ],
        page: <PageDialectLearnWords />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'categories' ],
        page: <PageDialectLearnWordsCategories />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'categories', new paramMatch('category', ANYTHING_BUT_SLASH) ],
        page: <PageDialectLearnWords />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'create' ],
        page: <PageDialectWordsCreate />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', new paramMatch('word', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewWord />,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT],
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', new paramMatch('word', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectWordEdit />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases' ],
        page: <PageDialectLearnPhrases />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', 'categories' ],
        page: <PageDialectLearnPhrasesCategories />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', 'categories', new paramMatch('category', ANYTHING_BUT_SLASH) ],
        page: <PageDialectLearnPhrases />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', 'create' ],
        page: <PageDialectPhrasesCreate />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', new paramMatch('phrase', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewPhrase />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', new paramMatch('phrase', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectPhraseEdit />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories' ],
        page: <PageDialectLearnStoriesAndSongs typeFilter="story" typePlural="stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs' ],
        page: <PageDialectLearnStoriesAndSongs typeFilter="song" typePlural="songs" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs-stories' ],
        page: <PageDialectLearnStoriesAndSongs typePlural="Songs and Stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', 'create' ],
        page: <PageDialectStoriesAndSongsCreate typeFilter="story" typePlural="stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', 'create' ],
        page: <PageDialectStoriesAndSongsCreate typeFilter="song" typePlural="songs" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', new paramMatch('bookName', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewBook typeFilter="song" typePlural="songs" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', new paramMatch('bookName', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectBookEdit typeFilter="song" typePlural="songs" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', new paramMatch('parentBookName', ANYTHING_BUT_SLASH), 'create' ],
        page: <PageDialectStoriesAndSongsBookEntryCreate typeFilter="song" typePlural="songs" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'songs', new paramMatch('parentBookName', ANYTHING_BUT_SLASH), new paramMatch('bookName', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectBookEntryEdit typeFilter="song" typePlural="songs" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', new paramMatch('bookName', ANYTHING_BUT_SLASH) ],
        page: <PageDialectViewBook typeFilter="story" typePlural="stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', new paramMatch('bookName', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectBookEdit typeFilter="story" typePlural="stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', new paramMatch('parentBookName', ANYTHING_BUT_SLASH), 'create' ],
        page: <PageDialectStoriesAndSongsBookEntryCreate typeFilter="story" typePlural="stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories', new paramMatch('parentBookName', ANYTHING_BUT_SLASH), new paramMatch('bookName', ANYTHING_BUT_SLASH), 'edit' ],
        page: <PageDialectBookEntryEdit typeFilter="story" typePlural="stories" />,
        extractPaths: true,
        redirects: [WORKSPACE_TO_SECTION_REDIRECT]
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'categories', 'create' ],
        page: <PageDialectCategoryCreate />,
        extractPaths: true
      },
      {
        path: [KIDS_OR_DEFAULT, 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrasebooks', 'create' ],
        page: <PageDialectPhraseBooksCreate />
      }
    ]);

    return {
      routes: routes,
      matchedPage: null,
      matchedRouteParams: {},
      warningsDismissed: false
    };
  }

  /**
  * Conditionally route the parameters.
  * This could normally go into the render method to keep things simple,
  * however redirecting (i.e. updating state), cannot be done inside render.
  */
  _route(props, routesOverride = null) {

    let matchedPage = null
    let matchedRouteParams = {};

    const pathArray = props.splitWindowPath;

    let routes = routesOverride || this.state.routes;

    routes.forEach(function(value, key) {

      let matchTest = this._matchPath(value.get('path'), pathArray);

      if (matchTest.matched) {

        let routeParams = matchTest.routeParams;

        // Extract common paths from URL
        if (value.has('extractPaths') && value.get('extractPaths')) {
          if (pathArray.length >= 7)
            routeParams['dialect_path'] = decodeURI('/' + pathArray.slice(1, 7).join('/'));

          if (pathArray.length >= 6)
            routeParams['language_path'] = decodeURI('/' + pathArray.slice(1, 6).join('/'));

          if (pathArray.length >= 5)
            routeParams['language_family_path'] = decodeURI('/' + pathArray.slice(1, 5).join('/'));
        }

        matchedPage = value;
        matchedRouteParams = routeParams;

        // Break out of forEach
        return false;
      }
    }.bind(this));

    // Match found
    if (matchedPage !== null) {

      // Redirect if required
      if (matchedPage.has('redirects')) {
        matchedPage.get('redirects').forEach(function(value, key) {

          if (value.get('condition')({props: props})) {

            // Avoid invariant violations during rendering by setting temporary placeholder component as matched page, and 'redirecting' after mount.
            matchedPage = matchedPage.set('page', Immutable.fromJS(React.createElement(Redirecter, {redirect: function () {
                return props.replaceWindowPath(value.get('target')({props: props}));
            }}, matchedPage.get('page'))))
            
            return false;
          }
        }.bind(this));
      }

      // Switch themes based on route params
      if (matchedRouteParams.hasOwnProperty('theme')) {

        let newTheme = matchedRouteParams.theme;

        // Switch to workspace theme if available
        if (((matchedRouteParams.hasOwnProperty('area') && matchedRouteParams.area === 'Workspaces') || matchedPage.get('path').indexOf('Workspaces') !== -1) && matchedRouteParams.theme == 'explore') {
          newTheme = 'workspace';
        }

        if (props.properties.theme.id != newTheme) {
          props.changeTheme(newTheme);
        }
      }
      else {
        props.changeTheme('default');
      }

      let matchReturn = {
        matchedPage: matchedPage,
        matchedRouteParams: matchedRouteParams
      };

      // Load help
      props.loadGuide(props.windowPath, matchReturn);

      this.setState(matchReturn);
    }
  }

  componentWillMount() {
    this._route(this.props);
  }

  componentWillUpdate(nextProps, nextState) {

    if (nextProps.windowPath != this.props.windowPath) {
      let title = ConfGlobal.title;

      // Update title
      if (nextState.matchedPage && nextState.matchedPage.has('title') && nextState.matchedPage.get('title') && nextState.matchedPage.get('title') != document.title) {
        title = nextState.matchedPage.get('title') + ' | ' + ConfGlobal.title;
      }

      document.title = title;

      // Track page view
      window.snowplow('trackPageView');
    }
  }

  componentWillReceiveProps(nextProps) {

    let primary_dialect_path = selectn('primary_dialect_path', this.props.preferences);
    let next_primary_dialect_path = selectn('primary_dialect_path', nextProps.preferences);
    

    // Re-route on window path change
    if (nextProps.windowPath != this.props.windowPath) {
      this._route(nextProps);
    }

    // Re-route on login
    else if (nextProps.computeLogin != this.props.computeLogin) {
      this._route(nextProps);
    }

    // Re-route if preferences change
    else if (next_primary_dialect_path != primary_dialect_path && next_primary_dialect_path.length > 0) {
      this._route(nextProps);
    }
  }

  _renderBreadcrumb(matchedPage, routeParams) {
    let props = this.props;
    let splitPath = props.splitWindowPath;
    let routes = this.state.routes;

    let breadcrumb = splitPath.map(function(path, index) {
      if (path && path != "" && REMOVE_FROM_BREADCRUMBS.indexOf(path) === -1) {
        // Last element (i.e. current page)
        if (index == splitPath.length - 1) {
          return <li key={index} className="active">{decodeURIComponent(path).replace('&amp;', '&')}</li>;
        }
        else {

          let hrefPath = "/" + splitPath.slice(0, index + 1).join('/');

          /**
          * Replace breadcrumb entry with redirect value. Solved some rendering issues. Needs more robust solution though.
          */
          routes.forEach(function(value, key) {

            let matchTest = this._matchPath(value.get('path'), [ path ]);

            if (matchTest.matched) {

              if (value.has('redirects')) {
                value.get('redirects').forEach(function(redirectValue, key) {

                  if (redirectValue.get('condition')({props: props})) {
                    hrefPath = redirectValue.get('target')({props: props});
                    hrefPath = hrefPath.replace('sections', routeParams.area);

                    return false;
                  }
                }.bind(this));
              }

              // Break out of forEach
              return false;
            }

          }.bind(this));

          return <li key={index}><Link key={index} href={hrefPath}>{decodeURIComponent(path).replace('&amp;', '&')}</Link></li>;
        }
      }
    }.bind(this));

    return breadcrumb;
  }

  _renderWithBreadcrumb(reactElement, matchedPage, props) {

    return (
      <div>

        <div className="clearfix">

          {(() => {
            if (selectn("routeParams.area", reactElement.props) && selectn("isConnected", props.computeLogin) && matchedPage.get('disableWorkspaceSectionNav') !== true) {

              return <ul className={classNames('workspace-switcher', 'nav', 'nav-pills', 'pull-right')} style={{"display":"inline-block","verticalAlign":"middle","paddingTop": "10px"}}>
                <li role="presentation" className={(reactElement.props.routeParams.area == 'Workspaces') ? 'active' : ''}><Link href={props.windowPath.replace('sections', 'Workspaces')}>Workspace</Link></li> <li className={(reactElement.props.routeParams.area == 'sections') ? 'active' : ''} role="presentation"><Link href={props.windowPath.replace('Workspaces', 'sections')}>Public View</Link></li>
              </ul>;

            }

          })()}

          <ol className={classNames('breadcrumb', 'pull-left')}><li><Link href="/home">Home</Link></li>{this._renderBreadcrumb(matchedPage, reactElement.props.routeParams)}</ol>

        </div>

        {reactElement}

      </div>
    )
  }

  /**
  * Tests to see if current URL matches route.
  * Return object with matched boolean and route params returned
  */
  _matchPath(pathMatchArray, urlPath) {

    // Remove empties from path array, return Immutable list
    const currentPathArray = Immutable.fromJS(urlPath.filter(function(e){ return e; }));

    if (pathMatchArray.size != currentPathArray.size) {
      return { matched: false, routeParams: {} };
    }

    let matchedRouteParams = {};

    let matched = pathMatchArray.every(function(value, key) {

      if (value instanceof RegExp) {
        return value.test(currentPathArray.get(key));
      }
      else if (value instanceof paramMatch)
      {
        if (value.hasOwnProperty('matcher')) {
          let testMatch = value.matcher.test(currentPathArray.get(key))

          if (testMatch) {
            matchedRouteParams[value.id] = decodeURI(currentPathArray.get(key));
            return true;
          }
        }

        return false;
      }
      else {
        return value === currentPathArray.get(key);
      }
    });

    return { matched: matched, routeParams: matchedRouteParams };
  }

  render() {

    const { matchedPage, matchedRouteParams } = this.state;
    
    let page, navigation = <Navigation frontpage={(!matchedPage) ? false : matchedPage.get('frontpage')} routeParams={matchedRouteParams} />;
    let theme = (matchedRouteParams.hasOwnProperty('theme')) ? matchedRouteParams.theme : 'default';
    let print = (matchedPage) ? matchedPage.get('page').get('props').get('print') === true : false;

    if (!matchedPage) {
      page = <div>404</div>;
    } else {
      let clonedElement = React.cloneElement(matchedPage.get('page').toJS(), { routeParams: matchedRouteParams });

      // For print view return page only
      if (print) {
        return <div style={{margin: '25px'}}>{clonedElement}</div>;
      }

      // Remove breadcrumbs for Kids portal
      // TODO: Make more generic if additional themes are added in the future.
      if (theme == 'kids') {
        page = clonedElement;
        navigation = <KidsNavigation routeParams={matchedRouteParams} />;
      } else {
        // Without breadcrumbs
        if (matchedPage.get('breadcrumbs') === false) {
          page = clonedElement;
        }
        // With breadcrumbs
        else {
          page = this._renderWithBreadcrumb(clonedElement, matchedPage, this.props);
        }
      }
    }

    return (
      <div>

        {((matchedPage && matchedPage.hasOwnProperty('warnings')) ? matchedPage.get('warnings') : []).map(function (warning) {
          if (this.props.warnings.hasOwnProperty(warning) && !this.state.warningsDismissed) {
            return <div style={{position: 'fixed', bottom: 0, zIndex: 99999}} className={classNames('alert', 'alert-warning')}>{selectn(warning, this.props.warnings)} <FlatButton label="Dismiss" onTouchTap={() => this.setState({warningsDismissed: true})} /></div>;
          }
        }.bind(this))}

        <div className="row">{navigation}</div>
        <div className={'page-' + theme + '-theme'}>{page}</div>
        <div className="row"><Footer /></div>
      </div>
    );
  }
}