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
import React from 'react';
import { render } from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import Request from 'request';

import ConfGlobal from 'conf/local.json';

import injectTapEventPlugin from 'react-tap-event-plugin';

import AppWrapper from 'views/AppWrapper';

// Pages
import Index from 'views/pages/index';
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
import NotFound from 'views/pages/not-found';

require('!style!css!normalize.css');

require('bootstrap/less/bootstrap');
require("styles/main");

injectTapEventPlugin();

// Temp: Wrap application in request to generate proper guest user session
Request({url: ConfGlobal.baseURL + "/view_home.faces", method: "HEAD"}, function (error, response, body) {

  if (!error && response.statusCode == 200) {
    render((
      <Router history={browserHistory}>
        <Route path="/" component={AppWrapper}>
          <IndexRoute component={Index} />
          <Route path="/get-started" label="Get Started" menus={[{'main': true}]} component={GetStarted}/>
          <Route path="/explore" label="Explore" menus={[{'main': true}]} component={ExploreArchive}/>
          <Route path="/explore/:family" component={ExploreFamily}/>
          <Route path="/explore/:family/:language" component={ExploreLanguage}/>
          <Route path="/explore/:family/:language/:dialect" component={ExploreDialect}>
            <Route path="learn" component={DialectLearn}>
              <Route path="words" component={DialectLearnWords}>
                <Route path=":word" component={ViewWord}/>
              </Route>
              <Route path="phrases" component={DialectLearnPhrases}/>
              <Route path="songs" component={DialectLearnSongs}/>
              <Route path="stories" component={DialectLearnStories}/>
            </Route>
            <Route path="play" component={DialectPlay}/>
            <Route path="community-slideshow" component={DialectCommunitySlideshow}/>
            <Route path="art-gallery" component={DialectArtGallery}/>
          </Route>
          <Route path="/contribute" label="Contribute" menus={[{'main': true}]} component={Contribute}/>
          <Route path="/play" label="Play" menus={[{'main': true}]} component={Play}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    ), document.getElementById('app-wrapper'))
  } else {
    // Server is down, serve static alternative?
  }
});
