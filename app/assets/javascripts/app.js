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
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

//import initStore from 'stores/AppStore'

import Request from 'request';

import ConfGlobal from 'conf/local.json';

import injectTapEventPlugin from 'react-tap-event-plugin';

import AppWrapper from 'views/AppWrapper';

import providers from './providers/index';

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

const context = {
  providers,
  providedState: {
    ui: {menuVisible: false},
    properties: {
      title: ConfGlobal.title,
      domain: ConfGlobal.domain
    }
  }
};

// Temp: Wrap application in request to generate proper guest user session
//Request({url: ConfGlobal.baseURL + "/view_home.faces", method: "HEAD"}, function (error, response, body) {
  //if (!error && response.statusCode == 200) {
    render(<AppWrapper { ...context } />, document.getElementById('app-wrapper'))
  //} else {
    // Server is down, serve static alternative?
  //}
//});
