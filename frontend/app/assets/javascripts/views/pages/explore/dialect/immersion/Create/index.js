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

// REDUX
import { connect } from 'react-redux'
import { createLabel } from 'providers/redux/reducers/fvLabel'

import {
  withMobileDialog,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
} from '@material-ui/core'

import TranslationInput from '../Edit/translationInput'

/**
 * List view for words in immersion
 */
const { bool, func, object, string } = PropTypes

class CreateLabelModal extends Component {
  static propTypes = {
    fullscreen: bool.isRequired,
    open: bool,
    handleClose: func,
    label: object,
    dialectPath: string,
    // REDUX: actions/dispatch/func
    createLabel: func.isRequired,
  }
  static defaultProps = {
    fullscreen: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      translation: this.props.label ? this.mapTranslation(label.base) : [],
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.label && this.props.label && prevProps.label.base !== this.props.label.base) {
      //   change label
      this.setState({ translation: this.mapTranslation(this.props.label.base) })
    } else if (prevProps.label && !this.props.label) {
      // empty label
      this.setState({ translation: [] })
    } else if (!prevProps.label && this.props.label) {
      // new label
      this.setState({ translation: this.mapTranslation(this.props.label.base) })
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
    const { label, createLabel, handleClose, dialectPath } = this.props
    const { translation } = this.state

    const now = Date.now()

    createLabel(
      dialectPath,
      {
        type: 'FVLabel',
        name: now.toString(),
        properties: {
          'dc:title': translation.join(''),
          'fvlabel:labelKey': label.labelKey,
        },
      },
      null,
      now
    ).then(() => {
      handleClose(true)
    })
  }

  renderTranslation = (label, type = 'base') => {
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
    const { fullScreen, open, handleClose, label } = this.props
    const { translation } = this.state

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={() => handleClose()}
          aria-labelledby="responsive-dialog-title"
          scroll="paper"
        >
          {label ? (
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
                <span>{this.renderTranslation(label, 'base')}</span>
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
                  These will show if vistors to the site select 'Immersive Bilingual' or 'Immersive Indigenous
                  Monolingual' for their site experience.
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

                {/* OPTIONAL AUDIO FILE */}
                <div>audio file</div>
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
          ) : (
            <div />
          )}
        </Dialog>
      </div>
    )
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvLabel } = state

  const { computeLabel } = fvLabel
  return {
    computeLabel,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  createLabel,
}

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(CreateLabelModal))
