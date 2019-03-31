const func = {
    formatedEntitiesName: function (namesArray) {
        return namesArray.map(fullName =>
            func.capitalize(fullName.split('.')[0])
        )
    },

    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
}

module.exports = func