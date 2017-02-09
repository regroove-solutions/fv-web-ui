
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
import React, {Component} from 'react';


/**
* Play games
*/
export default class Play extends Component {

  constructor(props, context){
    super(props, context);
  }

  render() {
    return <div>
            <div className="row">
              <div className="col-xs-12">
                <h1>Games</h1>
                <div className="flex-container">
                  <div className="grid">
                    <div className="cell">
                      <a href="./play/jigsaw"><img src="/assets/games/jigsaw/assets/images/preview.png" className="responsive-image"/></a>
                    </div>
                   <div className="cell">
                      <a href="./play/colouringbook"><img src="/assets/games/colouring-book/assets/images/preview.png" className="responsive-image"/></a>
                    </div>
                    <div className="cell">
                      <a href="./play/wordsearch"><img src="/assets/games/wordsearch/assets/images/preview.png" className="responsive-image"/></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>;
  }
}