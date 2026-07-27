import { DatePicker } from "react-datepicker"

class CalendarBody extends React.Component {

    state = {
      
    };

    _onSelectDate(date) {
        console.log(date);
    }

    _onChangeDate(date) {
        console.log(date);
    }

    //<DatePicker selected = {{selectedDate}} 
    //                        onSelect = {(date) => this._onSelectDate(date)} 
    //                        onChange={(date) => _onChangeDate(date)} />

    render() {
        let selectedDate = new Date();
        return (
            <div>
                hi
                <DatePicker onSelect = {(date) => this._onSelectDate(date)} 
                            onChange = {(date) => _onChangeDate(date)} />
            </div>
        );
    }
}

export default CalendarBody