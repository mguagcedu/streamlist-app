import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Render error caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui" }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
          <p>Check console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
