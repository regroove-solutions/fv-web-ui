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
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';
import t from 'tcomb-form';

import ProviderHelpers from 'common/ProviderHelpers';
import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

// Models
import {Document} from 'nuxeo';

// Views
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';

import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import BookEntryEdit from 'views/pages/explore/dialect/learn/songs-stories/entry/edit';
import BookEntryList from 'views/pages/explore/dialect/learn/songs-stories/entry/list-view';

import Dialog from 'material-ui/lib/dialog';

import fields from 'models/schemas/fields';
import options from 'models/schemas/options';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const DEFAULT_LANGUAGE = 'english';

const DEFAULT_SORT_ORDER = '&sortOrder=asc,asc&sortBy=fvbookentry:sort_map,dc:created';

@provide
export default class PageDialectBookEdit extends Component {

    static propTypes = {
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        fetchBook: PropTypes.func.isRequired,
        computeBook: PropTypes.object.isRequired,
        fetchBookEntries: PropTypes.func.isRequired,
        computeBookEntries: PropTypes.object.isRequired,
        updateBook: PropTypes.func.isRequired,
        updateBookEntry: PropTypes.func.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        book: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            book: null,
            editPageDialogOpen: false,
            editPageItem: null,
            bookPath: props.routeParams.dialect_path + '/Stories & Songs/' + props.routeParams.bookName,
            formValue: null,
            sortedItems: List()
        };

        // Bind methods to 'this'
        ['_onRequestSaveForm', '_editPage', '_pageSaved', '_storeSortOrder'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {
        newProps.fetchDialect2(newProps.routeParams.dialect_path);
        newProps.fetchBook(this.state.bookPath);
        newProps.fetchBookEntries(this.state.bookPath, DEFAULT_SORT_ORDER);
    }

    // Fetch data on initial render
    componentDidMount() {
        this.fetchData(this.props);
    }

    _onRequestSaveForm(e) {

        // Prevent default behaviour
        e.preventDefault();

        let formValue = this.refs["form_book"].getValue();

        // Passed validation
        if (formValue) {
            let book = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath);

            // TODO: Find better way to construct object then accessing internal function
            // Create new document rather than modifying the original document
            let newDocument = new Document(book.response, {
                'repository': book.response._repository,
                'nuxeo': book.response._nuxeo
            });

            // Set new value property on document
            newDocument.set(formValue);

            // Save new order for pages
            if (!this.state.sortedItems.isEmpty()) {
                this.state.sortedItems.forEach(function (entry, key) {

                    let newPage = new Document(entry, {
                        'repository': book.response._repository,
                        'nuxeo': book.response._nuxeo
                    });

                    // Set new value property on document
                    newPage.set({'fvbookentry:sort_map': key});

                    // Save document
                    this.props.updateBookEntry(newPage);

                }.bind(this));
            }

            // Save document
            this.props.updateBook(newDocument);
            this.props.fetchBookEntries(this.state.bookPath, DEFAULT_SORT_ORDER);

            this.setState({formValue: formValue});
        } else {
            window.scrollTo(0, 0);
        }
    }

    _storeSortOrder(items) {
        this.setState({
            sortedItems: items
        });
    }

    _editPage(item) {
        this.setState({editPageDialogOpen: true, editPageItem: item});
    }

    _pageSaved() {
        // Ensure update is complete before re-fetch.
        setTimeout(function () {
            this.props.fetchBookEntries(this.state.bookPath, DEFAULT_SORT_ORDER);
        }.bind(this), 500);
        this.setState({editPageDialogOpen: false, editPageItem: null});
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.state.bookPath,
            'entity': this.props.computeBook
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }, {
            'id': this.state.bookPath,
            'entity': this.props.computeBookEntries
        }])

        const computeBook = ProviderHelpers.getEntry(this.props.computeBook, this.state.bookPath);
        const computeBookEntries = ProviderHelpers.getEntry(this.props.computeBookEntries, this.state.bookPath);
        const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path);

        return <PromiseWrapper renderOnError={true} computeEntities={computeEntities}>

            <div className="row" style={{marginTop: '15px'}}>

                <div className={classNames('col-xs-8', 'col-md-10')}>
                    <Tabs>
                        <Tab label={intl.trans('book', 'Book', 'first')}>
                            <h1>{intl.trans('views.pages.explore.dialect.learn.songs_stories.edit_x_book',
                                'Edit ' + selectn("response.properties.dc:title", computeBook) + ' Book', 'words', [selectn("response.properties.dc:title", computeBook)])}</h1>
                            <form onSubmit={this._onRequestSaveForm}>
                                <t.form.Form
                                    ref="form_book"
                                    type={t.struct(selectn("FVBook", fields))}
                                    context={selectn("response", computeDialect2)}
                                    value={this.state.formValue || selectn("response.properties", computeBook)}
                                    options={selectn("FVBook", options)}/>
                                <div className="form-group">
                                    <button type="submit"
                                            className="btn btn-primary">{intl.trans('save', 'Save', 'first')}</button>
                                </div>
                            </form>
                        </Tab>
                        <Tab label={intl.trans('pages', 'Pages', 'first')}>
                            <h1>{intl.trans('', 'Edit ' + selectn("response.properties.dc:title", computeBook) + ' pages', 'first', [selectn("response.properties.dc:title", computeBook)])}</h1>
                            <BookEntryList
                                reorder={true}
                                sortOrderChanged={this._storeSortOrder}
                                defaultLanguage={DEFAULT_LANGUAGE}
                                editAction={this._editPage}
                                innerStyle={{minHeight: 'inherit'}}
                                metadata={selectn('response', computeBookEntries) || {}}
                                items={selectn('response.entries', computeBookEntries) || []}/>
                        </Tab>
                    </Tabs>
                </div>

                <div className={classNames('col-xs-4', 'col-md-2')}>

                    <Paper style={{padding: '15px', margin: '20px 0'}} zDepth={2}>

                        <div className="subheader">{intl.trans('metadata', 'Metadata', 'first')}</div>

                    </Paper>

                </div>

                <Dialog
                    autoScrollBodyContent={true}
                    style={{zIndex: 0}}
                    overlayStyle={{background: 'none'}}
                    open={this.state.editPageDialogOpen}
                    onRequestClose={() => this.setState({editPageDialogOpen: false})}>
                    <BookEntryEdit
                        entry={this.state.editPageItem}
                        handlePageSaved={this._pageSaved}
                        dialectEntry={computeDialect2}
                        {...this.props} />
                </Dialog>

            </div>
        </PromiseWrapper>;
    }
}