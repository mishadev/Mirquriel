define(["knockout", "underscore", 'router', 'resources', "text!./loading.html"], function (ko, _, router, resources, template) {

    function model(context) {
        router._onRouteChanged = router.onRouteChanged;
        router.onRouteChanged = _.partial(loading, context.menu);

        initPreloader();

        loading(context.menu);
    }

    function loading(menu, route) {
        router.isDestroying(true);
        _.delay(function () {
            _.isObject(route) && router._onRouteChanged(route);
            _.delay(function () {
                router.isDestroying(false);
                _.delay(function () {
                    menu.toggleMenu(false);
                }, 50);
            }, 100);
        }, 200);

        runLoadingBar();
    }

    function runLoadingBar() {
        $('.loading-bar div')
            .animate({ width: '100%' },
            {
                queue: false,
                duration: 1000,
                easing: "swing",
                always: function () { $('.loading-bar div').width(0); }
            });
    }

    function initPreloader() {
        var hidePreloaderAfter = _.partial(_.delay, function () {
            $('.preloader').addClass('hiding');
            _.delay(function () {
                $('.preloader').remove();
            }, 500);
        });

        if (ko.isSubscribable(resources.Resources))
            var subscription = resources.Resources.subscribe(function () {
                hidePreloaderAfter(500)
                subscription.dispose();
            });
        hidePreloaderAfter(1000);
    }

    return { viewModel: model, template: template };
});
