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

import Paper from 'material-ui/lib/paper';

@provide
export default class Preview extends Component {

  static propTypes = {
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      fetched: false
    };
  }

/*  shouldComponentUpdate(newProps, newState) {

    if (newProps.computeWord.response.title != this.props.computeWord.response.title) {
      return true;
    }

    return false;
  }
*/
  componentDidMount() {
    switch (this.props.type) {
      case 'FVWord':
        if (!this.state.fetched)
          this.props.fetchWord(this.props.id);

        this.setState({fetched: true});
      break;
    }
  }

  _renderIsFetching(computeResult) {
    if (computeResult.response.isFetching) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }
  }

  render() {

      let previewStyles = {
        padding: '10px'
      }

      let computeResult;
      let body = '';

      switch (this.props.type) {
        case 'FVWord':
          computeResult = this.props.computeWord;
          this._renderIsFetching(computeResult);

          let word = computeResult.response;

          if (computeResult.success) {
            body = <div><strong>{word.title}</strong> (Part of Speech: {word.properties['fv-word:part_of_speech']})</div>;
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
