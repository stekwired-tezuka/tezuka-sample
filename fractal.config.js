"use strict";

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = (module.exports = require("@frctl/fractal").create());

/* Set the title of the project */
fractal.set("project.title", "sample");

/* Tell Fractal where the components will live */
fractal.components.set("path", "fractal/components");

/* Tell Fractal where the documentation pages will live */
fractal.docs.set("path", "fractal/docs");

/* Tell the Fractal web preview plugin where to look for static assets. */
fractal.web.set("static.path", "fractal/public");
