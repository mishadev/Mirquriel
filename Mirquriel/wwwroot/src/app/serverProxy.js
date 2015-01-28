define(['jquery'], function ($) {
    var apiHost = "http://localhost:57071/";

    return {
        GetResources: getResources
    }

    function getResources() {
        return $.getJSON(apiHost + 'api/resources');
    }
});
