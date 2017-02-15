import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import t from 'tcomb-form';

import fields from 'models/schemas/filter-fields';
import options from 'models/schemas/filter-options';

import { RaisedButton } from 'material-ui';

const defaultFilterFunc = function (propertyToSearch, filterValue) {

    if (!propertyToSearch)
        return true;

    if (Array.isArray(propertyToSearch)) {
        return !(propertyToSearch.indexOf(filterValue) === -1);
    } else {
        return !(propertyToSearch.search(new RegExp(filterValue, "i")) === -1);
    }

    return true;
}

export default function withFilter(ComposedFilter, DefaultFetcherParams) {
  class FilteredGridList extends Component {

    static propTypes = {
        fetcher: PropTypes.func,
        fixedList: PropTypes.bool,
        fixedListFetcher: PropTypes.func,
        fetcherParams: PropTypes.object,
        filterOptionsKey: PropTypes.string.isRequired,
        metadata: PropTypes.object
    }

    constructor(props, context){
        super(props, context);

        this.state = {
            options: options,
            formValue: null
        };

        ['_onReset', '_doFilter', '_onFilterSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    _doFilter(filters) {

        // Filter a fixed list (i.e. all items sent to component)
        if (this.props.fixedList) {
            let filteredList = new List(this.props.items).filter(function(item) {

                // Test each of the filters against item
                for (let filterKey in filters) {

                    let filterOptions = selectn([this.props.filterOptionsKey, 'fields', filterKey], options);
                    let filterFunc = (filterOptions && filterOptions.hasOwnProperty('filterFunc')) ? filterOptions.filterFunc : defaultFilterFunc;

                    let filterValue = filters[filterKey];
                    let propertyToSearch = selectn(filterKey, item);

                    return filterFunc(propertyToSearch, filterValue);
                }

            }.bind(this));

            this.props.fixedListFetcher(filteredList);
        }
        // Filter a remote list (i.e. partial list sent to component)
        else {
                let preparedFilters = {};

                // Test each of the filters against item
                for (let filterKey in filters) {

                    let filterOptions = selectn([this.props.filterOptionsKey, 'fields', filterKey], options);

                    // Add options to returned filter object

                    // Filter not prepared
                    if (!filters[filterKey].hasOwnProperty('appliedFilters')) {
                        preparedFilters[filterKey] = {
                            appliedFilters: filters[filterKey],
                            filterOptions: filterOptions
                        }
                    } else {
                        preparedFilters[filterKey] = filters[filterKey];
                    }

                }

            this.props.fetcher(Object.assign({}, this.props.fetcherParams, {
                currentPageIndex: 0,
                filters: preparedFilters
            }));
        }
    }

    _onReset(event) {
        this.setState({
            formValue: null
        });

        if (this.props.fixedList) {
            this.props.fixedListFetcher(this.props.items);
        }
        else {
            this._doFilter(DefaultFetcherParams.filters);
        }
    }

    _onFilterSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["filter_form"].getValue();

        let properties = {};

            for (let key in formValue) {
            if (formValue.hasOwnProperty(key) && key) {
                if (formValue[key] && formValue[key] != '') {
                    properties[key] = formValue[key];
                }
            }
            }

        if (formValue && Object.keys(properties).length != 0) {
            this.setState({
                formValue: properties
            });

            this._doFilter(properties);
        }
    }

    render() {

    let options = Object.assign({}, selectn(this.props.filterOptionsKey, this.state.options));

      return(
          <div>

            <div className="row">

                <div className="col-xs-3">

                    <div className={classNames('panel', 'panel-default')}>

                        <form onSubmit={this._onFilterSaveForm}>

                        <div className="panel-heading">
                            Filter List
                        </div>

                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <t.form.Form
                                        ref="filter_form"
                                        type={t.struct(selectn(this.props.filterOptionsKey, fields))}
                                        value={this.state.formValue}
                                        options={options} />      
                                 <RaisedButton
                                        onTouchTap={this._onReset}
                                        label="Reset"
                                        primary={true} /> &nbsp;
                                    <RaisedButton
                                        type="submit"
                                        label="Filter"
                                        primary={true} />           
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>

                </div>

                <div className="col-xs-9">
                    <ComposedFilter
                    {...this.state}
                    {...this.props}
                    />
                </div>

            </div>


          </div>)
      ;
    }
  }

  return FilteredGridList;
}