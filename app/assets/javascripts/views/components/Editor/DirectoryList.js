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
import React, {Component, PropTypes} from 'react';
import provide from 'react-redux-provide';

import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';

@provide
export default class DirectoryList extends Component {

  static propTypes = {
    fetchDirectory: PropTypes.func.isRequired,
    computeDirectory: PropTypes.object.isRequired,
    directory: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);

    this.state = {
      value: null,
      fetched: false
    };
  }

  _handleChange(event, index, value) {
    this.setState({value});
    this.props.onChange(value);
  }

  componentDidMount() {
    if (!this.state.fetched)
      this.props.fetchDirectory(this.props.directory);

    this.setState({fetched: true});
  }

  render() {

      let previewStyles = {
        padding: '10px'
      }

      const { computeDirectory } = this.props;

      let entries = computeDirectory.entries || [];

      return (
        <SelectField value={this.state.value} onChange={this._handleChange} floatingLabelText={'Select ' + this.props.label + ':'}>
          {entries.map((entry) => 
            <MenuItem key={entry.value} value={entry.value} primaryText={entry.text} />
          )}   
        </SelectField>
      );
    }
}
