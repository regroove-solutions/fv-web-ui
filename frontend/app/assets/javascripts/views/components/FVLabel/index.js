import React, { useState } from 'react'
import proptypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import '!style-loader!css-loader!./FVLabel.css'

function FVLabel({ transKey, defaultStr, transform, params, prepend, append, forceLocale, intl, locale }) {
  const isInHelpMode = true
  const [anchorElement, setAnchorElement] = useState()

  const handleClick = (event) => {
    if (isInHelpMode) {
      event.preventDefault()
      event.stopPropagation()
      if (anchorElement) {
        setAnchorElement(undefined)
      } else {
        setAnchorElement(event.currentTarget)
      }
      console.log(transKey)
    }
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  const playAudio = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const openEdit = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <span className="fv-label">
      {intl.trans(transKey, defaultStr, transform, params, prepend, append, forceLocale)}
      {isInHelpMode && (
        <span onClick={handleClick} className="fv-label-click-cover">
          <Menu id="simple-menu" anchorEl={anchorElement} open={!!anchorElement} onClose={handleClose}  anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
            <ListItem>Translation: {intl.trans(transKey, defaultStr, transform, params, prepend, append, locale)}</ListItem>
            <ListItem button onClick={playAudio}>Play Audio</ListItem>
            <ListItem button onClick={openEdit}>Edit</ListItem>
          </Menu>
        </span>
      )}
    </span>
  )
}

const { string, array, object } = proptypes

FVLabel.propTypes = {
  transKey: string.isRequired,
  defaultStr: string,
  transform: string,
  params: array,
  prepend: string,
  append: string,
  forceLocale: string,
  locale: string,
  intl: object.isRequired,
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  return {
    intl: locale.intlService,
    locale: locale.locale,
  }
}

export default connect(mapStateToProps)(FVLabel)
