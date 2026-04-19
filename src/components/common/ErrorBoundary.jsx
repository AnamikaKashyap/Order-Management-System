import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <pre className="mt-3 text-sm text-slate-400">{String(this.state.error)}</pre>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="mt-4 px-3 py-2 rounded bg-indigo-600 text-white">Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}
