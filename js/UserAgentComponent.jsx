import React from 'react';

class UserAgentComponent extends React.Component {
    render() {
        var k = 0;
        var ua = (this.props.value || []).map(function(i) {
            return <li key={k++}>{i}</li>;
        });
        return (
            <div>Last 10 User-Agents:
                <ul>{ua}</ul>
            </div>
        );
    }
}

export default UserAgentComponent;
