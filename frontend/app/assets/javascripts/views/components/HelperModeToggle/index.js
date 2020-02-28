import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import selectn from 'selectn'

import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import CloseIcon from '@material-ui/icons/Close'

import { toggleHelpMode, setEditingLabel } from 'providers/redux/reducers/locale'
import { fetchDirectoryEntries } from 'providers/redux/reducers/directory'
import DocumentOperations from 'operations/DocumentOperations'

import LabelModal from 'views/pages/explore/dialect/immersion/Modal'
import FVButton from './../FVButton/index'
import '!style-loader!css-loader!./HelperModeToggle.css'

const HelperModeToggle = ({
  handleToggleHelpMode,
  isInHelpMode,
  isImmersionModeOn,
  editingLabel,
  labelIds,
  computeDirectory,
  fetchDirectoryEntries,
  intl,
  locale,
  routeParams,
  setEditingLabel,
}) => {
  const [isNew, setIsNew] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [label, setLabel] = useState()
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if (!fetched) {
      fetchDirectoryEntries('fv_labels', ['type', 'template_strings', 'category'])
      fetchDirectoryEntries('fv_label_categories', ['parent'])
      setFetched(true)
    }
    if (editingLabel) {
      const uid = selectn(editingLabel, labelIds)
      setIsNew(!uid)
      const allLabels = selectn('directoryEntries.fv_labels', computeDirectory) || []
      const allCategories = selectn('directoryEntries.fv_label_categories', computeDirectory) || []

      const mappedLabel = allLabels.find((l) => {
        return l.id === editingLabel
      })
      const category = allCategories.find((c) => {
        return c.id === mappedLabel.category
      })
      const templateStrings = mappedLabel.template_strings.split(',')
      const label = {
        labelKey: editingLabel,
        type: mappedLabel.type,
        templateStrings,
        category: category.label,
        base: intl.trans(editingLabel, 'Translated Label', null, templateStrings, null, null, locale),
        translation: undefined,
        uid,
        relatedAudio: undefined,
      }
      if (uid) {
        DocumentOperations.getDocument(uid, 'FVLabel').then((data) => {
          label.relatedAudio = selectn('properties.fv:related_audio[0]', data)
          label.translation = selectn('properties.dc:title', data)
          setLabel(label)
          setIsOpen(true)
        })
      } else {
        setLabel(label)
        setIsOpen(true)
      }
    } else {
      setIsOpen(false)
    }
    return () => {
      setFetched(false)
    }
  }, [editingLabel])

  const closeModal = () => {
    setLabel(null)
    setIsOpen(false)
    setEditingLabel()
  }

  return (
    <div className="helper-mode-toggle">
      {isImmersionModeOn && (
        <>
          <FVButton variant="extendedFab" color="primary" onClick={handleToggleHelpMode}>
            {!isInHelpMode && (
              <>
                <LiveHelpIcon />
                Enable Helper Mode
              </>
            )}
            {isInHelpMode && (
              <>
                Close Helper Mode
                <CloseIcon />
              </>
            )}
          </FVButton>
          <LabelModal
            isNew={isNew}
            dialectPath={routeParams.dialect_path}
            open={isOpen}
            handleClose={(save) => closeModal(save)}
            label={label}
          />
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  const { locale, directory, navigation } = state
  const { isInHelpMode, editingLabel } = locale

  return {
    isInHelpMode,
    editingLabel,
    labelIds: locale.labelIds,
    intl: locale.intlService,
    locale: locale.locale,
    isImmersionModeOn: !!locale.immersionMode && !!locale.workspace,
    computeDirectory: directory.computeDirectory,
    routeParams: navigation.route.routeParams,
  }
}

const mapDispatchToProps = {
  handleToggleHelpMode: toggleHelpMode,
  fetchDirectoryEntries,
  setEditingLabel,
}

const { bool, func, string, object } = propTypes

HelperModeToggle.propTypes = {
  isInHelpMode: bool.isRequired,
  isImmersionModeOn: bool.isRequired,
  handleToggleHelpMode: func.isRequired,
  fetchDirectoryEntries: func.isRequired,
  setEditingLabel: func.isRequired,
  labelIds: object.isRequired,
  editingLabel: string,
  intl: object.isRequired,
  locale: string.isRequired,
  routeParams: object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(HelperModeToggle)
