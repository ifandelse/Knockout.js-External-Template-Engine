$(function() {
    infuser.defaults.templateUrl = "templates";
    //infuser.defaults.templatePrefix = "SomePrefix"
    //infuser.defaults.templateSuffix = "SomeSuffix"

    function State(id, name, cities) {
        return {
            id: ko.observable(id),
            name: ko.observable(name),
            cities: ko.observableArray(cities || ["Dunno"]),
	        afterRenderCallback: function(elem, model) {
		        if($(elem).is(".infuser-loading")) {
			        console.log("afterAdd invoked but this is still the loading template");
		        }
		        else {
		            console.log("afterAdd invoked for " + model.name + ", " + name + ".  This is the real template.");
			        if($(elem).find("strong").text() === "Chattanooga") {
				        $(elem).find("strong").html("<a href='http://www.chattanoogafun.com/' alt='O Hai, Chattanooga' target='_blank'>Chattanooga</a>");
			        }
		        }
	        }
        }
    }
    var viewModel = {
        isEditable: ko.observable(false),
        items: ko.observableArray([
                new State(1, "Tennessee", [
                    {name: "Nashville"}, {name: "Chattanooga"}, {name: "Franklin"}, {name: "Spring Hill"}, {name: "Signal Mountain"}
                ]),
                new State(2, "Georgia", [
                    {name: "Atlanta"}, {name: "Savannah"}, {name: "Snellville"}, {name: "Stone Mountain"}
                ]),
                new State(3, "Texas", [
                    {name: "Dallas"}, {name: "Austin"}, {name: "Houston"}, {name: "San Antonio"}, {name: "Katy"}
                ])
            ]),
        whichTemplateToUse: function() {
            return viewModel.isEditable() ? 'edit' : 'view';
        }
    };

    ko.applyBindings(viewModel);
});