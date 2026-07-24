class DatabaseBody extends React.Component {

    state = {
       
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

    _renderUsers() {
        let result = [];
        for (const [i, value] of TC.database.people.entries()) {
            result.push(
                <tr key={'user' + i}>
                    <td><button className="databaseButton">{value.name}</button></td>
                    <td>{value.code}</td>
                    <td>{value.activeTimeSpan != null ? "CLOCKED IN" : "-"}</td>
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
            </div>
        );
    }
}