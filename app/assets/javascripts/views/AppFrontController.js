import React, { Component, PropTypes } from 'react';
import provide from 'react-redux-provide';
import {Link} from 'provide-page';

import { PageExploreArchive, PageExploreFamily, PageExploreLanguage, PageExploreDialect } from 'views/pages';

import { PageDialectLearn, PageDialectPlay, PageDialectGallery, PageDialectReports } from 'views/pages';
import { PageDialectLearnWords, PageDialectLearnPhrases, PageDialectLearnStoriesAndSongs, PageDialectViewDictionaryItem } from 'views/pages';
import { PageDialectViewWord, PageDialectViewPhrase } from 'views/pages';

import { PageGetStarted, PageContribute, PagePlay, PageSearch } from 'views/pages';

import { PageExploreDialectEdit } from 'views/pages/edit';
import { PageDialectWordsCreate, PageDialectPhrasesCreate, PageDialectStoriesAndSongsCreate } from 'views/pages/create';

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

const REGEX_MATCH_ANYTHING_BUT_SLASH = new RegExp("([^/]*)");

const REMOVE_FROM_BREADCRUMBS = ['FV', 'sections', 'Data', 'Workspaces'];

@provide
export default class AppFrontController extends Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.matchPath = this.matchPath.bind(this);
  }

  renderBreadcrumb() {
    let splitPath = this.props.splitWindowPath;
    let breadcrumb = splitPath.map(function(path, index) {
      if (path && path != "" && REMOVE_FROM_BREADCRUMBS.indexOf(path) === -1) {
        return <span key={index}> &raquo; <Link key={index} href={"/" + splitPath.slice(0, index + 1).join('/')}>{decodeURIComponent(path).replace('&amp;', '&')}</Link></span>;
      }
    });
    
    return breadcrumb;
  }

  renderWithBreadcrumb(reactElement) {
    return (<div><Link href="/">Home</Link> {this.renderBreadcrumb()} {reactElement}</div>)
  }

  matchPath(pathMatchArray) {

    // Remove empties from path array
    const currentPathArray = this.props.splitWindowPath.filter(function(e){ return e; });

    if (pathMatchArray.length != currentPathArray.length) {
      return false;
    }

    let matches = pathMatchArray.every(function(element, index) {
      if (element instanceof RegExp) {
        return element.test(currentPathArray[index]);
      }
      else {
        return element === currentPathArray[index]; 
      }
    });
  
    return matches;
  }

  render() {

    const { splitWindowPath, windowPath } = this.props; 

    // Remove empties from path array
    const pathPartsArray = splitWindowPath.filter(function(e){return e});

    // Routing
    // TODO: Replace FV with dynamic domain
    switch (true) {

      case this.matchPath([]):
        return this.renderWithBreadcrumb(<div>Welcome home!!!</div>);

      case this.matchPath(['get-started']):
        return this.renderWithBreadcrumb(<PageGetStarted />);

      case this.matchPath(['contribute']):
        return this.renderWithBreadcrumb(<PageContribute />);

      case this.matchPath(['play']):
        return this.renderWithBreadcrumb(<PagePlay />);    
      
      case this.matchPath(['explore']):
        return this.renderWithBreadcrumb(<PageExploreArchive />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', 'search']):    
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', 'search', REGEX_MATCH_ANYTHING_BUT_SLASH]): 
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'search']):	      	  
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'search', REGEX_MATCH_ANYTHING_BUT_SLASH]):	  
          return this.renderWithBreadcrumb(<PageSearch />);       
      
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH]):
        return this.renderWithBreadcrumb(<PageExploreFamily />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH ]):
        return this.renderWithBreadcrumb(<PageExploreLanguage />);

      // Portal
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH ]):
        return this.renderWithBreadcrumb(<PageExploreDialect />);

      // Portal Edit view
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'edit' ]):
        return this.renderWithBreadcrumb(<PageExploreDialectEdit />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn' ]):
        return this.renderWithBreadcrumb(<PageDialectLearn />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'play' ]):
        return this.renderWithBreadcrumb(<PageDialectPlay />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'gallery', REGEX_MATCH_ANYTHING_BUT_SLASH ]):
        return this.renderWithBreadcrumb(<PageDialectGallery />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'reports' ]):
          return this.renderWithBreadcrumb(<PageDialectReports />);      
      
      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'words' ]):
        return this.renderWithBreadcrumb(<PageDialectLearnWords />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'words', 'create' ]):
        return this.renderWithBreadcrumb(<PageDialectWordsCreate />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'words', REGEX_MATCH_ANYTHING_BUT_SLASH ]):
        return this.renderWithBreadcrumb(<PageDialectViewWord />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'phrases' ]):
        return this.renderWithBreadcrumb(<PageDialectLearnPhrases />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'phrases', 'create' ]):
        return this.renderWithBreadcrumb(<PageDialectPhrasesCreate />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'phrases', REGEX_MATCH_ANYTHING_BUT_SLASH ]):
        return this.renderWithBreadcrumb(<PageDialectViewPhrase />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'stories-songs' ]):
        return this.renderWithBreadcrumb(<PageDialectLearnStoriesAndSongs />);

      case this.matchPath(['explore', 'FV', new RegExp("(sections|Workspaces)"), 'Data', REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, REGEX_MATCH_ANYTHING_BUT_SLASH, 'learn', 'stories-songs', 'create' ]):
        return this.renderWithBreadcrumb(<PageDialectStoriesAndSongsCreate />);
    }

    return (<div>404</div>);
  }
}