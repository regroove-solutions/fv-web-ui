import React, { Component, PropTypes } from 'react'
const { bool, string } = PropTypes
// import classNames from 'classnames'
import Request from 'request'

import { CSV_URL, CSV_URL_INITIATE, CSV_URL_DOWNLOAD } from './constants'

export default class ExportDialect extends Component {
  static propTypes = {
    dialectId: string,
    fileName: string,
    fileUrl: string,
    isReady: bool,
    isProcessing: bool,
    isErrored: bool,
  }
  static defaultProps = {
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
      initiateCsvRequestSent: false,
      initiateCsvRequestErrored: false,
    }

    // Bind methods to 'this'
    ;['_initiateCsvRequest', '_requestCsvDownload'].forEach((method) => (this[method] = this[method].bind(this)))
  }

  render() {
    const { isProcessing, isReady, isErrored } = this.props
    const { initiateCsvRequestSent, initiateCsvRequestErrored } = this.state
    let content = this._stateIsDefault()
    if (isProcessing || initiateCsvRequestSent) {
      content = this._stateIsProcessing()
    }
    if (isErrored || initiateCsvRequestErrored) {
      content = this._stateIsErrored()
    }
    if (isReady) {
      content = this._stateIsReady()
    }
    return (
      <div>
        <h2>Export</h2>
        {content}
      </div>
    )
  }
  _stateIsDefault() {
    const { dialectId } = this.props
    if (dialectId === undefined) {
      return null
    }
    return (
      <div>
        <p>You can create a file of this dialect for printing or other uses:</p>
        <button type="button" onClick={this._initiateCsvRequest}>
          Create export file
        </button>
      </div>
    )
  }
  _stateIsProcessing() {
    return (
      <div>
        <p>The export file is being created.</p>
        <button onClick={this._requestCsvDownload}>
          <strong>TEMP FOR DEV</strong>
          <br />
          CALL Document.GetFormattedDocument
        </button>
      </div>
    )
  }
  _stateIsErrored() {
    return (
      <div>
        <p>There was a problem creating the export file.</p>
        <p>We have been notified of the matter and will look into it shortly.</p>
      </div>
    )
  }
  _stateIsReady() {
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
  _initiateCsvRequest() {
    const { dialectId } = this.props
    if (dialectId === undefined) {
      return
    }
    const reqBody = {
      input: dialectId,
      params: {
        columns: '*',
        format: 'CSV',
        query: '*',
      },
    }
    Request(
      {
        url: `${CSV_URL}${CSV_URL_INITIATE}`,
        method: 'POST',
        body: reqBody,
        json: true,
      },
      (error, response, body) => {
        // console.log('!', error)
        // console.log('!!', response)
        // console.log('!!!', body)

        if (response && response.statusCode === 204) {
          this.setState({
            initiateCsvRequestSent: true,
          })
        } else {
          this.setState({
            initiateCsvRequestErrored: true,
          })
        }
      }
    )
  }
  _requestCsvDownload() {
    const { dialectId } = this.props
    if (dialectId === undefined) {
      return
    }
    const reqBody = {
      input: dialectId,
      params: {
        format: 'CSV',
      },
    }
    Request(
      {
        url: `${CSV_URL}${CSV_URL_DOWNLOAD}`,
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
  }
}
