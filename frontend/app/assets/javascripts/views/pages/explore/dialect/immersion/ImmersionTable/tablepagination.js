import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Select, MenuItem } from '@material-ui/core'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

export default class TablePaginationActions extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }
  handleFirstPageButtonClick = (event) => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = (event) => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  handleLastPageButtonClick = (event) => {
    this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1))
  }

  render() {
    const { count, page, rowsPerPage } = this.props
    const maxPage = Math.ceil(count / rowsPerPage)
    const pageNumbers = Array(maxPage).fill('')
    return (
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ marginLeft: '15px' }}>
          Page:
          <Select
            style={{ paddingLeft: '5px', marginLeft: '5px' }}
            value={page}
            onChange={(ev) => this.props.onChangePage(event, ev.target.value)}
            inputProps={{
              name: 'page',
              id: 'page',
            }}
          >
            {pageNumbers.map((m, i) => {
              return (
                <MenuItem key={i.toString()} value={i}>
                  {(i + 1).toString()}
                </MenuItem>
              )
            })}
          </Select>
          / {maxPage}
        </div>
        <IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    )
  }
}
