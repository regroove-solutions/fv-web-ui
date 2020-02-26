import React, { useState, useEffect } from 'react'
import selectn from 'selectn'
import proptypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import DocumentOperations from 'operations/DocumentOperations'
import CircularProgress from '@material-ui/core/CircularProgress'
import '!style-loader!css-loader!./FVLabel.css'

function FVLabel({ transKey, defaultStr, transform, params, prepend, append, forceLocale, intl, locale, isInHelpMode, labelIds }) {
  const [anchorElement, setAnchorElement] = useState()
  const [audioId, setAudioId] = useState('')
  const [isFetchingAudio, setIsFetchingAudio] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  const handleClick = (event) => {
    if (isInHelpMode) {
      event.preventDefault()
      event.stopPropagation()
      if (anchorElement) {
        setAnchorElement(undefined)
      } else {
        const translationId = selectn(transKey, labelIds)
        setAnchorElement(event.currentTarget)
        if (translationId) {
          setIsFetchingAudio(true)
          DocumentOperations.getDocument(translationId, 'FVLabel').then(data => {
            if (isMounted) {
              setAudioId(selectn('properties.fv:related_audio[0]', data))
              setIsFetchingAudio(false)
            } else {
              console.log("Ahh I'm not mounted!")
            }
          })
        }
      }
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
          <Menu id="simple-menu" anchorEl={anchorElement} open={!!anchorElement} onClose={handleClose} getContentAnchorEl={null} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <ListItem>Translation: {intl.trans(transKey, defaultStr, transform, params, prepend, append, locale)}</ListItem>
            {!isFetchingAudio && audioId && <ListItem button onClick={playAudio}>Play Audio</ListItem>}
            {!isFetchingAudio && !audioId && <ListItem button disabled>No audio</ListItem>}
            {isFetchingAudio && <ListItem><CircularProgress size={21} style={{ margin: '0 auto' }} /></ListItem>}
            <ListItem button onClick={openEdit}>Edit</ListItem>
          </Menu>
        </span>
      )}
    </span>
  )
}

const { string, array, object, bool } = proptypes

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
  isInHelpMode: bool.isRequired,
  labelIds: object.isRequired,
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale } = state

  return {
    intl: locale.intlService,
    locale: locale.locale,
    isInHelpMode: locale.isInHelpMode,
    labelIds: locale.labelIds,
  }
}

export default connect(mapStateToProps)(FVLabel)
