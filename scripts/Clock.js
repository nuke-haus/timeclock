TC = {};
TC.database = {};
TC.database.people = [];
TC.effects = [];

TC._jsonOutputLogic = function(key, value) {
    return (value == null || value === "" || value === NaN)
        ? undefined
        : value;
}

TC.getAllDataForExport = function() {
    const exportData = {people: []};
    for (let id in TC.database.people) {
        const clone = TC.deepCopy(TC.database.people[id]);
        exportData.people.push(clone);
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
}

TC.outputAllPeopleCSV = function() {
    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

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

TC.isCodeLength3 = function(code) {
    return code.length == 3;
}

TC.canAddNewUser = function(code) {
    return TC.getUserData(code) == null && code.length == 3;
}

TC.getUserData = function(code) {
    return TC.database.people.find(x => x.code == code)
}

TC.getUserIndex = function(code) {
    return TC.database.people.findIndex(x => x.code == code);
}

TC.addNewUser = function(code, name) {
    let user = {
        code: code,
        name: name,
        timeSpans: [],
        activeTimeSpan: null
    };

    TC.database.people.push(user);

    console.log("Added new user '" + user.name + "' with code " + user.code);
}

TC.isUserClockedIn = function(code) {
    let data = TC.getUserData(code);
    if (data != null) {
        return data.activeTimeSpan != null;
    }
    return false;
}

TC.enterCode = function(code) {
    let data = TC.getUserData(code);
    let index = TC.getUserIndex(code);
    if (data != null) {
        if (TC.isUserClockedIn(code)) {
            let timeSpan = data.activeTimeSpan;
            let now = new Date();
            let diff = TC.differenceInTime(timeSpan, now);
            let year = new Date().getFullYear();
            let month = new Date().getMonth();
            let day = new Date().getDate();
            let dateStr = day + "/" + month + "/" + year;
            
            TC.database.people[index].timeSpans.push({
                time: diff,
                date: dateStr
            });
            TC.database.people[index].activeTimeSpan = null;

            console.log("Clocked out " + data.name + " - " + diff);
        } else {
            TC.database.people[index].activeTimeSpan = new Date();

            console.log("Clocked in " + data.name);
        }
    }
}

TC.differenceInTime = function(dt1, dt2) {
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
  
    return Math.abs(diff);
}

TC.addEffects = function() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let emojis = ['🎈', '🤡', '🐀', '🍕', '✨', '⭐', '🚀', '🪐', '🤪', '🥸', '⌛', '🌭', '🍎',
                '😀', '💩', '🍦', '🚗', '📦', '🚚', '🛻', '🚙', '🤩', '💖', '🦅', '🛥️', '🫘', '🌶️',
                '🍫', '🍗', '🪙', '🪠', '👻', '😼', '🎷', '🎺', '🍁', '🍌', '🧀', '🍓', '👽', '🇨🇦',
                '🗿', '⚓', '🫃', '🥶', '🥵', '🌡️', '🌞', '💸', '🌎', '🦋', '🌈', '⛵', '🧅', '❄️'];
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