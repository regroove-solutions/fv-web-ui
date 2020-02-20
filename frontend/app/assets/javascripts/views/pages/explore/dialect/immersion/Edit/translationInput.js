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

import { Input, Chip } from '@material-ui/core'

/**
 * List view for words in immersion
 */
const { bool, func, array } = PropTypes

class TranslationInput extends Component {
  static propTypes = { templateStrings: array, translation: array, onChange: func }
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  handleChange = (name) => (event) => {}

  renderTranslation = () => {
    const { translation, templateStrings, onChange } = this.props
    var count = 0
    const words = translation.map((word, i) => {
      const output = []
      if (word === '%s') {
        output.push(<Chip key={i.toString()} label={templateStrings[count]} />)
        count++
      } else {
        output.push(
          <Input key={i.toString()} id={i.toString()} value={word} onChange={(event) => onChange(event, i)} />
        )
      }
      return output
    })
    return words
  }

  render() {
    return <div>{this.renderTranslation()}</div>
  }
}

export default TranslationInput
