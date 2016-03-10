# yuidoc-filters
A YUIDoc preprocessor for filtering out parts of documentation

## Installation
To install `yuidoc-filters`, simply run `npm install --save-dev yuidoc-filters` in your npm project root.

## Usage
To use on an existing yuidoc project, add the following entries to your `yuidoc.json` file:

```javascript
{
  ...
  "preprocessor": "yuidoc-filters",
  "yuidoc-filters-exclude": ["private", "deprecated"]
}
```

Currently yuidoc filters only filters classes marked private or deprecated.

