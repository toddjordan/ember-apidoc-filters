
function isPrivateClass(item) {
  return item.hasOwnProperty('access') && item.access === 'private';
};

function isDeprecatedClass(item) {
  return item.hasOwnProperty('deprecated') && item.deprecated === true;
};

function isClassToBeIncluded(item, options) {
  if (options["yuidoc-filters-exclude"]) {
    var accessors = options['yuidoc-filters-exclude'];
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

function gatherClassesToDocument(data, options) {
  var classesToDocument = {};

  for (var c in data.classes) {
    if (isClassToBeIncluded(data.classes[c], options)) {
      classesToDocument[c] = data.classes[c];
    }
  }
  return classesToDocument;
};

function updateClassReferencesInNamespaces(data) {
  for (var namespace in data.modules) {
    var namespaceClasses = {};
    var originalClasses = data.modules[namespace].classes;
    for(var className in originalClasses) {
      if (contains(Object.keys(data.classes), className)) {
        namespaceClasses[className] = 1;
      }
    }
    data.modules[namespace].classes = namespaceClasses;
  }

};

module.exports = function (data, options) {
  if (!options["yuidoc-filters-exclude"]) {
    console.log('no yuidoc-filters-exclude specified in yuidoc.json.  Skipping filters.')
    return;
  }

  console.log("Excluding yuidoc for classes with: " + options["yuidoc-filters-exclude"]);

  data.classes = gatherClassesToDocument(data, options);

  updateClassReferencesInNamespaces(data);

}
