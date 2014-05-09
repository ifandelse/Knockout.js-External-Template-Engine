require.config( {
	paths : {
		infuser : 'libs/infuser-amd',
		TrafficCop : 'libs/TrafficCop',
		ko : 'libs/knockout-latest.debug',
		koext: 'libs/koExternalTemplateEngine-amd'
	},
	baseUrl: 'js'
});

require(['jquery', 'infuser', 'ko', 'koext'],function($, infuser, ko, koext){
    
    infuser.defaults.templateUrl = "templates";

    var State = function(name, region, cities) {
            return {
                name: ko.observable(name || ""),
                region: ko.observable(region || ""),
                cities: ko.observableArray(cities || [])
            }
        },
        City = function(name, stats) {
            this.name = ko.observable(name || "");
            this.stats = ko.observableArray(stats || []);
            this.img = ko.dependentObservable(function(){
                return "img/" + this.name() + ".jpg";
            }, this);
            this.template = ko.observable("stat_view");
            this.toggleTemplate= function() {
                var self = this;
                if(self.template() === 'stat_view') {
                    this.template("stat_edit");
                }
                else {
                    this.template("stat_view");
                }
            };
            this.editing = ko.observable(false);
        },
        Statistic = function(name, value) {
            this.name = ko.observable(name || "");
            this.value = ko.observable(value || "");
            this.editing = ko.observable(false);
            this.toggleEdit = function() {
                var self = this;
                self.editing(!self.editing());
            }
        },
        viewModel = {
            states: [
                new State("Tennessee", "Southeast", [
                    new City("Nashville", [
                        new Statistic("Population", "749,935"),
                        new Statistic("Mayor" ,"Karl Dean")
                    ]),
                    new City("Franklin", [
                        new Statistic("Population", "62,487"),
                        new Statistic("Mayor" ,"Ken Moore")
                    ]),
                    new City("Brentwood", [
                        new Statistic("Population", "37,060"),
                        new Statistic("Mayor" ,"Paul Webb")
                    ]),
                    new City("Murfreesboro", [
                        new Statistic("Population", "108,755"),
                        new Statistic("Mayor" ,"Tommy Bragg")
                    ])
                ]),
                new State("Georgia", "Southeast", [
                    new City("Atlanta", [
                        new Statistic("Population", "3,500,000"),
                        new Statistic("Mayor" ,"Kasim Reed")
                    ]),
                    new City("Snellville", [
                        new Statistic("Population", "18,242"),
                        new Statistic("Mayor" ,"Jerry Oberholtzer")
                    ])
                ]),
                new State("Ohio", "Mid-West", [
                    new City("Columbus", [
                        new Statistic("Population", "1,100,000"),
                        new Statistic("Mayor" ,"Michael B. Coleman")
                    ])
                ]),
            ]
        };

    ko.applyBindings(viewModel);
});