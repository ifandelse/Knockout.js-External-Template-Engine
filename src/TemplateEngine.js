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