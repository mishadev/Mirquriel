define(['jquery', 'knockout', 'underscore', 'scrollbar'], function ($, ko, _, resources) {
    ko.bindingHandlers['scrollable'] = {
        'init': function (element, valueAccessor) {
            var $element = $(element);

            $element.append(
                $('<div class="viewport">').append(
                    $('<div class="overview">').append(
                        $element.children()
                    )
                )
            );
            $element.prepend(
                $('<div class="scrollbar">').append(
                    $('<div class="track">').append(
                        $('<div class="thumb">').append(
                            $('<div class="end">')
                        )
                    )
                )
            );
            $(element).tinyscrollbar(valueAccessor());
            var plugin = $(element).data('plugin_tinyscrollbar');

            $(element).change(function () {
                plugin.update();
            });
        },
        'update': function (element, valueAccessor) {
            var plugin = $(element).data('plugin_tinyscrollbar');
            if (_.isObject(plugin))
                plugin.update();
        }
    };
});
