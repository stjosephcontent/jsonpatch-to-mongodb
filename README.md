# jsonpatch-to-mongodb

[![build status](https://secure.travis-ci.org/imlucas/jsonpatch-to-mongodb.png)](http://travis-ci.org/imlucas/jsonpatch-to-mongodb)

Convert [JSON patches](http://jsonpatch.com/) into a MongoDB update.

## Example 1: Replace a string property

```javascript
var toMongodb = require('jsonpatch-to-mongodb');
var patches = [{
  op: 'replace',
  path: '/name',
  value: 'dave'
}];

console.log(toMongodb(patches));
// {'$set': {name: 'dave'}};
```

Example: [with express and mongoose](http://github.com/imlucas/jsonpatch-to-mongodb/tree/master/examples/express)

## Example 2: Add an element to an array

```javascript
var toMongodb = require('jsonpatch-to-mongodb');
var patches = [{
  op: 'add',
  path: '/some-path/names',
  value: ['dave']
}];

console.log(toMongodb(patches));
// "$push": { "some-path/names": { "$each": ["dave"] } }
```

## Install

```
npm install --save jsonpatch-to-mongodb
```

## Test

```
npm test
```

## License

MIT
