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
import React, { Component, PropTypes } from 'react'
import provide from 'react-redux-provide'
import selectn from 'selectn'

import SelectField from 'material-ui/lib/SelectField'
import MenuItem from 'material-ui/lib/menus/menu-item'
import StringHelpers, { CLEAN_ID } from 'common/StringHelpers'
import IntlService from 'views/services/intl'
const intl = IntlService.instance

export class DirectoryList extends Component {
  static propTypes = {
    fetchDirectory: PropTypes.func.isRequired,
    computeDirectory: PropTypes.object.isRequired,
    directory: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    fancy: PropTypes.bool,
    value: PropTypes.string,
    dataTestId: PropTypes.string,
  }

  static defaultProps = {
    fancy: true,
  }

  constructor(props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)
    this._handleStandardSelectChange = this._handleStandardSelectChange.bind(this)
  }

  _handleChange(event, index, value) {
    this.props.onChange(value)
  }

  _handleStandardSelectChange(event) {
    this.props.onChange(event.target.value)
  }

  componentWillReceiveProps(nextProps) {
    // Ensure value is in sync -- relevant for setting default value dynamically
    if (nextProps.value !== undefined) {
      this.props.onChange(nextProps.value)
    }
  }

  componentDidMount() {
    this.props.fetchDirectory(this.props.directory)
  }

  render() {
    const { computeDirectory } = this.props

    const entries = selectn('directories.' + this.props.directory, computeDirectory) || []
    const dataTestId = StringHelpers.clean(this.props.dataTestId, CLEAN_ID)
    return (
      <div>
        {this.props.fancy ? (
          <SelectField
            data-testid={dataTestId}
            maxHeight={300}
            autoWidth
            value={this.props.value}
            onChange={this._handleChange}
            floatingLabelText={intl.trans('select_x', 'Select ' + this.props.label, 'first', [this.props.label]) + ':'}
          >
            {entries.map((entry) => (
              <MenuItem key={entry.value} value={entry.value} primaryText={entry.text} />
            ))}
          </SelectField>
        ) : (
          <select onChange={this._handleStandardSelectChange} data-testid={dataTestId}>
          {/* Note: Had a conflict and `value={this.props.value}` was the incoming change */}
          {/* <select value={this.props.value} onChange={this._handleStandardSelectChange} data-testid={dataTestId}> */}
            {entries.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.text}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }
}
export default provide(DirectoryList)
