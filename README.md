# Version 2.0.5

(MIT License)
________
##THIS PROJECT HAS BEEN **RETIRED**!
###(Do you want it?)
My sincerest apologies to everyone who has been waiting on some kind of response to issues and/or PRs on this project. Writing open source software is something I love to do - but the unfortunate reality is that I only have so much time to spread between my various projects after I focus on the [things](http://instagram.com/p/ZN_0-DCAby/) [that](http://instagram.com/p/aXfZ_AiAT2/) [matter](http://instagram.com/p/jtDCDgCAVE/) [the most](http://instagram.com/p/nYXz4cCAbP/) to me. I'm no longer using KnockoutJS on a daily basis (haven't been for a while), and if I were on a KO project, I'd be using [RequireJS and an approach like what my friend Ryan Niemeyer recommends](http://www.knockmeout.net/2013/05/knockout-amd-helpers-plugin.html) (to load external templates). This template engine extension was created for an *internal intranet* site where multiple round trips and non-bundling of dependencies wasn't really a problem. If you are building public facing sites, I *highly* recommend looking at Ryan's recommendations, and use a more substantial loader & module setup (like RequireJS), or have a build step that concats your templates into your host page(s) before deployment, etc.

If you are an *active* member of the KO OSS "community", and want to take over this project, I'm happy to hand it off to you. Just get in touch with me on [twitter](https://twitter.com/ifandelse) to start the conversation.

You can read the long-overdue blog on retiring this project here: [Know When to Walk Away](http://ifandelse.com/know-when-to-walk-away/).
________

## What Is It

The Knockout.js External Template Engine extends Knockout.js to allow you to load templates asynchronously from a remote resource.
It currently supports both native and jquery templates.  Special thanks to Ryan Niemeyer for the assistance in getting jquery templates working in this version of the plugin.

## Prerequisites
* Knockout.js 2.0 or later (you will need to look at the tagged 1.0 version if you need support for older Knockout.js)
* jQuery 1.5 or later
* jquery-tmpl *only if you are using jquery templates*
* TrafficCop
* infuser

The dependencies listed above are in the ext folder under in the repository.

> Note: This project takes a depdency on a library called infuser.  infuser no longer has an `infuser.config` object.  It has been merged with `infuser.defaults`.

## How To Use

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

See the example folder in the project for more information (& see below for how to run the examples).
You can also use IIS on Windows if you make the root of the repository a virtual directory and then browse to example/{subfolder of choice}.

## Build Dependencies
This project uses [anvil.js](http://appendTo.github.com/anvil.js) for it's build/combine/minify/etc.  To use anvil, you will need Node.js and npm.
Three build outputs are produced in this project:

1) The default build creates the koExternalTemplateEngine.js & koExternalTemplateEngine.min.js files.  Using either of these files will require you to include TrafficCop and infuser as separate script includes in your page.
2) The "combined" build creates koExternalTemplateEngine_all.js & koExternalTemplateEngine_all.min.js - which includes TrafficCop and infuser as part of the output.
3) The "amd" build creates an amd-style module of just the koExternalTemplateEngine.js file - creating koExternalTemplateEngine-amd.js & koExternalTemplateEngine-amd.min.js.

To run the build from the command line you do the following (at the project root): `anvil -b`

To run the examples, run `anvil --host`.  Examples will be accessible by going to http://localhost:3080/example under the following sub-folders:

* jquery
* jqueryWithOptions
* native
* native-nested-alt-locations
* native2

Examples using the AMD module version can be found under http://localhost:3080/example/amd, in the following folders:

* native
* native-nested-alt-locations
* native2
