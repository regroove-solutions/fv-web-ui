import React, { Component, PropTypes } from 'react'
import Immutable, { Set } from 'immutable'

import selectn from 'selectn'

import Paper from 'material-ui/lib/paper'
import ListUI from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import Checkbox from 'material-ui/lib/checkbox'
import withToggle from 'views/hoc/view/with-toggle'
import IntlService from 'views/services/intl'

const FiltersWithToggle = withToggle()

export default class FacetFilterListCategory extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    facets: PropTypes.array.isRequired,
    onFacetSelected: PropTypes.func.isRequired,
    facetField: PropTypes.string.isRequired,
    appliedFilterIds: PropTypes.instanceOf(Set),
    styles: PropTypes.object,
  }

  intl = IntlService.instance

  constructor(props, context) {
    super(props, context)

    this.state = {
      checked: props.appliedFilterIds,
    }
    ;['_toggleCheckbox'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  _toggleCheckbox(facetId, childrenIDs = [], event, checked) {
    this.props.onFacetSelected(this.props.facetField, facetId, childrenIDs, event, checked)

    let newList

    // Checking
    if (checked) {
      newList = this.state.checked.add(facetId)

      // Add all children
      if (childrenIDs) {
        childrenIDs.forEach((childId) => {
          newList = newList.add(childId)
        })
      }
    } else {
      // Unchecking
      newList = this.state.checked.delete(this.state.checked.keyOf(facetId))

      // Remove children
      if (childrenIDs) {
        childrenIDs.forEach((childId, i) => {
          newList = newList.delete(newList.keyOf(childId))
        })
      }
    }

    this.setState({ checked: newList })
  }

  render() {
    const listItem0Style = {
      fontSize: '13px',
      fontWeight: 'normal',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: '10px',
      marginBottom: 0,
      display: 'flex',
      alignItems: 'center',
    }
    const listItem0CheckboxStyle = {
      position: 'relative',
      top: 0,
      left: 0,
    }
    const listItem1Style = {
      fontSize: '13px',
      fontWeight: 'normal',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      marginBottom: 0,
      display: 'flex',
      alignItems: 'center',
    }
    const listItem1CheckboxStyle = {
      position: 'relative',
      top: 0,
      left: 0,
    }

    return (
      <FiltersWithToggle
        className="panel-category"
        label={this.intl.searchAndReplace(this.props.title)}
        mobileOnly
        style={this.props.styles}
      >
        <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <ListUI>
            {(this.props.facets || []).map(
              (facet, i) => {
                const childrenIds = []
                const parentFacetChecked = this.state.checked.includes(facet.uid)

                const nestedItems = []
                const children = selectn('contextParameters.children.entries', facet).sort((a, b) => {
                  if (a.title < b.title) return -1
                  if (a.title > b.title) return 1
                  return 0
                })

                // Render children if exist
                if (children.length > 0) {
                  children.map(
                    (facetChild, i) => {
                      childrenIds.push(facetChild.uid)

                      // Mark as checked if parent checked or if it is checked directly.
                      const checked = this.state.checked.includes(facetChild.uid)

                      nestedItems.push(
                        <ListItem
                          key={facetChild.uid}
                          leftCheckbox={
                            <Checkbox
                              checked={checked}
                              onCheck={this._toggleCheckbox.bind(this, facetChild.uid, null)}
                              style={listItem1CheckboxStyle}
                            />
                          }
                          primaryText={this.intl.searchAndReplace(facetChild.title)}
                          style={listItem1Style}
                        />
                      )
                    }.bind(this)
                  )
                }

                return (
                  <ListItem
                    key={facet.uid}
                    autoGenerateNestedIndicator={false}
                    initiallyOpen
                    leftCheckbox={
                      <Checkbox
                        checked={parentFacetChecked}
                        onCheck={this._toggleCheckbox.bind(this, facet.uid, childrenIds)}
                        style={listItem0CheckboxStyle}
                      />
                    }
                    nestedItems={nestedItems}
                    open={parentFacetChecked}
                    primaryText={facet.title}
                    style={listItem0Style}
                  />
                )
              }
            )}
          </ListUI>
        </Paper>
      </FiltersWithToggle>
    )
  }
}
