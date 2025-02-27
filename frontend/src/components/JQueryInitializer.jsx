import { useEffect } from 'react'

export default function JQueryInitializer() {
  useEffect(() => {
    // Wait for jQuery plugins to load
    const timer = setTimeout(() => {
      if (window.jQuery) {
        // Initialize main theme functionality
        window.theme?.init()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return null
}
