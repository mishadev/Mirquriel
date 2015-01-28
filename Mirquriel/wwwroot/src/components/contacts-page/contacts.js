define(["knockout", "underscore", "resources", "text!./contacts.html"], function (ko, _, resources, template) {

    function model(context) {
        this.url = function (key) { return resources.GetUri(key); }
        this.hideSplashScreen = function () { hideSplashScreen() };

        var hideSplashScreen = _.partial(_.delay, function () {
            $('.video').addClass('hiding');
            _.delay(function () {
                $('.video').remove();
            }, 500);
        }, 100);
    }

    return { viewModel: model, template: template };
});
