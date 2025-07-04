// Load external scripts dynamically to avoid Vite bundling issues
export const loadExternalScripts = () => {
  return new Promise((resolve, reject) => {
    const scriptsToLoad = [
      '/src/assets/js/jquery.min.js',
      '/src/assets/js/plugins.js',
      '/src/assets/js/bootstrap.bundle.min.js',
      '/src/assets/js/main.min.js'
    ]

    let loadedCount = 0

    const onScriptLoad = () => {
      loadedCount++
      if (loadedCount === scriptsToLoad.length) {
        console.log('✅ All external scripts loaded successfully')
        resolve()
      }
    }

    const onScriptError = (error) => {
      console.error('❌ Failed to load script:', error)
      // Don't reject, continue loading other scripts
      onScriptLoad()
    }

    scriptsToLoad.forEach((src, index) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        onScriptLoad()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.async = false // Preserve order
      script.onload = onScriptLoad
      script.onerror = onScriptError
      
      document.head.appendChild(script)
    })
  })
}

// Initialize scripts when DOM is ready
export const initializeExternalScripts = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadExternalScripts)
  } else {
    loadExternalScripts()
  }
}
