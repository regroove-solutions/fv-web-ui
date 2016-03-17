import React, {Component, PropTypes} from 'react';
import AlloyEditor from 'alloyeditor';

var AlloyEditorComponent = React.createClass({
    componentDidMount: function() {
        this._editor = AlloyEditor.editable(this.props.container, this.props.alloyEditorConfig);
        this._nativeEditor = this._editor.get('nativeEditor'); 

        var _this = this;

        this._nativeEditor.on('change', function () {
            _this.props.onContentChange(_this._nativeEditor.getData());
        });
    },

    componentWillUnmount: function() {
        this._editor.destroy();
    },

    render: function() {
        return (
            <div id={this.props.container} dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        );
    }
});

module.exports = AlloyEditorComponent;