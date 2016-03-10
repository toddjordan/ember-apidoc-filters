
function isPrivateClass(item) {
  return item.hasOwnProperty('access') && item.access === 'private';
};

function isDeprecatedClass(item) {
  return item.hasOwnProperty('deprecated') && item.deprecated === true;
};

function isClassToBeIncluded(item, options) {
  if (options["ember-yuidoc-exclude"]) {
    var accessors = options['ember-yuidoc-exclude'];
    for (var i = 0; i < accessors.length; i++) {
      if ((accessors[i] === 'private' && isPrivateClass(item)) ||
          (accessors[i] === 'deprecated' && isDeprecatedClass(item))) {
        return false;
      }
    }
  }
  return true;
};

function contains(array, item) {
  for(var i = 0; i < array.length; i++) {
    if (array[i] === item) {
      return true;
    }
  }
  return false;
};

module.exports = function (data, options) {
  if (options["ember-yuidoc-exclude"]) {
    console.log("Excluding classes with accessors: "+ options["ember-yuidoc-exclude"]);
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

  for (var namespace in data.modules) {
    var namespaceClasses = {};
    var originalClasses = data.modules[namespace].classes;
    for(var className in originalClasses) {
      if (contains(classNamesToDocument, className)) {
        namespaceClasses[className] = 1;
      }
    }
    data.modules[namespace].classes = namespaceClasses;
  }

  data.classes = classesToDocument;
}
