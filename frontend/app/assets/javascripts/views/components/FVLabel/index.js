import React, { useState, useEffect } from 'react'
import selectn from 'selectn'
import proptypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import DocumentOperations from 'operations/DocumentOperations'
import Preview from 'views/components/Editor/Preview'
import '!style-loader!css-loader!./FVLabel.css'

function FVLabel({
  transKey,
  defaultStr,
  transform,
  params,
  prepend,
  append,
  forceLocale,
  intl,
  isInHelpMode,
  labelIds,
}) {
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
          DocumentOperations.getDocument(translationId, 'FVLabel').then((data) => {
            if (isMounted) {
              setAudioId(selectn('properties.fv:related_audio[0]', data))
              setIsFetchingAudio(false)
            }
          })
        }
      }
    }
  }

  const handleClose = () => {
    setAnchorElement(undefined)
  }

  const openEdit = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const audioContainerStyles = {
    minWidth: '200px',
    minHeight: '79px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }

  const [translation, usedFallback] = intl.fvLabelTrans(transKey, defaultStr, transform, params, prepend, append, forceLocale)

  return (
    <span className="fv-label">
      {translation}
      {isInHelpMode && !usedFallback && (
        <span onClick={handleClick} className="fv-label-click-cover">
          <Menu
            id="simple-menu"
            anchorEl={anchorElement}
            open={!!anchorElement}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <ListItem>
              Translation: {translation}
            </ListItem>
            {!isFetchingAudio && !audioId && <ListItem disabled>No Audio</ListItem>}
            {!isFetchingAudio && audioId && (
              <ListItem>
                <div style={audioContainerStyles}>
                  <Preview id={audioId} type="FVAudio" minimal styles={{ flex: 1 }} />
                </div>
              </ListItem>
            )}
            {isFetchingAudio && (
              <ListItem disabled>
                <div style={audioContainerStyles} />
              </ListItem>
            )}

            <ListItem button onClick={openEdit}>
              Edit
            </ListItem>
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
