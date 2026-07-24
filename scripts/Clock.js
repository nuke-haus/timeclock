TC = {};

TC.database = {};
TC.database.people = [];

TC._jsonOutputLogic = function(key, value) {
    return (value == null || value === "" || value === NaN)
        ? undefined
        : value;
}

TC.getAllDataForExport = function() {
    const exportData = {formulas: [], mixtures: [], materials: []};
    for (let id in TC.database.formulas) {
        const clone = TC.deepCopy(TC.database.formulas[id]);
        clone.computed = null;
        exportData.formulas.push(clone);
    }
    for (let id in TC.database.materials) {
        exportData.materials.push(TC.database.materials[id]);
    }
    for (let id in TC.database.mixtures) {
        exportData.mixtures.push(TC.database.mixtures[id]);
    }
    return JSON.stringify(exportData, TC._jsonOutputLogic, "\t");
}

TC.deleteLocalStore = function() {
    localStorage.removeItem("timeclock_data");
}

TC.persistInLocalStore = function() {
    localStorage.setItem("timeclock_data", TC.getAllDataForExport());
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

TC.isCodeLength4 = function(code) {
    return code.length == 4;
}

TC.canAddNewUser = function(code) {
    return TC.getUserData(code) == null && code.length == 4;
}

TC.getUserData = function(code) {
    return TC.database.people.find(x => x.code === code)
}

TC.addNewUser = function(code, name) {
    let user = {
        code: code,
        name: name,
        timeSpans: [],
        activeTimeSpan: null
    };

    TC.database.people.push(user);

    console.log("Added new user " + user.name + " with code " + user.code);
}

TC.isUserClockedIn = function(code) {
    let data = TC.getUserData(code);
    if (data != null) {
        return data.activeTimeSpan != null;
    }
    return false;
}