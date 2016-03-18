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
import injectTapEventPlugin from 'react-tap-event-plugin';

import ConfGlobal from 'conf/local.json';

// Providers provide reducers and actions
import providers from './providers/index';

// Views
import AppWrapper from 'views/AppWrapper';

require('!style!css!normalize.css');

require('bootstrap/less/bootstrap');
require("styles/main");

injectTapEventPlugin();

const context = {
  providers,
  combinedProviders: [
    providers // OK for all providers to share the same store for now
  ],
  providedState: {
    properties: {
      title: ConfGlobal.title,
      domain: ConfGlobal.domain
    }
  }
};

render(<AppWrapper { ...context } />, document.getElementById('app-wrapper'));