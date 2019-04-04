import React from 'react'
function JestTestSetup({ onSubmit }) {
  return (
    <form
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
      <label htmlFor="username">User name</label>
      <input id="username" name="username" type="text" />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="text" />
    </form>
  )
}
export { JestTestSetup }
