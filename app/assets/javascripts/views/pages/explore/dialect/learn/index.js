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

import RaisedButton from 'material-ui/lib/raised-button';

// Models
import Word from 'models/Word';
import Words from 'models/Words';
import Phrase from 'models/Phrase';
import Phrases from 'models/Phrases';

// Operations
import DocumentOperations from 'operations/DocumentOperations';
import DirectoryOperations from 'operations/DirectoryOperations';

/**
* Learn portion of the dialect portal
*/
export default class Learn extends React.Component {

  static contextTypes = {
      client: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
      router: React.PropTypes.object.isRequired,
      siteProps: React.PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this._navigate = this._navigate.bind(this);

    this.wordOperations = new DirectoryOperations(Word, Words, context.client, { domain: context.siteProps.domain });
    this.phraseOperations = new DirectoryOperations(Phrase, Phrases, context.client, { domain: context.siteProps.domain });

    this.currentPath = props.dialect.get('parentLanguageFamily').get('dc:title') + '/' + props.dialect.get('parentLanguage').get('dc:title') + '/' + props.dialect.get('dc:title');

    this.state = {
      wordCount: 0,
      phraseCount: 0
    }

    // Pre-fetch words and phrases to speed up display and extract count
    this._getPhrasesAndSetResultSize(props);
    this._getWordsAndSetResultSize(props);

    this._handlePhrasesDataRequest = this._handlePhrasesDataRequest.bind(this);
    this._handleWordsDataRequest = this._handleWordsDataRequest.bind(this);
  }

  // Handle change of params when navigating within router
  // See https://github.com/rackt/react-router/blob/latest/docs/guides/advanced/ComponentLifecycle.md
  componentDidUpdate (prevProps) {
    let oldDialect = prevProps.dialect;
    let newDialect = this.props.dialect;

    if (newDialect !== oldDialect && newDialect != null) {
      this._getWordsAndSetResultSize(this.props);
      this._getPhrasesAndSetResultSize(this.props);
    }
  }

  _getPhrasesAndSetResultSize(props){
    this._handlePhrasesDataRequest(props).then((function(phrases){
      this.setState({
        phraseCount: phrases.totalResultSize
      });
    }).bind(this));
  }

  _getWordsAndSetResultSize(props){
    this._handleWordsDataRequest(props).then((function(words){
      this.setState({
        wordCount: words.totalResultSize
      });
    }).bind(this));
  }

  _handlePhrasesDataRequest(childProps, page = 1, pageSize = 20) {
    return this.phraseOperations.getDocumentsByPath(
        '/sections/Data/' + this.currentPath,
        {'X-NXproperties': 'dublincore, fv-phrase, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  _handleWordsDataRequest(childProps, page = 1, pageSize = 20) {
    return this.wordOperations.getDocumentsByPath(
        '/sections/Data/' + this.currentPath,
        {'X-NXproperties': 'dublincore, fv-word, fvcore'},
        {'currentPageIndex': (page - 1), 'pageSize': pageSize}
    );
  }

  _navigate(page) {
    this.context.router.push('/explore/' + this.props.dialect.get('parentLanguageFamily').get('dc:title') + '/' + this.props.dialect.get('parentLanguage').get('dc:title') + '/' + this.props.dialect.get('dc:title') + '/learn/' + page );
  }

  render() {

    // Assign dialect prop, from parent, to all children
    let content = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, {
          dialect: this.props.dialect,
          handlePhrasesDataRequest: this._handlePhrasesDataRequest,
          handleWordsDataRequest: this._handleWordsDataRequest
        });
    }, this);

    // If no children, render main content.
    if (!this.props.children) {
      content = <div className="row">

        <div className={classNames('col-xs-12', 'col-md-6')}>
          <h1>About our Language</h1>
          <p>&quot;Pelpala7w&iacute;t i ucwalm&iacute;cwa m&uacute;ta7 ti tm&iacute;cwa &quot;- The people and land are one We are the Lilwat Nation, an Interior Salish people We live in a stunning and dramatic landscape with a rich biodiversity-a mysterious place of towering mountains,ice fields,alpine meadows,white-water rivers and braided river valleys that run to a milky color due to the silt and clay deposited by glacial melt. While Lilwat is a separate and distinct Nation, its still remains part of the St'at'imc Nation Our Language is called Ucwalmicwts. It is taught at both X'itolacw Community School and Pemberton Secondary School. Lilwat Also has a Language Immersion school which goes from Nursey to grade three and each subject in the immersion school is taught in the Ucwalmicwts Language. L&iacute;&#318;wat Nation (L&iacute;&#318;wat means where the rivers meet). </p>

          <p>Originally the Lil'wat7&uacute;l managed a vast territory within the headwaters of the three rivers: Green River, Lillooet River and the Birkenhead River. </p>

          <p>We are building a language retention strategy in the manner of nt'&aacute;kmen &amp; nx&eacute;kmen, and in 1974 was the inception of the written language in our community.</p>

          <p>Cedar is inherent in our lives from birth until death. It provides a basket for our children and is used to cradle our loved ones when they pass into the spirit world. We use it for clothing, transportation, art, regalia, shelter, gathering food, cooking and as medicine. </p>

          <p>Listen to our words, and explore the Lil'wat Language! CUYSTW&Iacute; MALH UCWALM&Iacute;CWTS- lets all go speak our Language!</p>
        </div>

        <div className={classNames('col-xs-12', 'col-md-2')}>
          <h1>{(this.props.dialect) ? this.props.dialect.get('dc:title') : ''} Alphabet</h1>
          <p>First words here</p>
        </div>

        <div className={classNames('col-xs-12', 'col-md-4')}>
          <h1>Contact Info</h1>
          <p>Status of our language here.</p>
          <h1>Keyboards</h1>
          <p>Keyboards</p>
        </div>

      </div>
    }

    return <div>
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'words')} label={"Words (" + this.state.wordCount + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'phrases')} label={"Phrases (" + this.state.phraseCount + ")"} secondary={true} /> 
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'songs')} label="Songs" secondary={true} /> 
                  <RaisedButton onTouchTap={this._navigate.bind(this, 'stories')} label="Stories" secondary={true} /> 
                </div>
              </div>
            </div>

            {content}
        </div>;
  }
}