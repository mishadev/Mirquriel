define(['knockout', 'underscore', 'resources'], function (ko, _, resources) {
    ko.bindingHandlers['textresource'] = {
        'update': function (element, valueAccessor) {
            var text = resources.GetText(ko.unwrap(valueAccessor()));
            if (_.isString(text))
                ko.bindingHandlers['html']['update'](element, function () { return text; });

            $(element).change();
        }
    };
});
