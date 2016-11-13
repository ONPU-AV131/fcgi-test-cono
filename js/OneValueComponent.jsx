import React from 'react';

class OneValueComponent extends React.Component {
    render() {
        return (
            <div>{this.props.text}: <span>{this.props.value}</span></div>
        );
    }
}

export default OneValueComponent;
