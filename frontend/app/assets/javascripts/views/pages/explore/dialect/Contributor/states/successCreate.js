import React from 'react'
import { PropTypes } from 'react'

// REDUX
import { connect } from 'react-redux'

const { string, object, func } = PropTypes
export class ContributorStateSuccessCreate extends React.Component {
  static propTypes = {
    className: string,
    copy: object,
    formData: object,
    itemUid: string,
    handleClick: func,
  }
  static defaultProps = {
    className: 'FormRecorder',
    copy: {
      default: {},
    },
  }
  render() {
    const { className, copy, /*formData, */ handleClick, routeParams, itemUid } = this.props
    const { theme, dialect_path } = routeParams
    // const name = formData['dc:title']
    // const description = formData['dc:description']
    // const photo = formData['fvcontributor:profile_picture'] ? formData['fvcontributor:profile_picture'][0] : {}
    const contributorDetailUrl = `/${theme}${dialect_path}/contributor/${itemUid}`
    const contributorEditUrl = `/${theme}${dialect_path}/edit/contributor/${itemUid}`
    return (
      <div className={`${className} Contributor Contributor--successCreate`}>
        <h1>{copy.create.success.title}</h1>

        <p>{copy.create.success.thanks}</p>

        {/* CREATE ANOTHER ------------- */}
        <p>
          <a
            href={window.location.pathname}
            onClick={(e) => {
              e.preventDefault()
              handleClick()
            }}
          >
            {copy.create.success.createAnother}
          </a>
        </p>
        {/* REVIEW ------------- */}
        {/* <p>{copy.create.success.review}</p> */}

        {/* Name ------------- */}
        {/* <p>{name || copy.create.success.noName}</p> */}

        {/* Biography ------------- */}
        {/* <div dangerouslySetInnerHTML={{ __html: description }} /> */}

        {/* File --------------- */}
        {/* {photoData && (
          <div>
            <img src={photoData} alt={`Photo representing '${photoName}'`} />
            <p>{photoName}</p>
          </div>
        )} */}

        {/* DETAIL ------------- */}
        <p>
          <a href={contributorDetailUrl}>Profile</a>
        </p>

        {/* EDIT ------------- */}
        {/* <h2>Made a mistake? Need to change something?</h2> */}
        <p>
          <a href={contributorEditUrl}>Edit</a>
        </p>

        {/* <dl>
          <dt>{name || copy.create.success.noName}</dt>
          <dd>{description || ''}</dd>
        </dl> */}
      </div>
    )
  }
}

// export default ContributorStateSuccessCreate

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation } = state

  const { route } = navigation

  return {
    routeParams: route.routeParams,
  }
}

export default connect(
  mapStateToProps,
  null
)(ContributorStateSuccessCreate)
