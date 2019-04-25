import React, { Component, PropTypes } from 'react'
import provide from 'react-redux-provide'
import ArchiveCreator from '/Users/laliacann/fv-web-ui/frontend/app/assets/javascripts/views/components/SetupArchive/setup.js'

@provide
export default class PageCreateArchive extends Component { 
  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    fetchPortal: PropTypes.func.isRequired,
    computePortal: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context)
    //this.props.fetchPortal("/FV/sections/Data/Athabascan/Dene/Dene")
  }

  render() {
    return <ArchiveCreator />
  }
}
