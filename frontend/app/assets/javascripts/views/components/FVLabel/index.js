import React from 'react'
import { connect } from 'react-redux'
import { setLocale, setImmersionMode } from 'providers/redux/reducers/locale'

function FVLabel({ setImmersion, currentLocale, hasWorkspace, immersionMode, defaultStr, strCase, params, prepend, append, forceLocale, intl }) {
  const switchImmersion = () => {
    if (immersionMode === 'solo') {
      setImmersion('duo')
    } else if (immersionMode === 'duo') {
      setImmersion('')
    } else {
      setImmersion('solo')
    }
  }

  return <>
    <ol>
      <li>{intl.trans('general.welcome', defaultStr, strCase, params, prepend, append, forceLocale)}</li>
      {immersionMode === 'duo' && hasWorkspace && <li>{intl.trans('general.welcome', defaultStr, strCase, params, prepend, append, currentLocale)}</li>}
    </ol>

    <button onClick={switchImmersion}>{immersionMode ? immersionMode : 'None'}</button>
  </>
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  return {
    intl: locale.intlService,
    immersionMode: locale.immersionMode,
    currentLocale: locale.locale,
    hasWorkspace: !!locale.workspace,
  }
}

const mapDispatchToProps = {
  setLocale,
  setImmersion: setImmersionMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(FVLabel)
