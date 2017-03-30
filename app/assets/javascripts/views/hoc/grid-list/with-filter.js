import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import t from 'tcomb-form';

import fields from 'models/schemas/filter-fields';
import options from 'models/schemas/filter-options';

import withToggle from 'views/hoc/view/with-toggle';

import ProviderHelpers from 'common/ProviderHelpers';

import { RaisedButton, FlatButton, FontIcon } from 'material-ui';

const FiltersWithToggle = withToggle();

/**
 * Return 'true' if value was found, 'false' otherwise.
 */
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

    static defaultProps = {
        filterOptionsKey: "Default"
    }

    static propTypes = {
        fetcher: PropTypes.func,
        fixedList: PropTypes.bool,
        fixedListFetcher: PropTypes.func,
        fetcherParams: PropTypes.object,
        filterOptionsKey: PropTypes.string.isRequired,
        applyDefaultFormValues: PropTypes.bool,
        metadata: PropTypes.object,
        area: PropTypes.string
    }

    constructor(props, context){
        super(props, context);

        this.state = {
            options: options,
            formValue: props.initialFormValue || props.formValues,
            defaultFormValue: props.formValues,
            initialFormValue: props.initialFormValue
        };

        ['_onReset', '_doFilter', '_onFilterSaveForm'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    componentDidMount() {
        // Only auto-apply with a fixed list
        if (this.props.fixedList && this.props.applyDefaultFormValues) {
            this._onFilterSaveForm(null);
        }
    }

    _doFilter(filters, props = this.props) {

        // Filter a fixed list (i.e. all items sent to component)
        if (this.props.fixedList) {
            let filteredList = new List(props.items).filter(function(item) {

                // Test each of the filters against item
                for (let filterKey in filters) {

                    let filterOptions = selectn([props.filterOptionsKey, 'fields', filterKey], options);
                    let filterFunc = (filterOptions && filterOptions.hasOwnProperty('filterFunc')) ? filterOptions.filterFunc : defaultFilterFunc;

                    let filterValue = filters[filterKey];
                    let propertyToSearch = selectn(filterKey, item);

                    if (!filterFunc(propertyToSearch, filterValue)) {
                        return false;
                    }
                }

                return true;

            }.bind(this));

            props.fixedListFetcher(filteredList);
        }
        // Filter a remote list (i.e. partial list sent to component)
        else {
                let preparedFilters = {};

                // Test each of the filters against item
                for (let filterKey in filters) {

                    let filterOptions = selectn([this.props.filterOptionsKey, 'fields', filterKey], options);

                    // Add options to returned filter object

                    // Filter not prepared
                    if (!filters[filterKey].hasOwnProperty('appliedFilter')) {
                        preparedFilters[filterKey] = {
                            appliedFilter: filters[filterKey],
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

    _onReset(event, props = this.props) {

        // Reset all controlled inputs
        let inputs = selectn('refs.input.refs', this.refs["filter_form"]);

        for (let inputKey in inputs) {
            if (typeof inputs[inputKey].reset === 'function') {
                inputs[inputKey].reset();
            }
        }

        this.setState({
            formValue: this.state.defaultFormValue || null
        });

        if (props.fixedList) {
            if (this.state.defaultFormValue) {
                this._doFilter(this.state.defaultFormValue, props);
            }
            else {
                props.fixedListFetcher(props.items);
            }
        }
        else {
            this._doFilter(DefaultFetcherParams.filters, props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.area != this.props.area) {
            this._onReset(null, nextProps);
        }

        // Items may change in a fixed list (e.g. deleted, added)
        if (this.props.fixedList && nextProps.items != this.props.items) {
            this._onReset(null, nextProps);
        }
    }

    _onFilterSaveForm(e) {

        // Prevent default behaviour
        if (e) {
            e.preventDefault();
        }

        let form = this.refs["filter_form"];
        let formValue = form.getValue();

        let properties = {};

            for (let key in formValue) {

                // Treat valued checkboxes differently. Always have value, so skip if unchecked.
                // getComponent does not work with input names that have '.' in them. Access directly.
                //let valuedCheckbox = selectn('form.refs.input.refs[\'' + key + '\'].refs.valued_checkbox', form);
                let valuedCheckbox = form.refs.input.refs[key].refs.valued_checkbox;
                if (valuedCheckbox) {
                    if (!valuedCheckbox.checked) {
                        continue;
                    }
                }

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
        } else {
            this._onReset(null);
        }
    }

    render() {

    let options = Map(selectn(this.props.filterOptionsKey, this.state.options));

    // Replace proxied properties where necessary
    if (this.props.area) {
        
        let fields = Map(options.get('fields')).map(function(field) {
            if (field.hasOwnProperty('nxql')) {
                field.nxql = ProviderHelpers.replaceAllWorkspaceSectionKeys(field.nxql, this.props.area);
            }

            return field;
        }.bind(this));

        options = options.set('fields', fields);
    }

      return(
          <div>

            <div className="row">

                <div className={classNames('col-xs-12', 'col-md-3')}>

                    <form onSubmit={this._onFilterSaveForm}>

                        <FiltersWithToggle label="Filter Items" mobileOnly={true}>
                            <t.form.Form
                                ref="filter_form"
                                type={t.struct(selectn(this.props.filterOptionsKey, fields))}
                                value={this.state.formValue}
                                options={options.toJS()} />      
                            <RaisedButton
                                onTouchTap={this._onReset}
                                label="Reset"
                                primary={true} /> &nbsp;
                            <RaisedButton
                                type="submit"
                                label="Filter"
                                primary={true} />
                        </FiltersWithToggle>

                    </form>

                </div>

                <div className={classNames('col-xs-12', 'col-md-9')}>
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