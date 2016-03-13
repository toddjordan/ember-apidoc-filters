var EXCLUDE_CATEGORY = 'yuidoc-filters-exclude-category';
var EXCLUDE = 'yuidoc-filters-exclude';

function isPrivateClass(item) {
  return item.access === 'private';
};

function isDeprecatedClass(item) {
  return item.deprecated === true;
};

function isClassToBeIncluded(item, options) {
  if (options[EXCLUDE]) {
    var accessors = options[EXCLUDE];
    for (var i = 0; i < accessors.length; i++) {
      if ((accessors[i] === 'private' && isPrivateClass(item)) ||
          (accessors[i] === 'deprecated' && isDeprecatedClass(item))) {
        return false;
      }
    }
  }

  if (options[EXCLUDE_CATEGORY] && item.category) {
    var categories = options[EXCLUDE_CATEGORY];
    for (var j = 0; j < categories.length; j++) {
      for (var k = 0; k < item.category.length; k++) {
        if (categories[j] === item.category[k]) {
          return false;
        }
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
  if (options[EXCLUDE]) {
    console.log("yuidoc-filters: Excluding yuidoc for classes with: " + options[EXCLUDE]);
  }
  if (options[EXCLUDE_CATEGORY]) {
    console.log("yuidoc-filters: Excluding yuidoc for classes with categories " + options[EXCLUDE_CATEGORY]);
  }
  if (!options[EXCLUDE] && !options[EXCLUDE_CATEGORY]) {
    console.log('yuidoc-filters: no yuidoc-filters-exclude and yuidoc-filters-exclude-category specified in yuidoc.json.  Skipping filters.')
    return;
  }

  data.classes = gatherClassesToDocument(data, options);
  updateClassReferencesInNamespaces(data);

}
