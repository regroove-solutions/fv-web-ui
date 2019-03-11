import React, { Component } from 'react'
import { PropTypes } from 'react'

// class JestTestSetup extends Component {
//   static propTypes = {
//     onSubmit: PropTypes.func,
//   }
//   componentDidMount() {}
//   render() {
//     return (
//       <form id="JestTestSetup" className="JestTestSetup" onSubmit={this.props.onSubmit}>
//         <input name="username" type="text" />
//         <input name="password" type="text" />
//         <input name="passwordAgain" type="text" />
//       </form>
//     )
//   }
// }
function JestTestSetup({ onSubmit }) {
  return (
    form
      id="JestTestSetup"
      className="JestTestSetup"
      onSubmit={(e) => {
        e.preventDefault()
        const { username, password } = e.target.elements
        onSubmit({
          username: username.value,
          password: password.value,
        })
      }}
    >
      <h1>This is the form</h1>
      <input name="username" type="text" />
      <input name="password" type="text" />
    </form>
  )
}
export { JestTestSetup }
