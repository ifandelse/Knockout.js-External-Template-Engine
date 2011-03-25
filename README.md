# What Is It

The Knockout.js External Template Engine extends the original Knockout.js jQuery template engine to allow you to load external templates.
PLEASE go check out knockoutjs.com.  Knockout.js is a powerful MVVM framework for building web apps using HTML/JavaScript/CSS.
Many kudos and high fives to Steve Sanderson for creating such a clean and powerful framework!

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
* "Why are you using the object['function'] syntax so much??"
  Answer: Because the minifier being used won't minify function calls expressed that way.  This keeps me from breaking calls to the jQuery or Knockout.js APIs, etc.

* "Umm....I use Knockout.js and I could _swear_ a lot of this code looks familiar...?"
  Answer: Because it _IS_. :-)  Steve Sanderson's code works great as-is.  I just wanted to mod some specific functions to enable the template engine to query for templates
  that didn't already exist in the DOM.  Steve made it super easy for me to modify targeted sections of his original template engine.  He did the leg work and simply handed
  the baton to me right at the finish line.  We all stand on the shoulders of giants.

* "I really want to see an example..."
  Answer: Glad you asked.  While my example is fairly rudimentary, it does utilize 3 templates (they are nested hierarchically) - none of which are delivered as part of the original response.
  Download the repo and browse to the "example" folder and look at "Index.html".  To _see_ this in action, create virtual directory on your local web server that points to the "example" directory.

* "Your example doesn't look so nice in IE."
  Answer: .....cricket.......cricket.  No, seriously, if a tree falls on IE in the forest, does anyone care?