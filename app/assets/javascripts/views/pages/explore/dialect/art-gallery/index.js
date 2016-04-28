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
export default class ArtGallery extends React.Component {

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
	  let path = this.props.splitWindowPath.slice(1, this.props.splitWindowPath.length - 1).join('/');
	  newProps.fetchGallery("/" + path + "/Portal/Art Gallery");  
  }

  // Fetch data on initial render
  componentDidMount() {
	  this.fetchData(this.props);
  } 
  
  render() {

	  const { computeGallery } = this.props;
	  
	  if(computeGallery.isFetching) {
			return <CircularProgress mode="indeterminate" size={3} />;
	}

	const images = [];
	
	if(computeGallery.success) {
		computeGallery.response.entries.map(function(entry) { 
			console.log(entry.title);
			console.log(entry.uid);
			
			let nxPath = entry.properties['file:content'].data;
			let image = { original: nxPath, description: entry.properties['dc:description'] };
			images.push(image);
			console.log(images);
			
		});
		//images.push({ original: 'http://lorempixel.com/400/300/nature/1/', description: 'Optional description...' })
		//images.push({ original: 'http://lorempixel.com/1000/600/nature/2/', description: 'Optional description...' })
		//images.push({ original: 'http://lorempixel.com/1500/600/nature/3/', description: 'Optional description...' })

	}
	  
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>Art Gallery</h1>
                <div className="col-sm-4 col-sm-offset-4">
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