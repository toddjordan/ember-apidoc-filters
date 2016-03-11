
function isPrivateClass(item) {
  return item.access === 'private';
};

function isDeprecatedClass(item) {
  return item.deprecated === true;
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
      if (data.classes.hasOwnProperty(className)) {
        namespaceClasses[className] = originalClasses[className]
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
