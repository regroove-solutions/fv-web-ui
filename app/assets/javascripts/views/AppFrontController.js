import React, { Component, PropTypes } from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import classNames from 'classnames';

import {Link} from 'provide-page';

import { PageExploreArchive, PageExploreFamily, PageExploreLanguage, PageExploreDialect } from 'views/pages';

import { PageDialectLearn, PageDialectPlay, PageDialectGallery, PageDialectReports } from 'views/pages';
import { PageDialectLearnWords, PageDialectLearnPhrases, PageDialectLearnStoriesAndSongs, PageDialectViewDictionaryItem } from 'views/pages';
import { PageDialectViewWord, PageDialectViewPhrase, PageDialectViewBook } from 'views/pages';

import { PageGetStarted, PageContribute, PagePlay, PageSearch } from 'views/pages';

import { PageExploreDialectEdit, PageDialectWordEdit } from 'views/pages/edit';
import { PageDialectWordsCreate, PageDialectPhrasesCreate, PageDialectStoriesAndSongsCreate, PageDialectGalleryCreate, PageDialectCategoryCreate, PageDialectPhraseBooksCreate, PageDialectContributorsCreate } from 'views/pages/create';

// To be used later views below:

// Pages
/*import Index from 'views/pages/index';
import GetStarted from 'views/pages/get-started';

// Pages: Explore
import ExploreArchive from 'views/pages/explore/archive';
import ExploreFamily from 'views/pages/explore/family';
import ExploreLanguage from 'views/pages/explore/language';

// Pages: Dialect Portal
import ExploreDialect from 'views/pages/explore/dialect';

import DialectLearnWords from 'views/pages/explore/dialect/learn/words';
import DialectLearnPhrases from 'views/pages/explore/dialect/learn/phrases';
import DialectLearnSongs from 'views/pages/explore/dialect/learn/songs';
import DialectLearnStories from 'views/pages/explore/dialect/learn/stories';
import DialectPlay from 'views/pages/explore/dialect/play';
import DialectCommunitySlideshow from 'views/pages/explore/dialect/community-slideshow';
import DialectArtGallery from 'views/pages/explore/dialect/art-gallery';

// Pages: Dialect -> Word
import ViewWord from 'views/pages/explore/dialect/learn/words/view';

import Contribute from 'views/pages/contribute';
import Play from 'views/pages/play';
import NotFound from 'views/pages/not-found';*/

// Regex helper
const ANYTHING_BUT_SLASH = new RegExp("([^/]*)");
const WORKSPACE_OR_SECTION = new RegExp("(sections|Workspaces)");

const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces', 'edit'];

@provide
export default class AppFrontController extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    computeLogin: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.matchPath = this.matchPath.bind(this);
  }

  renderBreadcrumb() {
    let splitPath = this.props.splitWindowPath;
    let breadcrumb = splitPath.map(function(path, index) {
      if (path && path != "" && REMOVE_FROM_BREADCRUMBS.indexOf(path) === -1) {
        // Last element (i.e. current page)
        if (index == splitPath.length - 1) {
          return <li key={index} className="active">{decodeURIComponent(path).replace('&amp;', '&')}</li>;
        }
        else {
          return <li key={index}><Link key={index} href={"/" + splitPath.slice(0, index + 1).join('/')}>{decodeURIComponent(path).replace('&amp;', '&')}</Link></li>;
        }
      }
    });
    
    return breadcrumb;
  }

  renderWithBreadcrumb(reactElement) {

    let areaWarning;

    if (reactElement.props.routeParams.area == 'Workspaces')
      areaWarning = <div className={classNames('alert', 'alert-info')} role="alert"><strong>Reminder</strong>: <span>You are currently within a <strong>Workspace</strong>. Some of this content may not be visible to the public.</span></div>;

    return (
      <div>
        <ol className="breadcrumb"><li><Link href="/">Home</Link></li>{this.renderBreadcrumb()}</ol>
        {areaWarning}
        {reactElement}
      </div>
    )
  }

  matchPath(pathMatchArray) {

    // Remove empties from path array
    const currentPathArray = this.props.splitWindowPath.filter(function(e){ return e; });

    if (pathMatchArray.length != currentPathArray.length) {
      return { result: false, routeParams: {} };
    }

    let matchedRouteParams = {};

    let matches = pathMatchArray.every(function(element, index) {
      if (element instanceof RegExp) {
        return element.test(currentPathArray[index]);
      }
      else if (element instanceof paramMatch)
      {
        if (element.hasOwnProperty('matcher')) {
          let testMatch = element.matcher.test(currentPathArray[index])

          if (testMatch) {
            matchedRouteParams[element.id] = currentPathArray[index];
            return true;
          }
        }

        return false;
      }
      else {
        return element === currentPathArray[index]; 
      }
    });

    return { result: matches, routeParams: matchedRouteParams };
  }

  render() {

    if (selectn("isConnected", this.props.computeLogin)) {
      //fetchPath = 'Workspaces/';
    }

    let page = <div>404</div>;

    let routes = [
      {
        path: [],
        page: <div>Welcome home!!!</div>
      },
      {
        path: ['get-started'],
        page: <PageGetStarted />
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
        path: ['explore'],
        page: <PageExploreArchive />
      },
      {
        path: ['explore', 'FV', , 'Data', 'search'],
        page: <PageSearch />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', 'search', ANYTHING_BUT_SLASH],
        page: <PageSearch />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'search'],
        page: <PageSearch />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'search', ANYTHING_BUT_SLASH],
        page: <PageSearch />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', new paramMatch('language_family', ANYTHING_BUT_SLASH)],
        page: <PageExploreFamily />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH ],
        page: <PageExploreLanguage />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH ],
        page: <PageExploreDialect />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'edit' ],
        page: <PageExploreDialectEdit />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn' ],
        page: <PageDialectLearn />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'play' ],
        page: <PageDialectPlay />
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', 'create' ],
        page: <PageDialectGalleryCreate />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'gallery', ANYTHING_BUT_SLASH ],
        page: <PageDialectGallery />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'reports' ],
        page: <PageDialectReports />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words' ],
        page: <PageDialectLearnWords />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'create' ],
        page: <PageDialectWordsCreate />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', ANYTHING_BUT_SLASH ],
        page: <PageDialectViewWord />
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'words', 'edit', ANYTHING_BUT_SLASH ],
        page: <PageDialectWordEdit />
      },
      {
        path: ['explore', 'FV', new paramMatch('area', WORKSPACE_OR_SECTION), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases' ],
        page: <PageDialectLearnPhrases />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', 'create' ],
        page: <PageDialectPhrasesCreate />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrases', ANYTHING_BUT_SLASH ],
        page: <PageDialectViewPhrase />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories-songs' ],
        page: <PageDialectLearnStoriesAndSongs />
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories-songs', 'create' ],
        page: <PageDialectStoriesAndSongsCreate />
      },
      {
        path: ['explore', 'FV', WORKSPACE_OR_SECTION, 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'stories-songs', ANYTHING_BUT_SLASH ],
        page: <PageDialectViewBook />
      },
      {
        path: ['explore', 'FV', 'Workspaces', 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'categories', 'create' ],
        page: <PageDialectCategoryCreate />,
        extractPaths: true
      },
      {
        path: ['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, ANYTHING_BUT_SLASH, 'learn', 'phrasebooks', 'create' ],
        page: <PageDialectPhraseBooksCreate />
      },
    ];

    for (let i = 0; i < routes.length; ++i) {
      let matchTest = this.matchPath(routes[i].path);

      if (matchTest.result) {

        let routeParams = matchTest.routeParams;
        
        // Extract common paths from URL
        if (routes[i].hasOwnProperty('extractPaths') && routes[i].extractPaths) {
          if (this.props.splitWindowPath.length >= 7)
            routeParams['dialect_path'] = decodeURI('/' + this.props.splitWindowPath.slice(1, 7).join('/'));

          if (this.props.splitWindowPath.length >= 6)
            routeParams['language_path'] = decodeURI('/' + this.props.splitWindowPath.slice(1, 6).join('/'));

          if (this.props.splitWindowPath.length >= 5)
            routeParams['language_family_path'] = decodeURI('/' + this.props.splitWindowPath.slice(1, 5).join('/'));
        }

        page = this.renderWithBreadcrumb(React.cloneElement(routes[i].page, {routeParams: routeParams}));

        break;
      }
    };

    return (page);
  }
}

/**
* Parameter matching class
*/
class paramMatch {
  constructor(id, matcher) {
    this.id = id;
    this.matcher = matcher;
  }
}