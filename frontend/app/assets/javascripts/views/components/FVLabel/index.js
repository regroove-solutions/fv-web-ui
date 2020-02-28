import React, { useState, useEffect } from 'react'
import selectn from 'selectn'
import proptypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import { setEditingLabel } from 'providers/redux/reducers/locale'

import DocumentOperations from 'operations/DocumentOperations'
import Typography from '@material-ui/core/Typography'
import Preview from 'views/components/Editor/Preview'
import ProviderHelpers from 'common/ProviderHelpers'
import '!style-loader!css-loader!./FVLabel.css'

function FVLabel({
  transKey,
  locale,
  defaultStr,
  transform,
  params,
  prepend,
  append,
  forceLocale,
  intl,
  isInHelpMode,
  labelIds,
  startEditingLabel,
  computeLogin,
}) {
  const [anchorElement, setAnchorElement] = useState()
  const [audioId, setAudioId] = useState('')
  const [isFetching, setisFetching] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const readableLocale = {
    en: 'English',
    fr: 'Français',
  }

  const [translation, usedFallback, actualTransKey] = intl.fvLabelTrans(
    transKey,
    defaultStr,
    transform,
    params,
    prepend,
    append,
    forceLocale
  )
  const isAdmin = ProviderHelpers.isRecorderWithApproval(computeLogin) || ProviderHelpers.isAdmin(computeLogin)

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
        const translationId = selectn(actualTransKey, labelIds)
        setAnchorElement(event.currentTarget)
        if (translationId) {
          setisFetching(true)
          DocumentOperations.getDocument(translationId, 'FVLabel').then((data) => {
            if (isMounted) {
              setAudioId(selectn('properties.fv:related_audio[0]', data))
              setisFetching(false)
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
    startEditingLabel(actualTransKey)
  }

  const audioContainerStyles = {
    minWidth: '200px',
    minHeight: '79px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }

  return (
    <span className="fv-label">
      {translation}
      {isInHelpMode && (!usedFallback || isAdmin) && (
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
              <div>
                <Typography variant="caption">{readableLocale[locale]}:</Typography>
                <Typography variant="body1">
                  {intl.trans(transKey, defaultStr, transform, params, prepend, append, locale)}
                </Typography>
              </div>
            </ListItem>
            {!isFetching && !audioId && <ListItem disabled>No Audio</ListItem>}
            {!isFetching && audioId && (
              <ListItem>
                <div style={audioContainerStyles}>
                  <Preview id={audioId} type="FVAudio" minimal styles={{ flex: 1 }} />
                </div>
              </ListItem>
            )}
            {isFetching && (
              <ListItem disabled>
                <div style={audioContainerStyles} />
              </ListItem>
            )}

            {isAdmin && (
              <ListItem button onClick={openEdit}>
                Edit Translation
              </ListItem>
            )}
          </Menu>
        </span>
      )}
    </span>
  )
}

const { string, array, object, bool, func } = proptypes

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
  computeLogin: object.isRequired,
  startEditingLabel: func.isRequired,
}

const mapStateToProps = (state /*, ownProps*/) => {
  const { locale, nuxeo } = state
  const { computeLogin } = nuxeo

  return {
    intl: locale.intlService,
    locale: locale.locale,
    isInHelpMode: locale.isInHelpMode,
    labelIds: locale.labelIds,
    computeLogin,
  }
}

const mapDispatchToProps = {
  startEditingLabel: setEditingLabel,
}

export default connect(mapStateToProps, mapDispatchToProps)(FVLabel)
