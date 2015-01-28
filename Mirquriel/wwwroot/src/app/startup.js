define(['jquery', 'knockout', 'underscore', 'router', './menu', 'knockout-projections', './bindings', './fixes', 'font!google,families:[Roboto:300,500,EB+Garamond:400,Source+Sans+Pro:300,Roboto+Slab:300]'], function ($, ko, _, router, menu) {

    //pages
    ko.components.register('business-offer-page', { require: 'components/business-offer-page/business-offer' });
    ko.components.register('cooperation-offer-page', { require: 'components/cooperation-offer-page/cooperation-offer' });
    ko.components.register('contacts-page', { require: 'components/contacts-page/contacts' });

    //components
    ko.components.register('menu-bar', { template: { require: 'text!components/menu-bar/menu-bar.html' } });
    ko.components.register('loading', { require: 'components/loading/loading' });

    var viewModel = {
        menu: menu,
        route: router.currentRoute,
        page: { isDestroying: router.isDestroying }
    };

    ko.applyBindings(viewModel);
});
