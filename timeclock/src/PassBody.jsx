import React from 'react';
import TC from './Clock.js';

class PassBody extends React.Component {

    state = {
        pass: "",
        login: false
    };

    componentDidMount() {

    }

    componentWillUnmount() {
     
    }

    _onDone() {
        this.setState({pass: "", login: false});
    }

    _onLogin(log) {
        if (TC.isPassValid(this.state.pass)) {
            this.setState({login: true});
        }
        else {
            this.setState({login: false});
        }
    }

    _onPassChanged(ev) {
        this.setState({pass: ev.currentTarget.value});
    }

    _renderPass() {
        if (TC.isPassValid(this.state.pass) && this.state.login) {
            return (
                <div>
                    <div>
                        <button onClick={() => this._onDone()}>🔐 Log Out Admin</button>
                    </div>
                    <div>
                        {this.props.innerHtml}
                    </div>
                </div>
            )
        } else {
             return (
                <div>
                    <button onClick={() => this._onLogin()}>🔑 Log In</button>
                    <input className="keypadName" type="password" placeholder="Password" defaultValue={""} onInput={(value) => this._onPassChanged(value)}></input>
                </div>
             );
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

export default PassBody