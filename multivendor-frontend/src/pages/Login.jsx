
import React from 'react'

function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission (e.g. call an API, dispatch login action, etc.)
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Replace with your own form fields */}
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default LoginPage