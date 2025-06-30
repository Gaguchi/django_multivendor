import { Component } from 'react'

/**
 * Error boundary specifically for debug components
 * Prevents debug tools from crashing the main application
 */
class DebugErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error but don't crash the app
    console.warn('Debug component error (non-critical):', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render a minimal fallback or nothing at all
      return null
    }

    return this.props.children
  }
}

export default DebugErrorBoundary
