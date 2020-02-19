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

import IntlService from 'views/services/intl'

const intl = IntlService.instance

/**
 * List view for words in immersion
 */
const { bool, func, object } = PropTypes

class TranslationInput extends Component {
  static propTypes = { label: object }
  static defaultProps = {}

  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  handleChange = (name) => (event) => {}

  renderTranslation = (label) => {
    var count = 0
    var inputCount = 0
    const words = label.translation.split(/(%s)/g)
    const translation = words.map((word, i) => {
      const output = []
      if (word === '%s') {
        if (i === 0) {
          output.push(<Input key={inputCount.toString()} id={inputCount.toString()} value={''} />)
          inputCount++
        }
        output.push(<Chip key={count.toString()} label={label.templateStrings[count]} />)
        if (i === words.length - 1) {
          output.push(<Input key={inputCount.toString()} id={inputCount.toString()} value={''} />)
          inputCount++
        }
        count++
      } else {
        output.push(<Input key={inputCount.toString()} id={inputCount.toString()} value={word} />)
        inputCount++
      }
      return output
    })
    return translation
  }

  render() {
    const { label } = this.props
    const {} = this.state

    return <div>{label && this.renderTranslation(label)}</div>
  }
}

export default TranslationInput
