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
import RaisedButton from 'material-ui/lib/raised-button';


const insetStyle = {
    boxShadow:'inset 2px 4px 9px 0px rgba(0,0,0,0.44)',        
}

const spotStyle = {
    display:'inline-block',
    fontSize:'50px',
    lineHeight: '42px',
    margin:'10px',
    padding: '10px',
    height:'60px',
    width:'60px',
    color: '#35b3ad',
    position:'relative',
    overflow:'hidden'
}

const guessedLetter = {
    fontSize: '32px',
    color:'#7f00b3',
    margin:'0'
}

const lineStyle = {
    border: '2px solid #000',
    width: '40px',
    position: 'absolute',
    bottom: '5px',
    left: '10px'
}

const inputStyle = {
    outline: 'none',
    border: '1px solid #CCC',
    fontSize: '24px',
    width: '80px',
    textAlign: 'center',
    verticalAlign: 'middle',
    marginRight: '10px'
}


const buttonStyle ={
    background: "#22e376",
    backgroundImage: "linear-gradient(to bottom, #22e376, #2bb8ac)",
    WebkitBorderRadius: "28",
    MozBorderRadius: "28",
    borderRadius: "28px",
    fontFamily: "Arial",
    color: "#ffffff",
    fontSize: "20px",
    padding: "10px 20px 10px 20px",
    textDecoration: "none",
    display: 'inline-block',
    verticalAlign: 'top',
    height: '90px',
    borderRadius: '6px',
    lineHeight: '70px',
    marginLeft: '5px',
    width: '190px',
    cursor:'pointer'
}

/**
* Play games
*/
export default class HangmanGame extends Component {
  


  /**
   * Constructor
   */
  constructor(props, context) {

    super(props, context);
    this.state = this.getDefaultState();

  }

  /**
   * Get Default State
   */
  getDefaultState()
  {
      return  {
        word:this.prepareWord(this.props.word),
        guessedLetters:[],
        guessesLeft:7
    }
  }


  /**
   * Prepare word
   * breaks up word into letters
   */
  prepareWord(word){
      const letters = word.split('');
      return letters.map((letter)=>{
          return {
              char:letter,
              found:false
          }
      })
  }


  /**
   * Guess letter
   */
  guessLetter()
  {
      const char = this.input.value;
      const guessedLetters = this.state.guessedLetters;
      let guessesLeft = this.state.guessesLeft;

      if(guessesLeft > 0)
      {
        let word = [...this.state.word];

        if(guessedLetters.indexOf(char) === -1)
        {
            guessedLetters.push(char);
            
            let letterFound = false;
            word.map((wordPart, action) => {
                if(wordPart.char === char)
                {
                    letterFound = true;
                    wordPart.found = true;
                }
            });
            
            if(letterFound === false)
            {
                guessesLeft = guessesLeft - 1;
            }

            this.setState({guessedLetters, word, guessesLeft});  
        }
      }
      
      this.input.value = '';
  }


  /**
   * On input down
   */
  onInputDown(e)
  {
      if(e.keyCode === 13)
      {
          this.guessLetter();
      }
      else
      {
          this.input.value = '';          
      }
  }

  /**
   * Render
   */
  render() {


    return <div className="hangman-game" style={{textAlign:'center'}}>
                <h1>Parachute</h1>
                <div>Guess the word to make it to the beach</div>
                <img src={`/assets/games/hangman/assets/${this.state.guessesLeft}.png`} style={{width:'750px',marginBottom:'-45px'}} />
                <div>
                    {this.state.word.map((letter, index)=>{
                        return (<div key={letter.char} className="spot" style={{...spotStyle,...insetStyle}} >
                                    <div className="letter">{letter.found ? letter.char : false}</div>
                                    <div className="line" style={lineStyle}></div>
                                </div>)
                    })}
                </div>
                <input type="text" onKeyDown={this.onInputDown.bind(this)} ref={(el)=>{this.input = el}} maxLength="1" style={inputStyle}/>

                <RaisedButton label="Guess" primary={true} onClick={this.guessLetter.bind(this)} />

                <div style={{margin:'auto', maxWidth:'480px'}}>
                    <div style={{ paddingTop: '19px',fontWeight: 'bold' }} >Guessed letters</div>
                    {this.state.guessedLetters.map((letter, index)=>{
                        return (<div  key={index} className="spot" style={{...spotStyle, ...guessedLetter}} >
                                    <div className="letter">{letter}</div>
                                    <div className="line" style={lineStyle}></div>
                                </div>)
                    })}
                </div>
           </div>;
  }

}
