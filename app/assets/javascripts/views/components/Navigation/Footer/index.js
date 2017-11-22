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
      <div>
        <footer className={classNames('footer', this.props.className)}>
          <div className="container-fluid">
              <div className="row">

                <div className={classNames('col-xs-12', 'col-md-5', 'col-md-offset-1')} style={{paddingTop: '20px'}}>
                  <img src="/assets/images/logo-fpcc-white.png" alt="FirstVoices Logo" className={classNames('pull-left')} />
                </div>

                <div className={classNames('col-xs-12', 'col-md-5', 'col-md-offset-1', 'body')} style={{paddingTop: '20px', fontWeight: 100}}>
                  <p>Disclaimer | Conditions of Use | <a href="mailto:feedback@fpcf.ca">Feedback</a> | Donate</p>
                  <p>Phone: 250-652-5952 · Email: info@fpcc.ca</p>
                  <p>&copy; 2000-{new Date().getFullYear()} FirstVoices</p>
                </div>

              </div>
          </div>
        </footer>

        <div className="container-fluid" style={{backgroundColor: '#0d6c80', borderTop: '1px solid #1c788c'}}>
            <div className="row">
              <div className={classNames('col-xs-12')}>
                <p style={{fontSize: '10px', lineHeight: '130%', marginTop: '10px', color: '#4191a5'}}>&copy; This database is protected by copyright laws and is owned by the First Peoples’ Cultural Foundation. All materials on this site are protected by copyright laws and are owned by the individual Indigenous language communities who created the archival content. Language and multimedia data available on this site is intended for private, non-commercial use by individuals. Any commercial use of the language data or multimedia data in whole or in part, directly or indirectly, is specifically forbidden except with the prior written authority of the owner of the copyright.</p>
              </div>
            </div>
        </div>

      </div>
    );
  }
}