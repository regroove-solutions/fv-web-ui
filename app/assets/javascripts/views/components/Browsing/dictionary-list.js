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
import Immutable, { List, Map } from 'immutable'
// import classNames from 'classnames'
import selectn from 'selectn'

import IntlService from 'views/services/intl'

export default class DictionaryList extends Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    filteredItems: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]),
    fields: PropTypes.instanceOf(Map),
    columns: PropTypes.array.isRequired,
    type: PropTypes.string,
    theme: PropTypes.string,
    action: PropTypes.func,
    cols: PropTypes.number,
    cellHeight: PropTypes.number,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    cols: 3,
    cellHeight: 210,
    wrapperStyle: null,
    style: null,
  }

  intl = IntlService.instance

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const items = this.props.filteredItems || this.props.items
    const columns = this.props.columns

    if (selectn('length', items) === 0) {
      return (
        <div style={{ margin: '20px 0' }}>
          {this.intl.translate({
            key: 'no_results_found',
            default: 'No Results Found',
            case: 'first',
            append: '.',
          })}
        </div>
      )
    }

    return (
      <table className="data-table">
        <tbody>
          <tr>
            {(columns || []).map((column, i) => (
              <th key={i} align="left">
                {selectn('title', column)}
              </th>
            ))}
          </tr>

          {(items || []).map((item, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px dotted #a8a8a8',
                margin: '10px',
                background: i % 2 ? '#f2f7ff' : '#ffffff',
              }}
            >
              {(columns || []).map((column, j) => {
                const cellValue = selectn(column.name, item)
                const cellRender =
                  typeof column.render === 'function' ? column.render(cellValue, item, column) : cellValue
                return (
                  <td key={j} align="left">
                    {cellRender}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
