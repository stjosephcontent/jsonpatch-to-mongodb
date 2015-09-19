"use strict"

var assert = require("assert");
var toMongodb = require("../");
var chai = require("chai");

describe("jsonpatch to mongodb", function () {
   
   it("should work with a single add to a string property", function () {
      var patches = [{
            op: "add",
            path: "/name1/name2",
            value: "dave"
         }];
      var expected = {
         "$set": {
            "name1.name2": "dave"
         }
      };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should work with a single add to an array property", function () {
      var patches = [{
            op: "add",
            path: "/name/name",
            value: ["dave"]
         }];
      var expected = {
         "$push": {
            "name.name": { "$each": ["dave"] }
         }
      };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should work with a single add to an object property", function () {
      var patches = [{
            op: "add",
            path: "/first/second",
            value: { "mary": { "had": "lamb" } }
         }];
      var expected = {
         "$set": {
            "first.second": { "mary": { "had": "lamb" } }
         }
      }
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   
   it("should work with multiple adds to an array property", function () {
      var patches = [{
            op: "add",
            path: "/names",
            value: ["dave"]
         }, {
            op: "add",
            path: "/names",
            value: ["bob"]
         }, {
            op: "add",
            path: "/names",
            value: ["john"]
         }];
      var expected = {
         "$push": {
            "names": { "$each": ["dave", "bob", "john"] }
         }
      };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should work with multiple adds to a string property", function () {
      // This means we are adding/overwriting to the same property so last one wins!
      var patches = [{
            op: "add",
            path: "/name",
            value: "dave"
         }, {
            op: "add",
            path: "/name",
            value: "bob"
         }, {
            op: "add",
            path: "/name",
            value: "john"
         }];
      var expected = {
         "$set": {
            "name": "john"
         }
      };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should work with remove", function () {
      var patches = [{
            op: "remove",
            path: "/name",
            value: "dave"
         }];
      var expected = {
         $unset: {
            name: 1
         }
      };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should work with replace", function () {
      var patches = [{
            op: "replace",
            path: "/name",
            value: "dave"
         }];
      var expected = {
         $set: {
            name: "dave"
         }
      };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should work with test", function () {
      var patches = [{
            op: "test",
            path: "/name",
            value: "dave"
         }];
      var expected = { "name": "dave" };
      
      assert.deepEqual(toMongodb(patches), expected);
   });
   
   it("should blow up on move", function () {
      var patches = [{
            op: "move",
            path: "/name",
            from: "/old_name"
         }];
      
      chai.expect(function () { toMongodb(patches) }).to.throw("Unsupported Operation! op = move");
   });
   
   it("should blow up on copy", function () {
      var patches = [{
            op: "copy",
            path: "/name",
            from: "/old_name"
         }];
      
      chai.expect(function () { toMongodb(patches) }).to.throw("Unsupported Operation! op = copy");
   });
});