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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import t from 'tcomb-form'

import { connect } from 'react-redux'
import ProviderHelpers from 'common/ProviderHelpers'

import selectn from 'selectn'
import options from 'models/schemas/options'
import fields from 'models/schemas/fields'

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
} from '@material-ui/core'

import TranslationInput from './translationInput'
import '!style-loader!css-loader!./modalStyles.css'

/**
 * List view for words in immersion
 */
const { bool, func, object, string } = PropTypes

class ModalContent extends Component {
  static propTypes = {
    handleClose: func,
    handleSave: func,
    label: object,
    type: string.isRequired,
    dialectPath: string.isRequired,
    audioRef: object.isRequired,
    // redux
    computeDialect2: object.isRequired,
  }
  static defaultProps = {
    type: 'base',
  }

  constructor(props, context) {
    super(props, context)

    const { label, type } = this.props

    this.fields = Object.assign({}, selectn('FVLabel', fields))

    this.options = Object.assign({}, selectn('FVLabel', options))

    this.state = {
      translation: label ? this.mapTranslation(label[type]) : [],
      formValue: null,
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const { type, label } = this.props
    if (prevProps.label && label && prevProps.label[type] !== label[type]) {
      //   change label
      this.setState({ translation: this.mapTranslation(label[type]) })
    } else if (prevProps.label && !label) {
      // empty label
      this.setState({ translation: [] })
    } else if (!prevProps.label && label) {
      // new label
      this.setState({ translation: this.mapTranslation(label[type]) })
    }
  }

  mapTranslation = (translation) => {
    const mappedTranslation = translation.split(/(%s)/g)
    if (mappedTranslation[0] === '%s') {
      mappedTranslation.splice(0, 0, '')
    }
    if (mappedTranslation[-1] === '%s') {
      mappedTranslation.push('')
    }
    return mappedTranslation
  }

  handleChange = (event, index) => {
    const newState = [...this.state.translation]
    newState[index] = event.target.value
    this.setState({
      translation: newState,
    })
  }

  handleSave = () => {
    const { handleSave } = this.props
    const { translation } = this.state
    handleSave(translation)
  }

  renderTranslation = (label) => {
    const { type } = this.props
    if (label.type === 'phrase') return label[type]
    var translation = label[type]
    var count = 0
    const words = translation.split(/(%s)/g).map((word, i) => {
      if (word === '%s') {
        const chip = <Chip key={i} label={label.templateStrings[count]} />
        count++
        return chip
      } else {
        return <span key={i}>{word}</span>
      }
    })
    return words
  }

  scriptTranslation = (label) => {
    const { translation } = this.state
    var words = translation.join('')
    label.templateStrings.forEach((string) => {
      words = words.replace('%s', string)
    })
    return words
  }

  render() {
    const { handleClose, label, audioRef, dialectPath, computeDialect2 } = this.props
    const { translation, formValue } = this.state

    const _computeDialect2 = ProviderHelpers.getEntry(computeDialect2, dialectPath)
    const context = selectn('response', _computeDialect2)
    return (
      <>
        <DialogTitle id="responsive-dialog-title">Edit Label</DialogTitle>
        <DialogContent>
          <h3>Label Information</h3>
          <TextField
            id="base-phrase"
            label="Base Phrase"
            multiline
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            rowsMax="4"
            defaultValue={label.base}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <span>{this.renderTranslation(label)}</span>
          <TextField
            id="category"
            label="Category"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={label.category}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <h3>Enter the translation and related audio files below.</h3>
          <DialogContentText>
            These will show if vistors to the site select 'Immersive Bilingual' or 'Immersive Indigenous Monolingual'
            for their site experience.
          </DialogContentText>
          {/* PHRASE VS TEMPLATE ENTRY */}
          {label.type === 'phrase' ? (
            <TextField
              id="translation"
              label="Translation"
              fullWidth
              multiline
              required
              InputLabelProps={{
                shrink: true,
              }}
              rowsMax="4"
              value={translation[0]}
              onChange={(ev) => this.handleChange(ev, 0)}
              margin="normal"
            />
          ) : (
            <div>
              <TranslationInput
                templateStrings={label.templateStrings}
                translation={translation}
                onChange={this.handleChange}
              />
              <div>preview</div>
              <span>{this.scriptTranslation(label)}</span>
            </div>
          )}
          <div className="related-audio">
            <t.form.Form
              ref={audioRef}
              type={t.struct(this.fields)}
              context={selectn('response', _computeDialect2)}
              value={label.relatedAudio ? { 'fv:related_audio': [label.relatedAudio] } : formValue}
              options={this.options}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => this.handleSave()} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvDialect } = state

  const { computeDialect2 } = fvDialect
  return {
    computeDialect2,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContent)
