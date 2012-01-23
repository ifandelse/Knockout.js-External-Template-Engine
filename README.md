#-->{ BREAKING API CHANGE }<--
This project takes a depdency on a library called infuser.  infuser no longer has an `infuser.config` object.  It has been merged with `infuser.defaults`.


# What Is It

The Knockout.js External Template Engine extends Knockout.js to allow you to load templates asynchronously from a remote resource.
It currently supports both native and jquery templates.  Special thanks to Ryan Niemeyer for the assistance in getting jquery templates working in this version of the plugin.

# Prerequisites
* Knockout.js 2.0 or later (you will need to look at the tagged 1.0 version if you need support for older Knockout.js)
* jQuery 1.5 or later
* jquery-tmpl *only if you are using jquery templates*
* TrafficCop
* infuser

The dependencies listed above are in the ext folder under in the repository.

# How To Use

* In your HTML file, reference jQuery, jquery-tmpl (if you're using jquery templates), knockout.js, TrafficCop, infuser and the koExternalTemplateEngine.js file
* By referencing koExternalTemplateEngine.js, you've automatically overridden the default Knockout.js template engine and added a new template source
* Configure the koExternalTemplateEngine:
    * by default, if your external template files have ".html" as the file extension and live in the same directory as the requesting HTML file, then you can simply reference them by name (for example, "CustomerTemplate" will call down a CustomerTemplate.html file).
    * You can specify a template file suffix (like ".tpl.html") by setting the `infuser.defaults.templateSuffix` value
    * You can specify a template file prefix (like "template_") by setting the `infuser.defaults.templatePrefix` value
    * You can specify a different URL/path to the template files if you prefer to keep them in a different directory than the requesting HTML file by setting the `infuser.defaults.templateUrl` value.
    * You can override the default loading template html by providing your own custom html string to the `infuser.defaults.loadingTemplate.content` property.
    * You can override the default infuser options in any **native** template binding (jquery-tmpl engine does not support overrides at this point).  For example: `<div data-bind="template: { name: 'stats', templateUrl: 'templates/info'}"></div>`
    * You can override `$.ajax` options two ways:
        * Set defaults via `infuser.defaults.ajax` (example: `infuser.defaults.ajax.cache = false`)
        * Set a value in-line via a template binding: `<div data-bind="template: { name: 'stats', templateUrl: 'templates/info', ajax: { cache: false } }"></div>`

See the example folder in the project for more information.  You can run the example by running "node nodetesthost.js" at the root of the repository then browsing to example/native/index.html(assuming you have Node.js installed).
You can also use IIS on Windows if you make the root of the repository a virtual directory and then browse to example/native/index.html.

# Build and Testing Dependencies
This project uses anvil.js (see http://github.com/arobson/anvil.js) for it's build/combine/minify/etc.  To use anvil, you will need Node.js and npm.
Two builds are in this project:

* The default build (driven by the build.json file) outputs the koExternalTemplateEngine.js, koExternalTemplateEngine.min.js & koExternalTemplateEngine.min.gz.js files.  Using this file will require you to include TrafficCop and infuser as separate script includes in your page.
* The "combined" build (driven by the build_combine.json file) outputs koExternalTemplateEngine_all.js, koExternalTemplateEngine_all.min.js & koExternalTemplateEngine_all.min.gz.js - which includes TrafficCop and infuser as part of the output.

To run the build from the command line you do the following (at the project root):

* For the default build: anvil -b 
* For the combined build : anvil -b "build_combined.json"

The test host also requires Node.js and the "express" package (express is located in the node_modules folder).