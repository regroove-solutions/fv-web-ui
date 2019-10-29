import React from 'react'
import PropTypes from 'prop-types'

const { bool, string, element, object } = PropTypes
export class CategoryStateDetail extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    breadcrumb: element,
    isTrashed: bool,
    valueName: string,
    valueDescription: string,
  }
  static defaultProps = {
    className: '',
    breadcrumb: null,
    isTrashed: false,
    valueName: '',
    valueDescription: '',
    copy: {
      default: {},
    },
  }
  render() {
    const { className, copy, isTrashed, valueName, valueDescription, breadcrumb } = this.props
    const _copy = copy.detail
    const itemDeleted = isTrashed ? <div className="alert alert-danger">{_copy.isTrashed}</div> : null
    return (
      <div className={`${className} Category Category--detail`}>
        <div className="Category__content">
          <div className="Category__main">
            <div className="Category__mainInner">
              {itemDeleted}
              <header>
                {breadcrumb}
                <h1 className="Category__heading">{_copy.title}</h1>
              </header>
              {/* Name ------------- */}
              <h2 className="visually-hidden">{_copy.name}</h2>
              <p className="Category__name">{valueName}</p>

              {/* Description ------------- */}
              <h2 className="visually-hidden">{_copy.biography}</h2>
              <div className="Category__description" dangerouslySetInnerHTML={{ __html: valueDescription }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CategoryStateDetail
