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

/**
* Play games
*/
export default class Picturethis extends Component {

  /**
   * Constructor
   */
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      selectedTheme:false,
      selectedWordInPicture:false,
      selectedWordInList:false
    }
    
    this.config = {
      themes:[
        {
          image:'/assets/games/picturethis/assets/01animals.png',
          name:'Animals',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/02backyard.png',
          name:'Backyard',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/03bedroom.png',
          name:'Bedroom',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/04camping.png',
          name:'Camping',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/05classroom.png',
          name:'Classroom',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/06feast.png',
          name:'Feast',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/07garage_sale.png',
          name:'Garage Sale',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/08kitchen.png',
          name:'Kitchen',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/09medical_center.png',
          name:'Medical Center',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/10pow_wow.png',
          name:'Pow Wow',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/11travel.png',
          name:'Travel',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        },
        {
          image:'/assets/games/picturethis/assets/12village.png',
          name:'Village',
          words:[
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:13,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:100,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:200,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            },
            {
                word:'(replace with word)',
                translation:'(replace with translation)',
                location:{
                  x:300,
                  y:59
                },
                audio:'/assets/games/jigsaw/assets/sounds/sample.mp3'
            }
          ]
        }
      ]
    }
  }

  /**
   * Select Theme
   */
  selectTheme(theme)
  {
    window.scrollTo(0, 0); //@todo remove this, / find a better way
    
    this.resetTheme(theme);
    this.buildAudioReferences(theme);

    this.setState({
      selectedTheme:theme, 
      selectedWordInList:false, 
      selectedWordInList:false
    });

  }

  resetTheme(theme)
  {
    theme.words.forEach((word)=>{
      word.found = false
    })
  }

  buildAudioReferences(theme)
  {
    theme.words.forEach((word)=>{
      word.audioObject = new Audio(word.audio);
    })
  }

  renderThemeList()
  {

    const imageTileStyle = {
          border: '1px solid #666',
          borderRadius: '16px',
          boxShadow: '1px 1px 1px #666'
    }

    return ( <div className="picturethis-game">
              <div className="flex-container"> 
                <div className="grid">
                    {this.config.themes.map((theme, index)=>{
                        return ( <div key={index} className="cell" style={{cursor:'pointer'}} onMouseUp={this.selectTheme.bind(this, theme)}>
                                  <img className="responsive-image" src={`${theme.image}`} style={imageTileStyle} />
                                  <div style={{fontSize:'28px',textAlign:'center'}}>{theme.name}</div>
                                </div> )
                    })}
                </div>
              </div>
            </div>);
  }

  selectWordOrMatch(word, inPicture)
  {
    if(this.state.selectedWordInPicture === false && inPicture)
    {
      this.setState({selectedWordInPicture:word}, this.checkMatch.bind(this));
    }
    else if(this.state.selectedWordInList === false && inPicture === false)
    {
      this.setState({selectedWordInList:word},this.checkMatch.bind(this));
    }
  }


  checkMatch()
  {
    if(this.state.selectedWordInList !== false && this.state.selectedWordInPicture !== false)
    {
      if(this.state.selectedWordInPicture === this.state.selectedWordInList)
      {
          const word = this.state.selectedWordInList;
          word.found = true;
          word.audioObject.play();
          this.setState({selectedWordInList:false, selectedWordInPicture:false})
      }
      else
      {
          this.setState({selectedWordInList:false, selectedWordInPicture:false})
      }
    }    
  }

  renderGame()
  {
     const defaultAssetsPath = '/assets/games/picturethis/assets';
     const theme = this.state.selectedTheme;

     const tableCellStyle = {
       display:'inline-block', 
       width:'25%', 
       padding:'10px'
    };

     const tableStyle = {
       width: '700px',
       margin: '20px auto',
       border:' 1px solid #000',
       borderRadius: '12px'
    };

    const tableHeader = {
      background: '#CCC',
      borderRadius: '10px 11px 0 0',
      borderBottom: '2px solid #000',
      fontSize:'17px',
      fontWeight:'bold'
    }

    const locationNumberStyle = {
      "borderRadius": "30px",
      "display": "inline-block",
      "width": "37px",
      "height": "37px",
      "lineHeight": "36px",
      "fontWeight": "bold",
      "textAlign": "center",
      "cursor": "pointer",
      "border": "1px solid #00bcd4",
      "boxShadow": "0 0 1px #555",
      "color": "#000"
  }

    const unknownLocation = {
      position:'absolute',
      width:'37px',
      height:'37px',
      lineHeight:'37px',
      border: "1px solid #FFF",
      boxShadow: "0 0 1px #555",
      background:'#FFF',
      borderRadius: '20px',
      cursor:'pointer'
    }

    const foundLocation = {
      background: "#00bcd4",
      border:'1px solid #FFFFFF',
      color:'#FFFFFF'
    }

    const highlightLocation = {
      border:'2px solid #000000',
      background:'#00bcd4'
    }

     return (<div className="game" style={{textAlign:'center'}}>
              <a href="#" >Back</a>
              <h2>{theme.name}</h2>
              <div style={{position:'relative', display:'inline-block'}}>
                <img className="responsive-image" style={{borderRadius:'30px', border:'1px solid #000'}}src={`${theme.image}`} />
                {this.state.selectedTheme.words.map((word, location)=>
                  {
                    let highlight = {};

                    if(this.state.selectedWordInPicture === word)
                    {
                      highlight = highlightLocation;
                    }
                    let dot = false;
                    
                    if(word.found)
                    {
                      dot = <div style={{...unknownLocation,...locationNumberStyle,...foundLocation,  top:`${word.location.y}px`,left:`${word.location.x}px`}} onMouseUp={this.selectWordOrMatch.bind(this, word, true)}>{location + 1}</div>;
                    }
                    else
                    {
                      dot = <div style={{...unknownLocation, ...highlight, top:`${word.location.y}px`,left:`${word.location.x}px`}} onMouseUp={this.selectWordOrMatch.bind(this, word, true)}></div>;
                    }
                    return <div key={location}>
                            {dot}
                        </div>
                })}
              </div>
              <div style={tableStyle}>
                <div style={tableHeader}>
                    <div style={tableCellStyle}>Location</div>
                    <div style={tableCellStyle}>Word</div>
                    <div style={tableCellStyle}>Translation</div>
                    <div style={tableCellStyle}>Audio</div>
                </div>
                {this.state.selectedTheme.words.map((word, location)=>{
                  
                  let dotStyle = locationNumberStyle;

                  let dotAction = false;

                  if(word.found === false)
                  {
                    dotAction = this.selectWordOrMatch.bind(this, word, false)
                  }
                  else
                  {
                    dotStyle = {...dotStyle, ...foundLocation};
                  }

                  if(this.state.selectedWordInList === word)
                  {
                    dotStyle = {...locationNumberStyle,...highlightLocation}
                  }

                  return <div key={location}>
                            <div style={tableCellStyle}><div style={dotStyle} onMouseUp={dotAction}>{location + 1}</div></div>
                            <div style={tableCellStyle}>{word.word}</div>
                            <div style={tableCellStyle}>{word.translation}</div>
                            <div style={tableCellStyle}>
                              <audio controls style={{verticalAlign:'middle'}}>
                                <source src={word.audio} type="audio/mpeg"/>
                              </audio>
                            </div>
                        </div>
                })}

            </div>
          </div>)
  }
  /**
   * Render
   */
  render() {
      return (<div>
        {this.state.selectedTheme === false ? false : this.renderGame()}
        {this.renderThemeList()}
      </div>);
  }

}


