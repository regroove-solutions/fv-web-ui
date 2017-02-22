import React, { Component, PropTypes } from 'react';
import selectn from 'selectn';

import Pagination from 'views/components/Navigation/Pagination';

import {IconButton, MenuItem, SelectField} from "material-ui";

/**
 * HOC: Adds pagination to a grid list
 */
export default function withPagination(ComposedFilter, pageSize, pageRange = 10) {
  class PaginatedGridList extends Component {

    static defaultProps = {
      disablePageSize: false
    }

    static propTypes = {
        fetcher: PropTypes.func.isRequired,
        fetcherParams: PropTypes.object.isRequired,
        metadata: PropTypes.object.isRequired,
        disablePageSize: PropTypes.bool
    }

    constructor(props, context){
      super(props, context);

      this.state = {
          pageRange: pageRange,
          currentPageSize: pageSize,
          currentPageIndex: 0
      };

      ['_onPageChange', '_onPageSizeChange'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    _onPageSizeChange(event, index, value) {

      let currentPageSize = value;

      this.props.fetcher(Object.assign({}, this.props.fetcherParams, {
        currentPageIndex: this.state.currentPageIndex,
        pageSize: currentPageSize
      }));

      this.setState({currentPageSize: currentPageSize});
    }

    _onPageChange(pagination) {

      let currentPageIndex = pagination.selected;

      this.props.fetcher(Object.assign({}, this.props.fetcherParams, {
        currentPageIndex: currentPageIndex,
        pageSize: this.state.currentPageSize
      }));

      this.setState( { currentPageIndex: currentPageIndex });
    }

    render() {

      const pageSizeControl = (!this.props.disablePageSize) ? <div>
                <label style={{verticalAlign: '4px', marginRight: '10px'}}>Per Page:</label>
                <SelectField style={{width: '45px', marginRight: '5px'}} value={this.state.currentPageSize} onChange={this._onPageSizeChange}>
                  <MenuItem value={5} primaryText="5" />
                  <MenuItem value={10} primaryText="10" />
                  <MenuItem value={20} primaryText="20" />
                  <MenuItem value={30} primaryText="30" />
                  <MenuItem value={40} primaryText="40" />
                  <MenuItem value={50} primaryText="50" />
                </SelectField>
                <span style={{verticalAlign: '4px'}}>/ {selectn('resultsCount', this.props.metadata)}</span>
              </div> : '';

      return(
          <div>

            <div className="row">
              <div className="col-xs-12">
                <ComposedFilter
                  {...this.state}
                  {...this.props} />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-9">
                <Pagination 
                  forcePage={this.props.fetcherParams.currentPageIndex}
                  pageCount={selectn('pageCount', this.props.metadata)}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={this.state.pageRange}
                  onPageChange={this._onPageChange} />
              </div>

              <div className="col-xs-3" style={{textAlign:'right'}}>
                {pageSizeControl}
                {this.props.appendControls}
              </div>


            </div>

          </div>)
      ;
    }
  }

  return PaginatedGridList;
}