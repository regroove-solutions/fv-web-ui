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
  render() {
    const { CONSTANTS } = this.props.ExportDialectReducer
    const { IN_PROGRESS, SUCCESS, ERROR } = CONSTANTS
    const { dialectIdDocumentUuid, dialectIdLifecycle, dialectIdData } = this._getData()
    let componentState = null
    switch (dialectIdLifecycle) {
      case IN_PROGRESS:
        componentState = this._stateIsInProgress(dialectIdData)
        this._pollServer(this._checkProgress, 3000, 1000)
          .then((response) => {
            // Polling done, now do something else!
            console.log('render > this._pollServer > success', response)
          })
          .catch((error) => {
            // Polling timed out, handle the error!
            console.log('render > this._pollServer > timeout', error)
            // debugger
          })

        break
      case SUCCESS:
        componentState = this._stateIsSuccess(dialectIdData)
        break
      case ERROR:
        componentState = this._stateIsError(dialectIdData)
        break
      default:
        componentState = this._stateIsNotStarted()
    }

    const debug = this._getDebug()
    return (
      <div>
        <h2>Export</h2>
        {debug}
        {componentState}
      </div>
    )
  }

  async _exportDialectProgress() {
    const { dialectId } = this.props
    const _dialectId = this.state.dialectId || dialectId
    if (_dialectId === undefined) {
      return
    }
    const documentUuid = this.props.ExportDialectReducer.dialectIdDocumentUuid[_dialectId]
    await this.props.ExportDialectProgress(_dialectId, documentUuid, this.state._EXPORT_DIALECT_SCHEME_HOST_URL)
  }

  async _exportDialectRequest() {
    const { dialectId } = this.props
    const _dialectId = this.state.dialectId || dialectId
    if (_dialectId === undefined) {
      return
    }
    await this.props.ExportDialectRequest(_dialectId, this.state._EXPORT_DIALECT_SCHEME_HOST_URL)
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
    await this._exportDialectProgress()
    const { CONSTANTS } = this.props.ExportDialectReducer
    const { SUCCESS, ERROR } = CONSTANTS
    const { dialectIdLifecycle } = this._getData()
    if (dialectIdLifecycle === SUCCESS) {
      return true
    }

    if (dialectIdLifecycle === ERROR) {
      return false
    }
    return null
  }

  // Thanks: https://davidwalsh.name/javascript-polling
  _pollServer(fn, timeout = 2000, interval = 100) {
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
        reject(new Error('checkCondition rejected'))
      }
      if (Number(new Date()) < endTime) {
        // If the condition isn't met but the timeout hasn't elapsed, go again
        if (result === null) {
          setTimeout(checkCondition, interval, resolve, reject)
        }
      } else {
        // Didn't match and too much time, reject!
        reject(new Error('timed out for ' + fn + ': ' + arguments))
      }
    }

    return new Promise(checkCondition)
  }

  _stateIsError(dialectIdData) {
    return (
      <div>
        <p>There was a problem creating the export file.</p>
        <p>We have been notified of the matter and will look into it shortly.</p>
        <p>{`${dialectIdData.message} ${dialectIdData.percentage}`}</p>
      </div>
    )
  }

  _stateIsNotStarted() {
    const { dialectId } = this.props
    const id = this.state.dialectId || dialectId

    return (
      <div>
        <p>You can create a file of this dialect for printing or other uses:</p>
        <button type="button" onClick={this._exportDialectRequest}>
          Create export file
        </button>
      </div>
    )
  }

  _stateIsInProgress(dialectIdData = { message: '', percentage: 0 }) {
    return (
      <div>
        <p>The export file is being created.</p>
        <p>{`${dialectIdData.message} ${dialectIdData.percentage}`}</p>
      </div>
    )
  }

  _stateIsSuccess() {
    const { fileName, fileUrl } = this.props

    const content =
      fileUrl === '' ? (
        <div>
          <p>The file has finished processing but is temporarily unavailable for download.</p>
          <p>Sorry for the delay, it should be fixed shortly.</p>
        </div>
      ) : (
        <div>
          <p>You can download a file of this dialect for printing or other uses:</p>
          <a href={fileUrl}>
            Download <strong>{fileName}</strong>
          </a>
        </div>
      )
    return content
  }

  _requestCsvDownload() {
    /*
    const { dialectId, EXPORT_DIALECT_SCHEME_HOST_URL } = this.props
    const { _EXPORT_DIALECT_SCHEME_HOST_URL } = this.state
    const id = this.state.dialectId || dialectId
    if (id === undefined) {
      return
    }
    const reqBody = {
      input: id,
      params: {
        format: 'CSV',
      },
    }
    Request(
      {
        url: `${_EXPORT_DIALECT_SCHEME_HOST_URL || EXPORT_DIALECT_SCHEME_HOST_URL}${CSV_URL_DOWNLOAD}`,
        method: 'POST',
        body: reqBody,
        json: true,
      },
      (error, response, body) => {
        // console.log('!', error)
        // console.log('!!', response)
        // console.log('!!!', body)
        if (response && response.statusCode === 200) {
          if (body && body.value) {
            const respData = body.value.split(',')
            const id = respData[1].split(':')
            console.log('!!!', id[1])
          }
        }
      }
    )
    */
  }
}
