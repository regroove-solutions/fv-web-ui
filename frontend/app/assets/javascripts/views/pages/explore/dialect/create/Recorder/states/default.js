import React from 'react'
import { PropTypes } from 'react'
import copy from '../internationalization'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import { getError, getErrorFeedback } from 'common/FormHelpers'
const { string, element, array, bool, func } = PropTypes
export class RecorderStatesDefault extends React.Component {
  static propTypes = {
    className: string,
    copyTitle: string,
    copySubmit: string,
    groupName: string,
    breadcrumb: element,
    errors: array,
    isBusy: bool,
    onRequestSaveForm: func,
    setFormRef: func,
    valueName: string,
    valueDescription: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
    groupName: 'Form__group',
    breadcrumb: null,
    errors: [],
    isBusy: false,
    onRequestSaveForm: () => {},
    setFormRef: () => {},
    valueName: '',
    valueDescription: '',
  }
  render() {
    const {
      className,
      copyTitle,
      copySubmit,
      valueName,
      valueDescription,
      breadcrumb,
      errors,
      isBusy,
      onRequestSaveForm,
      setFormRef,
    } = this.props
    return (
      <form
        className={className}
        ref={setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          onRequestSaveForm()
        }}
      >
        {breadcrumb}
        <h2>{copyTitle || copy.default.title}</h2>

        {/* Name ------------- */}
        <Text
          className={this.props.groupName}
          id={this._clean('dc:title')}
          name="dc:title"
          // value={formData['dc:title'] || ''}
          value={valueName}
          error={getError({ errors, fieldName: 'dc:title' })}
          labelText={copy.default.name}
        />

        {/* Description ------------- */}
        <Textarea
          className={this.props.groupName}
          id={this._clean('dc:description')}
          labelText={copy.default.description}
          name="dc:description"
          // value={formData['dc:description'] || ''}
          value={valueDescription}
          error={getError({ errors, fieldName: 'dc:description' })}
        />

        {/* {formStatus} */}
        {getErrorFeedback({ errors })}

        {/* BTN: Create contributor ------------- */}
        <button disabled={isBusy} type="submit">
          {copySubmit || copy.default.submit}
        </button>
      </form>
    )
  }
  _clean = (name) => {
    return StringHelpers.clean(name, 'CLEAN_ID')
  }
}

export default RecorderStatesDefault
