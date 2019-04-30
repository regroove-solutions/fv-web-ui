import React from 'react'
import { PropTypes } from 'react'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'

// import ProviderHelpers from 'common/ProviderHelpers'
import Preview from 'views/components/Editor/Preview'

// see about dropping:
import provide from 'react-redux-provide'
import ProviderHelpers from 'common/ProviderHelpers'

const { array, func, number, string } = PropTypes

export class FormRelatedPhrase extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  STATE_BROWSE = 5

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: string,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    index: number,
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnSelectExistingItems: string,
    textLegendItem: string,
    handleClickCreateItem: func,
    handleClickSelectItem: func,
    handleClickRemoveItem: func,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
    handleItemSelected: func,
    componentState: number,
    value: string,
    // browseComponent: element.isRequired,
    // NOTE: COMING FROM REDUX/PROVIDER
    // computeCategory: object.isRequired,
    // createCategory: func.isRequired,
    splitWindowPath: array.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    // computeDialectFromParent: object.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedPhrase',
    groupName: 'FormRelatedPhrase__group',
    id: '_0',
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemSelected: () => {},
    // browseComponent: null,
  }

  state = {
    componentState: this.props.componentState,
    createItemName: '',
    createItemDescription: '',
    createItemFile: {},
    createItemIsShared: false,
    createItemIsChildFocused: false,
    createItemContributors: [],
    createItemRecorders: [],
    pathOrId: undefined,
  }

  CONTRIBUTOR_PATH = undefined
  DIALECT_PATH = undefined

  componentDidMount() {
    const { splitWindowPath } = this.props
    this.DIALECT_PATH = ProviderHelpers.getDialectPathFromURLArray(splitWindowPath)
  }

  render() {
    const {
      className,
      id,
      idDescribedByItemMove,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textLegendItem,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
    } = this.props

    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>

        <div>
          <div className="FormItemButtons">
            <FormMoveButtons
              id={id}
              idDescribedByItemMove={idDescribedByItemMove}
              textBtnMoveItemUp={textBtnMoveItemUp}
              textBtnMoveItemDown={textBtnMoveItemDown}
              handleClickMoveItemUp={handleClickMoveItemUp}
              handleClickMoveItemDown={handleClickMoveItemDown}
            />
            <FormRemoveButton
              id={id}
              textBtnRemoveItem={textBtnRemoveItem}
              handleClickRemoveItem={handleClickRemoveItem}
            />
          </div>
          <Preview id={this.props.id} type="FVPhrase" />
        </div>
      </fieldset>
    )
  }
}

export default provide(FormRelatedPhrase)
