//Implementing the singleton pattern,
//which is object-oriented programming's method of solving the problems
//that global variables solve in procedural languages.
define(function () {
  var orchestre = {};

  return {
    getOrchestre: function () {
      return orchestre;
    }
  };
});
