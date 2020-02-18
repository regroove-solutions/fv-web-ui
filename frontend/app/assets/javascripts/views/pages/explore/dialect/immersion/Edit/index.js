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
import { fetchLabel, updateLabel } from 'providers/redux/reducers/fvLabel'
import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import Immutable from 'immutable'

import {
  withMobileDialog,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'

import { Document } from 'nuxeo'
import IntlService from 'views/services/intl'
import ProviderHelpers from 'common/ProviderHelpers'

const intl = IntlService.instance

/**
 * List view for words in immersion
 */
const { bool, func, object } = PropTypes

class LabelModal extends Component {
  static propTypes = {
    fullscreen: bool.isRequired,
    open: bool,
    handleClose: func,
    label: object,
    // REDUX: actions/dispatch/func
    fetchLabel: func.isRequired,
    updateLabel: func.isRequired,
  }
  static defaultProps = {
    fullscreen: false,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      translation: this.props.label ? label.translation : '',
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.label && this.props.label && prevProps.label.translation !== this.props.label.translation) {
      //   change label
      this.setState({ translation: this.props.label.translation })
    } else if (prevProps.label && !this.props.label) {
      // empty label
      this.setState({ translation: '' })
    } else if (!prevProps.label && this.props.label) {
      // new label
      this.props.fetchLabel(this.props.label.uid)
      this.setState({ translation: this.props.label.translation })
    }
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleSave = () => {
    const { label, updateLabel, computeLabel, handleClose } = this.props
    const { translation } = this.state

    const computeEntities = Immutable.fromJS([
      {
        id: label.uid,
        entity: computeLabel,
      },
    ])

    const item = computeEntities.find((value) => value.get('id') === label.uid)

    const word = ProviderHelpers.getEntry(item.get('entity'), label.uid)

    const newDocument = new Document(word.response, {
      repository: word.response._repository,
      nuxeo: word.response._nuxeo,
    })

    newDocument.set({ 'dc:title': translation })

    updateLabel(newDocument, null, null).then(() => {
      handleClose(true)
    })
  }

  render() {
    const { fullScreen, open, handleClose, label, computeLabel } = this.props
    const { translation } = this.state
    const computeEntities = label
      ? Immutable.fromJS([
          {
            id: label.uid,
            entity: computeLabel,
          },
        ])
      : null
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
              <PromiseWrapper computeEntities={computeEntities}>
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
                    value={translation}
                    onChange={this.handleChange('translation')}
                    margin="normal"
                  />
                  {/* OPTIONAL AUDIO FILES */}
                  <div>audio files</div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => handleClose()} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={() => this.handleSave()} color="primary" autoFocus>
                    Save
                  </Button>
                </DialogActions>
              </PromiseWrapper>
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
  fetchLabel,
  updateLabel,
}

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(LabelModal))
