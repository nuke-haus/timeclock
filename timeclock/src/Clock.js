const TC = {};
TC.database = {};
TC.database.people = [];
TC.database.holidays = [];
TC.effects = [];

TC._jsonOutputLogic = function(key, value) {
    return (value == null || value === "" || value === NaN)
        ? undefined
        : value;
}

TC.getAllDataForExport = function() {
    const exportData = {people: [], holidays: []};
    for (let id in TC.database.people) {
        const clone = TC.deepCopy(TC.database.people[id]);
        exportData.people.push(clone);
    }
    for (let id in TC.database.holidays) {
        const clone = TC.deepCopy(TC.database.holidays[id]);
        exportData.holidays.push(clone);
    }
    return JSON.stringify(exportData, TC._jsonOutputLogic, "\t");
}

TC.deleteLocalStore = function() {
    localStorage.removeItem("timeclock_data");
}

TC.saveAllData = function() {
    localStorage.setItem("timeclock_data", TC.getAllDataForExport());
}

TC.loadData = function(data) {
    TC.database.people = data.people;
    TC.database.holidays = data.holidays;
}

TC.getTimeReport = function(d1, d2) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // header goes here
    csvContent += "Name,Code,Total Hours,Total Stat Holiday Hours\r\n";

    for (let [i, value] of TC.database.people.entries()) {

        let validSpans = value.timeSpans.filter((x) => TC.isDateInRange(x.start, d1, d2));
        let count = 0.0;
        let statCount = 0.0;
        for (let [j, value2] of validSpans.entries()) {
            let dt1 = new Date();
            dt1.setTime(value2.start);
            let dt2 = new Date();
            dt2.setTime(value2.end);

            if (value2.multiplier > 1.0) {
                statCount += TC.differenceInTime(dt1, dt2);
            }
            else {
                count += TC.differenceInTime(dt1, dt2);
            }
        }

        let str = `${value.name},${value.code},${count},${statCount}\r\n`;
        csvContent += str;
    }

    return csvContent;
}

TC.getDetailedTimeReport = function(d1, d2) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // header goes here
    csvContent += "Name,Code,Date,Total Hours,Multiplier\r\n";

    for (let [i, value] of TC.database.people.entries()) {

        let validSpans = value.timeSpans.filter((x) => TC.isDateInRange(x.start, d1, d2));
        for (let [j, value2] of validSpans.entries()) {
            let startDate = new Date();
            let endDate = new Date();
            startDate.setTime(value2.start);
            endDate.setTime(value2.end);
            let total = TC.differenceInTime(startDate, endDate).toString();
            let clippedTotal = total.substring(0, 5);
            csvContent += `${value.name},${value.code},${value2.date},${clippedTotal},${value2.multiplier}\r\n`;
        }
    }

    return csvContent;
}

TC.outputAllPeopleCSV = function() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // header goes here
    csvContent += "" + "\r\n";

    for (let [i, value] of TC.database.people.entries()) {
        csvContent += value.code + "," + value.name + "\r\n";
    }

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

TC.isBlankString = function(string) {
    return string == null || string.trim() === "";
}

TC.parseFloat = function(value) {
    value = parseFloat(value || "0");
    if (value === NaN || value === Infinity) {
        return 0.0;
    }
    return Math.max(value, 0.0);
}

TC.guid = function() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

TC.deepCopy = function(object) {
    return JSON.parse(JSON.stringify(object));
}

TC.areEqual = function(obj1, obj2) {
    return JSON.stringify(obj1 || "").localeCompare(JSON.stringify(obj2 || "")) === 0;
}

// Timeclock logic

TC.employeeTimeCheck = function() {
    let date = new Date();
    // It is nearly midnight so force a clock out for all people who are still clocked in
    if (date.getHours() == 23 && date.getMinutes() > 50) {
        console.log('Forcing clock out for all users');
        for (let [i, value] of TC.database.people.entries()) {
            if (TC.isUserClockedIn(value.code)) {
                TC.enterCode(value.code, true);
                TC.saveAllData();
            }
        }
    }
}

TC.getCalendarFormatDate = function(date) {
    // datepicker has a stupid format for dates it uses
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
}

TC.hasHoliday = function(date) {
    return TC.database.holidays.find(x => x.date === date) != undefined;
}

TC.addHoliday = function(date, timestamp) {
    let h = {
        date: date,
        timestamp: timestamp
    }
    TC.database.holidays.push(date);
    TC.database.holidays.sort();
}

TC.removeHoliday = function(date) {
    TC.database.holidays = TC.database.holidays.filter(x => x.date !== date);
}

TC.isCodeLength3 = function(code) {
    let numeric = /^\d+$/.test(code);
    return code.length == 3 && numeric;
}

TC.canAddNewUser = function(code) {
    return TC.getUserData(code) == null && code.length == 3;
}

TC.removeUser = function(code) {
    TC.database.people = TC.database.people.filter((x) => x.code != code);
    TC.saveAllData();
}

TC.getUserData = function(code) {
    return TC.database.people.find(x => x.code == code)
}

TC.getUserIndex = function(code) {
    return TC.database.people.findIndex(x => x.code == code);
}

TC.addNewUser = function(code, name, pass) {
    let admin = false;
    if (TC.database.people.length == 0) {
        admin = true;
    }
    let user = {
        code: code,
        name: name,
        pass: pass,
        admin: admin,
        timeSpans: [],
        activeTimeSpan: null
    };

    TC.database.people.push(user);

    console.log("Added new user '" + user.name + "' with code " + user.code);
}

TC.isPassValid = function(pass) {
    if (TC.database.people.length == 0) {
        return false;
    }
    let user = TC.database.people[0];
    return user.admin && user.pass == pass;
}

TC.isUserClockedIn = function(code) {
    let data = TC.getUserData(code);
    if (data != null) {
        return data.activeTimeSpan != null;
    }
    return false;
}

TC.checkDateForHoliday = function(timestamp) {
    let date = new Date();
    date.setTime(timestamp);
    let formatted = TC.getCalendarFormatDate(date);
    let result = null;

    for (let [i, value] of TC.database.holidays.entries()) { 
        let hdate = new Date();
        hdate.setTime(value.timestamp);
        let str = TC.getCalendarFormatDate(hdate);

        if (str == formatted) {
            result = value.timestamp;
        }
    }

    let holiday = TC.database.holidays.find(x => x.timestamp == result);

    return holiday;
}

TC.enterCode = function(code, forced) {
    let data = TC.getUserData(code);
    let index = TC.getUserIndex(code);
    if (data != null) {
        if (TC.isUserClockedIn(code)) {
            let timeSpan = new Date();
            timeSpan.setTime(data.activeTimeSpan);

            let now = new Date();
            let year = new Date().getFullYear();
            let month = new Date().getMonth();
            let day = new Date().getDate();
            let dateStr = day + "/" + month + "/" + year;
            let calendarStr = TC.getCalendarFormatDate(now);
            let mult = 1.0;
            
            

            TC.database.people[index].timeSpans.push({
                start: timeSpan.getTime(),
                end: now.getTime(),
                forced: forced,
                multiplier: mult,
                date: dateStr,
                dateDay: day,
                dateMonth: month,
                dateYear: year,
                calendarDate: calendarStr
            });
            TC.database.people[index].activeTimeSpan = null;

            console.log("Clocked out " + data.name + " - " + dateStr);
        } else {
            TC.database.people[index].activeTimeSpan = new Date().getTime();

            console.log("Clocked in " + data.name);
        }
    }
}

TC.isDateInRange = function(timestamp, start, end) {
    let date = new Date();
    date.setTime(timestamp);
    return date >= start && date <= end;
}

TC.differenceInTime = function(dt1, dt2) {
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
  
    return Math.abs(diff);
}

TC.addEffects = function() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let emojis = ['🎈', '🤡', '🐀', '🍕', '🪶', '⭐', '🚀', '🪐', '🤪', '😎', '🐟', '🥸', '⌛', '🌭', '🍎', '🩴', '⏱️',
                '😀', '💩', '🍦', '🚗', '📦', '🚚', '🛻', '🚙', '🤩', '❤️', '🦅', '🛥️', '🫘', '🌶️', '🐢', '🕺', '😵‍💫',
                '🍫', '🍗', '🪙', '🪠', '👻', '😼', '🎷', '🎺', '🍁', '🍌', '🧀', '🍓', '👽', '🇨🇦', '🍄', '👍', '🌀',
                '🗿', '⚓', '🫃', '🥶', '🥵', '🌡️', '🌞', '💸', '🌎', '🦋', '🌈', '⛵', '🧅', '🪱', '🎵', '❄️', '💎'];
    let emote = TC.rand(emojis);
    let doRand = true;

    if (Math.random() < 0.02) {
        doRand = false;
    }

    let margin = viewportWidth * 0.2;

    for (let i = 0; i < 20; i++) {
        TC.effects.push({
            text: doRand ? TC.rand(emojis) : emote,
            xwobb: 0,
            xpos: (Math.random() * (viewportWidth - 2 * margin)) + margin,
            ypos: 0,
            rotation: Math.random() * 360,
            rotate: (Math.random() * -6) + 3,
            size: (Math.random() * 3.5) + 1.2,
            speed: (Math.random() * 4) + 0.5,
            wobble: (Math.random() * 200),
            wobbleSpd: Math.random() * 0.01,
            wobbleOff: Math.random() * 5000,
            name: new Date().getMilliseconds() + "emoji" + i
        });
    }
}

TC.rand = function(items) {
    return items[items.length * Math.random() | 0];
}

export default TC