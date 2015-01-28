define(['jquery', 'knockout', 'underscore', 'resources', 'async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'], function ($, ko, _, resources) {
    ko.bindingHandlers['map'] = {
        'update': function (element, valueAccessor) {
            var value = _.defaults(valueAccessor(), { lat: 46.474405, lng: 30.739399 })
                $map = $('<div>').appendTo(element),
                position = new google.maps.LatLng(value.lat, value.lng),
                map = new google.maps.Map($map[0], {
                    zoom: 14,
                    scrollwheel: false,
                    center: position,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: resources.GetText('inc_title')
                }),
                info = createInfo();

            if (!_.isUndefined(info)) {
                info.open(map, marker);
                google.maps.event.addListener(marker, 'click', function () { info.open(map, marker); });
            }

            function createInfo() {
                var hasMissResources = _.chain([
                    'inc_title',
                    'contacts_phone_lable',
                    'contacts_email_lable',
                    'contacts_address_lable',
                    'contacts_phone',
                    'contacts_email',
                    'contacts_address_city',
                    'contacts_address_street'])
                    .map(resources.GetText)
                    .any(_.isUndefined)
                    .value();

                if (!hasMissResources) {
                    return new google.maps.InfoWindow({
                        content:
                        '<div class="contacts">' +
                            '<p>' + resources.GetText('inc_title') + '</p>' +
                            '<p><span>' + resources.GetText('contacts_phone_lable') + '</span><span>' + resources.GetText('contacts_phone') + '</span></p>' +
                            '<p><span>' + resources.GetText('contacts_email_lable') + '</span><a href="' + resources.GetUri('contacts_email') + '"><span>' + resources.GetText('contacts_email') + '</span></a></p>' +
                            '<p><span>' + resources.GetText('contacts_address_lable') + '</span><span>' + resources.GetText('contacts_address_city') + '</span>, <span>' + resources.GetText('contacts_address_street') + '</span></p>' +
                        '</div>'
                    });
                }
            }
        }
    };
});
