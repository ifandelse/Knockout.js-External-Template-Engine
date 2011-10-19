# What Is It

The Knockout.js External Template Engine extends the original Knockout.js jQuery template engine to allow you to load external templates.
Knockout.js is a powerful MVVM framework for building web apps using HTML/JavaScript/CSS.

# Prerequisites
* Knockout.js 1.2.0pre or later
* jQuery 1.5 or later
* jquery.tmpl.js (jQuery templating)

# How To Use

* In your HTML file, reference jQuery, jquery.tmpl, knockout.js and the koExternalTemplateEngine.js file
* By referencing koExternalTemplateEngine.js, you've automatically overridden the default Knockout.js template engine
* Configure the koExternalTemplateEngine:
    * by default, if your external template files have ".html" as the file extension and live in the same directory as the requesting HTML file, then you can simply reference them by name (for example, "CustomerTemplate" will call down a CustomerTemplate.html file).
    * You can specify a template file suffix (like ".tpl.html") by setting the koExternalTemplateEngine.templateSuffix value
    * You can specify a template file prefix (like "template_") by setting the koExternalTemplateEngine.templatePrefix value
    * You can specify a different URL/path to the template files if you prefer to keep them in a different directory than the requesting HTML file by setting the koExternalTemplateEngine.templateUrl value.
    * You can choose to turn off the default error template by setting koExternalTemplateEngine.useDefaultErrorTemplate to false (it defaults to true)
    * You can override the default error template html by providing your own custom html string to the koExternalTemplateEngine.defaultErrorTemplateHtml property.

# Get Going!
Thanks to Steve Sanderson's hard work, nested templates already worked in Knockout.js, and by extension, my external template engine plugin for Knockout.js supports nested templates as well.

# Oh, and One More Thing
"Why are you using the object['function'] syntax so much??"
Answer: Because the minifier being used won't minify function calls expressed that way.  This keeps me from breaking calls to the jQuery or Knockout.js APIs, etc.
