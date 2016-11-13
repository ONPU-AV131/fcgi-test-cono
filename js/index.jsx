import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';

import OneValueComponent from './OneValueComponent.jsx';
import UptimeComponent from './UptimeComponent.jsx';
import UserAgentComponent from './UserAgentComponent.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getStat = this.getStat.bind(this);
    }

    getStat() {
        var self = this;


        $.getJSON('/stat', function(result) {
            if(!result){
                return;
            }

            self.setState(result);
        });
    }

    componentDidMount() {
        this.getStat();
        this.timer = setInterval(this.getStat, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render () {
        return (
            <div>
                <UptimeComponent value={this.state.uptime} />
                <OneValueComponent text="Requests count" value={this.state.requests} />
                <OneValueComponent text="Online count" value={this.state.online} />
                <OneValueComponent text="Uniq visitors for last hour" value={this.state.hour} />
                <UserAgentComponent value={this.state.ua} />
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));
