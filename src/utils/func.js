module.exports = {
  formatedEntitiesName: function(namesArray) {
    return namesArray.map(fullName =>
        this.capitalize(fullName.split('.')[0])
    )
  },

  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
}