
function isClassToBeIncluded(item, options) {
  if (options["exclude-class-accessors"]) {
    var accessors = [].concat(options["exclude-class-accessors"]);
    for (var i = 0; i < accessors.length; i++) {
      if (item.hasOwnProperty('access') &&
          item.hasOwnProperty('name') &&
          item.access === accessors[i]) {
        return false;
      }
    }
  }
  return true;
};

module.exports = function (data, options) {
  if (options["exclude-class-accessors"]) {
    console.log("Excluding classes with accessors: "+ [].concat(options["exclude-class-accessors"]));
  }

  var classesToDocument = {};

  for (var c in data.classes) {
    if (isClassToBeIncluded(data.classes[c], options)) {
      classesToDocument[c] = data.classes[c];
    }
  }

  var classNamesToDocument = [];

  for (var n in classesToDocument) {
    classNamesToDocument.push(n);
  }

  data.classes = classesToDocument;
  data.modules.ember.classes = classNamesToDocument;
}
