import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import Autosuggest from 'react-autosuggest';

const theme = {
  container: 'autosuggest dropdown',
  containerOpen: 'dropdown open',
  input: 'form-control',
  suggestionsContainer: 'dropdown-menu',
  suggestion: '',
  suggestionFocused: 'active'
};

@provide
export default class AutoSuggestComponent extends Component {
  static propTypes = {
    fetchSharedAudios: PropTypes.func.isRequired,
    computeSharedAudios: PropTypes.object.isRequired,
    fetchSharedWords: PropTypes.func.isRequired,
    computeSharedWords: PropTypes.object.isRequired,
    fetchSharedPhrases: PropTypes.func.isRequired,
    computeSharedPhrases: PropTypes.object.isRequired,
    fetchSharedCategories: PropTypes.func.isRequired,
    computeSharedCategories: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  shouldRenderSuggestions(value) {
    return value.trim().length > 2;
  }

  getSuggestionValue(suggestion) {
      this.props.onChange(
        event, suggestion
      );
    return suggestion.title;
  }

  renderSuggestion(suggestion) {
    switch (this.props.type) {
      case 'FVWord':
        return (<a href='javascript:void(0);'>{suggestion.title} {(suggestion.properties['fv-word:part_of_speech']) ? '(' + suggestion.properties['fv-word:part_of_speech'] + ')' : ''}</a>);
      break;

      case 'FVCategory':

        let breadcrumb = [];

        selectn('contextParameters.breadcrumb.entries', suggestion).map(function(entry, i) {
          if (entry.type === 'FVCategory') {
            breadcrumb.push(<span key={i}> &raquo; {entry.title}</span>);
          }
        });

        return (<a href='javascript:void(0);'>{breadcrumb}</a>);
      break;

      default:
        return (<a href='javascript:void(0);'>{suggestion.title}</a>);
      break;
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
      selectObj: null
    };
    
    this.onChange = this.onChange.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }
  
  // BUG: this will show UID instead of title?
  componentWillReceiveProps(newProps) {
    
    if (newProps.value && newProps.value != this.state.value) {
      this.setState({
        value: newProps.value
      });
    }
  }

  loadSuggestions(value) {
    this.setState({
      isLoading: true
    });

    switch (this.props.type) {
      case 'FVAudio':
        this.props.fetchSharedAudios('all_shared_audio', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
      break;
      case 'FVWord':
        this.props.fetchSharedWords('featured_word_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
      break;
      case 'FVPhrase':
        this.props.fetchSharedPhrases('dialect_phrase_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
      break;
      case 'FVCategory':
        this.props.fetchSharedCategories('category_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, { 'X-NXenrichers.document': 'breadcrumb' } );
      break;
    }   
  }

  onChange(event, { newValue }) {

    this.setState({
      value: newValue
    });
  }
  
  //onSuggestionSelected(event, { suggestionValue }) {
    //this.loadSuggestions(suggestionValue);
  //}
  
  onSuggestionsUpdateRequested({ value, reason }) {

    if (reason === 'type')
      this.loadSuggestions(value);
  }


  getComputeType() {
    switch (this.props.type) {
      case 'FVAudio':
        return this.props.computeSharedAudios;
      break;

      case 'FVWord':
        return this.props.computeSharedWords;
      break;

      case 'FVPhrase':
        return this.props.computeSharedPhrases;
      break;

      case 'FVCategory':
        return this.props.computeSharedCategories;
      break;
    }
  }

  render() {

    const { value, isLoading } = this.state;
    const inputProps = {
      placeholder: "Start typing for suggestions...",
      value,
      onChange: this.onChange
    };

    const status = (this.getComputeType().isFetching ? 'Loading suggestions...' : '');

    return (
      <div className="app-container">
        <Autosuggest
          theme={theme}
          suggestions={this.getComputeType().response.entries || []}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          //onSuggestionSelected={this.props.onSuggestionSelected}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
        <div className="status">
          <strong>Status:</strong> {status}
        </div>
      </div>
    );
  }
}
