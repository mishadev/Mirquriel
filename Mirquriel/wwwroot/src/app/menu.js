define(['jquery', 'knockout', 'underscore'], function ($, ko, _) {

    var menu = {
        isMenuOpened: ko.observable(false),
        isHintActive: ko.observable(false)
    };

    menu.toggleMenu = function (state) {
        if (!_.isBoolean(state))
            state = !menu.isMenuOpened();

        _.delay(_.partial(menu.isMenuOpened, state), 50);
    }

    menu.hint = function () {
        if (!menu.isMenuOpened() && !menu.isHintActive()){
            menu.isHintActive(true);
            _.delay(_.partial(menu.isHintActive, false), 300);
        }
    }

    return menu;
});
