# What Is It

The Knockout.js External Template Engine extends Knockout.js *native* templates to allow you to load them asynchronously from a remote resource.
At this time is does not work with jQuery templates (jquery-tmpl).

# Prerequisites
* Knockout.js 1.3 or later (you will need to look at the tagged 1.0 version if you need support for older Knockout.js)
* jQuery 1.5 or later
* TrafficCop
* infuser

The dependencies listed above are in the ext folder under in the repository.

# How To Use

* In your HTML file, reference jQuery, knockout.js, TrafficCop, infuser and the koExternalTemplateEngine.js file
* By referencing koExternalTemplateEngine.js, you've automatically overridden the default Knockout.js template engine and added a new template source
* Configure the koExternalTemplateEngine:
    * by default, if your external template files have ".html" as the file extension and live in the same directory as the requesting HTML file, then you can simply reference them by name (for example, "CustomerTemplate" will call down a CustomerTemplate.html file).
    * You can specify a template file suffix (like ".tpl.html") by setting the infuser.config.templateSuffix value
    * You can specify a template file prefix (like "template_") by setting the infuser.config.templatePrefix value
    * You can specify a different URL/path to the template files if you prefer to keep them in a different directory than the requesting HTML file by setting the infuser.config.templateUrl value.
    * You can override the default loading template html by providing your own custom html string to the infuser.defaults.loadingTemplate.content property.

See the example folder in the project for more information.  You can run the example by running "node nodetesthost.js" at the root of the repository then browsing to example/native/index.html(assuming you have Node.js installed).
You can also use IIS on Windows if you make the root of the repository a virtual directory and then browse to example/native/index.html.