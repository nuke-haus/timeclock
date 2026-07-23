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

    render() {
    
        return (
            <div>
                <a ref={(ref) => this._downloadLink = ref}/>
            </div>
        );
    }
}