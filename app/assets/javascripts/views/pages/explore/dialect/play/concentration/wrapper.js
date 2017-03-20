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
import ReactDOM from 'react-dom';
import Memory from 'games/memory'

/**
* Test game wrapper
*/
export default class Game extends Component {

  static propTypes = {
    words: PropTypes.array.isRequired
  }

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
    this.gameContainer = null;
  }

  /**
   * componentDidMount
   */
  componentDidMount () {

    //Setup default asset paths
    const defaultAssetsPath = '/assets/games/memory/assets';
    const defaultLibsPath = `${defaultAssetsPath}/libs`;
    const defaultImagesPath = `${defaultAssetsPath}/images`;

    //Default game config
    /**
     * @todo Setup image paths based on dialect
     */


    let gameConfig = {

        images:{
            preloaderLoading:`${defaultImagesPath}/loading.png`,
            preloaderLogo:`${defaultImagesPath}/logo.png`,
            background:`${defaultImagesPath}/background.png`,
            card:`${defaultImagesPath}/card.png`,
            card_flipped:`${defaultImagesPath}/card_flipped.png`,
            title:`${defaultImagesPath}/title.png`,
            time:`${defaultImagesPath}/time.png`
        },

        cards:[
            {
                word:'Word 1',
                translation:'english translation',
                image:`${defaultImagesPath}/example/1.png`,
                audio:'assets/sounds/sample.mp3'
            },
            {
                word:'Word 2',
                translation:'english translation',
                image:`${defaultImagesPath}/example/2.png`,
                audio:'assets/sounds/sample.mp3'
            },
            {
                word:'Word 3',
                translation:'english translation',
                image:`${defaultImagesPath}/example/3.png`,
                audio:'assets/sounds/sample.mp3'
            },
            {
                word:'Word 4',
                translation:'english translation',
                image:`${defaultImagesPath}/example/4.png`,
                audio:'assets/sounds/sample.mp3'
            },
            {
                word:'Word 5',
                translation:'english translation',
                image:`${defaultImagesPath}/example/5.png`,
                audio:'assets/sounds/sample.mp3'
            }
        ]
        
    };



    /**
     * Create the game, with container and game config
     */
    const gameContainerNode = ReactDOM.findDOMNode(this.gameContainer);
    Memory.init(gameContainerNode, gameConfig);
  }

  /**
   * Component Will Unmount
   * Cleanup the game / assets for memory management
   */
  componentWillUnmount () {
      Memory.destroy();
  }

  /**
   * Render
   */
  render() {

    //Setup game styles
    const gameContainerStyles = {
      maxWidth:800,
      margin:'auto'
    }

    return <div style={gameContainerStyles} ref={(el)=>{this.gameContainer = el}}></div>;
  }
}