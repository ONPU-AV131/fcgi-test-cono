import React from 'react';

class UptimeComponent extends React.Component {
    render() {
        var scale = [
            ["days", "day", 24 * 60 * 60],
            ["hours", "hour", 60 * 60],
            ["minutes", "minute", 60],
            ["seconds", "second", 1]
        ];

        var result = '';
        var num = this.props.value;
        for (var s in scale) {
            var integral = Math.floor(num / scale[s][2]);
            if (integral == 0) { continue }

            num %= scale[s][2];
            result += integral + " " + (integral == 1 ? scale[s][1] : scale[s][0]) + " ";
        }
        return (
            <div>Uptime: <span>{result}</span></div>
        );
    }
}

export default UptimeComponent;
