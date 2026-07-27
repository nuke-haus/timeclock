class DatabaseBody extends React.Component {

    state = {
       user: null
    };

    _formatName(value) {
        const str = String(value);
        return (str.charAt(0).toUpperCase() + str.slice(1));
    }

    _formatLower(value) {
        return String(value).toLowerCase();
    }

    _formatUpper(value) {
        return String(value).toUpperCase();
    }

    _onClickUser(user) {
        this.setState({user: user});
    }

    _renderSingleUser() {
        if (this.state.user == null) {
            return null;
        }

        let str = this.state.user.name;
        return (
            <div>
                <div className="tabletext">
                    {str}
                </div>
                <table className="formulatablesmall">
                    <tbody>
                        <tr>
                            <th>DATE (DAY/MONTH/YEAR)</th>
                            <th>HOURS LOGGED</th>
                        </tr>
                        {this._renderUserData()}
                    </tbody>
                </table>
            </div>
        );
    }

    _renderUserData() {
        let result = [];
        for (const [i, value] of this.state.user.timeSpans.entries()) {
            result.push(
                <tr key={'userdata' + i}>
                    <td>{value.date.toString()}</td>
                    <td>{value.time || 'INVALID'}</td>
                </tr>
            );
        }
        return result;
    }

    _renderUsers() {
        let result = [];
        for (const [i, value] of TC.database.people.entries()) {
            result.push(
                <tr key={'user' + i}>
                    <td><button onClick={() => this._onClickUser(value)} className="databaseButton">{value.name}</button></td>
                    <td>{value.code}</td>
                    <td>{value.activeTimeSpan != null ? "CLOCKED IN" : "---"}</td>
                </tr>
            );
        }
        return result;
    }

    _renderUserList() {
        if (TC.database.people.length === 0) {
            return null;
        }
        return (
            <div>
                <div className="tabletext">
                    USERS TABLE
                </div>
                <table className="formulatablesmall">
                    <tbody>
                        <tr>
                            <th>NAME</th>
                            <th>CODE</th>
                            <th>STATUS</th>
                        </tr>
                        {this._renderUsers()}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this._renderUserList()}
                <br/>
                {this._renderSingleUser()}
            </div>
        );
    }
}

export default DatabaseBody