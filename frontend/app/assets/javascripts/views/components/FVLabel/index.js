import React from 'react'
import { connect } from 'react-redux'

function FVLabel({transKey, defaultStr, transform, params, prepend, append, forceLocale, intl }) {
  return <>
    {intl.trans(transKey, defaultStr, transform, params, prepend, append, forceLocale)}
  </>
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  return {
    intl: locale.intlService,
  }
}


export default connect(mapStateToProps)(FVLabel)
