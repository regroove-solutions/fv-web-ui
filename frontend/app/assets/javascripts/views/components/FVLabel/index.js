import React from 'react'
import { connect } from 'react-redux';
import IntlService from '../../services/intl';
import { setLocale } from "providers/redux/reducers/locale"

function FVLabel({ locale, dialect_path, setLocale }) {

  console.log(IntlService.instance.trans("general.welcome"));

  if (locale === "immersive") {
    setLocale("test");
  }

  return <div>{IntlService.instance.trans("general.welcome")}</div>
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale, navigation } = state

  return {
    locale: locale.locale,
    dialect_path: navigation.route.routeParams.dialect_path
  }
}

const mapDispatchToProps = {
  setLocale
}

export default connect(mapStateToProps, mapDispatchToProps)(FVLabel)