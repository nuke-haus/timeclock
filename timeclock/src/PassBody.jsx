import React from 'react';
import TC from './Clock.js';

class PassBody extends React.Component {

    state = {
        pass: "",
        code: "",
        name: "",
        login: false
    };

    componentDidMount() {

    }

    componentWillUnmount() {
     
    }

    _onDone() {
        this.setState({pass: "", login: false});
    }

    _onCreateAdmin() {
        TC.addNewUser(this.state.code, this.state.name, this.state.pass);
        TC.saveAllData();

        this.setState({name: "", code: ""});
    }

    _onLogin(log) {
        if (TC.isPassValid(this.state.pass)) {
            this.setState({login: true});
        }
        else {
            this.setState({login: false});
        }
    }

    _onCodeChanged(ev) {
        this.setState({code: ev.currentTarget.value});
    }

    _onNameChanged(ev) {
        this.setState({name: ev.currentTarget.value});
    }

    _onPassChanged(ev) {
        this.setState({pass: ev.currentTarget.value});
    }

    _renderPass() {
        let userdata = null;
        if (TC.database.people.length == 0) {
            userdata = <div>
                <div>
                    <input className="keypadName" type="text" placeholder="Name" onInput={(value) => this._onNameChanged(value)}></input>
                </div>
                <div>
                    <input className="keypadName" type="text" placeholder="Code" maxlength="3" pattern="[0-9][0-9][0-9]" onInput={(value) => this._onCodeChanged(value)}></input>
                </div>
                <div key="inputpass">
                    <input className="keypadName" type="password" placeholder="Password" onInput={(value) => this._onPassChanged(value)}></input>
                </div>
                <button onClick={() => this._onCreateAdmin()}>🔑 Make Admin Account</button>
            </div>
        }
        else {
            userdata = <div>
                <div key="userpass">
                    <input className="keypadName" type="password" placeholder="Password" onInput={(value) => this._onPassChanged(value)}></input>
                </div>
                <div>
                    <button onClick={() => this._onLogin()}>🔑 Log In</button>
                </div>
            </div>
        }

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
                    {userdata}
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