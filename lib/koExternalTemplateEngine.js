
// Knockout External Template Engine
// Author: Jim Cowart
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 2.0.5

// This is the 'standard js lib' style version of the KO External Template Engine
// If you need the AMD module version, please go to https://github.com/ifandelse/Knockout.js-External-Template-Engine

(function ( global, ko, jQuery, infuser, undefined ) {

	var ExternalTemplateSource = function(templateId, options) {
	    var self = this, origAfterRender;
	    self.templateId = templateId;
	    self.loaded = false;
	    self.template = ko.observable(infuser.defaults.useLoadingTemplate ? infuser.defaults.loadingTemplate.content : undefined);
	    self.template.data = {};
	    self.options = ko.utils.extend({},options);
	    self.options.templateId = templateId;
	    if(self.options && self.options.afterRender) {
	        origAfterRender = self.options.afterRender;
	        self.options.afterRender = function() {
	            if(self.loaded) {
	                origAfterRender.apply(self.options, arguments);
	            }
	        };
	    }
	};
	
	ko.utils.extend(ExternalTemplateSource.prototype, {
	    data: function(key, value) {
	        if (arguments.length === 1) {
	            if(key === "precompiled") {
	                this.template();
	            }
	            return this.template.data[key];
	        }
	        this.template.data[key] = value;
	    },
	
	    text: function(value) {
	        if (!this.loaded) {
	           this.getTemplate();
	        }
	
	        if (arguments.length === 0) {
	            return this.template();
	        } else {
	           this.template(arguments[0]);
	        }
	    },
	
	    getTemplate: function() {
	        var self = this;
	        infuser.get(self.options, function(tmpl) {
	            self.data("precompiled",null);
	            self.template(tmpl);
	            self.loaded = true;
	        });
	    }
	});
	var KoExternalTemplateEngine = function(koEngineType) {
	    var engine = koEngineType ? new koEngineType() : new ko.nativeTemplateEngine();
	    engine.templates = {};
	    engine.makeTemplateSource = function(template, bindingContext, options) {
	        // Named template
	        if (typeof template == "string") {
	            var elem = document.getElementById(template);
	            if (elem)
	                return new ko.templateSources.domElement(elem);
	            else {
	                if(!engine.templates[template]) {
	                    engine.templates[template] = new ExternalTemplateSource(template, options);
	                }
	                return engine.templates[template];
	            }
	        }
	        else if ((template.nodeType == 1) || (template.nodeType == 8)) {
	            // Anonymous template
	            return new ko.templateSources.anonymousTemplate(template);
	        }
	        
	    };
	
	    engine.renderTemplate = function (template, bindingContext, options) {
	        var templateSource = engine.makeTemplateSource(template, bindingContext, options);
	        return engine.renderTemplateSource(templateSource, bindingContext, options);
	    };
	
	    return engine;
	};
	
	ko.KoExternalTemplateEngine = KoExternalTemplateEngine;
	
	if (jQuery.tmpl && jQuery.tmpl.tag.tmpl.open.toString().indexOf('__') >= 0) {
	    ko.setTemplateEngine(new KoExternalTemplateEngine(ko.jqueryTmplTemplateEngine));
	}
	else {
	    ko.setTemplateEngine(new KoExternalTemplateEngine());
	}

})( window, ko, jQuery, infuser );