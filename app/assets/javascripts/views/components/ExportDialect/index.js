import React, { Component, PropTypes } from 'react'
const { any, bool, func, string } = PropTypes
// import classNames from 'classnames'
import Request from 'request'
import provide from 'react-redux-provide'

// import { CSV_URL_DOWNLOAD } from './constants'

@provide
export default class ExportDialect extends Component {
  static propTypes = {
    ExportDialectReducer: any.isRequired,
    ExportDialectRequest: func.isRequired,
    ExportDialectProgress: func.isRequired,
    ExportDialectDownload: func.isRequired,
    displayDebug: bool,
    dialectId: string,
    fileName: string,
    fileUrl: string,
    isReady: bool,
    isProcessing: bool,
    isErrored: bool,
  }
  static defaultProps = {
    displayDebug: false,
    dialectId: undefined,
    fileName: '',
    fileUrl: '',
    isReady: false,
    isProcessing: false,
    isErrored: false,
  }

  polling = false

  constructor(props) {
    super(props)
    this.state = {
      _EXPORT_DIALECT_SCHEME_HOST_URL: null,
      _dialectId: null,
    }

    // Bind methods to 'this'
    ;[
      '_checkProgress',
      '_getDebug',
      '_exportDialectRequest',
      '_exportDialectProgress',
      '_pollServer',
      '_stateIsNotStarted',
      '_stateIsSuccess',
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }
  componentWillUnmount() {
    this.polling = false
  }
  render() {
    const { CONSTANTS } = this.props.ExportDialectReducer
    const { IN_PROGRESS, IN_PROGRESS_SUCCESS, SUCCESS, ERROR } = CONSTANTS
    const { dialectIdLifecycle } = this._getData()
    let componentState = null
    switch (dialectIdLifecycle) {
      case IN_PROGRESS:
        componentState = this._stateIsInProgress()
        break
      case IN_PROGRESS_SUCCESS:
        componentState = this._stateIsSuccess()
        break
      case SUCCESS:
        componentState = this._stateIsSuccess()
        break
      case ERROR:
        componentState = this._stateIsError()
        break
      default:
        componentState = this._stateIsNotStarted()
    }

    // const debug = this._getDebug()
    return (
      <div>
        <h2>Export</h2>
        {/* {debug} */}
        {componentState}
      </div>
    )
  }

  async _exportDialectDownload() {
    const { dialectId } = this.props
    const documentUuid = this.props.ExportDialectReducer.dialectIdDocumentUuid[dialectId]
    await this.props.ExportDialectDownload(dialectId, documentUuid)
  }
  async _exportDialectProgress() {
    const { dialectId } = this.props
    const documentUuid = this.props.ExportDialectReducer.dialectIdDocumentUuid[dialectId]
    await this.props.ExportDialectProgress(dialectId, documentUuid)
  }

  async _exportDialectRequest() {
    const { dialectId } = this.props
    await this.props.ExportDialectRequest(dialectId)
  }

  _getData() {
    const { dialectId } = this.props

    if (!dialectId) {
      return {
        dialectIdDocumentUuid,
        dialectIdLifecycle,
        dialectIdData,
      }
    }

    const { dialectIdDocumentUuid, dialectIdLifecycle, dialectIdData } = this.props.ExportDialectReducer

    const _dialectIdDocumentUuid = dialectIdDocumentUuid[dialectId]

    const _dialectIdLifecycle = dialectIdLifecycle[_dialectIdDocumentUuid]
    const _dialectIdData = dialectIdData[_dialectIdDocumentUuid]

    return {
      dialectIdDocumentUuid: _dialectIdDocumentUuid,
      dialectIdLifecycle: _dialectIdLifecycle,
      dialectIdData: _dialectIdData,
    }
  }

  _getDebug() {
    const { displayDebug, dialectId, ExportDialectReducer } = this.props
    const { CONSTANTS } = ExportDialectReducer
    const { EXPORT_DIALECT_SCHEME_HOST_URL } = CONSTANTS

    const { _dialectId, _EXPORT_DIALECT_SCHEME_HOST_URL } = this.state

    const debug = displayDebug ? (
      <div style={{ border: '1px dotted red', margin: '5px 0', padding: '5px', fontSize: '11px' }}>
        <h3 style={{ fontSize: '12px', margin: '0' }}>TEMP FOR DEV</h3>

        {(_EXPORT_DIALECT_SCHEME_HOST_URL || _dialectId) && (
          <button
            type="button"
            style={{ fontSize: '11px', display: 'block', margin: '2px' }}
            onClick={() => {
              this.setState({
                dialectId,
                _dialectId: undefined,
                _EXPORT_DIALECT_SCHEME_HOST_URL: undefined,
                EXPORT_DIALECT_SCHEME_HOST_URL,
              })
            }}
          >
            Reset vaules
          </button>
        )}

        <div>
          URL:
          <input
            style={{ fontSize: '11px', margin: '0', width: '100%' }}
            onChange={(evt) => {
              this.setState({ _EXPORT_DIALECT_SCHEME_HOST_URL: evt.target.value })
            }}
            value={_EXPORT_DIALECT_SCHEME_HOST_URL || EXPORT_DIALECT_SCHEME_HOST_URL}
          />
        </div>

        <div>
          Document ID:
          <input
            style={{ fontSize: '11px', margin: '0', width: '100%' }}
            onChange={(evt) => {
              this.setState({ _dialectId: evt.target.value })
            }}
            value={_dialectId || dialectId}
          />
        </div>

        <hr />

        <h3>Make requests:</h3>

        <button
          type="button"
          style={{
            fontSize: '11px',
            display: 'block',
            width: '100%',
            margin: '2px',
            lineHeight: '1.3',
            wordBreak: 'break-word',
            textAlign: 'left',
          }}
          onClick={this._exportDialectRequest}
        >
          ExportDialectRequest
        </button>

        <button
          type="button"
          style={{
            fontSize: '11px',
            display: 'block',
            width: '100%',
            margin: '2px',
            lineHeight: '1.3',
            wordBreak: 'break-word',
            textAlign: 'left',
          }}
          onClick={this._exportDialectProgress}
        >
          ExportDialectProgress
        </button>
      </div>
    ) : null

    return debug
  }

  async _checkProgress() {
    // Make request
    await this._exportDialectProgress()
    // Pull data from store
    const { CONSTANTS } = this.props.ExportDialectReducer
    const { IN_PROGRESS_SUCCESS, SUCCESS, ERROR } = CONSTANTS
    const { dialectIdLifecycle } = this._getData()

    // Responses
    // if (dialectIdLifecycle === SUCCESS) {
    if (dialectIdLifecycle === IN_PROGRESS_SUCCESS) {
      // true: Stop polling
      return true
    }

    if (dialectIdLifecycle === ERROR) {
      // false: Stop polling
      return false
    }

    // null: Continue polling
    return null
  }

  // Thanks: https://davidwalsh.name/javascript-polling
  _pollServer(fn, timeout = 20000, interval = 5000) {
    // The polling function
    const endTime = Number(new Date()) + timeout
    // eslint-disable-next-line func-names
    const checkCondition = async function(resolve, reject) {
      // If the condition is met, we're done!
      const result = await fn()
      if (result === true) {
        resolve(result)
      }
      if (result === false) {
        reject(new Error('Network request error'))
      }
      if (Number(new Date()) < endTime && result === null) {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        // this.pollServerTimeoutId = setTimeout(checkCondition, interval, resolve, reject)
        setTimeout(checkCondition, interval, resolve, reject)
      } else {
        // Didn't match and too much time, reject!
        reject(new Error('Timed out'))
      }
    }

    return new Promise(checkCondition)
  }

  _stateIsError() {
    const { dialectIdLifecycle, dialectIdData } = this._getData()
    const { message, percentage } = dialectIdData
    return (
      <div>
        <p>There was a problem creating the export file.</p>
        <p>We have been notified of the matter and will look into it shortly.</p>
        <p>{`${dialectIdLifecycle}: ${message || ''} ${percentage || ''}`}</p>
      </div>
    )
  }

  _stateIsNotStarted() {
    return (
      <div>
        <p>You can create a file of this dialect for printing or other uses:</p>
        <button type="button" onClick={this._exportDialectRequest}>
          Create export file
        </button>
      </div>
    )
  }

  _stateIsInProgress() {
    const { dialectIdLifecycle, dialectIdData } = this._getData()
    const { message, percentage } = dialectIdData

    if (this.polling === false) {
      this.polling = true
      this._pollServer(this._checkProgress, 2000000, 1000)
        .then((response) => {
          // Polling done, now do something else!
          this.polling = false
          console.log('render > this._pollServer > success', response)
          this._exportDialectDownload()
        })
        .catch((error) => {
          // Polling timed out, handle the error!
          this.polling = false
          debugger
          console.log('render > this._pollServer > timeout', error)
        })
    }
    return (
      <div>
        <p>The export file is being created.</p>
        <p>{`${dialectIdLifecycle}: ${message || ''} ${percentage || ''}`}</p>
      </div>
    )
  }

  _stateIsSuccess() {
    const { dialectIdLifecycle, dialectIdData } = this._getData()
    const { entityType, entries } = dialectIdData
    console.log('_stateIsSuccess', entityType, entries)

    // await this._exportDialectDownload()
    // const { dialectIdData } = this._getData()
    // const { ExportDialectFileUrl, ExportDialectFileName } = dialectIdData
    // const ExportDialectFileUrl = ''
    // const ExportDialectFileName = ''

    const content = (
      <div>
        <p>You can download a file of this dialect for printing or other uses:</p>
        <button>TBD</button>
      </div>
    )
    return content
  }
}
