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
import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import DOMPurify from 'dompurify';

import ConfGlobal from 'conf/local.json';

import Preview from 'views/components/Editor/Preview';

import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';

import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

const defaultStyle = {marginBottom: '20px'};

class Introduction extends Component {
  render() {

    const DEFAULT_LANGUAGE = this.props.defaultLanguage;
    const introTabStyle = {width: '99%', position: 'relative', overflowY: 'scroll', padding: '15px', height: '100px'};

    const introduction = selectn('properties.fvbook:introduction', this.props.item);
    const introductionTranslations = selectn('properties.fvbook:introduction_literal_translation', this.props.item);
    const introductionDiv = <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(introduction)}} style={Object.assign(introTabStyle, this.props.style)}></div>;

    if (introductionTranslations.length == 0) {
      if (!introduction) {
        return null;
      }

      return <div style={{padding: '10px'}}><div><h1 style={{fontSize: '1.2em'}}>Introduction</h1></div>{introductionDiv}</div>;
    }

    return <Tabs> 
            <Tab label="Introduction"> 
              {introductionDiv}
            </Tab> 
            <Tab label={DEFAULT_LANGUAGE}> 
              <div style={Object.assign(introTabStyle, this.props.style)}> 
                  {introductionTranslations.map(function(translation, i) {
                      if (translation.language == DEFAULT_LANGUAGE) {
                        return <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(translation.translation)}} key={i}></div>;
                      }
                    })}
              </div> 
            </Tab> 
          </Tabs>;
  }
}

class CardView extends Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      showIntro: false
    };
  }

  render () {

    // If action is not defined
    let action;

    if (this.props.hasOwnProperty('action') && typeof this.props.action === "function") {
      action = this.props.action;
    } else {
      action = () => {};
    }

    const DEFAULT_LANGUAGE = this.props.defaultLanguage;

    let coverImage = selectn('contextParameters.book.related_pictures[0].views[2].url', this.props.item) || '/assets/images/cover.png';
    let audioObj = selectn('contextParameters.book.related_audio[0]', this.props.item);

    let audio = (audioObj) ? <Preview minimal={true} key={selectn('uid', audioObj)} expandedValue={audioObj} type="FVAudio" /> : '';

    return <div style={Object.assign(defaultStyle, this.props.style)} key={this.props.item.uid} className={classNames('col-xs-12', 'col-md-' + Math.ceil(12 / this.props.cols))}>
                <Card style={{minHeight: '265px'}}>

                  <CardMedia
                    overlay={<CardTitle title={<span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.props.item.title)}} />} subtitle={selectn('properties.fvbook:title_literal_translation', this.props.item).map(function(translation, i) {
                      if (translation.language == DEFAULT_LANGUAGE) {
                        return <span key={i}>{translation.translation}</span>;
                      }
                    })} />}>
                    <img style={{minWidth: 'inherit', width: 'inherit'}} src={coverImage + '?inline=true'} />

                    <div style={{position: 'absolute', zIndex: (this.state.showIntro) ? 2 : -1 ,top: '10px', left: '10px', width:'95%', minWidth: 'auto', padding:0, backgroundColor:'#fff', height: '100%', border: '1px solid #777777', borderRadius: '0 0 10px 10px'}}>

                    {(() => {
                      if (selectn('properties.fvbook:introduction', this.props.item)) {
                        return <Introduction {...this.props} />
                      }
                    })()}

                    {audio}

                    </div>
                  </CardMedia>

                  <CardText style={{padding: '4px'}}>

                    <FlatButton onTouchTap={this.props.action.bind(this, '/explore' + this.props.item.path.replace('Stories & Songs', 'learn/' + (selectn('properties.fvbook:type', this.props.item) == 'story' ? 'stories' : 'songs') ))} primary={true} label={'Continue to ' + (selectn('properties.fvbook:type', this.props.item) || 'Entry')} />
                    
                    {(() => {
                      if (selectn('properties.fvbook:introduction', this.props.item)) {

                          return <IconButton iconClassName="material-icons" style={{verticalAlign: '-5px', padding:'5px', width: 'auto', height: 'auto', 'float':'right'}} tooltipPosition="top-left" onTouchTap={() => this.setState({showIntro: !this.state.showIntro})} touch={true}>flip_to_front</IconButton>;
                      }
                    })()}
                    
                  </CardText>

                </Card>
            </div>;
  }
}


class ListView extends Component {

  static propTypes = {
    items: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(List)
    ]),
    filteredItems: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(List)
    ]),
    type: PropTypes.string,
    action: PropTypes.func,
    cols: PropTypes.number,
    cellHeight: PropTypes.number,
    style: PropTypes.object
  };

  static defaultProps = {
    cols: 3,
    cellHeight: 210,
    style: null
  }

  constructor(props, context){
    super(props, context);
  }

  render() {

    let items = this.props.filteredItems || this.props.items;

    if (selectn('length', items) == 0) {
      return <div style={{margin: '20px 0'}}>No results found.</div>;
    }

    return <div className="row">
                {(items || []).map(function (item, i) {
                    return <CardView key={item.uid} item={item} {...this.props} />
                }.bind(this))}
            </div>;
  }
}

export {
  Introduction,
  ListView
}