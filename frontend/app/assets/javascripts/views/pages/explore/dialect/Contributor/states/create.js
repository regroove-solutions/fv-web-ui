import React from 'react'
import { PropTypes } from 'react'
// import copy from '../internationalization'
import File from 'views/components/Form/Common/File'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import ContributorDelete from 'views/components/Confirmation'
import { getError, getErrorFeedback } from 'common/FormHelpers'
const { string, element, array, bool, func, object } = PropTypes
export class ContributorStateCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    groupName: string,
    breadcrumb: element,
    errors: array,
    isBusy: bool,
    isEdit: bool,
    deleteItem: func,
    onRequestSaveForm: func,
    setFormRef: func,
    valueName: string,
    valueDescription: string,
    valuePhotoName: string,
    valuePhotoData: string,
  }
  static defaultProps = {
    className: 'FormRecorder',
    groupName: 'Form__group',
    breadcrumb: null,
    errors: [],
    isBusy: false,
    isEdit: false,
    deleteItem: () => {},
    onRequestSaveForm: () => {},
    setFormRef: () => {},
    valueName: '',
    valueDescription: '',
    valuePhotoName: '',
    valuePhotoData: '',
    copy: {
      default: {},
    },
  }
  state = {
    deleting: false,
  }
  // NOTE: Using callback refs since on old React
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
  btnDeleteInitiate = null
  btnDeleteDeny = null

  render() {
    const {
      className,
      copy,
      groupName,
      valueName,
      valueDescription,
      valuePhotoName,
      valuePhotoData,
      breadcrumb,
      errors,
      isBusy,
      isEdit,
      onRequestSaveForm,
      setFormRef,
    } = this.props
    const _copy = isEdit ? copy.edit : copy.create

    return (
      <form
        className={`${className} Contributor Contributor--create`}
        ref={setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          onRequestSaveForm()
        }}
        encType="multipart/form-data"
      >
        {breadcrumb}

        <div className="Contributor__btnHeader">
          <button
            className="_btn _btn--secondary Contributor__btnBack"
            type="button"
            onClick={() => {
              window.history.back()
            }}
          >
            {_copy.btnBack}
          </button>
          {/* BTN: Delete contributor ------------- */}
          {isEdit ? (
            <ContributorDelete
              confirmationAction={this.props.deleteItem}
              className="Contributor__delete"
              reverse
              copy={{
                isConfirmOrDenyTitle: _copy.isConfirmOrDenyTitle,
                btnInitiate: _copy.btnInitiate,
                btnDeny: _copy.btnDeny,
                btnConfirm: _copy.btnConfirm,
              }}
            />
          ) : null}
        </div>

        <h1 className="Contributor__heading">{_copy.title}</h1>
        <p>All fields with an asterisk are required.</p>
        {/* Name ------------- */}
        <Text
          className={groupName}
          id={this._clean('dc:title')}
          name="dc:title"
          value={valueName}
          error={getError({ errors, fieldName: 'dc:title' })}
          labelText={_copy.name}
          isRequired
        />

        {/* Description ------------- */}
        <Textarea
          className={groupName}
          id={this._clean('dc:description')}
          labelText={_copy.description}
          name="dc:description"
          value={valueDescription}
          error={getError({ errors, fieldName: 'dc:description' })}
          wysiwyg
        />

        {/* File --------------- */}
        <div className={`${groupName} Contributor__photoGroup`}>
          {valuePhotoData && (
            <div className={groupName}>
              <h2>{_copy.profilePhotoCurrent}</h2>
              <p>{valuePhotoName}</p>
              <img className="Contributor__photo" src={valuePhotoData} alt={`Photo representing '${valueName}'`} />
            </div>
          )}
          <File
            className={groupName}
            id={this._clean('fvcontributor:profile_picture')}
            labelText={valuePhotoData ? _copy.profilePhotoExists : _copy.profilePhoto}
            name="fvcontributor:profile_picture"
            value=""
            handleChange={(data) => {
              this.setState({ createItemFile: data })
            }}
          />
        </div>

        {/* {formStatus} */}
        {getErrorFeedback({ errors })}

        <div className="Contributor__btn-container">
          {/* BTN: Create contributor ------------- */}
          <button className="_btn _btn--primary" disabled={isBusy} type="submit">
            {_copy.submit}
          </button>
        </div>
      </form>
    )
  }
  _clean = (name) => {
    return StringHelpers.clean(name, 'CLEAN_ID')
  }
}

export default ContributorStateCreate
