define(["knockout", "crossroads", "hasher"], function(ko, crossroads, hasher) {

    return new Router({
        routes: [
            { url: '', params: { page: 'business-offer-page' } },
            { url: 'cooperation', params: { page: 'cooperation-offer-page' } },
            { url: 'contacts', params: { page: 'contacts-page' } }
        ]
    });

    function Router(config) {
        this.currentRoute = ko.observable({});
        this.isDestroying = ko.observable(false);
        this.onRouteChanged = _.bind(this.currentRoute, this);

        _init.call(this, config);
    }

    function _init(config) {
        var _this = this;
        ko.utils.arrayForEach(config.routes, function (route) {
            crossroads.addRoute(route.url, function (requestParams) {
                _this.onRouteChanged(ko.utils.extend(requestParams, route.params));
            });
        });

        activateCrossroads();
    }

    function activateCrossroads() {
        function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    }
});