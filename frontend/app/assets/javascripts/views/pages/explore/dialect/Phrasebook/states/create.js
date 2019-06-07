import React from 'react'
import { PropTypes } from 'react'
import Text from 'views/components/Form/Common/Text'
import Textarea from 'views/components/Form/Common/Textarea'
import StringHelpers from 'common/StringHelpers'
import { getError, getErrorFeedback } from 'common/FormHelpers'
const { string, element, array, bool, func, object } = PropTypes
export class PhrasebookStateCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    groupName: string,
    breadcrumb: element,
    errors: array,
    isBusy: bool,
    isEdit: bool,
    deleteSelf: func,
    onRequestSaveForm: func,
    setFormRef: func,
    valueName: string,
    valueDescription: string,
    valuePhotoName: string,
    valuePhotoData: string,
  }
  static defaultProps = {
    className: '',
    groupName: '',
    breadcrumb: null,
    errors: [],
    isBusy: false,
    isEdit: false,
    deleteSelf: () => {},
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
        className={`${className} Phrasebook Phrasebook--create`}
        ref={setFormRef}
        onSubmit={(e) => {
          e.preventDefault()
          onRequestSaveForm()
        }}
      >
        {breadcrumb}
        <h1 className="Phrasebook__heading">{_copy.title}</h1>

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

        {/* {formStatus} */}
        {getErrorFeedback({ errors })}
        <div className="Contributor__btn-container">
          {/* BTN: Create ------------- */}
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
                  onClick={this._deleteSelfInitiate}
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
                  onClick={this._deleteSelfDeny}
                  type="button"
                >
                  {_copy.btnDeleteDeny}
                </button>
                <button
                  className="_btn _btn--destructive deleteConfirmation__confirm"
                  disabled={isBusy}
                  onClick={this._deleteSelfConfirm}
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
  _deleteSelfInitiate = () => {
    this.setState(
      {
        deleting: true,
      },
      () => {
        this.btnDeleteDeny.focus()
      }
    )
  }
  _deleteSelfConfirm = () => {
    this.setState(
      {
        deleting: false,
      },
      () => {
        this.props.deleteSelf()
      }
    )
  }
  _deleteSelfDeny = () => {
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

export default PhrasebookStateCreate
