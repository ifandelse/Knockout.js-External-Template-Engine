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