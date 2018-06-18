/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;

let uuid = require("sdk/util/uuid").uuid();

document.write("Hello World" + "<p/>" + uuid);

console.log("Hello, World!");
window.addEventListener(
  "click",
  () => {
    dump("Click!\n");
  },
  false
);
