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

import ContributorDelete from 'views/components/Confirmation'

const { array, func, object } = PropTypes

export class Contributors extends Component {
  static propTypes = {
    selected: array,
    copy: object,
    confirmationAction: func.isRequired,
  }

  static defaultProps = {
    selected: [],
    confirmationAction: () => {},
  }

  state = {
    copy: {},
  }

  async componentDidMount() {
    const copy = this.props.copy
      ? this.props.copy
      : await import(/* webpackChunkName: "ContributorsSelectedInternationalization" */ './ContributorsSelectedInternationalization').then(
          (_module) => {
            return _module.default
          }
        )
    this.setState({
      copy,
    })
  }

  render() {
    return (
      <ContributorDelete
        confirmationAction={this.props.confirmationAction}
        className="Contributor__delete"
        compact
        copy={this.state.copy}
        disabled={this.props.selected.length === 0}
      />
    )
  }
}

export default Contributors
