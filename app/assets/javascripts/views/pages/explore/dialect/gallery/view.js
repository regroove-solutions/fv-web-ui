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
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import ImageGallery from 'react-image-gallery';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import RaisedButton from 'material-ui/lib/raised-button';

import ProviderHelpers from 'common/ProviderHelpers';

import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';
import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

//Stylesheet
import '!style-loader!css-loader!react-image-gallery/build/image-gallery.css';

@provide
export default class Gallery extends React.Component {

  static propTypes = {
	  splitWindowPath: PropTypes.array.isRequired,
	  windowPath: PropTypes.string.isRequired,
	  pushWindowPath: PropTypes.func.isRequired,
      fetchGallery: PropTypes.func.isRequired,
      computeGallery: PropTypes.object.isRequired,
      routeParams: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      galleryPath: props.routeParams.dialect_path + '/Portal/' + props.routeParams.galleryName
    };
  }

  handleImageLoad(event) {
    console.log('Image loaded ', event.target)
  }

  fetchData(newProps) {
	  newProps.fetchGallery(this.props.routeParams.dialect_path + "/Portal/" + this.props.routeParams.galleryName);
  }

  _onNavigateRequest(path) {
    this.props.pushWindowPath(this.props.windowPath.replace('sections', 'Workspaces') + '/' + path);
  }

  // Fetch data on initial render
  componentDidMount() {
	  this.fetchData(this.props);
  }

  render() {

	const images = [];

    const computeGallery = ProviderHelpers.getEntry(this.props.computeGallery, this.state.galleryPath);

	(selectn('response.contextParameters.gallery.related_pictures', computeGallery) || []).map(function(picture) {
		let image = { original: ConfGlobal.baseURL + picture.path, description: picture['dc:description'] };
		images.push(image);
	});

    const computeEntities = Immutable.fromJS([{
      'id': this.state.galleryPath,
      'entity': this.props.computeGallery
    }])

    return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>
	          <div className="row">
	            <div className="col-xs-8">
	            </div>
	            <div className={classNames('col-xs-4', 'text-right')}>
                  <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', computeGallery)}}>
                    <RaisedButton label="Edit Gallery" onTouchTap={this._onNavigateRequest.bind(this, 'edit')} primary={true} />
                  </AuthorizationFilter>
	            </div>
	          </div>

            <div className="row">

              <div className="col-xs-12">
                <h1>{selectn('response.title', computeGallery)}</h1>
                <p>{selectn('response.properties.dc:description', computeGallery)}</p>
                <div className="col-xs-4 col-xs-offset-4">
	           	 <ImageGallery
	              ref={i => this._imageGallery = i}
	              items={images}
	           	  slideInterval={2000}
	              handleImageLoad={this.handleImageLoad}
	              showThumbnails={false}
	              showBullets={true} />
	           	 </div>
	           </div>
            </div>
        </PromiseWrapper>;
  }
}