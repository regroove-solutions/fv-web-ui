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
import classNames from 'classnames';
import provide from 'react-redux-provide';

import WordView from 'views/pages/explore/dialect/learn/words/view';

import CircularProgress from 'material-ui/lib/circular-progress';

/**
* View entity controller
*/
@provide
export default class PageDialectViewDictionaryItem extends Component {

  static propTypes = {
    properties: PropTypes.object.isRequired,
    windowPath: PropTypes.string.isRequired,
    splitWindowPath: PropTypes.array.isRequired,
    pushWindowPath: PropTypes.func.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    computeDocument: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);
  }

  fetchData(newProps) {
    let path = newProps.splitWindowPath.slice(1).join('/');
    newProps.fetchDocument('/' + path, { 'X-NXenrichers.document': 'ancestry, word' });
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  render() {

    const { computeDocument } = this.props;

    let document = computeDocument.response;

    let debug = <pre>{JSON.stringify(document, null, 4)}</pre>;

    if (computeDocument.isFetching || !computeDocument.success) {
      return <CircularProgress mode="indeterminate" size={5} />;
    }

    switch (document.type) {
    	case 'FVWord':
    		return <div><WordView word={document} /></div>;
    	break;
    }

    return <div>404</div>;
  }
}