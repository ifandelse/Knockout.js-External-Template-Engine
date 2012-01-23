(function($, undefined) {

var inProgress = {};

$.trafficCop = function(url, options) {
    var reqOptions = url, key;
    if(arguments.length === 2) {
        reqOptions = $.extend(true, options, { url: url });
    }
    key = JSON.stringify(reqOptions);
    if(inProgress[key]) {
        inProgress[key].successCallbacks.push(reqOptions.success);
        inProgress[key].errorCallbacks.push(reqOptions.error);
        return;
    }

    var remove = function() {
            delete inProgress[key];
        },
        traffic = {
            successCallbacks: [reqOptions.success],
            errorCallbacks: [reqOptions.error],
            success: function() {
                var args = arguments;
                $.each($(inProgress[key].successCallbacks), function(idx,item){ item.apply(null, args); });
                remove();
            },
            error: function() {
                var args = arguments;
                $.each($(inProgress[key].errorCallbacks), function(idx,item){ item.apply(null, args); });
                remove();
            }
        };
    inProgress[key] = $.extend(true, {}, reqOptions, traffic);
    return $.ajax(inProgress[key]);
};

})(jQuery);

(function($, global, undefined) {
/*
    infuser.js
    Author: Jim Cowart
    License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
    Version 0.1.0
*/
var hashStorage = {
    templates: {},

    storeTemplate: function(templateId, templateContent) {
        this.templates[templateId] = templateContent;
    },

    getTemplate: function(templateId) {
        return this.templates[templateId];
    },

    purge: function() {
        this.templates = {};
    }
};
var scriptStorage = {
    templateIds: [],
    storeTemplate: function(templateId, templateContent) {
        var node = document.getElementById(templateId);
        if(node === null) {
            this.templateIds.push(templateId);
            node = document.createElement("script");
            node.type = "text/html";
            node.id = templateId;
            document.body.appendChild(node);
        }
        node.text = templateContent;
    },

    getTemplate: function(templateId) {
        return document.getElementById(templateId);
    },

    purge: function() {
        for(var i = 0; i < this.templateIds.length; i++) {
            document.body.removeChild(document.getElementById(this.templateIds[i]));
        }
        this.templateIds = [];
    }
};
var errorHtml = "<div class='infuser-error'>The template <a href='{TEMPLATEURL}'>{TEMPLATEID}</a> could not be loaded. {STATUS}</div>",
    returnErrorTemplate = function(status, templateId, templatePath) {
        return errorHtml.replace('{STATUS}', status).replace('{TEMPLATEID}', templateId).replace('{TEMPLATEURL}', templatePath);
    },
    errors = [];
var helpers = {
    getTemplatePath: function(templateOptions) {
        var templateFile = templateOptions.templatePrefix + templateOptions.templateId + templateOptions.templateSuffix;
        return templateOptions.templateUrl === undefined || templateOptions.templateUrl === "" ?
                templateFile : templateOptions.templateUrl + "/" + templateFile;
    },
    templateGetSuccess: function(templateId, callback) {
        return function(response) {
            infuser.store.storeTemplate(templateId, response);
            callback(infuser.store.getTemplate(templateId));
        };
    },
    templateGetError: function(templateId, templatePath, callback) {
        return function(exception) {
            if($.inArray(templateId, errors) === -1) {
                errors.push(templateId);
            }
            var templateHtml = returnErrorTemplate("HTTP Status code: " + exception.status, templateId, templatePath);
            infuser.store.storeTemplate(templateId, templateHtml);
            callback(infuser.store.getTemplate(templateId));
        };
    }
};
var infuser = {
    storageOptions: {
        hash: hashStorage,
        script: scriptStorage
    },

    store: hashStorage,

    defaults: {
        // Template name conventions
        templateUrl: "",
        templateSuffix: ".html",
        templatePrefix: "",
        // AJAX Options
        "async": true,
        "dataType": "html",
        "type": "GET",
        // infuse() specific options - NOT used for "get" or "getSync"
        target:  function(templateId) { return "#" + templateId }, // DEFAULT MAPPING
        loadingTemplate:    {
                                content:        '<div class="infuser-loading">Loading...</div>',
                                transitionIn:   function(target, content) {
                                                    var tgt = $(target);
                                                    tgt.hide();
                                                    tgt.html(content);
                                                    tgt.fadeIn();
                                                },
                                transitionOut:  function(target) {
                                                    $(target).html("");
                                                }
                            },
        postRender:         function(targetElement) { }, // NO_OP effectively by default
        preRender:          function(targetElement, template) { }, // NO_OP effectively by default
        render:             function(target, template) {
                                var tgt = $(target);
                                if(tgt.children().length === 0) {
                                    tgt.append($(template));
                                }
                                else {
                                    tgt.children().replaceWith($(template));
                                }
                            },
        bindingInstruction:  function(template, model) { return template; }, // NO_OP effectively by default
        useLoadingTemplate: true // true/false
    },

    get: function(options, callback) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof options === "object" ? options : { templateId: options })),
            template = this.store.getTemplate(templateOptions.templateId);
        if(!template || $.inArray(templateOptions.templateId, errors) !== -1) {
            templateOptions.url = helpers.getTemplatePath(templateOptions);
            templateOptions.success = helpers.templateGetSuccess(templateOptions.templateId, callback);
            templateOptions.error = helpers.templateGetError(templateOptions.templateId, templateOptions.url, callback);
            $.trafficCop(templateOptions);
        }
        else {
            callback(template);
        }
    },

    getSync: function(options) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof options === "object" ? options : { templateId: options }), { async: false }),
            template = this.store.getTemplate(templateOptions.templateId),
            templateHtml;
        if(!template || $.inArray(templateOptions.templateId, errors) !== -1) {
            templateOptions.url = helpers.getTemplatePath(templateOptions);
            templateHtml = null;
            templateOptions.success = function(response) { templateHtml = response;};
            templateOptions.error = function(exception) {
                if($.inArray(templateOptions.templateId) === -1) {
                    errors.push(templateOptions.templateId);
                }
                templateHtml = returnErrorTemplate("HTTP Status code: exception.status", templateOptions.templateId, templateOptions.url);
            };
            $.ajax(templateOptions);
            if(templateHtml === null) {
                templateHtml = returnErrorTemplate("An unknown error occurred.", templateId, templatePath);
            }
            else {
                this.store.storeTemplate(templateOptions.templateId, templateHtml);
                template = this.store.getTemplate(templateOptions.templateId);
            }
        }
        return template;
    },

    infuse: function(templateId, renderOptions) {
        var templateOptions = $.extend({}, infuser.defaults, (typeof templateId === "object" ? templateId : renderOptions), (typeof templateId === "string" ? { templateId: templateId } : undefined )),
            targetElement = typeof templateOptions.target === 'function' ? templateOptions.target(templateId) : templateOptions.target;
        if(templateOptions.useLoadingTemplate) {
            templateOptions.loadingTemplate.transitionIn(targetElement, templateOptions.loadingTemplate.content);
        }
        infuser.get(templateOptions, function(template) {
            var _template = template;
            templateOptions.preRender(targetElement, _template);
            _template = templateOptions.bindingInstruction(_template, templateOptions.model);
            if(templateOptions.useLoadingTemplate) {
                templateOptions.loadingTemplate.transitionOut(targetElement);
            }
            templateOptions.render(targetElement, _template);
            templateOptions.postRender(targetElement);
        });
    }
};
global.infuser = infuser; })(jQuery, window);

(function(global, ko, jQuery, infuser, undefined) {
// Knockout External Template Engine
// Author: Jim Cowart
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 2.0

var ExternalTemplateSource = function(templateId, options) {
    this.templateId = templateId;
    this.loaded = false;
    this.template = ko.observable(infuser.defaults.loadingTemplate.content);
    this.template.data = {};
    this.options = options || {};
    this.options.templateId = templateId;
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

if (jQuery['tmpl'] && jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
    ko.setTemplateEngine(new KoExternalTemplateEngine(ko.jqueryTmplTemplateEngine));
}
else {
    ko.setTemplateEngine(new KoExternalTemplateEngine());
}
})(window, ko, jQuery, infuser);