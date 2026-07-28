import React from 'react';
import TC from './Clock.js';

class PassBody extends React.Component {

    state = {
        pass: "",
    };

    componentDidMount() {

    }

    componentWillUnmount() {
     
    }

    _onDone() {
        this.setState({pass: ""});
    }

    _onPassChanged(ev) {
        this.setState({pass: ev.currentTarget.value});
    }

    _renderPass() {
        if (TC.isPassValid(this.state.pass)) {
            return (
                <div>
                    <div>
                        <button onClick={() => this._onDone()}>🔑 Log Out Admin</button>
                    </div>
                    <div>
                        {this.props.innerHtml}
                    </div>
                </div>
            )
        } else {
             return <input className="keypadName" type="password" placeholder="Password" defaultValue={""} onInput={(value) => this._onPassChanged(value)}></input>
        }
    }

    render() {
        return (
            <div>
                {this._renderPass()}
            </div>
        );
    }
}

export default ClockBody