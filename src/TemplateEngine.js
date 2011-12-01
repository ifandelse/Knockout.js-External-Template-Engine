var KoExternalTemplateEngine = function(koEngineType) {
    var engine = koEngineType ? new koEngineType() : new ko.nativeTemplateEngine();
    engine.templates = {};
    engine.makeTemplateSource = function(template) {
        // Named template
        if (typeof template == "string") {
            var elem = document.getElementById(template);
            if (elem)
                return new ko.templateSources.domElement(elem);
            else {
                if(!engine.templates[template]) {
                    engine.templates[template] = new ExternalTemplateSource(template);
                }
                return engine.templates[template];
            }
        }
        else if ((template.nodeType == 1) || (template.nodeType == 8)) {
            // Anonymous template
            return new ko.templateSources.anonymousTemplate(template);
        }
        
    };
    return engine;
};