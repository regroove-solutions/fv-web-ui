import React from 'react'
import { connect } from 'react-redux';
import { setLocale } from "providers/redux/reducers/locale"

function FVLabel({ setLocale, defaultStr, strCase, params, prepend, append, forceLocale, intl }) {
  return <div>{intl.trans("general.welcome", defaultStr, strCase, params, prepend, append, forceLocale)}</div>
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  return {
    intl: locale.intlService
  }
}

const mapDispatchToProps = {
  setLocale
}

export default connect(mapStateToProps, mapDispatchToProps)(FVLabel)