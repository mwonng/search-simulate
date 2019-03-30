
module.exports = {
  formatedEntitiesName: function(namesArray) {
    return namesArray.map(fullName =>
        this.capitalize(fullName.split('.')[0])
    )
  },

  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  readableLine:  function(key, value) {
    if (Array.isArray(value)) {
      value = JSON.stringify(value);
    } else {
      value = value.toString();
    }
    return key.padEnd(30) + value.toString().padEnd(50);
  }
}