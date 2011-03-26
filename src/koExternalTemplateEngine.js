/**
 * Created by Jim Cowart/Steve Sanderson
 * Date: 3/22/11
 * Time: 2:30 PM
 */
 
(function($,ko,undefined){
	if(ko === undefined)
	{
		throw "You must reference Knockout.js in order for the ko.externaljQueryTemplateEngine to work.";
	}
	else
	{
		ko.externaljQueryTemplateEngine = function () {
			// Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
			// doesn't expose a version number, so we have to infer it.
			jQueryTmplVersion = (function() {
				if ($ === undefined || !$.tmpl)
					return 0;
				// Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
				if ($.tmpl.tag) {
					if ($.tmpl.tag.tmpl && $.tmpl.tag.tmpl.open) {
						if ($.tmpl.tag.tmpl.open.toString().indexOf('__') >= 0) {
							return 3; // Since 1.0.0pre, custom tags should append markup to an array called "__"
						}
					}
					return 2; // Prior to 1.0.0pre, custom tags should append markup to an array called "_"
				}
				return 1; // Very old version doesn't have an extensible tag system
			})();

			// These two only needed for jquery-tmpl v1
			var aposMarker = "__ko_apos__";
			var aposRegex = new RegExp(aposMarker, "g");

			// By default templates are pulled from the same server path as the html file making the request.
			// If you keep your templates in a separate directory, specify it here as a relative path to the html document making the request
			// For example, /Templates for a sub dir, or ../Templates for going up a dir level and dropping into a Templates folder
			var templateUrl = "",

			//  We want to be able to apply any naming conventions you have for your template resource files without cluttering the name itself up.
			//  So, if you have a convention to name your templates with a ".tpl.html" extension/suffix, then specify ".tpl.html" here
			templateSuffix = ".html",

			//  If you prefer to prefix your templates with a convention, specify it here.
			templatePrefix = "",

			//  Allows you to use a default "error" template to display when templates cannot be found.
			//  If you choose to not use the default error template, a js error will be thrown - be sure to use Chrome or Firefox's debugging tools to catch this!
			useDefaultErrorTemplate = true,

			// The html of the template to use for the default error template
			// Keep in mind this is a 'public' member, so you can override this with your own default error template.
			defaultErrorTemplateHtml = "<div style='font-style: italic;'>The template could not be loaded.  HTTP Status code: {STATUSCODE}.</div>",

			//  This function is the primary difference between the normal KO jQuery template engine and the external template version.
			//  Since we are lazy-loading templates on-demand, they don't exist in the DOM yet.  We make a request to the server
			//  for the static resource and then place the contents in a new <script> tag, with the id attribute set to the templateId.
			//  That way, the remaining logic behind the default KO jQuery template engine works as if the template existed in the
			//  DOM the entire time.
			getTemplateNode = function (templateId, templatePath) {
				var node = document.getElementById(templateId);
				if(node == null)
				{
					var templateHtml = null;
					$.ajax({
						url:templatePath,
						async: false,
						dataType: "html",
						type: "GET",
						"success": function(response) { templateHtml = response;},
						"error": function(exception) {
							if(useDefaultErrorTemplate)
								templateHtml = defaultErrorTemplateHtml.replace('{STATUSCODE}', exception.status);
						}.bind(this)
					})

					if(templateHtml === null)
						throw new Error("Cannot find template with ID=" + templateId);

					var node = document.createElement('script');
					node.setAttribute('type','text/html');
					node.setAttribute('id', templateId);
					node.text = templateHtml;
					document.body.appendChild(node);
				}
				return node;
			},

			getTemplatePath = function(templateId) {
				var templateFile = templatePrefix + templateId + templateSuffix;
				var templateSrc = templateUrl === undefined || templateUrl == "" ? templateFile : templateUrl + "/" + templateFile;
				return templateSrc;
			},

			renderTemplate = function (templateId, data, options) {
				options = options || {};
				if (jQueryTmplVersion == 0)
					throw new Error("jquery.tmpl not detected.\nTo use the External jQuery Template Engine, reference jQuery and jquery.tmpl. See Knockout installation documentation for more details.");

				if (jQueryTmplVersion == 1) {
					// jquery.tmpl v1 doesn't like it if the template returns just text content or nothing - it only likes you to return DOM nodes.
					// To make things more flexible, we can wrap the whole template in a <script> node so that jquery.tmpl just processes it as
					// text and doesn't try to parse the output. Then, since jquery.tmpl has jQuery as a dependency anyway, we can use jQuery to
					// parse that text into a document fragment using jQuery.clean().
					var templateTextInWrapper = "<script type=\"text/html\">" + getTemplateNode(templateId, getTemplatePath(templateId)).text + "</script>";
					var renderedMarkupInWrapper = $.tmpl(templateTextInWrapper, data);
					var renderedMarkup = renderedMarkupInWrapper[0].text.replace(aposRegex, "'");;
					return $.clean([renderedMarkup], document);
				}

				// It's easier with jquery.tmpl v2 and later - it handles any DOM structure
				if (!(templateId in $.template)) {
					// Precache a precompiled version of this template (don't want to reparse on every render)
					var templateText = getTemplateNode(templateId, getTemplatePath(templateId)).text;
					$.template(templateId, templateText);
				}
				data = [data]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays

				var resultNodes = 
					$.tmpl(templateId, data, options['templateOptions']).
					appendTo(document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work
				$.fragments = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
				return resultNodes;
			},

			isTemplateRewritten = function (templateId) {
				// It must already be rewritten if we've already got a cached version of it
				// (this optimisation helps on IE < 9, because it greatly reduces the number of getElementById calls)
				if (templateId in $.template)
					return true;

				return getTemplateNode(templateId, getTemplatePath(templateId)).isRewritten === true;
			},

			rewriteTemplate = function (templateId, rewriterCallback) {
				var templateNode = getTemplateNode(templateId, getTemplatePath(templateId));
				var rewritten = rewriterCallback(templateNode.text);

				if (jQueryTmplVersion == 1) {
					// jquery.tmpl v1 falls over if you use single-quotes, so replace these with a temporary marker for template rendering,
					// and then replace back after the template was rendered. This is slightly complicated by the fact that we must not interfere
					// with any code blocks - only replace apos characters outside code blocks.
					rewritten = ko.utils.stringTrim(rewritten);
					rewritten = rewritten.replace(/([\s\S]*?)(\${[\s\S]*?}|{{[\=a-z][\s\S]*?}}|$)/g, function(match) {
						// Called for each non-code-block followed by a code block (or end of template)
						var nonCodeSnippet = arguments[1];
						var codeSnippet = arguments[2];
						return nonCodeSnippet.replace(/\'/g, aposMarker) + codeSnippet;
					});
				}

				templateNode.text = rewritten;
				templateNode.isRewritten = true;
			},

			createJavaScriptEvaluatorBlock = function (script) {
				if (jQueryTmplVersion == 1)
					return "{{= " + script + "}}";

				// From v2, jquery-tmpl does some parameter parsing that fails on nontrivial expressions.
				// Prevent it from messing with the code by wrapping it in a further function.
				return "{{ko_code ((function() { return " + script + " })()) }}";
			},

			addTemplate = function (templateId, templateMarkup) {
				document.write("<script type='text/html' id='" + templateId + "'>" + templateMarkup + "</script>");
			}

			if (jQueryTmplVersion > 1) {
				$.tmpl.tag.ko_code = {
					open: (jQueryTmplVersion < 3 ? "_" : "__") + ".push($1 || '');"
				};
			}
		};
	}
	ko.externaljQueryTemplateEngine.prototype = new ko.templateEngine();
	// Giving you an easy handle to set member values like templateUrl, templatePrefix and templateSuffix.
	externaljQueryTemplateEngine = new ko.externaljQueryTemplateEngine();
	 // overrides the default template engine KO normally wires up.
	ko.setTemplateEngine(externaljQueryTemplateEngine);
})(jQuery,ko);