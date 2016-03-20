import React, {Component, PropTypes} from 'react';
import t from 'tcomb-form';
import classNames from 'classnames';
import Select from 'react-select';
'use strict';


import Autosuggest from 'react-autosuggest'

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Javascript',
    year: 1995
  },
  {
    name: 'Python',
    year: 1991
  }
]

function getSuggestions(value) {
  return languages.filter(language => language.name.indexOf(value) === 0)
}

function getSuggestionValue(suggestion) {
  return suggestion.name
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  )
}

// define the template only once
function getTemplate(options) {
  function renderInput(locals) {
    const value = locals.value || '' // react-autosuggest doesn't like null or undefined as value
    const inputProps = {
      ...locals.attrs,
      value: value,
      onChange: (evt, { newValue }) => {
        locals.onChange(newValue)
      }
    }
    const suggestions = options.getSuggestions(value)
    return (
      <Autosuggest
        suggestions={suggestions}
        getSuggestionValue={options.getSuggestionValue}
        renderSuggestion={options.renderSuggestion}
        inputProps={inputProps}
      />
    )
  }

  return t.form.Form.templates.textbox.clone({ renderInput });
}




/**
* Custom select field for tcomb-form that uses alloy-editor
*/
/*
export default class SelectFactory extends t.form.Select {

	constructor() {
		super();
		this.state = {
			selectedValue: null
		}
	}

  _onChange(newValue) {
    console.log(newValue);
    this.setState({selectedValue: newValue});
   }

  renderOption(option) {
    return <span>{option.label} {option.data}</span>;
  }

  renderValue(option) {
    return <strong>{option.label} <audio src={option.data}/></strong>;
  }

  _getOptions(input, callback) {
    if (this.props.computeAudiosAll.success) {
      let fetchedOptions = selectn("response.entries", this.props.computeAudiosAll).map((audio) => {
        return {value: audio.uid, label: audio.title, data: audio.properties['file:content'].data};
      });

     // console.log(options)

      callback(null, {
          options: fetchedOptions,
          // CAREFUL! Only set this to true when there are no more options,
          // or more specific queries will not be sent to the server.
          complete: false
      });
    }
   }

  getTemplate() {
    return (locals) => { // <- locals contains the "recipe" to build the UI

      // handle error status
      var className = 'form-group';
      if (locals.hasError) {
        className += ' has-error';
      }

      // translate the option model from tcomb to react-select
      var options = locals.options.map(({value, text}) => ({value, label: text}));

      return (
        <div className={className}>
          <label className="control-label">{locals.label}</label>
	        <Select
	          name="form-field-name"
	          options={options1}
	        />
        </div>
      );
    };
  }
}*/