define(['knockout', 'underscore', 'app/serverProxy'], function (ko, _, server) {
    var _resources = ko.observable(null);

    initializaResource();

    return {
        GetText: function (key) {
            if (_.isNull(_resources())) return;

            var text = _resources()['text_' + key];
            if (_.isString(text)) return text;
        },
        GetUri: function (key) {
            if (_.isNull(_resources())) return;

            var text = _resources()['uri_' + key];
            if (_.isString(text)) return text;
        },
        Resources: _resources
    };

    function initializaResource() {
        if (_.isNull(_resources())) {
            server.GetResources()
                .then(function (data) {
                    _resources(data);
                });
        }
    };
});
