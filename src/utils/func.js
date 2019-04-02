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

    reverseMap: (object) => {
        let result = {};
        let keys = Object.keys(object);

        keys.forEach( key => {
            let value = object[key];
            if (!result[value]) {
                result[value] = new Set();
            }
            result[value].add(key);
        })
        return result;
    },

    arrayMapToObject(array, object_key) {
        let result = {}
        array.forEach(el => {
            let key = el[object_key];
            result[key] = el;
        })

        return result
    }
}

module.exports = func;