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
import selectn from 'selectn';
import t from 'tcomb-form';
import classNames from 'classnames';

import QueryString from 'query-string';

import { Dialog, FlatButton, RaisedButton } from 'material-ui';

import MediaList from 'views/components/Browsing/media-list';
import withPagination from 'views/hoc/grid-list/with-pagination';
import withFilter from 'views/hoc/grid-list/with-filter';

const gridListStyle = {width: '100%', height: '100vh', overflowY: 'auto', marginBottom: 10};

const DefaultFetcherParams = { currentPageIndex: 0, pageSize: 10, filters: {'properties.dc:title': {appliedFilter: ''}, 'dialect': {appliedFilter: ''} } };

const FilteredPaginatedMediaList = withFilter(withPagination(MediaList, DefaultFetcherParams.pageSize), DefaultFetcherParams);

@provide
export default class SelectMediaComponent extends React.Component {

  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    fetchSharedPictures: PropTypes.func.isRequired,
    computeSharedPictures: PropTypes.object.isRequired,
    fetchSharedAudios: PropTypes.func.isRequired,
    computeSharedAudios: PropTypes.object.isRequired,
    fetchSharedVideos: PropTypes.func.isRequired,
    computeSharedVideos: PropTypes.object.isRequired,
    dialect: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  getDefaultValues() {
    label: "Upload Media"
  }

  _handleOpen() {
    this.setState({open: true});
  }

  _handleClose() {
    this.setState({open: false});
  }

  _handleSelectElement(value) {
    this.props.onComplete(value);
  }

  constructor(props) {
    super(props);

    // Bind methods to 'this'
    ['_handleOpen', '_handleClose', '_handleSelectElement', 'fetchData'].forEach( (method => this[method] = this[method].bind(this)) );

    this.state = {
      open: false,
      fetcherParams: DefaultFetcherParams
    };
  }

  fetchData(fetcherParams) {

    let preparedParams = {
      currentPageIndex: fetcherParams.currentPageIndex,
      pageSize: fetcherParams.pageSize,
      queryParams: [fetcherParams.filters['properties.dc:title'].appliedFilter, this.props.dialect.uid]
    };

    switch(this.props.type) {
      case 'FVPicture':
        this.props.fetchSharedPictures('all_shared_pictures', QueryString.stringify(preparedParams), {});
      break;

      case 'FVAudio':
        this.props.fetchSharedAudios('all_shared_audio', QueryString.stringify(preparedParams), {});
      break;

      case 'FVVideo':
        this.props.fetchSharedVideos('all_shared_videos', QueryString.stringify(preparedParams), {});
      break;
    }

    this.setState({
      fetcherParams: fetcherParams
    });
  }

  componentDidMount() {
    this.fetchData(this.state.fetcherParams);
  }

  render() {

      const actions = [
        <FlatButton
          label="Cancel"
          secondary={true}
          onTouchTap={this._handleClose} />
      ];

      var results, computeEntity, filterOptionsKey;

      switch (this.props.type) {
        case 'FVAudio':
          filterOptionsKey = 'SharedAudio';
          computeEntity = this.props.computeSharedAudios;
        break;

        case 'FVPicture':
          filterOptionsKey = 'SharedPictures';
          computeEntity = this.props.computeSharedPictures;
        break;

        case 'FVVideo':
          filterOptionsKey = 'SharedVideos';
          computeEntity = this.props.computeSharedVideos;
        break;
      }

      results = computeEntity.response.entries || [];

      let fileTypeLabel = 'File';
      let fileTypeCellHeight = 210;
      let fileTypeTilePosition = 'bottom';

      switch (this.props.type) {
        case 'FVAudio':
          fileTypeLabel = 'audio files';
          fileTypeCellHeight = 100;
          fileTypeTilePosition = 'top';
        break;

        case 'FVPicture':
          fileTypeLabel = 'pictures';
        break;

        case 'FVVideo':
          fileTypeLabel = 'videos';
          fileTypeTilePosition = 'top';
        break;
      }

      return (
        <div style={{display: 'inline'}}>
          <RaisedButton label={this.props.label} onTouchTap={this._handleOpen} />
          <Dialog
            title={"Select existing " + fileTypeLabel + " from the " + this.props.dialect.get('dc:title') + " dialect:"}
            actions={actions}
            modal={true}
            contentStyle={{width: '80%', height: '80vh', maxWidth: '100%'}}
            open={this.state.open}>

              <FilteredPaginatedMediaList
                style={{overflowY: 'auto', maxHeight: '50vh'}}
                cols={5}
                cellHeight={150}
                filterOptionsKey={filterOptionsKey}
                action={this._handleSelectElement}
                fetcher={this.fetchData}
                fetcherParams={this.state.fetcherParams}
                metadata={selectn('response', computeEntity)}
                items={selectn('response.entries', computeEntity) || []} />

          </Dialog>
        </div>
      );
    }
}
