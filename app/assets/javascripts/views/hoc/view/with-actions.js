import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';
import classNames from 'classnames';
import selectn from 'selectn';

import t from 'tcomb-form';

import fields from 'models/schemas/filter-fields';
import options from 'models/schemas/filter-options';

import ProviderHelpers from 'common/ProviderHelpers';
import StringHelpers from 'common/StringHelpers';

import { RaisedButton } from 'material-ui';

import PageToolbar from 'views/pages/explore/dialect/page-toolbar';

import FlatButton from 'material-ui/lib/flat-button';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter';

import Dialog from 'material-ui/lib/dialog';

export default function withActions(ComposedFilter, publishWarningEnabled = false) {
  class ViewWithActions extends Component {

    constructor(props, context){
        super(props, context);

        this.state = {
            deleteSuccessDialogOpen: false,
            deleteDialogOpen: false,
            prePublishDialogOpen: false,
            prePublishCompleteAction: null,
            publishToggleCancelled: false
        };

        ['_publishToggleAction', '_enableToggleAction', '_publishChangesAction', '_delete'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    // Toggle (enabled/disabled)
    _enableToggleAction(toggled, workflow) {
        if (toggled) {
            if (workflow) {
                this.props.askToEnableAction(this.props.itemPath, {id: "FVEnableLanguageAsset", start: "true"}, null, "Request to enable " + this.props.labels.single + " successfully submitted!", null);
            }
            else {
                this.props.enableAction(this.props.itemPath, null, null, StringHelpers.toTitleCase(this.props.labels.single) + " enabled!");
            }
        } else {
            if (workflow) {
                this.props.askToDisableAction(this.props.itemPath, {id: "FVDisableLanguageAsset", start: "true"}, null, "Request to disable " + this.props.labels.single + " successfully submitted!", null);
            }
            else {
                this.props.disableAction(this.props.itemPath, null, null, StringHelpers.toTitleCase(this.props.labels.single) + " disabled!");
            }
        }
    }

     // Publish changes
     _publishChangesAction() {

        const publishChangesAction = function () {
            this.props.publishAction(this.props.itemPath, null, null, StringHelpers.toTitleCase(this.props.labels.single) + " published successfully!");
            this.setState({prePublishCompleteAction:null, prePublishDialogOpen: false});
        }.bind(this);

        if (publishWarningEnabled) {
            this.setState({
                prePublishDialogOpen: true,
                prePublishCompleteAction: publishChangesAction
            });
        } else {
            publishChangesAction();
        }
    } 

    // Toggle published
    _publishToggleAction(toggled, workflow) {
        if (toggled) {
            if (workflow) {

                const askToPublishToggleAction = function () {
                        this.props.askToPublishAction(this.props.itemPath, {id: "FVPublishLanguageAsset", start: "true"}, null, "Request to publish " + this.props.labels.single + " successfully submitted!", null);
                        this.setState({prePublishCompleteAction:null, prePublishDialogOpen: false});
                }.bind(this);

                if (publishWarningEnabled) {
                    this.setState({
                        prePublishDialogOpen: true,
                        prePublishCompleteAction: askToPublishToggleAction
                    });
                } else {
                    askToPublishToggleAction();
                }

            }
            else {

                const publishToggleAction = function () {
                        this.props.publishAction(this.props.itemPath, null, null, StringHelpers.toTitleCase(this.props.labels.single) + " published successfully!");
                        this.setState({prePublishCompleteAction:null, prePublishDialogOpen: false});
                }.bind(this);

                if (publishWarningEnabled) {
                    this.setState({
                        prePublishDialogOpen: true,
                        prePublishCompleteAction: publishToggleAction
                    });
                } else {
                    publishToggleAction();
                }
            }
        } else {
            if (workflow) {
                this.props.askToUnpublishAction(this.props.itemPath, {id: "FVUnpublishLanguageAsset", start: "true"}, null, "Request to unpublish " + this.props.labels.single + " successfully submitted!", null);
            }
            else {
                this.props.unpublishAction(this.props.itemPath, null, null, StringHelpers.toTitleCase(this.props.labels.single) + " unpublished successfully!");
            }
        }
    }

    _delete(item, event) {
        this.props.deleteAction(item.uid);
        this.setState({deleteDialogOpen: false, deleteSuccessDialogOpen: true});
    }

    render() {

        if (!this.props.routeParams || this.props.routeParams.area != 'Workspaces') {
            return (<ComposedFilter {...this.props} {...this.state} />);
        }

        return(
            <div className="row">
                <div className="col-xs-12">

                        {(() => {
                            if (selectn('response', this.props.computeItem)) {
                                return <PageToolbar
                                        label={StringHelpers.toTitleCase(this.props.labels.single)}
                                        handleNavigateRequest={this.props.onNavigateRequest}
                                        computeEntity={this.props.computeItem}
                                        computePermissionEntity={this.props.permissionEntry}
                                        computeLogin={this.props.computeLogin}
                                        publishToggleAction={this._publishToggleAction}
                                        publishChangesAction={this._publishChangesAction}
                                        enableToggleAction={this._enableToggleAction}
                                        {...this.props}>&nbsp;</PageToolbar>;
                            }
                        })()}

                    </div>

                    <div className="col-xs-12">
                        <ComposedFilter {...this.props} {...this.state} />
                    </div>

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', this.props.computeItem)}}>
                        <Dialog
                            contentStyle={{height: '20vh'}}
                            autoScrollBodyContent={true}	
                            title={"Publish " + StringHelpers.toTitleCase(this.props.labels.single)}
                            actions={[
                            <FlatButton
                                label="Cancel"
                                secondary={true}
                                onTouchTap={() => this.setState({prePublishDialogOpen: false, publishToggleCancelled: true, prePublishCompleteAction: null})} />,
                            <FlatButton
                                label="Publish"
                                primary={true}
                                keyboardFocused={true}
                                onTouchTap={this.state.prePublishCompleteAction} />]}
                            modal={false}
                            open={this.state.prePublishDialogOpen}
                            onRequestClose={() => this.setState({prePublishDialogOpen: false, publishToggleCancelled: true, prePublishCompleteAction: null})}>

                            {(() => {
                                if (this.props.tabs && this.props.tabs.length > 0) {
                                    return  <div>
                                                <p>Publishing this {this.props.labels.single} will also publish (or republish) the following related items:</p>
                                                <Tabs>{this.props.tabs}</Tabs>
                                            </div>;
                                } else {
                                    return  <div>
                                                <p>Publishing this {this.props.labels.single} will also publish (or republish) all the media and child items associated with it.</p>
                                            </div>;
                                }
                            })()}

                        </Dialog>
                    </AuthorizationFilter>

                    <AuthorizationFilter filter={{permission: 'Write', entity: selectn('response', this.props.computeItem)}}>
                        <div>
                        <Toolbar className="toolbar">
                            <ToolbarGroup key={0} float="right">
                            <RaisedButton onTouchTap={() => this.setState({deleteDialogOpen: true})} secondary={true} label={"Delete " + StringHelpers.toTitleCase(this.props.labels.single)} />
                            </ToolbarGroup>
                        </Toolbar>

                        <Dialog
                            title={"Deleting " + StringHelpers.toTitleCase(this.props.labels.single)}
                            actions={[
                            <FlatButton
                            label="Cancel"
                            secondary={true}
                            onTouchTap={() => this.setState({deleteDialogOpen: false})} />,
                            <FlatButton
                            label="Delete"
                            primary={true}
                            keyboardFocused={true}
                            onTouchTap={this._delete.bind(this, selectn('response', this.props.computeItem))} />]}
                            modal={false}
                            open={this.state.deleteDialogOpen}
                            onRequestClose={this._handleCancelDelete}>
                            Are you sure you would like to delete the {this.props.labels.single} <strong>{selectn('response.title', this.props.computeItem)}</strong>?
                        </Dialog>

                        <Dialog
                            title={"Delete " + StringHelpers.toTitleCase(this.props.labels.single) + " Success"}
                            actions={[
                            <FlatButton
                            label="Return to Previous Page"
                            secondary={true}
                            onTouchTap={() => window.history.back()} />,
                            <FlatButton
                            label={"Go to Dialect Language Home"}
                            primary={true}
                            keyboardFocused={true}
                            onTouchTap={this.props.onNavigateRequest.bind(this, '/' + this.props.splitWindowPath.slice(0, this.props.splitWindowPath.length - 2).join('/'))} />]}
                            modal={true}
                            open={this.state.deleteSuccessDialogOpen}>
                            The {this.props.labels.single} <strong>{selectn('response.title', this.props.computeItem)}</strong> has been successfully deleted.
                        </Dialog>

                        </div>
                    </AuthorizationFilter>

            </div>);
        }
  }

  return ViewWithActions;
}