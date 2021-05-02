import React from "react";

export default class Errorboundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        console.log("getDerivedStateFromError", error);
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        this.errorHandler(error, errorInfo);
    }

    errorHandler = console.log

    render() {
        if (this.state.hasError) {
            return <p>Something no good.</p>
        }
        return this.props.children
    }
}