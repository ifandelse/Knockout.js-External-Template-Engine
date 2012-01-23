var ExternalTemplateSource = function(templateId, options) {
    var self = this, origAfterRender;
    self.templateId = templateId;
    self.loaded = false;
    self.template = ko.observable(infuser.defaults.useLoadingTemplate ? infuser.defaults.loadingTemplate.content : undefined);
    self.template.data = {};
    self.options = options || {};
    self.options.templateId = templateId;
    if(options.afterRender) {
        origAfterRender = options.afterRender;
        options.afterRender = function() {
            if(self.loaded) {
                origAfterRender();
            }
        }
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