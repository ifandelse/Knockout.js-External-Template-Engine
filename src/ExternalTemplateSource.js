var ExternalTemplateSource = function(templateId) {
    this.templateId = templateId;
    this.loaded = false;
    this.template = ko.observable(infuser.defaults.loadingTemplate.content);
    this.template.data = {};
};

ko.utils.extend(ExternalTemplateSource.prototype, {
    data: function(key, value) {
        if (arguments.length === 1) {
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
        infuser.get(self.templateId, function(tmpl) {
            self.template(tmpl);
            self.loaded = true;
        });
    }
});