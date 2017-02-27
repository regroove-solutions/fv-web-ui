import React, { Component, PropTypes } from 'react';
import Immutable, { List, Map } from 'immutable';

import selectn from 'selectn';

import Paper from 'material-ui/lib/paper';
import ListUI from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionGrade from 'material-ui/lib/svg-icons/action/grade';
import Checkbox from 'material-ui/lib/checkbox';

export default class FacetFilterList extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        facets: PropTypes.array.isRequired,
        onFacetSelected: PropTypes.func.isRequired,
        facetField: PropTypes.string.isRequired,
        appliedFilterIds: PropTypes.instanceOf(List)
    };

    constructor(props, context){
        super(props, context);

        this.state = {
            checked: props.appliedFilterIds
        };

        ['_toggleCheckbox'].forEach( (method => this[method] = this[method].bind(this)) );
    }

    _toggleCheckbox(facetId, childrenIDs = [], event, checked) {
        this.props.onFacetSelected(this.props.facetField, facetId, childrenIDs, event, checked);
        
        let newList;

        // Checking
        if (checked) {
            newList = this.state.checked.push(facetId);
        }
        // Unchecking
        else {
            newList = this.state.checked.delete(this.state.checked.keyOf(facetId));
        }

        this.setState({checked: newList});
    }

    render () {

        const listItemStyle = {fontSize: '13px', fontWeight: 'normal'};

        return <Paper style={{maxHeight: '70vh', overflow: 'auto'}}>
            <ListUI subheader={this.props.titles}>

                {(this.props.facets || []).map(function (facet, i) { 

                    let childrenIds = [];
                    let parentFacetChecked = this.state.checked.includes(facet.uid)

                    let nestedItems = [];
                    let children = selectn('contextParameters.children.entries', facet).sort(function(a, b){
                        if(a.title < b.title) return -1;
                        if(a.title > b.title) return 1;
                        return 0;
                    });

                    // Render children if exist 
                    if (children.length > 0) {
                        children.map(function (facetChild, i) {

                            childrenIds.push(facetChild.uid);

                            // Mark as checked if parent checked or if it is checked directly.
                            let checked = parentFacetChecked || this.state.checked.includes(facetChild.uid);

                            nestedItems.push(<ListItem
                                key={facetChild.uid}
                                leftCheckbox={<Checkbox checked={checked} onCheck={this._toggleCheckbox.bind(this, facetChild.uid, null)} />}
                                style={listItemStyle}
                                primaryText={facetChild.title} />);
                        }.bind(this));
                    }

                    return <ListItem
                                style={listItemStyle}
                                key={facet.uid}
                                leftCheckbox={<Checkbox checked={parentFacetChecked}
                                onCheck={this._toggleCheckbox.bind(this, facet.uid, childrenIds)} />}
                                primaryText={facet.title}
                                open={parentFacetChecked}
                                initiallyOpen={true}
                                autoGenerateNestedIndicator={false}
                                nestedItems={nestedItems} />
                }.bind(this))}

            </ListUI>
        </Paper>
    }
}