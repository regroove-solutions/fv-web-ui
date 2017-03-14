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
import Immutable, { List, Map } from 'immutable';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Colors from 'material-ui/lib/styles/colors';
import FontIcon from 'material-ui/lib/font-icon';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';

import provide from 'react-redux-provide';
import selectn from 'selectn';

/**
* Play games
*/
@provide
export default class Wordscramble extends Component {

  static propTypes = {
    fetchPhrases: PropTypes.func.isRequired,
    computePhrases: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired
  }

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
    // Fetch fetch data
    this.fetchData(this.props);
  }

  fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
    props.fetchPhrases(props.routeParams.dialect_path + '/Dictionary',
    //' AND fv-word:available_in_games = 1 AND fv:related_pictures/* IS NOT NULL AND fv:related_audio/* IS NOT NULL' + 
    '&currentPageIndex=0' + 
    '&pageSize=10' + 
    '&sortBy=dc:created' + 
    '&sortOrder=DESC' 
    );
  }

  /**
   * Render
   */
  render() {

    const computeEntities = Immutable.fromJS([{
      'id': this.props.routeParams.dialect_path + '/Dictionary',
      'entity': this.props.computePhrases
    }])

    const computePhrases = ProviderHelpers.getEntry(this.props.computePhrases, this.props.routeParams.dialect_path + '/Dictionary');

    return <div className="wordscramble-game">
              {(selectn('response.entries', computePhrases) || []).filter((phrase) => selectn('properties.dc:title', phrase).indexOf(' ') > 0).map(function(phrase, i) {
                return <Scramble key={i} sentence={{
                    original: new List(selectn('properties.dc:title', phrase).split(' ')),
                    translation: selectn('properties.fv:definitions[0].translation', phrase),
                    audio: ConfGlobal.baseURL + selectn('contextParameters.phrase.related_audio[0].path', phrase) + '?inline=true',
                    picture: ConfGlobal.baseURL + selectn('contextParameters.phrase.related_pictures[0].path', phrase) + '?inline=true'}} />
              })}
          </div>;
  }

}


/**
 * Word Scramble
 */
export class Scramble extends Component {
  
  /**
   * Constructor
   */
  constructor(props){
    super(props)
    this.state = this.getDefaultState();
  }
  
  /**
   * Get default state (allows for reset)
   */
  getDefaultState()
  {
    const scrambledSentence = this.props.sentence.original.sortBy(()=>Math.random());
    
    return {
      scrambledSentence:scrambledSentence,
      selected:[],
      complete:false,
      incorrect:false
    }
  }

  /**
   * Reset Scrambled word
   */
  reset()
  {
     this.setState(this.getDefaultState())
  }

  /**
   * Select a word
   */
  selectWord(word)
  {
      const selectedWords = [...this.state.selected, word];
      this.setState({selected:selectedWords,incorrect:false});
  }

  /**
   * Unselect a word
   */
  unSelectWord(word)
  {
      const selectedWords = [...this.state.selected].filter((value)=>{
          return value !== word;
      });

      this.setState({selected:selectedWords});
  }
  
  /**
   * Check if answer is correct
   */
  checkAnswer()
  {
      if(this.state.selected.join(' ') === this.props.sentence.original.toJS().join(' '))
      {
        this.setState({complete:true})
      }
      else
      {
          this.setState({incorrect:true})
      }
  }

  render(){

    const containerStyles = {
        padding: '10px',
        display: 'inline-block',
        border: '1px solid #CCC',
        background: '#FFF',
        boxShadow: '2px 2px 6px #CCC',
        marginBottom:'20px',
        position:'relative'
    }

    return <div style={{marginTop: '15px'}}>
            <div className="scrambled-sentence" style={containerStyles}>
                <div style={{height:'50px', borderBottom: '1px solid #CCC', marginBottom: '16px'}}>
                    {this.state.selected.map((word, index)=>{
                        return <RaisedButton key={index} style={{backgroundColor:'#a7fba5'}} label={word} onMouseUp={this.unSelectWord.bind(this,word)}/>
                    })}
                    { this.state.complete ? <FontIcon className="material-icons" style={{color:Colors.greenA200, fontSize:'50px', position:'absolute', top:'5px', right:'5px'}}>check_box</FontIcon> : false }
                    { this.state.incorrect ? <FontIcon className="material-icons" style={{color:Colors.red600, fontSize:'50px', position:'absolute', top:'5px', right:'5px'}}>indeterminate_check_box</FontIcon> : false }
                </div>
                    {
                        this.state.scrambledSentence.map((word, index)=>{
                            
                            let disabled = false;

                            if(this.state.selected.includes(word))
                            {
                                disabled = true;
                            }

                        return <RaisedButton disabled={disabled} label={word} key={index} onMouseUp={this.selectWord.bind(this, word)} />
                        })
                    }
                {this.state.complete ? <RaisedButton label="Reset" primary={true} onMouseUp={this.reset.bind(this)}/> : false}
                <RaisedButton label="Check"  style={ this.state.complete ? {visibility:'hidden'} : {}} disabled={this.state.complete ? true : false} secondary={true} onMouseUp={this.checkAnswer.bind(this)}/>
                {this.state.complete ? false : <RaisedButton label="Reset" primary={true} onMouseUp={this.reset.bind(this)}/>}
                <div>
                    <audio src={this.props.sentence.audio} controls />
                    <TextField disabled={true} hintText={this.props.sentence.translation} />
                </div>
            </div>
    </div>
  }


}