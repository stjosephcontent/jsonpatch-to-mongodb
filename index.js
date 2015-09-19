"use strict"

module.exports = function (patches) {
   var update = {};
   
   // Removing leading slash and convert remainder to dots
   var toDot = function (path) {
      return path.replace(/\//g, '.').replace(/^\./, '');
   }
   
   // Not worth extending prototypes for this simple array check usecase
   var typeIs = function (val) {
      var type = typeof (val);
      if (type === "object" && Object.prototype.toString.call(val) === "[object Array]") {
         type = "array";
      }
      return type;
   }
   
   patches.map(function (p) {
      // Switched (pun intended) to switch http://archive.oreilly.com/pub/a/server-administration/excerpts/even-faster-websites/writing-efficient-javascript.html
      // To-do: Is latest V8 in Node4 performing better for switch statements than it used to? FireFox is apparently very fast.
      switch (p.op) {
         case "add":
            if (typeIs(p.value) === "array") {
               if (!update.$push) {
                  update.$push = {};
               }
               if (!update.$push[toDot(p.path)]) {
                  update.$push[toDot(p.path)] = { $each: [] };
               }
               p.value.forEach(function (v) {
                  update.$push[toDot(p.path)].$each.push(v);
               });
            }
            else {
               if (!update.$set) {
                  update.$set = {};
               }
               update.$set[toDot(p.path)] = p.value;
            }
            break;
         case "remove":
            if (!update.$unset) {
               update.$unset = {};
            }
            update.$unset[toDot(p.path)] = 1;
            break;
         case "replace":
            if (!update.$set) {
               update.$set = {};
            }
            update.$set[toDot(p.path)] = p.value;
            break;
         case "test":
            update[toDot(p.path)] = p.value;
            break;
         default:
            throw new Error("Unsupported Operation! op = " + p.op);
            break;
      }
   });
   return update;
};