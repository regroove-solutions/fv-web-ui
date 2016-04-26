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
import React, {Component, PropTypes} from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';

@provide
export default class Preview extends Component {

  static propTypes = {
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    fetchPhrase: PropTypes.func.isRequired,
    computePhrase: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    switch (this.props.type) {
      case 'FVWord':
        this.props.fetchWord(this.props.id);
      break;

      case 'FVPhrase':
        this.props.fetchPhrase(this.props.id);
      break;
    }
  }

  render() {

      let previewStyles = {
        padding: '10px'
      }

      let computeResult;
      let body = <CircularProgress mode="indeterminate" size={1} />;

      switch (this.props.type) {
        case 'FVWord':
          computeResult = this.props.computeWord;

          let word = selectn('words.' + this.props.id, this.props.computeWord);
          let wordResponse = selectn('response', word);

          if (wordResponse && word.success) {
            body = <div><strong>{wordResponse.title}</strong> (Part of Speech: {wordResponse.properties['fv-word:part_of_speech']})</div>;
          }
        break;

        case 'FVPhrase':
          computeResult = this.props.computePhrase;

          let phrase = selectn('phrases.' + this.props.id, this.props.computePhrase);
          let phraseResponse = selectn('response', phrase);

          if (phraseResponse && phrase.success) {
            body = <div><strong>{phraseResponse.title}</strong></div>;
          }
        break;
      }

      return (
        <Paper style={previewStyles} zDepth={3}>
          {body}
        </Paper>
      );
    }
}
