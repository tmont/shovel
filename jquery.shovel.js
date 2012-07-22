(function(window, document, $) {

	var pushStateSupported = window.history && !!window.history.pushState;
	var ns = 'shovel';
	var routeCount = 0;
	var routeTable = {
		verbatim: {},
		regex: [],
		lookup: []
	};

	function findRoute(url) {
		var route;
		if (routeTable.verbatim[url]) {
			route = routeTable.verbatim[url];
		} else {
			for (var i = 0; i < routeTable.regex.length; i++) {
				if (routeTable.regex[i].url.test(url)) {
					route = routeTable.regex[i];
					break;
				}
			}
		}

		return route;
	}

	$.shovel = {
		enable: function() {
			if (!pushStateSupported) {
				return;
			}

			$(window).on('popstate.' + ns, function(e) {
				var state = e.originalEvent.state;
				var route, url = window.location.pathname;
				if (state.routeId) {
					route = routeTable.lookup[state.routeId];
					url = state.url;
				} else {
					route = findRoute(url);
				}

				if (!route) {
					return;
				}

				route.execute(url, 'popstate');
			});

			$(document).on('click.' + ns, 'a:not([data-no-shovel])', function(e) {
				var $anchor = $(this);
				var url = $anchor.attr('href');
				var route = findRoute(url);

				if (!route) {
					return true;
				}

				e.preventDefault();

				window.history.pushState(
					{ url: url, routeId: route.id },
					route.title || '',
					url
				);

				route.execute(url, this);
			});
		},

		disable: function() {
			$(document).off('click.' + ns, 'a');
			$(window).off('popstate.' + ns);
		},

		addRoute: function(url, handlers, title) {
			if (Object.prototype.toString.call(handlers) !== '[object Array]') {
				handlers = [ handlers ];
			}

			var route = {
				id: ++routeCount,
				title: title || '',
				url: url,
				execute: function(url, catalyst) {
					var params = [];
					if (this.url instanceof RegExp) {
						params = (this.url.exec(url) || [, ]).slice(1);
					}
					for (var i = 0; i < handlers.length; i++) {
						if (handlers[i].call(this, url, params, catalyst) === false) {
							break;
						}
					}
				}
			};

			if (url instanceof RegExp) {
				routeTable.regex.push(route);
			} else {
				routeTable.verbatim[url] = route;
			}

			routeTable.lookup[route.id] = route;

			return route;
		}
	};

}(window, document, jQuery));