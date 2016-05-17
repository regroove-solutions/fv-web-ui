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
import ImageGallery from 'react-image-gallery';
import provide from 'react-redux-provide';

import CircularProgress from 'material-ui/lib/circular-progress';
import ConfGlobal from 'conf/local.json';

//Stylesheet
import '!style!css!react-image-gallery/build/image-gallery.css';

@provide
export default class Gallery extends React.Component {

  static propTypes = {
	  splitWindowPath: PropTypes.array.isRequired,	  
      fetchGallery: PropTypes.func.isRequired,
      computeGallery: PropTypes.object.isRequired
  };		
	
  constructor(props, context){
    super(props, context);
  }

  handleImageLoad(event) {
    console.log('Image loaded ', event.target)
  }
 
  fetchData(newProps) {
	  let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 2).join('/');	  
	  let galleryName = this.props.splitWindowPath.pop();
	  newProps.fetchGallery("/" + path + "/Portal/" + galleryName);  
  }

  // Fetch data on initial render
  componentDidMount() {
	  this.fetchData(this.props);
  } 
  
  render() {

	const { computeGallery } = this.props;
	  	  
	if(computeGallery.isFetching || !computeGallery.success || computeGallery.response === undefined) {
		return <CircularProgress mode="indeterminate" size={3} />;
	}

	const images = [];
			
	let gallery = computeGallery.response;

	gallery.contextParameters.gallery.related_pictures.map(function(picture) { 
		let image = { original: ConfGlobal.baseURL + picture.path, description: picture['dc:description'] };
		images.push(image);
		//console.log(images);			
	});
	
	// Add some sample images for testing
	images.push({ original: 'http://lorempixel.com/400/300/nature/1/', description: 'Optional description...' })
	images.push({ original: 'http://lorempixel.com/1000/600/nature/2/', description: 'Optional description...' })
	images.push({ original: 'http://lorempixel.com/1500/600/nature/3/', description: 'Optional description...' })
	  
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>{gallery.title}</h1>
                <p>{gallery.properties['dc:description']}</p>
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
        </div>;
  }
}