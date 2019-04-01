const func = {
    formateEntitiesName: function (namesArray, caps = false) {
        return namesArray.map(fullName => {
            let withoutExt = fullName.split('.')[0] ;
            return caps ? func.capitalize(withoutExt) : withoutExt;
        })
    },

    capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
}

module.exports = func