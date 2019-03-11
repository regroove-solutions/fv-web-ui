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
      <input name="username" type="text" />
      <input name="password" type="text" />
    </form>
  )
}
export { JestTestSetup }
