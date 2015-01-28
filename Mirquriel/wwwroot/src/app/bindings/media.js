define(['jquery', 'knockout', 'underscore'], function ($, ko, _) {

    ko.bindingHandlers['audio'] = {
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var apiHost = "http://localhost:57071/";

            if (!$(element).is(':visible'))
                return;

            var audio = $('<audio>'),
                options = ko.unwrap(valueAccessor());

            _.each(options, function (val, name) {
                if (_.isObject(val)) return;
                if (name === 'src') val = /^https?:\/\//i.test(val) && val || apiHost + val;
                audio.prop(name, val);
            });

            if (_.has(options, 'events'))
                _.each(options.events, function (val, name) {
                    if (!_.isFunction(val)) return;

                    var newValueAccessor = function () {
                        var result = {};
                        result[name] = val;
                        return result;
                    };

                    return ko.bindingHandlers['event']['init'].call(this, audio[0], newValueAccessor, allBindings, viewModel, bindingContext);
                });

            $(element).append(audio);
        }
    };

    ko.bindingHandlers['video'] = {
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var options = ko.unwrap(valueAccessor()),
                video = $('<video>'),
                stub = $('<div>').append('<div>');

            if (!video[0].canPlayType && _.has(options, 'events') && _.has(options.events, 'error') && _.isFunction(options.events.error))
                options.events.error();
            
            var apiHost = "http://localhost:57071/";
            if (!$(element).is(':visible'))
                return;

            _.each(options, function (val, name) {
                if (_.isObject(val)) return;
                if (name === 'src') val = /^https?:\/\//i.test(val) && val || apiHost + val;
                video.prop(name, val);
            });

            $(element)
                .append(video)
                .append(stub);

            if (_.has(options, 'events'))
                _.each(options.events, function (val, name) {
                    if (!_.isFunction(val)) return;

                    var newValueAccessor = function () {
                        var result = {};
                        result[name] = val;
                        return result;
                    };

                    return ko.bindingHandlers['event']['init'].call(this, video[0], newValueAccessor, allBindings, viewModel, bindingContext);
                });

            var playing = false;
            video.on('canplay', function (e) {
                stub.addClass('hide');
                playing = true;
            });

            startAnimation(stub.find('div'));
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                _.defer(function () {
                    video[0].pause();
                    video[0].src = '';
                    video[0].load();
                    video.remove();
                });
            });
        }
    };

    function startAnimation(spinner) {
        spinner
            .removeClass('yellow')
            .removeClass('red')
            .removeClass('green');
        _.delay(function () {
            spinner.addClass('yellow');
            _.delay(function () {
                spinner.addClass('red');
                _.delay(function () {
                    spinner.addClass('green');
                    _.delay(function () {
                        startAnimation(spinner);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    };
});
