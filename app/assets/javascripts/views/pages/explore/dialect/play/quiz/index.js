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

import {IconButton, RaisedButton, LinearProgress} from 'material-ui';

import ConfGlobal from 'conf/local.json';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

import provide from 'react-redux-provide';
import selectn from 'selectn';

const TOTAL_QUESTIONS = 10;

const containerStyle = {
    background: 'url(/assets/games/wordscramble/assets/images/background.png)',
    backgroundSize: 'cover',
    padding: '40px',
    display: 'block',
    border: '3px solid #040000',
    marginBottom:'20px',
    position:'relative',
    maxWidth:'800px',
    margin:'auto'
}

const randomIntBetween = function(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}

class Answer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {data, selected, correct, disabled} = this.props;

    let backgroundColor = '#fff';
    let labelColor = '#000';

    if (selected) {
        backgroundColor = 'orange';

        if (correct) {
            labelColor = '#fff';
            backgroundColor = 'green';
        }
    }

    return <div className="col-xs-6">
      <RaisedButton style={{'width': '100%'}} labelColor={labelColor} disabled={disabled} backgroundColor={backgroundColor} onTouchTap={this.props.onSelect.bind(this, data, correct)} label={(data) ? selectn('word', data) : 'Loading...'} />
    </div>;
  }
}

@provide
export default class Quiz extends Component {

    static propTypes = {
        fetchWords: PropTypes.func.isRequired,
        computeWords: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired
    }

    constructor(props, context) {
        super(props, context);

        ['_handleNavigate', '_handleAnswerSelected', '_restart'].forEach( (method => this[method] = this[method].bind(this)) );

        this.state = this.getDefaultState();
    }

    getDefaultState() {

        // Create a random list of numbers to serve as the word order
        const randomizeNumbers = new List([...Array(50).keys()]).sortBy(()=>Math.random())

        // First 10 of random numbers will be questions
        const questionsOrder = randomizeNumbers.slice(0, 10);

        return  {
            nowPlaying: null,
            questionsOrder: questionsOrder,
            fillerAnswers: new List(),
            answersOrder: Array.from({length: 10}, () => Math.floor(Math.random() * 4)), // For each question determine random position of answer
            selectedAnswers: new Map(),
            currentAnswerIndex: 0,
            attempts: 0
        }
    }

    componentDidMount () {
        this.fetchData(this.props);
    }

    fetchData(props, pageIndex, pageSize, sortOrder, sortBy) {
        // Fetch words (generate randomness based on GUID)
        props.fetchWords(props.routeParams.dialect_path + '/Dictionary',
        ' AND fv:related_pictures/* IS NOT NULL AND fv:related_audio/* IS NOT NULL' + 
        //' AND fv-word:available_in_games = 1 ' + 
        ' AND ecm:uuid LIKE \'%' + randomIntBetween(10, 99) + '%\'' +
        '&currentPageIndex=0' + 
        '&pageSize=50'
        );
    }

    _restart() {
        this.setState(this.getDefaultState());
        this.fetchData(this.props);
    }

    _handleAnswerSelected( word, correct, e ){

        if (correct) {
            UIHelpers.playAudio(this.state, function(state) { this.setState(state); }.bind(this), selectn('audio', word), e);
        }

        this.setState({
            attempts: this.state.attempts + 1,
            selectedAnswers: this.state.selectedAnswers.set(this.state.currentAnswerIndex, new Map({ word: word, correct: correct}))
        });
    }

    _handleNavigate(direction) {

        let newIndex;

        if (direction == 'next')
            newIndex = this.state.currentAnswerIndex + 1;
        else
            newIndex = this.state.currentAnswerIndex - 1;

        if (newIndex <= (TOTAL_QUESTIONS - 1) && newIndex >= 0)
        {
            this.setState({
                currentAnswerIndex: newIndex
            });
        }
    }

    _normalizeWord(wordObj) {
        return {
            uid: selectn('uid', wordObj),
            word: selectn('properties.dc:title', wordObj),
            translation: selectn('properties.fv:literal_translation[0].translation', wordObj) || selectn('properties.fv:definitions[0].translation', wordObj),
            audio: ConfGlobal.baseURL + selectn('contextParameters.word.related_audio[0].path', wordObj) + '?inline=true',
            image: UIHelpers.getThumbnail(selectn('contextParameters.word.related_pictures[0]', wordObj), 'Medium')
        };
    }

    render() {

        let selectedAnswer = null;
        let questions = new List();
        let fillerAnswers = new List();
        let answers = [];

        let isCorrect = false;

        // All correct answers
        let correctAnswers = this.state.selectedAnswers.filter((v, k) => v.get('correct'));

        // Answer has been selected
        let isSelected = this.state.selectedAnswers.has(this.state.currentAnswerIndex);

        // Quiz complete
        let isComplete = correctAnswers.count() === TOTAL_QUESTIONS;

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path + '/Dictionary',
            'entity': this.props.computeWords
        }])

        const computeWords = ProviderHelpers.getEntry(this.props.computeWords, this.props.routeParams.dialect_path + '/Dictionary');

        // Seperate all correct answers from all wrong answers
        (selectn('response.entries', computeWords) || []).forEach(function(v, i) {
            // If word is a correct answer
            if (this.state.questionsOrder.includes(i)) {
                questions = questions.push(this._normalizeWord(v));
            }
            // If word is a wrong answer
            else {
                fillerAnswers = fillerAnswers.push(this._normalizeWord(v));
            }
        }.bind(this));

        // Generate 4 answers
        if (questions.size > 0) {
            for (let i = 0; i < 4; ++i) {
                let answer, isAnswerCorrect, isSelectedAnswer;

                let key = i + (this.state.currentAnswerIndex * 3);

                // Seperate correct answer from wrong answer
                if (i === this.state.answersOrder[this.state.currentAnswerIndex]) {
                    answer = questions.get(this.state.currentAnswerIndex);
                    isAnswerCorrect = true;
                } else {
                    answer = fillerAnswers.get(key);
                    isAnswerCorrect = false;
                }

                // Get current answer if it is selected
                isSelectedAnswer = isSelected && selectn('uid', this.state.selectedAnswers.get(this.state.currentAnswerIndex).get('word')) === selectn('uid', answer);

                // Check if current selected answer is correct
                if (isSelectedAnswer) {

                    selectedAnswer = answer;

                    if (isAnswerCorrect) {
                        isCorrect = true;
                    }
                }

                answers.push(<Answer onSelect={this._handleAnswerSelected} selected={isSelectedAnswer} key={selectn('uid', answer)} data={answer} correct={isAnswerCorrect} />);
            }
        }

        // Show skill level message based on attempts.
        let skillLevel = '';

        if (this.state.attempts == TOTAL_QUESTIONS) {
            skillLevel = 'Looks like you\'re an expert!';
        } else if (this.state.attempts > TOTAL_QUESTIONS && this.state.attempts < (TOTAL_QUESTIONS * 2)) {
            skillLevel = 'On your way to becoming an expert!';
        }

        return <div className="quiz-container">

                <div style={containerStyle}>

                    <div className="row">
                        <div className="col-xs-12">
                            <LinearProgress style={{height: '15px'}} mode="determinate" value={((this.state.currentAnswerIndex + 1) / TOTAL_QUESTIONS) * 100} />
                        </div>
                    </div>   

                    <div className="row">
                        <div className="col-xs-12">
                            <div className="imgCont" style={{textAlign: 'center'}}>

                                {(isComplete) ? <div className={classNames('alert', 'alert-success')} style={{marginTop: '15px', padding: '0'}}>Nice! You're completed this quiz! {skillLevel} <RaisedButton onTouchTap={this._restart} label="New Quiz" style={{marginLeft: '10px'}} /></div> : ''}

                                <img className="image" src={selectn('image', questions.get(this.state.currentAnswerIndex))} alt={selectn('title', questions.get(this.state.currentAnswerIndex))}/>

                                {(questions.size > 0) ? '' : <div style={{marginTop: '15px'}}><strong>Loading...</strong></div>}

                            </div>
                        </div>
                    </div>

                    <div className={classNames('row', 'row-answers')}>
                        {answers.map((answer) => { return (isCorrect && !answer.props.correct) ? React.cloneElement(answer, { disabled: true}) : answer })}
                    </div>

                    <div className={classNames('row', 'row-navigation')}>

                        <div className={classNames('col-xs-2', 'text-left')}>
                            <IconButton onTouchTap={this._handleNavigate.bind(this, 'previous')} iconClassName={classNames('glyphicon', 'glyphicon-chevron-left')} tooltip="Previous Question"/>
                        </div>

                        <div className={classNames('col-xs-8', 'text-center')}>
                            <div style={{width: '90%', margin: '10px auto', padding: '5px'}} className={classNames('alert', {'alert-success': isCorrect, 'alert-warning': !isCorrect, 'hidden': !isSelected})}>{(isSelected) ? (isCorrect) ? <div>Good Job! <strong>{selectn('word', selectedAnswer)}</strong> translates to <strong>{selectn('translation', selectedAnswer)}</strong></div> : 'Try again...' : ''}</div>
                        </div>

                        <div className={classNames('col-xs-2', 'text-right')}>
                            <IconButton onTouchTap={this._handleNavigate.bind(this, 'next')} disabled={!isCorrect || isComplete} iconClassName={classNames('glyphicon', 'glyphicon-chevron-right')} tooltip="Next Question"/>
                        </div>

                    </div>
                    
                </div>

              </div>
    }
}