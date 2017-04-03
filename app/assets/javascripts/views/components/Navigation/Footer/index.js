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

import classNames from 'classnames';

import Divider from 'material-ui/lib/divider';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import LeftNav from 'material-ui/lib/left-nav';
import AppBar from 'material-ui/lib/app-bar';

export default class Footer extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <footer className={classNames('footer', this.props.className)}>
        <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <p className={classNames('text-center', 'text-muted')}><a href="mailto:feedback@fpcf.ca">Feedback</a> | Disclaimer | Conditions of Use</p>
              </div>
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-6">
                    {/*<img src="http://www.firstvoices.com/img/fpcf-logo-28x28.gif" alt="FirstVoices Logo" className={classNames('fv-small-logo', 'pull-left')} />&copy; 2000-13 FirstVoices<br/>Phone: 250-652-5952 · Email: info@fpcc.ca*/}
                  </div>
                  <div className={classNames('text-right', 'col-xs-6')}>
                    v1.0.1
                    {/*<img src="http://www.firstvoices.com/img/fv-logo-100x25.gif" alt="FirstVoices" />*/}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </footer>
    );
  }
}