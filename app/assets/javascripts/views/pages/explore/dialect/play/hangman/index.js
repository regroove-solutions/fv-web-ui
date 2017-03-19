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
import HangManGame from './hangman';

/**
* Play games
*/
export default class Hangman extends Component {

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
  }

  /**
   * componentDidMount
   */
  componentDidMount () {

  }

  /**
   * Render
   */
  render() {
    
    const config = {
      puzzle:'charlie is cool',
      translation:'translation',
      alphabet:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
      audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
    }

    return <div className="hangman-game">
              <HangManGame {...config} />
          </div>;
  }

}