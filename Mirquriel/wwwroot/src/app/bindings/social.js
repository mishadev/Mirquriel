define(['jquery', 'knockout', 'underscore', 'resources'], function ($, ko, _, resources) {
    ko.bindingHandlers['social'] = {
        'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var uri = resources.GetUri(ko.unwrap(valueAccessor()));

            if (_.isUndefined(uri))
                return;

            return $(element).is('a') ?
                ko.bindingHandlers['attr']['update'](element, function () { return { target: '_blank', href: uri } }, allBindings) :
                ko.bindingHandlers['click']['init'].call(this, element, function () {
                    return function () { _.isFunction(window.open) ? window.open(uri) : (window.location.href = uri); };
                }, allBindings, viewModel, bindingContext);
        }
    };
});
