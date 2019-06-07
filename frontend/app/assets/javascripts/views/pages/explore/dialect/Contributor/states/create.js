import React from 'react'
import { PropTypes } from 'react'
// import copy from '../internationalization'
import File from 'views/components/Form/Common/File'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
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
    deleteContributor: func,
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
    deleteContributor: () => {},
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
        <h1 className="Contributor__heading">{_copy.title}</h1>

        {/* Name ------------- */}
        <Text
          className={groupName}
          id={this._clean('dc:title')}
          name="dc:title"
          value={valueName}
          error={getError({ errors, fieldName: 'dc:title' })}
          labelText={_copy.name}
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
        <div className={`${className}__photo`} style={{ display: 'flex' }}>
          {valuePhotoData && (
            <div className={groupName}>
              <dl>
                <dt>{_copy.profilePhotoCurrent}</dt>
                <dd>{valuePhotoName}</dd>
                <dd>
                  <img src={valuePhotoData} alt={`Photo representing '${valueName}'`} />
                </dd>
              </dl>
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

          {/* BTN: Delete contributor ------------- */}
          {isEdit && (
            <div className={`delete ${this.state.deleting ? 'delete--confirmation' : ''}`}>
              <div className={'deleteInitiate'}>
                <button
                  className="_btn _btn--secondary deleteConfirmation__initiate"
                  ref={(_element) => {
                    this.btnDeleteInitiate = _element
                  }}
                  disabled={isBusy}
                  onClick={this._deleteContributorInitiate}
                  type="button"
                >
                  {_copy.btnDelete}
                </button>
              </div>
              <div className={'deleteConfirmation'}>
                <button
                  className="_btn _btn--secondary deleteConfirmation__deny"
                  ref={(_element) => {
                    this.btnDeleteDeny = _element
                  }}
                  disabled={isBusy}
                  onClick={this._deleteContributorDeny}
                  type="button"
                >
                  {_copy.btnDeleteDeny}
                </button>
                <button
                  className="_btn _btn--destructive deleteConfirmation__confirm"
                  disabled={isBusy}
                  onClick={this._deleteContributorConfirm}
                  type="button"
                >
                  {_copy.btnDeleteConfirm}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    )
  }
  _clean = (name) => {
    return StringHelpers.clean(name, 'CLEAN_ID')
  }
  _deleteContributorInitiate = () => {
    this.setState(
      {
        deleting: true,
      },
      () => {
        this.btnDeleteDeny.focus()
      }
    )
  }
  _deleteContributorConfirm = () => {
    this.setState(
      {
        deleting: false,
      },
      () => {
        this.props.deleteContributor()
      }
    )
  }
  _deleteContributorDeny = () => {
    this.setState(
      {
        deleting: false,
      },
      () => {
        this.btnDeleteInitiate.focus()
      }
    )
  }
}

export default ContributorStateCreate
