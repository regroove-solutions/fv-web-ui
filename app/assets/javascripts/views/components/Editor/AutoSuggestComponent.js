import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
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

let KeymanWebChangePolling;

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
    fetchSharedContributors: PropTypes.func.isRequired,
    computeSharedContributors: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    provider: PropTypes.object,
    locals: PropTypes.object
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object,
    kmw: React.PropTypes.object
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

      case 'FVContributor':
        return (<a href='javascript:void(0);'>{suggestion.title} {(suggestion.properties['dc:description']) ? '(' + suggestion.properties['dc:description'] + ')' : ''}</a>);
      break;

      case 'FVCategory':

        let breadcrumb = [];

        selectn('contextParameters.breadcrumb.entries', suggestion).map(function(entry, i) {
          if (entry.type === 'FVCategory') {
            let shared = '';

            if (entry.path.indexOf('SharedData') !== -1)
              shared = ' (Shared)';

            breadcrumb.push(<span key={i}> &raquo; {entry.title} {shared}</span>);
          }
        });

        return (<a href='javascript:void(0);'>{breadcrumb}</a>);
      break;

      default:
        return (<a href='javascript:void(0);'>{suggestion.title}</a>);
      break;
    }
  }

  constructor(props, context) {
    super(props, context);

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

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value != this.state.value) {
      this.setState({
        value: newProps.value
      });
    }
  }

  componentWillUnmount() {
    clearInterval(KeymanWebChangePolling);
  }

  loadSuggestions(value) {
    this.setState({ isLoading: true });

    var timeout;

    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(function() {
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
          this.props.fetchSharedCategories(this.props.provider.name, 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.path + '/' + this.props.provider.folder, { 'X-NXenrichers.document': 'breadcrumb' } );
        break;
        case 'FVContributor':
          this.props.fetchSharedContributors('contributor_suggestion', 'currentPageIndex=1&pageSize=15&queryParams=' + value + '&queryParams=' + this.props.dialect.uid, {});
        break;
      }
    }.bind(this), 750);
  }

  onChange(event, { newValue, method }) {
    this.setState({
      value: newValue
    });
  }

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

      case 'FVContributor':
        return this.props.computeSharedContributors;
      break;
    }
  }

  componentDidMount() {
    setTimeout(function () {

      /**
      * This is a workaround for Keymanweb modifying the input value directly and not triggering an onChange event.
      * The virtual keyboard input will trigger a change on the actual suggest input via polling (see AppWrapper.js).
      * KeymanWeb should be patched or replaced in the future eliminating the need for this code.
      */
      let suggestionWidgetDOM = this.refs["suggestion_widget"].input;

      /**
      * Stop polling for KeymanWeb value when element blurred
      */
      suggestionWidgetDOM.addEventListener("blur", function(event) {
        clearInterval(KeymanWebChangePolling);
        return true;
      }.bind(this));

      /**
      * Begin polling for KeymanWeb value when element focused, if keyboard visible
      */
      suggestionWidgetDOM.addEventListener("focus", function(event) {

        // Always clear previous interval before starting a new one
        clearInterval(KeymanWebChangePolling);

        // Only required if keyboard is visible
        if (KeymanWeb.IsHelpVisible()) {

          KeymanWebChangePolling = setInterval(function() {

            // If keyboard closed, no need to keep polling
            if (!KeymanWeb.IsHelpVisible()) {
              clearInterval(KeymanWebChangePolling);
              return;
            }

            let keymanWebValue = suggestionWidgetDOM.value;

            // Update state value if values go out of sync, forcing an auto-suggest change
            if (keymanWebValue != this.state.value) {

              this.setState({value: keymanWebValue});
              this.loadSuggestions(keymanWebValue);

            }
          }.bind(this), 1000);
        }

        return true;
      }.bind(this));

    }.bind(this), 0);
  }

  render() {

    const { value, isLoading } = this.state;
    const inputProps = {
      'placeholder': "Start typing for suggestions...",
      'value': value,
      'onChange': this.onChange
    };

    const status = (this.getComputeType().isFetching ? 'Loading suggestions...' : '');

    return (
      <div className="row">
        <div className="col-xs-12">

          <Autosuggest
            ref="suggestion_widget"
            theme={theme}
            suggestions={this.getComputeType().response.entries || []}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps} />

          {status}

        </div>

      </div>
    );
  }
}
