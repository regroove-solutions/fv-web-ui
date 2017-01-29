import React, { Component, PropTypes } from 'react';

import selectn from 'selectn';

import Paper from 'material-ui/lib/paper';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import Checkbox from 'material-ui/lib/checkbox';

export default class FacetFilterList extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        facets: PropTypes.array.isRequired,
        onFacetSelected: PropTypes.func.isRequired,
        facetField: PropTypes.string.isRequired
    };

    constructor(props, context){
        super(props, context);

        this.state = {
            checked: []
        };

        ['_toggleCheckbox'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    _toggleCheckbox(facetId, event, checked) {
        this.props.onFacetSelected(this.props.facetField, facetId, event, checked);
        
        // Checking
        if (checked) {
            this.state.checked.push(facetId);
        }
        // Unchecking
        else {
            this.state.checked.splice(this.state.checked.indexOf(facetId), 1);
        }
    }

    render () {

        const listItemStyle = {fontSize: '13px', fontWeight: 'normal'};

        return <Paper>
            <List subheader={this.props.titles}>

                {(this.props.facets || []).map(function (facet, i) { 

                    let nestedItems = [];
                    let children = selectn('contextParameters.children.entries', facet).sort(function(a, b){
                        if(a.title < b.title) return -1;
                        if(a.title > b.title) return 1;
                        return 0;
                    });

                    // Render children if exist 
                    if (children.length > 0) {
                        children.map(function (facetChild, i) {
                            nestedItems.push(<ListItem
                                key={facetChild.uid}
                                leftCheckbox={<Checkbox checked={this.state.checked.includes(facetChild.uid)} onCheck={this._toggleCheckbox.bind(this, facetChild.uid)} />}
                                style={listItemStyle}
                                primaryText={facetChild.title} />);
                        }.bind(this));
                    }

                    return <ListItem
                                style={listItemStyle}
                                key={facet.uid}
                                leftCheckbox={<Checkbox checked={this.state.checked.includes(facet.uid)}  onCheck={this._toggleCheckbox.bind(this, facet.uid)} />}
                                primaryText={facet.title}
                                primaryTogglesNestedList={true}
                                nestedItems={nestedItems} />
                }.bind(this))}

            </List>
        </Paper>
    }
}