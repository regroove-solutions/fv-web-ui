import React, { Component, PropTypes } from 'react';
import provide from 'react-redux-provide';
import {Link} from 'provide-page';

import { PageExploreArchive, PageExploreFamily, PageExploreLanguage, PageExploreDialect } from 'views/pages';
import { PageGetStarted, PageContribute, PagePlay } from 'views/pages';


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
import DialectLearn from 'views/pages/explore/dialect/learn';
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



@provide
export default class AppFrontController extends Component {
  static propTypes = {
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired
  };

  renderBreadcrumb() {
    let splitPath = this.props.splitWindowPath;
    let breadcrumb = splitPath.map(function(path, index) {
      if (path && path != "")
        return <span key={index}> &raquo; <Link key={index} href={"/" + splitPath.slice(0, index + 1).join('/')}>{decodeURIComponent(path)}</Link></span>;
    });
    
    return breadcrumb;
  }

  renderWithBreadcrumb(reactElement) {
    return (<div><Link href="/">Home</Link> {this.renderBreadcrumb()} {reactElement}</div>)
  }

  render() {

    const { splitWindowPath, windowPath } = this.props; 

    // Remove empties from path array
    const pathPartsArray = splitWindowPath.filter(function(e){return e});

    // Get Path after section
    const pathWithoutSection = pathPartsArray.slice(1);

    // Routing

    // Root
    if (windowPath === '/') {
      return this.renderWithBreadcrumb(<div>Welcome home!!!</div>);
    }

    // Process sections, then anything under them
    switch (pathPartsArray[0]) {

      case 'get-started':
        return this.renderWithBreadcrumb(<PageGetStarted />);

      break;

      case 'contribute':

        if (pathPartsArray.length === 1)
          return this.renderWithBreadcrumb(<PageContribute />);

      break;

      case 'play':

        if (pathPartsArray.length === 1)
          return this.renderWithBreadcrumb(<PagePlay />);

      break;

      case 'explore':

        // Process areas under a section
        if (pathWithoutSection != null) {
          switch (pathWithoutSection.length) {
            case 1: 
              return this.renderWithBreadcrumb(<div>TEST/...</div>);
            break;

            case 2:
              return this.renderWithBreadcrumb(<div>TEST/TEST/...</div>);
            break;

            case 3:
              return this.renderWithBreadcrumb(<PageExploreDialect family={splitWindowPath[1]} language={splitWindowPath[2]} dialect={splitWindowPath[3]} />);
            break;
          }
        }

        // Matches a section root
        if (pathPartsArray.length === 1)
          return this.renderWithBreadcrumb(<PageExploreArchive />);

      break;
    }

    return (<div>404</div>);
  }
}