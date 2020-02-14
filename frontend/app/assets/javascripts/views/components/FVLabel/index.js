import React from 'react'
import { connect } from 'react-redux'

function FVLabel({
  transKey,
  defaultStr,
  transform,
  params,
  prepend,
  append,
  forceLocale,
  intl,
  locale,
  showTwoLanguages,
}) {
  return (
    <>
      {intl.trans(transKey, defaultStr, transform, params, prepend, append, forceLocale)}
      {showTwoLanguages && <>{intl.trans(transKey, defaultStr, transform, params, prepend, append, locale)}</>}
    </>
  )
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  return {
    intl: locale.intlService,
    showTwoLanguages: locale.immersionMode === 2,
    locale: locale.locale,
  }
}

export default connect(mapStateToProps)(FVLabel)
