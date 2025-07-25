/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function () { "use strict"; function t (o) { if (!o) throw new Error("No options passed to Waypoint constructor"); if (!o.element) throw new Error("No element option passed to Waypoint constructor"); if (!o.handler) throw new Error("No handler option passed to Waypoint constructor"); this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({ name: this.options.group, axis: this.axis }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[ this.options.offset ] && (this.options.offset = t.offsetAliases[ this.options.offset ]), this.group.add(this), this.context.add(this), i[ this.key ] = this, e += 1 } var e = 0, i = {}; t.prototype.queueTrigger = function (t) { this.group.queueTrigger(this, t) }, t.prototype.trigger = function (t) { this.enabled && this.callback && this.callback.apply(this, t) }, t.prototype.destroy = function () { this.context.remove(this), this.group.remove(this), delete i[ this.key ] }, t.prototype.disable = function () { return this.enabled = !1, this }, t.prototype.enable = function () { return this.context.refresh(), this.enabled = !0, this }, t.prototype.next = function () { return this.group.next(this) }, t.prototype.previous = function () { return this.group.previous(this) }, t.invokeAll = function (t) { var e = []; for (var o in i) e.push(i[ o ]); for (var n = 0, r = e.length; r > n; n++)e[ n ][ t ]() }, t.destroyAll = function () { t.invokeAll("destroy") }, t.disableAll = function () { t.invokeAll("disable") }, t.enableAll = function () { t.Context.refreshAll(); for (var e in i) i[ e ].enabled = !0; return this }, t.refreshAll = function () { t.Context.refreshAll() }, t.viewportHeight = function () { return window.innerHeight || document.documentElement.clientHeight }, t.viewportWidth = function () { return document.documentElement.clientWidth }, t.adapters = [], t.defaults = { context: window, continuous: !0, enabled: !0, group: "default", horizontal: !1, offset: 0 }, t.offsetAliases = { "bottom-in-view": function () { return this.context.innerHeight() - this.adapter.outerHeight() }, "right-in-view": function () { return this.context.innerWidth() - this.adapter.outerWidth() } }, window.Waypoint = t }(), function () { "use strict"; function t (t) { window.setTimeout(t, 1e3 / 60) } function e (t) { this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = { x: this.adapter.scrollLeft(), y: this.adapter.scrollTop() }, this.waypoints = { vertical: {}, horizontal: {} }, t.waypointContextKey = this.key, o[ t.waypointContextKey ] = this, i += 1, n.windowContext || (n.windowContext = !0, n.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler() } var i = 0, o = {}, n = window.Waypoint, r = window.onload; e.prototype.add = function (t) { var e = t.options.horizontal ? "horizontal" : "vertical"; this.waypoints[ e ][ t.key ] = t, this.refresh() }, e.prototype.checkEmpty = function () { var t = this.Adapter.isEmptyObject(this.waypoints.horizontal), e = this.Adapter.isEmptyObject(this.waypoints.vertical), i = this.element == this.element.window; t && e && !i && (this.adapter.off(".waypoints"), delete o[ this.key ]) }, e.prototype.createThrottledResizeHandler = function () { function t () { e.handleResize(), e.didResize = !1 } var e = this; this.adapter.on("resize.waypoints", function () { e.didResize || (e.didResize = !0, n.requestAnimationFrame(t)) }) }, e.prototype.createThrottledScrollHandler = function () { function t () { e.handleScroll(), e.didScroll = !1 } var e = this; this.adapter.on("scroll.waypoints", function () { (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t)) }) }, e.prototype.handleResize = function () { n.Context.refreshAll() }, e.prototype.handleScroll = function () { var t = {}, e = { horizontal: { newScroll: this.adapter.scrollLeft(), oldScroll: this.oldScroll.x, forward: "right", backward: "left" }, vertical: { newScroll: this.adapter.scrollTop(), oldScroll: this.oldScroll.y, forward: "down", backward: "up" } }; for (var i in e) { var o = e[ i ], n = o.newScroll > o.oldScroll, r = n ? o.forward : o.backward; for (var s in this.waypoints[ i ]) { var a = this.waypoints[ i ][ s ]; if (null !== a.triggerPoint) { var l = o.oldScroll < a.triggerPoint, h = o.newScroll >= a.triggerPoint, p = l && h, u = !l && !h; (p || u) && (a.queueTrigger(r), t[ a.group.id ] = a.group) } } } for (var c in t) t[ c ].flushTriggers(); this.oldScroll = { x: e.horizontal.newScroll, y: e.vertical.newScroll } }, e.prototype.innerHeight = function () { return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight() }, e.prototype.remove = function (t) { delete this.waypoints[ t.axis ][ t.key ], this.checkEmpty() }, e.prototype.innerWidth = function () { return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth() }, e.prototype.destroy = function () { var t = []; for (var e in this.waypoints) for (var i in this.waypoints[ e ]) t.push(this.waypoints[ e ][ i ]); for (var o = 0, n = t.length; n > o; o++)t[ o ].destroy() }, e.prototype.refresh = function () { var t, e = this.element == this.element.window, i = e ? void 0 : this.adapter.offset(), o = {}; this.handleScroll(), t = { horizontal: { contextOffset: e ? 0 : i.left, contextScroll: e ? 0 : this.oldScroll.x, contextDimension: this.innerWidth(), oldScroll: this.oldScroll.x, forward: "right", backward: "left", offsetProp: "left" }, vertical: { contextOffset: e ? 0 : i.top, contextScroll: e ? 0 : this.oldScroll.y, contextDimension: this.innerHeight(), oldScroll: this.oldScroll.y, forward: "down", backward: "up", offsetProp: "top" } }; for (var r in t) { var s = t[ r ]; for (var a in this.waypoints[ r ]) { var l, h, p, u, c, d = this.waypoints[ r ][ a ], f = d.options.offset, w = d.triggerPoint, y = 0, g = null == w; d.element !== d.element.window && (y = d.adapter.offset()[ s.offsetProp ]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = Math.floor(y + l - f), h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[ d.group.id ] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[ d.group.id ] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[ d.group.id ] = d.group) } } return n.requestAnimationFrame(function () { for (var t in o) o[ t ].flushTriggers() }), this }, e.findOrCreateByElement = function (t) { return e.findByElement(t) || new e(t) }, e.refreshAll = function () { for (var t in o) o[ t ].refresh() }, e.findByElement = function (t) { return o[ t.waypointContextKey ] }, window.onload = function () { r && r(), e.refreshAll() }, n.requestAnimationFrame = function (e) { var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t; i.call(window, e) }, n.Context = e }(), function () { "use strict"; function t (t, e) { return t.triggerPoint - e.triggerPoint } function e (t, e) { return e.triggerPoint - t.triggerPoint } function i (t) { this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[ this.axis ][ this.name ] = this } var o = { vertical: {}, horizontal: {} }, n = window.Waypoint; i.prototype.add = function (t) { this.waypoints.push(t) }, i.prototype.clearTriggerQueues = function () { this.triggerQueues = { up: [], down: [], left: [], right: [] } }, i.prototype.flushTriggers = function () { for (var i in this.triggerQueues) { var o = this.triggerQueues[ i ], n = "up" === i || "left" === i; o.sort(n ? e : t); for (var r = 0, s = o.length; s > r; r += 1) { var a = o[ r ]; (a.options.continuous || r === o.length - 1) && a.trigger([ i ]) } } this.clearTriggerQueues() }, i.prototype.next = function (e) { this.waypoints.sort(t); var i = n.Adapter.inArray(e, this.waypoints), o = i === this.waypoints.length - 1; return o ? null : this.waypoints[ i + 1 ] }, i.prototype.previous = function (e) { this.waypoints.sort(t); var i = n.Adapter.inArray(e, this.waypoints); return i ? this.waypoints[ i - 1 ] : null }, i.prototype.queueTrigger = function (t, e) { this.triggerQueues[ e ].push(t) }, i.prototype.remove = function (t) { var e = n.Adapter.inArray(t, this.waypoints); e > -1 && this.waypoints.splice(e, 1) }, i.prototype.first = function () { return this.waypoints[ 0 ] }, i.prototype.last = function () { return this.waypoints[ this.waypoints.length - 1 ] }, i.findOrCreate = function (t) { return o[ t.axis ][ t.name ] || new i(t) }, n.Group = i }(), function () { "use strict"; function t (t) { this.$element = e(t) } var e = window.jQuery, i = window.Waypoint; e.each([ "innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop" ], function (e, i) { t.prototype[ i ] = function () { var t = Array.prototype.slice.call(arguments); return this.$element[ i ].apply(this.$element, t) } }), e.each([ "extend", "inArray", "isEmptyObject" ], function (i, o) { t[ o ] = e[ o ] }), i.adapters.push({ name: "jquery", Adapter: t }), i.Adapter = t }(), function () { "use strict"; function t (t) { return function () { var i = [], o = arguments[ 0 ]; return t.isFunction(arguments[ 0 ]) && (o = t.extend({}, arguments[ 1 ]), o.handler = arguments[ 0 ]), this.each(function () { var n = t.extend({}, o, { element: this }); "string" == typeof n.context && (n.context = t(this).closest(n.context)[ 0 ]), i.push(new e(n)) }), i } } var e = window.Waypoint; window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto)) }();
/**
 * hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 **/
(function ($) {
	$.fn.hoverIntent = function (handlerIn, handlerOut, selector) {

		// default configuration values
		var cfg = {
			interval: 100,
			sensitivity: 7,
			timeout: 0
		};

		if (typeof handlerIn === "object") {
			cfg = $.extend(cfg, handlerIn);
		} else if ($.isFunction(handlerOut)) {
			cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector });
		} else {
			cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut });
		}

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function (ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function (ev, ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
				$(ob).off("mousemove.hoverIntent", track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob, [ ev ]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval);
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function (ev, ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob, [ ev ]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function (e) {
			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({}, e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// if e.type == "mouseenter"
			if (e.type == "mouseenter") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).on("mousemove.hoverIntent", track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob); }, cfg.interval); }

				// else e.type == "mouseleave"
			} else {
				// unbind expensive mousemove event
				$(ob).off("mousemove.hoverIntent", track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob); }, cfg.timeout); }
			}
		};

		// listen for mouseenter and mouseleave
		return this.on({ 'mouseenter.hoverIntent': handleHover, 'mouseleave.hoverIntent': handleHover }, cfg.selector);
	};
})(jQuery);

/*
 *  Bootstrap TouchSpin - v4.2.5
 *  A mobile and touch friendly input spinner component for Bootstrap 3 & 4.
 *  http://www.virtuosoft.eu/code/bootstrap-touchspin/
 *
 *  Made by István Ujj-Mészáros
 *  Under Apache License v2.0 License
 */
!function (o) { "function" == typeof define && define.amd ? define([ "jquery" ], o) : "object" == typeof module && module.exports ? module.exports = function (t, n) { return void 0 === n && (n = "undefined" != typeof window ? require("jquery") : require("jquery")(t)), o(n), n } : o(jQuery) }(function (j) { "use strict"; var D = 0; j.fn.TouchSpin = function (y) { var k = { min: 0, max: 100, initval: "", replacementval: "", step: 1, decimals: 0, stepinterval: 100, forcestepdivisibility: "round", stepintervaldelay: 500, verticalbuttons: !1, verticalup: "+", verticaldown: "-", verticalupclass: "", verticaldownclass: "", prefix: "", postfix: "", prefix_extraclass: "", postfix_extraclass: "", booster: !0, boostat: 10, maxboostedstep: !1, mousewheel: !0, buttondown_class: "btn btn-primary", buttonup_class: "btn btn-primary", buttondown_txt: "-", buttonup_txt: "+", callback_before_calculation: function (t) { return t }, callback_after_calculation: function (t) { return t } }, C = { min: "min", max: "max", initval: "init-val", replacementval: "replacement-val", step: "step", decimals: "decimals", stepinterval: "step-interval", verticalbuttons: "vertical-buttons", verticalupclass: "vertical-up-class", verticaldownclass: "vertical-down-class", forcestepdivisibility: "force-step-divisibility", stepintervaldelay: "step-interval-delay", prefix: "prefix", postfix: "postfix", prefix_extraclass: "prefix-extra-class", postfix_extraclass: "postfix-extra-class", booster: "booster", boostat: "boostat", maxboostedstep: "max-boosted-step", mousewheel: "mouse-wheel", buttondown_class: "button-down-class", buttonup_class: "button-up-class", buttondown_txt: "button-down-txt", buttonup_txt: "button-up-txt" }; return this.each(function () { var i, p, a, u, o, s, t, n, e, r, c = j(this), l = c.data(), d = 0, f = !1; function b () { "" === i.prefix && (p = o.prefix.detach()), "" === i.postfix && (a = o.postfix.detach()) } function h () { var t, n, o; "" !== (t = i.callback_before_calculation(c.val())) ? 0 < i.decimals && "." === t || (n = parseFloat(t), isNaN(n) && (n = "" !== i.replacementval ? i.replacementval : 0), (o = n).toString() !== t && (o = n), null !== i.min && n < i.min && (o = i.min), null !== i.max && n > i.max && (o = i.max), o = function (t) { switch (i.forcestepdivisibility) { case "round": return (Math.round(t / i.step) * i.step).toFixed(i.decimals); case "floor": return (Math.floor(t / i.step) * i.step).toFixed(i.decimals); case "ceil": return (Math.ceil(t / i.step) * i.step).toFixed(i.decimals); default: return t } }(o), Number(t).toString() !== o.toString() && (c.val(o), c.trigger("change"))) : "" !== i.replacementval && (c.val(i.replacementval), c.trigger("change")) } function v () { if (i.booster) { var t = Math.pow(2, Math.floor(d / i.boostat)) * i.step; return i.maxboostedstep && t > i.maxboostedstep && (t = i.maxboostedstep, s = Math.round(s / t) * t), Math.max(i.step, t) } return i.step } function x () { h(), s = parseFloat(i.callback_before_calculation(o.input.val())), isNaN(s) && (s = 0); var t = s, n = v(); s += n, null !== i.max && s > i.max && (s = i.max, c.trigger("touchspin.on.max"), _()), o.input.val(i.callback_after_calculation(Number(s).toFixed(i.decimals))), t !== s && c.trigger("change") } function g () { h(), s = parseFloat(i.callback_before_calculation(o.input.val())), isNaN(s) && (s = 0); var t = s, n = v(); s -= n, null !== i.min && s < i.min && (s = i.min, c.trigger("touchspin.on.min"), _()), o.input.val(i.callback_after_calculation(Number(s).toFixed(i.decimals))), t !== s && c.trigger("change") } function m () { _(), d = 0, f = "down", c.trigger("touchspin.on.startspin"), c.trigger("touchspin.on.startdownspin"), e = setTimeout(function () { t = setInterval(function () { d++, g() }, i.stepinterval) }, i.stepintervaldelay) } function w () { _(), d = 0, f = "up", c.trigger("touchspin.on.startspin"), c.trigger("touchspin.on.startupspin"), r = setTimeout(function () { n = setInterval(function () { d++, x() }, i.stepinterval) }, i.stepintervaldelay) } function _ () { switch (clearTimeout(e), clearTimeout(r), clearInterval(t), clearInterval(n), f) { case "up": c.trigger("touchspin.on.stopupspin"), c.trigger("touchspin.on.stopspin"); break; case "down": c.trigger("touchspin.on.stopdownspin"), c.trigger("touchspin.on.stopspin") }d = 0, f = !1 } !function () { if (c.data("alreadyinitialized")) return; if (c.data("alreadyinitialized", !0), D += 1, c.data("spinnerid", D), !c.is("input")) return console.log("Must be an input."); i = j.extend({}, k, l, (s = {}, j.each(C, function (t, n) { var o = "bts-" + n; c.is("[data-" + o + "]") && (s[ t ] = c.data(o)) }), s), y), "" !== i.initval && "" === c.val() && c.val(i.initval), h(), function () { var t = c.val(), n = c.parent(); "" !== t && (t = i.callback_after_calculation(Number(t).toFixed(i.decimals))); c.data("initvalue", t).val(t), c.addClass("form-control"), n.hasClass("input-group") ? function (t) { t.addClass("bootstrap-touchspin"); var n, o, s = c.prev(), p = c.next(), a = '<span class="input-group-addon input-group-prepend bootstrap-touchspin-prefix input-group-prepend bootstrap-touchspin-injected"><span class="input-group-text">' + i.prefix + "</span></span>", e = '<span class="input-group-addon input-group-append bootstrap-touchspin-postfix input-group-append bootstrap-touchspin-injected"><span class="input-group-text">' + i.postfix + "</span></span>"; s.hasClass("input-group-btn") || s.hasClass("input-group-prepend") ? (n = '<button class="' + i.buttondown_class + ' bootstrap-touchspin-down bootstrap-touchspin-injected" type="button">' + i.buttondown_txt + "</button>", s.append(n)) : (n = '<span class="input-group-btn input-group-prepend bootstrap-touchspin-injected"><button class="' + i.buttondown_class + ' bootstrap-touchspin-down" type="button">' + i.buttondown_txt + "</button></span>", j(n).insertBefore(c)); p.hasClass("input-group-btn") || p.hasClass("input-group-append") ? (o = '<button class="' + i.buttonup_class + ' bootstrap-touchspin-up bootstrap-touchspin-injected" type="button">' + i.buttonup_txt + "</button>", p.prepend(o)) : (o = '<span class="input-group-btn input-group-append bootstrap-touchspin-injected"><button class="' + i.buttonup_class + ' bootstrap-touchspin-up" type="button">' + i.buttonup_txt + "</button></span>", j(o).insertAfter(c)); j(a).insertBefore(c), j(e).insertAfter(c), u = t }(n) : function () { var t, n = ""; c.hasClass("input-sm") && (n = "input-group-sm"); c.hasClass("input-lg") && (n = "input-group-lg"); t = i.verticalbuttons ? '<div class="input-group ' + n + ' bootstrap-touchspin bootstrap-touchspin-injected"><span class="input-group-addon input-group-prepend bootstrap-touchspin-prefix"><span class="input-group-text">' + i.prefix + '</span></span><span class="input-group-addon bootstrap-touchspin-postfix input-group-append"><span class="input-group-text">' + i.postfix + '</span></span><span class="input-group-btn-vertical"><button class="' + i.buttondown_class + " bootstrap-touchspin-up " + i.verticalupclass + '" type="button">' + i.verticalup + '</button><button class="' + i.buttonup_class + " bootstrap-touchspin-down " + i.verticaldownclass + '" type="button">' + i.verticaldown + "</button></span></div>" : '<div class="input-group bootstrap-touchspin bootstrap-touchspin-injected"><span class="input-group-btn input-group-prepend"><button class="' + i.buttondown_class + ' bootstrap-touchspin-down" type="button">' + i.buttondown_txt + '</button></span><span class="input-group-addon bootstrap-touchspin-prefix input-group-prepend"><span class="input-group-text">' + i.prefix + '</span></span><span class="input-group-addon bootstrap-touchspin-postfix input-group-append"><span class="input-group-text">' + i.postfix + '</span></span><span class="input-group-btn input-group-append"><button class="' + i.buttonup_class + ' bootstrap-touchspin-up" type="button">' + i.buttonup_txt + "</button></span></div>"; u = j(t).insertBefore(c), j(".bootstrap-touchspin-prefix", u).after(c), c.hasClass("input-sm") ? u.addClass("input-group-sm") : c.hasClass("input-lg") && u.addClass("input-group-lg") }() }(), o = { down: j(".bootstrap-touchspin-down", u), up: j(".bootstrap-touchspin-up", u), input: j("input", u), prefix: j(".bootstrap-touchspin-prefix", u).addClass(i.prefix_extraclass), postfix: j(".bootstrap-touchspin-postfix", u).addClass(i.postfix_extraclass) }, b(), c.on("keydown.touchspin", function (t) { var n = t.keyCode || t.which; 38 === n ? ("up" !== f && (x(), w()), t.preventDefault()) : 40 === n && ("down" !== f && (g(), m()), t.preventDefault()) }), c.on("keyup.touchspin", function (t) { var n = t.keyCode || t.which; 38 === n ? _() : 40 === n && _() }), c.on("blur.touchspin", function () { h(), c.val(i.callback_after_calculation(c.val())) }), o.down.on("keydown", function (t) { var n = t.keyCode || t.which; 32 !== n && 13 !== n || ("down" !== f && (g(), m()), t.preventDefault()) }), o.down.on("keyup.touchspin", function (t) { var n = t.keyCode || t.which; 32 !== n && 13 !== n || _() }), o.up.on("keydown.touchspin", function (t) { var n = t.keyCode || t.which; 32 !== n && 13 !== n || ("up" !== f && (x(), w()), t.preventDefault()) }), o.up.on("keyup.touchspin", function (t) { var n = t.keyCode || t.which; 32 !== n && 13 !== n || _() }), o.down.on("mousedown.touchspin", function (t) { o.down.off("touchstart.touchspin"), c.is(":disabled") || (g(), m(), t.preventDefault(), t.stopPropagation()) }), o.down.on("touchstart.touchspin", function (t) { o.down.off("mousedown.touchspin"), c.is(":disabled") || (g(), m(), t.preventDefault(), t.stopPropagation()) }), o.up.on("mousedown.touchspin", function (t) { o.up.off("touchstart.touchspin"), c.is(":disabled") || (x(), w(), t.preventDefault(), t.stopPropagation()) }), o.up.on("touchstart.touchspin", function (t) { o.up.off("mousedown.touchspin"), c.is(":disabled") || (x(), w(), t.preventDefault(), t.stopPropagation()) }), o.up.on("mouseup.touchspin mouseout.touchspin touchleave.touchspin touchend.touchspin touchcancel.touchspin", function (t) { f && (t.stopPropagation(), _()) }), o.down.on("mouseup.touchspin mouseout.touchspin touchleave.touchspin touchend.touchspin touchcancel.touchspin", function (t) { f && (t.stopPropagation(), _()) }), o.down.on("mousemove.touchspin touchmove.touchspin", function (t) { f && (t.stopPropagation(), t.preventDefault()) }), o.up.on("mousemove.touchspin touchmove.touchspin", function (t) { f && (t.stopPropagation(), t.preventDefault()) }), c.on("mousewheel.touchspin DOMMouseScroll.touchspin", function (t) { if (i.mousewheel && c.is(":focus")) { var n = t.originalEvent.wheelDelta || -t.originalEvent.deltaY || -t.originalEvent.detail; t.stopPropagation(), t.preventDefault(), n < 0 ? g() : x() } }), c.on("touchspin.destroy", function () { var t; t = c.parent(), _(), c.off(".touchspin"), t.hasClass("bootstrap-touchspin-injected") ? (c.siblings().remove(), c.unwrap()) : (j(".bootstrap-touchspin-injected", t).remove(), t.removeClass("bootstrap-touchspin")), c.data("alreadyinitialized", !1) }), c.on("touchspin.uponce", function () { _(), x() }), c.on("touchspin.downonce", function () { _(), g() }), c.on("touchspin.startupspin", function () { w() }), c.on("touchspin.startdownspin", function () { m() }), c.on("touchspin.stopspin", function () { _() }), c.on("touchspin.updatesettings", function (t, n) { !function (t) { (function (t) { if (i = j.extend({}, i, t), t.postfix) { var n = c.parent().find(".bootstrap-touchspin-postfix"); 0 === n.length && a.insertAfter(c), c.parent().find(".bootstrap-touchspin-postfix .input-group-text").text(t.postfix) } if (t.prefix) { var o = c.parent().find(".bootstrap-touchspin-prefix"); 0 === o.length && p.insertBefore(c), c.parent().find(".bootstrap-touchspin-prefix .input-group-text").text(t.prefix) } b() })(t), h(); var n = o.input.val(); "" !== n && (n = Number(i.callback_before_calculation(o.input.val())), o.input.val(i.callback_after_calculation(Number(n).toFixed(i.decimals)))) }(n) }); var s }() }) } });
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define([ 'jquery' ], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	var CountTo = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
		this.init();
	};

	CountTo.DEFAULTS = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	CountTo.prototype.init = function () {
		this.value = this.options.from;
		this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
		this.loopCount = 0;
		this.increment = (this.options.to - this.options.from) / this.loops;
	};

	CountTo.prototype.dataOptions = function () {
		var options = {
			from: this.$element.data('from'),
			to: this.$element.data('to'),
			speed: this.$element.data('speed'),
			refreshInterval: this.$element.data('refresh-interval'),
			decimals: this.$element.data('decimals')
		};

		var keys = Object.keys(options);

		for (var i in keys) {
			var key = keys[ i ];

			if (typeof (options[ key ]) === 'undefined') {
				delete options[ key ];
			}
		}

		return options;
	};

	CountTo.prototype.update = function () {
		this.value += this.increment;
		this.loopCount++;

		this.render();

		if (typeof (this.options.onUpdate) == 'function') {
			this.options.onUpdate.call(this.$element, this.value);
		}

		if (this.loopCount >= this.loops) {
			clearInterval(this.interval);
			this.value = this.options.to;

			if (typeof (this.options.onComplete) == 'function') {
				this.options.onComplete.call(this.$element, this.value);
			}
		}
	};

	CountTo.prototype.render = function () {
		var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
		this.$element.text(formattedValue);
	};

	CountTo.prototype.restart = function () {
		this.stop();
		this.init();
		this.start();
	};

	CountTo.prototype.start = function () {
		this.stop();
		this.render();
		this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
	};

	CountTo.prototype.stop = function () {
		if (this.interval) {
			clearInterval(this.interval);
		}
	};

	CountTo.prototype.toggle = function () {
		if (this.interval) {
			this.stop();
		} else {
			this.start();
		}
	};

	function formatter (value, options) {
		return value.toFixed(options.decimals);
	}

	$.fn.countTo = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('countTo');
			var init = !data || typeof (option) === 'object';
			var options = typeof (option) === 'object' ? option : {};
			var method = typeof (option) === 'string' ? option : 'start';

			if (init) {
				if (data) data.stop();
				$this.data('countTo', data = new CountTo(this, options));
			}

			data[ method ].call(data);
		});
	};
}));

/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function (a) { "function" == typeof define && define.amd ? define([ "jquery" ], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto) }(function (a) { var b, c, d, e, f, g, h = "Close", i = "BeforeClose", j = "AfterClose", k = "BeforeAppend", l = "MarkupParse", m = "Open", n = "Change", o = "mfp", p = "." + o, q = "mfp-ready", r = "mfp-removing", s = "mfp-prevent-close", t = function () { }, u = !!window.jQuery, v = a(window), w = function (a, c) { b.ev.on(o + a + p, c) }, x = function (b, c, d, e) { var f = document.createElement("div"); return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f }, y = function (c, d) { b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[ c ] && b.st.callbacks[ c ].apply(b, a.isArray(d) ? d : [ d ])) }, z = function (c) { return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn }, A = function () { a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b) }, B = function () { var a = document.createElement("p").style, b = [ "ms", "O", "Moz", "Webkit" ]; if (void 0 !== a.transition) return !0; for (; b.length;)if (b.pop() + "Transition" in a) return !0; return !1 }; t.prototype = { constructor: t, init: function () { var c = navigator.appVersion; b.isLowIE = b.isIE8 = document.all && !document.addEventListener, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {} }, open: function (c) { var e; if (c.isObj === !1) { b.items = c.items.toArray(), b.index = 0; var g, h = c.items; for (e = 0; e < h.length; e++)if (g = h[ e ], g.parsed && (g = g.el[ 0 ]), g === c.el[ 0 ]) { b.index = e; break } } else b.items = a.isArray(c.items) ? c.items : [ c.items ], b.index = c.index || 0; if (b.isOpen) return void b.updateItemHTML(); b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[ c.key ] || (b.popupsCache[ c.key ] = {}), b.currTemplate = b.popupsCache[ c.key ]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function () { b.close() }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function (a) { b._checkIfClose(a.target) && b.close() }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading)); var i = a.magnificPopup.modules; for (e = 0; e < i.length; e++) { var j = i[ e ]; j = j.charAt(0).toUpperCase() + j.slice(1), b[ "init" + j ].call(b) } y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function (a, b, c, d) { c.close_replaceWith = z(d.type) }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({ overflow: b.st.overflowY, overflowX: "hidden", overflowY: b.st.overflowY }) : b.wrap.css({ top: v.scrollTop(), position: "absolute" }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({ height: d.height(), position: "absolute" }), b.st.enableEscapeKey && d.on("keyup" + p, function (a) { 27 === a.keyCode && b.close() }), v.on("resize" + p, function () { b.updateSize() }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f); var k = b.wH = v.height(), n = {}; if (b.fixedContentPos && b._hasScrollBar(k)) { var o = b._getScrollbarSize(); o && (n.marginRight = o) } b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden"); var r = b.st.mainClass; return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function () { b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn) }, 16), b.isOpen = !0, b.updateSize(k), y(m), c }, close: function () { b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function () { b._close() }, b.st.removalDelay)) : b._close()) }, _close: function () { y(h); var c = r + " " + q + " "; if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) { var e = { marginRight: "" }; b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e) } d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[ b.currItem.type ] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j) }, updateSize: function (a) { if (b.isIOS) { var c = document.documentElement.clientWidth / window.innerWidth, d = window.innerHeight * c; b.wrap.css("height", d), b.wH = d } else b.wH = a || v.height(); b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize") }, updateItemHTML: function () { var c = b.items[ b.index ]; b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index)); var d = c.type; if (y("BeforeChange", [ b.currItem ? b.currItem.type : "", d ]), b.currItem = c, !b.currTemplate[ d ]) { var f = b.st[ d ] ? b.st[ d ].markup : !1; y("FirstMarkupParse", f), f ? b.currTemplate[ d ] = a(f) : b.currTemplate[ d ] = !0 } e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder"); var g = b[ "get" + d.charAt(0).toUpperCase() + d.slice(1) ](c, b.currTemplate[ d ]); b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange") }, appendContent: function (a, c) { b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[ c ] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content) }, parseEl: function (c) { var d, e = b.items[ c ]; if (e.tagName ? e = { el: a(e) } : (d = e.type, e = { data: e, src: e.src }), e.el) { for (var f = b.types, g = 0; g < f.length; g++)if (e.el.hasClass("mfp-" + f[ g ])) { d = f[ g ]; break } e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href")) } return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[ c ] = e, y("ElementParse", e), b.items[ c ] }, addGroup: function (a, c) { var d = function (d) { d.mfpEl = this, b._openClick(d, a, c) }; c || (c = {}); var e = "click.magnificPopup"; c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d))) }, _openClick: function (c, d, e) { var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick; if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) { var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn; if (g) if (a.isFunction(g)) { if (!g.call(b)) return !0 } else if (v.width() < g) return !0; c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e) } }, updateStatus: function (a, d) { if (b.preloader) { c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading); var e = { status: a, text: d }; y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function (a) { a.stopImmediatePropagation() }), b.container.addClass("mfp-s-" + a), c = a } }, _checkIfClose: function (c) { if (!a(c).hasClass(s)) { var d = b.st.closeOnContentClick, e = b.st.closeOnBgClick; if (d && e) return !0; if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[ 0 ]) return !0; if (c === b.content[ 0 ] || a.contains(b.content[ 0 ], c)) { if (d) return !0 } else if (e && a.contains(document, c)) return !0; return !1 } }, _addClassToMFP: function (a) { b.bgOverlay.addClass(a), b.wrap.addClass(a) }, _removeClassFromMFP: function (a) { this.bgOverlay.removeClass(a), b.wrap.removeClass(a) }, _hasScrollBar: function (a) { return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height()) }, _setFocus: function () { (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus() }, _onFocusIn: function (c) { return c.target === b.wrap[ 0 ] || a.contains(b.wrap[ 0 ], c.target) ? void 0 : (b._setFocus(), !1) }, _parseMarkup: function (b, c, d) { var e; d.data && (c = a.extend(d.data, c)), y(l, [ b, c, d ]), a.each(c, function (c, d) { if (void 0 === d || d === !1) return !0; if (e = c.split("_"), e.length > 1) { var f = b.find(p + "-" + e[ 0 ]); if (f.length > 0) { var g = e[ 1 ]; "replaceWith" === g ? f[ 0 ] !== d[ 0 ] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[ 1 ], d) } } else b.find(p + "-" + c).html(d) }) }, _getScrollbarSize: function () { if (void 0 === b.scrollbarSize) { var a = document.createElement("div"); a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a) } return b.scrollbarSize } }, a.magnificPopup = { instance: null, proto: t.prototype, modules: [], open: function (b, c) { return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b) }, close: function () { return a.magnificPopup.instance && a.magnificPopup.instance.close() }, registerModule: function (b, c) { c.options && (a.magnificPopup.defaults[ b ] = c.options), a.extend(this.proto, c.proto), this.modules.push(b) }, defaults: { disableOn: 0, key: null, midClick: !1, mainClass: "", preloader: !0, focus: "", closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0, modal: !1, alignTop: !1, removalDelay: 0, prependTo: null, fixedContentPos: "auto", fixedBgPos: "auto", overflowY: "auto", closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>', tClose: "Close (Esc)", tLoading: "Loading...", autoFocusLast: !0 } }, a.fn.magnificPopup = function (c) { A(); var d = a(this); if ("string" == typeof c) if ("open" === c) { var e, f = u ? d.data("magnificPopup") : d[ 0 ].magnificPopup, g = parseInt(arguments[ 1 ], 10) || 0; f.items ? e = f.items[ g ] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({ mfpEl: e }, d, f) } else b.isOpen && b[ c ].apply(b, Array.prototype.slice.call(arguments, 1)); else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[ 0 ].magnificPopup = c, b.addGroup(d, c); return d }; var C, D, E, F = "inline", G = function () { E && (D.after(E.addClass(C)).detach(), E = null) }; a.magnificPopup.registerModule(F, { options: { hiddenClass: "hide", markup: "", tNotFound: "Content not found" }, proto: { initInline: function () { b.types.push(F), w(h + "." + F, function () { G() }) }, getInline: function (c, d) { if (G(), c.src) { var e = b.st.inline, f = a(c.src); if (f.length) { var g = f[ 0 ].parentNode; g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready") } else b.updateStatus("error", e.tNotFound), f = a("<div>"); return c.inlineElement = f, f } return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d } } }); var H, I = "ajax", J = function () { H && a(document.body).removeClass(H) }, K = function () { J(), b.req && b.req.abort() }; a.magnificPopup.registerModule(I, { options: { settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.' }, proto: { initAjax: function () { b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K) }, getAjax: function (c) { H && a(document.body).addClass(H), b.updateStatus("loading"); var d = a.extend({ url: c.src, success: function (d, e, f) { var g = { data: d, xhr: f }; y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function () { b.wrap.addClass(q) }, 16), b.updateStatus("ready"), y("AjaxContentAdded") }, error: function () { J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src)) } }, b.st.ajax.settings); return b.req = a.ajax(d), "" } } }); var L, M = function (c) { if (c.data && void 0 !== c.data.title) return c.data.title; var d = b.st.image.titleSrc; if (d) { if (a.isFunction(d)) return d.call(b, c); if (c.el) return c.el.attr(d) || "" } return "" }; a.magnificPopup.registerModule("image", { options: { markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>', cursor: "mfp-zoom-out-cur", titleSrc: "title", verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.' }, proto: { initImage: function () { var c = b.st.image, d = ".image"; b.types.push("image"), w(m + d, function () { "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor) }), w(h + d, function () { c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p) }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage) }, resizeImage: function () { var a = b.currItem; if (a && a.img && b.st.image.verticalFit) { var c = 0; b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c) } }, _onImageHasSize: function (a) { a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1)) }, findImageSize: function (a) { var c = 0, d = a.img[ 0 ], e = function (f) { L && clearInterval(L), L = setInterval(function () { return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void (3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500))) }, f) }; e(1) }, getImage: function (c, d) { var e = 0, f = function () { c && (c.img[ 0 ].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g())) }, g = function () { c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0) }, h = b.st.image, i = d.find(".mfp-img"); if (i.length) { var j = document.createElement("img"); j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[ 0 ], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1) } return b._parseMarkup(d, { title: M(c), img_replaceWith: c.img }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d) } } }); var N, O = function () { return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N }; a.magnificPopup.registerModule("zoom", { options: { enabled: !1, easing: "ease-in-out", duration: 300, opener: function (a) { return a.is("img") ? a : a.find("img") } }, proto: { initZoom: function () { var a, c = b.st.zoom, d = ".zoom"; if (c.enabled && b.supportsTransition) { var e, f, g = c.duration, j = function (a) { var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), d = "all " + c.duration / 1e3 + "s " + c.easing, e = { position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden" }, f = "transition"; return e[ "-webkit-" + f ] = e[ "-moz-" + f ] = e[ "-o-" + f ] = e[ f ] = d, b.css(e), b }, k = function () { b.content.css("visibility", "visible") }; w("BuildControls" + d, function () { if (b._allowZoom()) { if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k(); f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function () { f.css(b._getOffset(!0)), e = setTimeout(function () { k(), setTimeout(function () { f.remove(), a = f = null, y("ZoomAnimationEnded") }, 16) }, g) }, 16) } }), w(i + d, function () { if (b._allowZoom()) { if (clearTimeout(e), b.st.removalDelay = g, !a) { if (a = b._getItemToZoom(), !a) return; f = j(a) } f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function () { f.css(b._getOffset()) }, 16) } }), w(h + d, function () { b._allowZoom() && (k(), f && f.remove(), a = null) }) } }, _allowZoom: function () { return "image" === b.currItem.type }, _getItemToZoom: function () { return b.currItem.hasSize ? b.currItem.img : !1 }, _getOffset: function (c) { var d; d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem); var e = d.offset(), f = parseInt(d.css("padding-top"), 10), g = parseInt(d.css("padding-bottom"), 10); e.top -= a(window).scrollTop() - f; var h = { width: d.width(), height: (u ? d.innerHeight() : d[ 0 ].offsetHeight) - g - f }; return O() ? h[ "-moz-transform" ] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h } } }); var P = "iframe", Q = "//about:blank", R = function (a) { if (b.currTemplate[ P ]) { var c = b.currTemplate[ P ].find("iframe"); c.length && (a || (c[ 0 ].src = Q), b.isIE8 && c.css("display", a ? "block" : "none")) } }; a.magnificPopup.registerModule(P, { options: { markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: "iframe_src", patterns: { youtube: { index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1" }, vimeo: { index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1" }, gmaps: { index: "//maps.google.", src: "%id%&output=embed" } } }, proto: { initIframe: function () { b.types.push(P), w("BeforeChange", function (a, b, c) { b !== c && (b === P ? R() : c === P && R(!0)) }), w(h + "." + P, function () { R() }) }, getIframe: function (c, d) { var e = c.src, f = b.st.iframe; a.each(f.patterns, function () { return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0 }); var g = {}; return f.srcAction && (g[ f.srcAction ] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d } } }); var S = function (a) { var c = b.items.length; return a > c - 1 ? a - c : 0 > a ? c + a : a }, T = function (a, b, c) { return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c) }; a.magnificPopup.registerModule("gallery", { options: { enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [ 0, 2 ], navigateByImgClick: !0, arrows: !0, tPrev: "Previous (Left arrow key)", tNext: "Next (Right arrow key)", tCounter: "%curr% of %total%" }, proto: { initGallery: function () { var c = b.st.gallery, e = ".mfp-gallery"; return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function () { c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function () { return b.items.length > 1 ? (b.next(), !1) : void 0 }), d.on("keydown" + e, function (a) { 37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next() }) }), w("UpdateStatus" + e, function (a, c) { c.text && (c.text = T(c.text, b.currItem.index, b.items.length)) }), w(l + e, function (a, d, e, f) { var g = b.items.length; e.counter = g > 1 ? T(c.tCounter, f.index, g) : "" }), w("BuildControls" + e, function () { if (b.items.length > 1 && c.arrows && !b.arrowLeft) { var d = c.arrowMarkup, e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s), f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s); e.click(function () { b.prev() }), f.click(function () { b.next() }), b.container.append(e.add(f)) } }), w(n + e, function () { b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function () { b.preloadNearbyImages(), b._preloadTimeout = null }, 16) }), void w(h + e, function () { d.off(e), b.wrap.off("click" + e), b.arrowRight = b.arrowLeft = null })) : !1 }, next: function () { b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML() }, prev: function () { b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML() }, goTo: function (a) { b.direction = a >= b.index, b.index = a, b.updateItemHTML() }, preloadNearbyImages: function () { var a, c = b.st.gallery.preload, d = Math.min(c[ 0 ], b.items.length), e = Math.min(c[ 1 ], b.items.length); for (a = 1; a <= (b.direction ? e : d); a++)b._preloadItem(b.index + a); for (a = 1; a <= (b.direction ? d : e); a++)b._preloadItem(b.index - a) }, _preloadItem: function (c) { if (c = S(c), !b.items[ c ].preloaded) { var d = b.items[ c ]; d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function () { d.hasSize = !0 }).on("error.mfploader", function () { d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d) }).attr("src", d.src)), d.preloaded = !0 } } } }); var U = "retina"; a.magnificPopup.registerModule(U, { options: { replaceSrc: function (a) { return a.src.replace(/\.\w+$/, function (a) { return "@2x" + a }) }, ratio: 1 }, proto: { initRetina: function () { if (window.devicePixelRatio > 1) { var a = b.st.retina, c = a.ratio; c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function (a, b) { b.img.css({ "max-width": b.img[ 0 ].naturalWidth / c, width: "100%" }) }), w("ElementParse." + U, function (b, d) { d.src = a.replaceSrc(d, c) })) } } } }), A() });

/**
 * Owl Carousel v2.3.4
 * Copyright 2013-2018 David Deutsch
 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
 */
!function (a, b, c, d) { function e (b, c) { this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = { time: null, target: null, pointer: null, stage: { start: null, current: null }, direction: null }, this._states = { current: {}, tags: { initializing: [ "busy" ], animating: [ "busy" ], dragging: [ "interacting" ] } }, a.each([ "onResize", "onThrottledResize" ], a.proxy(function (b, c) { this._handlers[ c ] = a.proxy(this[ c ], this) }, this)), a.each(e.Plugins, a.proxy(function (a, b) { this._plugins[ a.charAt(0).toLowerCase() + a.slice(1) ] = new b(this) }, this)), a.each(e.Workers, a.proxy(function (b, c) { this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) }) }, this)), this.setup(), this.initialize() } e.Defaults = { items: 3, loop: !1, center: !1, rewind: !1, checkVisibility: !0, mouseDrag: !0, touchDrag: !0, pullDrag: !0, freeDrag: !1, margin: 0, stagePadding: 0, merge: !1, mergeFit: !0, autoWidth: !1, startPosition: 0, rtl: !1, smartSpeed: 250, fluidSpeed: !1, dragEndSpeed: !1, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: b, fallbackEasing: "swing", slideTransition: "", info: !1, nestedItemSelector: !1, itemElement: "div", stageElement: "div", refreshClass: "owl-refresh", loadedClass: "owl-loaded", loadingClass: "owl-loading", rtlClass: "owl-rtl", responsiveClass: "owl-responsive", dragClass: "owl-drag", itemClass: "owl-item", stageClass: "owl-stage", stageOuterClass: "owl-stage-outer", grabClass: "owl-grab" }, e.Width = { Default: "default", Inner: "inner", Outer: "outer" }, e.Type = { Event: "event", State: "state" }, e.Plugins = {}, e.Workers = [ { filter: [ "width", "settings" ], run: function () { this._width = this.$element.width() } }, { filter: [ "width", "items", "settings" ], run: function (a) { a.current = this._items && this._items[ this.relative(this._current) ] } }, { filter: [ "items", "settings" ], run: function () { this.$stage.children(".cloned").remove() } }, { filter: [ "width", "items", "settings" ], run: function (a) { var b = this.settings.margin || "", c = !this.settings.autoWidth, d = this.settings.rtl, e = { width: "auto", "margin-left": d ? b : "", "margin-right": d ? "" : b }; !c && this.$stage.children().css(e), a.css = e } }, { filter: [ "width", "items", "settings" ], run: function (a) { var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, c = null, d = this._items.length, e = !this.settings.autoWidth, f = []; for (a.items = { merge: !1, width: b }; d--;)c = this._mergers[ d ], c = this.settings.mergeFit && Math.min(c, this.settings.items) || c, a.items.merge = c > 1 || a.items.merge, f[ d ] = e ? b * c : this._items[ d ].width(); this._widths = f } }, { filter: [ "items", "settings" ], run: function () { var b = [], c = this._items, d = this.settings, e = Math.max(2 * d.items, 4), f = 2 * Math.ceil(c.length / 2), g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0, h = "", i = ""; for (g /= 2; g > 0;)b.push(this.normalize(b.length / 2, !0)), h += c[ b[ b.length - 1 ] ][ 0 ].outerHTML, b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), i = c[ b[ b.length - 1 ] ][ 0 ].outerHTML + i, g -= 1; this._clones = b, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage) } }, { filter: [ "width", "items", "settings" ], run: function () { for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;)d = f[ c - 1 ] || 0, e = this._widths[ this.relative(c) ] + this.settings.margin, f.push(d + e * a); this._coordinates = f } }, { filter: [ "width", "items", "settings" ], run: function () { var a = this.settings.stagePadding, b = this._coordinates, c = { width: Math.ceil(Math.abs(b[ b.length - 1 ])) + 2 * a, "padding-left": a || "", "padding-right": a || "" }; this.$stage.css(c) } }, { filter: [ "width", "items", "settings" ], run: function (a) { var b = this._coordinates.length, c = !this.settings.autoWidth, d = this.$stage.children(); if (c && a.items.merge) for (; b--;)a.css.width = this._widths[ this.relative(b) ], d.eq(b).css(a.css); else c && (a.css.width = a.items.width, d.css(a.css)) } }, { filter: [ "items" ], run: function () { this._coordinates.length < 1 && this.$stage.removeAttr("style") } }, { filter: [ "width", "items", "settings" ], run: function (a) { a.current = a.current ? this.$stage.children().index(a.current) : 0, a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current)), this.reset(a.current) } }, { filter: [ "position" ], run: function () { this.animate(this.coordinates(this._current)) } }, { filter: [ "width", "position", "items", "settings" ], run: function () { var a, b, c, d, e = this.settings.rtl ? 1 : -1, f = 2 * this.settings.stagePadding, g = this.coordinates(this.current()) + f, h = g + this.width() * e, i = []; for (c = 0, d = this._coordinates.length; c < d; c++)a = this._coordinates[ c - 1 ] || 0, b = Math.abs(this._coordinates[ c ]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c); this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center") } } ], e.prototype.initializeStage = function () { this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ">", { class: this.settings.stageClass }).wrap(a("<div/>", { class: this.settings.stageOuterClass })), this.$element.append(this.$stage.parent())) }, e.prototype.initializeItems = function () { var b = this.$element.find(".owl-item"); if (b.length) return this._items = b.get().map(function (b) { return a(b) }), this._mergers = this._items.map(function () { return 1 }), void this.refresh(); this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass) }, e.prototype.initialize = function () { if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) { var a, b, c; a = this.$element.find("img"), b = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, c = this.$element.children(b).width(), a.length && c <= 0 && this.preloadAutoWidthImages(a) } this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized") }, e.prototype.isVisible = function () { return !this.settings.checkVisibility || this.$element.is(":visible") }, e.prototype.setup = function () { var b = this.viewport(), c = this.options.responsive, d = -1, e = null; c ? (a.each(c, function (a) { a <= b && a > d && (d = Number(a)) }), e = a.extend({}, this.options, c[ d ]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options), this.trigger("change", { property: { name: "settings", value: e } }), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", { property: { name: "settings", value: this.settings } }) }, e.prototype.optionsLogic = function () { this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1) }, e.prototype.prepare = function (b) { var c = this.trigger("prepare", { content: b }); return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", { content: c.data }), c.data }, e.prototype.update = function () { for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) { return this[ a ] }, this._invalidated), e = {}; b < c;)(this._invalidated.all || a.grep(this._pipe[ b ].filter, d).length > 0) && this._pipe[ b ].run(e), b++; this._invalidated = {}, !this.is("valid") && this.enter("valid") }, e.prototype.width = function (a) { switch (a = a || e.Width.Default) { case e.Width.Inner: case e.Width.Outer: return this._width; default: return this._width - 2 * this.settings.stagePadding + this.settings.margin } }, e.prototype.refresh = function () { this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed") }, e.prototype.onThrottledResize = function () { b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate) }, e.prototype.onResize = function () { return !!this._items.length && (this._width !== this.$element.width() && (!!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized"))))) }, e.prototype.registerEventHandlers = function () { a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () { return !1 })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this))) }, e.prototype.onDragStart = function (b) { var d = null; 3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = { x: d[ 16 === d.length ? 12 : 4 ], y: d[ 16 === d.length ? 13 : 5 ] }) : (d = this.$stage.position(), d = { x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left, y: d.top }), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function (b) { var d = this.difference(this._drag.pointer, this.pointer(b)); a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag")) }, this))) }, e.prototype.onDragMove = function (a) { var b = null, c = null, d = null, e = this.difference(this._drag.pointer, this.pointer(a)), f = this.difference(this._drag.stage.start, e); this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x)) }, e.prototype.onDragEnd = function (b) { var d = this.difference(this._drag.pointer, this.pointer(b)), e = this._drag.stage.current, f = d.x > 0 ^ this.settings.rtl ? "left" : "right"; a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () { return !1 })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged")) }, e.prototype.closest = function (b, c) { var e = -1, f = 30, g = this.width(), h = this.coordinates(); return this.settings.freeDrag || a.each(h, a.proxy(function (a, i) { return "left" === c && b > i - f && b < i + f ? e = a : "right" === c && b > i - g - f && b < i - g + f ? e = a + 1 : this.op(b, "<", i) && this.op(b, ">", h[ a + 1 ] !== d ? h[ a + 1 ] : i - g) && (e = "left" === c ? a + 1 : a), -1 === e }, this)), this.settings.loop || (this.op(b, ">", h[ this.minimum() ]) ? e = b = this.minimum() : this.op(b, "<", h[ this.maximum() ]) && (e = b = this.maximum())), e }, e.prototype.animate = function (b) { var c = this.speed() > 0; this.is("animating") && this.onTransitionEnd(), c && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({ transform: "translate3d(" + b + "px,0px,0px)", transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "") }) : c ? this.$stage.animate({ left: b + "px" }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({ left: b + "px" }) }, e.prototype.is = function (a) { return this._states.current[ a ] && this._states.current[ a ] > 0 }, e.prototype.current = function (a) { if (a === d) return this._current; if (0 === this._items.length) return d; if (a = this.normalize(a), this._current !== a) { var b = this.trigger("change", { property: { name: "position", value: a } }); b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", { property: { name: "position", value: this._current } }) } return this._current }, e.prototype.invalidate = function (b) { return "string" === a.type(b) && (this._invalidated[ b ] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function (a, b) { return b }) }, e.prototype.reset = function (a) { (a = this.normalize(a)) !== d && (this._speed = 0, this._current = a, this.suppress([ "translate", "translated" ]), this.animate(this.coordinates(a)), this.release([ "translate", "translated" ])) }, e.prototype.normalize = function (a, b) { var c = this._items.length, e = b ? 0 : this._clones.length; return !this.isNumeric(a) || c < 1 ? a = d : (a < 0 || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a }, e.prototype.relative = function (a) { return a -= this._clones.length / 2, this.normalize(a, !0) }, e.prototype.maximum = function (a) { var b, c, d, e = this.settings, f = this._coordinates.length; if (e.loop) f = this._clones.length / 2 + this._items.length - 1; else if (e.autoWidth || e.merge) { if (b = this._items.length) for (c = this._items[ --b ].width(), d = this.$element.width(); b-- && !((c += this._items[ b ].width() + this.settings.margin) > d);); f = b + 1 } else f = e.center ? this._items.length - 1 : this._items.length - e.items; return a && (f -= this._clones.length / 2), Math.max(f, 0) }, e.prototype.minimum = function (a) { return a ? 0 : this._clones.length / 2 }, e.prototype.items = function (a) { return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[ a ]) }, e.prototype.mergers = function (a) { return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[ a ]) }, e.prototype.clones = function (b) { var c = this._clones.length / 2, e = c + this._items.length, f = function (a) { return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2 }; return b === d ? a.map(this._clones, function (a, b) { return f(b) }) : a.map(this._clones, function (a, c) { return a === b ? f(c) : null }) }, e.prototype.speed = function (a) { return a !== d && (this._speed = a), this._speed }, e.prototype.coordinates = function (b) { var c, e = 1, f = b - 1; return b === d ? a.map(this._coordinates, a.proxy(function (a, b) { return this.coordinates(b) }, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[ b ], c += (this.width() - c + (this._coordinates[ f ] || 0)) / 2 * e) : c = this._coordinates[ f ] || 0, c = Math.ceil(c)) }, e.prototype.duration = function (a, b, c) { return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed) }, e.prototype.to = function (a, b) { var c = this.current(), d = null, e = a - this.relative(c), f = (e > 0) - (e < 0), g = this._items.length, h = this.minimum(), i = this.maximum(); this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g), a = c + e, (d = ((a - h) % g + g) % g + h) !== a && d - e <= i && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a)), this.speed(this.duration(c, a, b)), this.current(a), this.isVisible() && this.update() }, e.prototype.next = function (a) { a = a || !1, this.to(this.relative(this.current()) + 1, a) }, e.prototype.prev = function (a) { a = a || !1, this.to(this.relative(this.current()) - 1, a) }, e.prototype.onTransitionEnd = function (a) { if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1; this.leave("animating"), this.trigger("translated") }, e.prototype.viewport = function () { var d; return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d }, e.prototype.replace = function (b) { this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () { return 1 === this.nodeType }).each(a.proxy(function (a, b) { b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1) }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items") }, e.prototype.add = function (b, c) { var e = this.relative(this._current); c = c === d ? this._items.length : this.normalize(c, !0), b = b instanceof jQuery ? b : a(b), this.trigger("add", { content: b, position: c }), b = this.prepare(b), 0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[ c - 1 ].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[ c ].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[ e ] && this.reset(this._items[ e ].index()), this.invalidate("items"), this.trigger("added", { content: b, position: c }) }, e.prototype.remove = function (a) { (a = this.normalize(a, !0)) !== d && (this.trigger("remove", { content: this._items[ a ], position: a }), this._items[ a ].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", { content: null, position: a })) }, e.prototype.preloadAutoWidthImages = function (b) { b.each(a.proxy(function (b, c) { this.enter("pre-loading"), c = a(c), a(new Image).one("load", a.proxy(function (a) { c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh() }, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina")) }, this)) }, e.prototype.destroy = function () { this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), !1 !== this.settings.responsive && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize)); for (var d in this._plugins) this._plugins[ d ].destroy(); this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel") }, e.prototype.op = function (a, b, c) { var d = this.settings.rtl; switch (b) { case "<": return d ? a > c : a < c; case ">": return d ? a < c : a > c; case ">=": return d ? a <= c : a >= c; case "<=": return d ? a >= c : a <= c } }, e.prototype.on = function (a, b, c, d) { a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c) }, e.prototype.off = function (a, b, c, d) { a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c) }, e.prototype.trigger = function (b, c, d, f, g) { var h = { item: { count: this._items.length, index: this.current() } }, i = a.camelCase(a.grep([ "on", b, d ], function (a) { return a }).join("-").toLowerCase()), j = a.Event([ b, "owl", d || "carousel" ].join(".").toLowerCase(), a.extend({ relatedTarget: this }, h, c)); return this._supress[ b ] || (a.each(this._plugins, function (a, b) { b.onTrigger && b.onTrigger(j) }), this.register({ type: e.Type.Event, name: b }), this.$element.trigger(j), this.settings && "function" == typeof this.settings[ i ] && this.settings[ i ].call(this, j)), j }, e.prototype.enter = function (b) { a.each([ b ].concat(this._states.tags[ b ] || []), a.proxy(function (a, b) { this._states.current[ b ] === d && (this._states.current[ b ] = 0), this._states.current[ b ]++ }, this)) }, e.prototype.leave = function (b) { a.each([ b ].concat(this._states.tags[ b ] || []), a.proxy(function (a, b) { this._states.current[ b ]-- }, this)) }, e.prototype.register = function (b) { if (b.type === e.Type.Event) { if (a.event.special[ b.name ] || (a.event.special[ b.name ] = {}), !a.event.special[ b.name ].owl) { var c = a.event.special[ b.name ]._default; a.event.special[ b.name ]._default = function (a) { return !c || !c.apply || a.namespace && -1 !== a.namespace.indexOf("owl") ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments) }, a.event.special[ b.name ].owl = !0 } } else b.type === e.Type.State && (this._states.tags[ b.name ] ? this._states.tags[ b.name ] = this._states.tags[ b.name ].concat(b.tags) : this._states.tags[ b.name ] = b.tags, this._states.tags[ b.name ] = a.grep(this._states.tags[ b.name ], a.proxy(function (c, d) { return a.inArray(c, this._states.tags[ b.name ]) === d }, this))) }, e.prototype.suppress = function (b) { a.each(b, a.proxy(function (a, b) { this._supress[ b ] = !0 }, this)) }, e.prototype.release = function (b) { a.each(b, a.proxy(function (a, b) { delete this._supress[ b ] }, this)) }, e.prototype.pointer = function (a) { var c = { x: null, y: null }; return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[ 0 ] : a.changedTouches && a.changedTouches.length ? a.changedTouches[ 0 ] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c }, e.prototype.isNumeric = function (a) { return !isNaN(parseFloat(a)) }, e.prototype.difference = function (a, b) { return { x: a.x - b.x, y: a.y - b.y } }, a.fn.owlCarousel = function (b) { var c = Array.prototype.slice.call(arguments, 1); return this.each(function () { var d = a(this), f = d.data("owl.carousel"); f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each([ "next", "prev", "to", "destroy", "refresh", "replace", "add", "remove" ], function (b, c) { f.register({ type: e.Type.Event, name: c }), f.$element.on(c + ".owl.carousel.core", a.proxy(function (a) { a.namespace && a.relatedTarget !== this && (this.suppress([ c ]), f[ c ].apply(this, [].slice.call(arguments, 1)), this.release([ c ])) }, f)) })), "string" == typeof b && "_" !== b.charAt(0) && f[ b ].apply(f, c) }) }, a.fn.owlCarousel.Constructor = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (b) { this._core = b, this._interval = null, this._visible = null, this._handlers = { "initialized.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.autoRefresh && this.watch() }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers) }; e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }, e.prototype.watch = function () { this._interval || (this._visible = this._core.isVisible(), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval)) }, e.prototype.refresh = function () { this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh()) }, e.prototype.destroy = function () { var a, c; b.clearInterval(this._interval); for (a in this._handlers) this._core.$element.off(a, this._handlers[ a ]); for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[ c ] && (this[ c ] = null) }, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (b) { this._core = b, this._loaded = [], this._handlers = { "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (b) { if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) { var c = this._core.settings, e = c.center && Math.ceil(c.items / 2) || c.items, f = c.center && -1 * e || 0, g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f, h = this._core.clones().length, i = a.proxy(function (a, b) { this.load(b) }, this); for (c.lazyLoadEager > 0 && (e += c.lazyLoadEager, c.loop && (g -= c.lazyLoadEager, e++)); f++ < e;)this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++ } }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers) }; e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }, e.prototype.load = function (c) { var d = this._core.$stage.children().eq(c), e = d && d.find(".owl-lazy"); !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) { var e, f = a(d), g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src") || f.attr("data-srcset"); this._core.trigger("load", { element: f, url: g }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () { f.css("opacity", 1), this._core.trigger("loaded", { element: f, url: g }, "lazy") }, this)).attr("src", g) : f.is("source") ? f.one("load.owl.lazy", a.proxy(function () { this._core.trigger("loaded", { element: f, url: g }, "lazy") }, this)).attr("srcset", g) : (e = new Image, e.onload = a.proxy(function () { f.css({ "background-image": 'url("' + g + '")', opacity: "1" }), this._core.trigger("loaded", { element: f, url: g }, "lazy") }, this), e.src = g) }, this)), this._loaded.push(d.get(0))) }, e.prototype.destroy = function () { var a, b; for (a in this.handlers) this._core.$element.off(a, this.handlers[ a ]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[ b ] && (this[ b ] = null) }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (c) { this._core = c, this._previousHeight = null, this._handlers = { "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.autoHeight && this.update() }, this), "changed.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.autoHeight && "position" === a.property.name && this.update() }, this), "loaded.owl.lazy": a.proxy(function (a) { a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update() }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null; var d = this; a(b).on("load", function () { d._core.settings.autoHeight && d.update() }), a(b).resize(function () { d._core.settings.autoHeight && (null != d._intervalId && clearTimeout(d._intervalId), d._intervalId = setTimeout(function () { d.update() }, 250)) }) }; e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }, e.prototype.update = function () { var b = this._core._current, c = b + this._core.settings.items, d = this._core.settings.lazyLoad, e = this._core.$stage.children().toArray().slice(b, c), f = [], g = 0; a.each(e, function (b, c) { f.push(a(c).height()) }), g = Math.max.apply(null, f), g <= 1 && d && this._previousHeight && (g = this._previousHeight), this._previousHeight = g, this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass) }, e.prototype.destroy = function () { var a, b; for (a in this._handlers) this._core.$element.off(a, this._handlers[ a ]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[ b ] && (this[ b ] = null) }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (b) { this._core = b, this._videos = {}, this._playing = null, this._handlers = { "initialized.owl.carousel": a.proxy(function (a) { a.namespace && this._core.register({ type: "state", name: "playing", tags: [ "interacting" ] }) }, this), "resize.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault() }, this), "refreshed.owl.carousel": a.proxy(function (a) { a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove() }, this), "changed.owl.carousel": a.proxy(function (a) { a.namespace && "position" === a.property.name && this._playing && this.stop() }, this), "prepared.owl.carousel": a.proxy(function (b) { if (b.namespace) { var c = a(b.content).find(".owl-video"); c.length && (c.css("display", "none"), this.fetch(c, a(b.content))) } }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) { this.play(a) }, this)) }; e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }, e.prototype.fetch = function (a, b) { var c = function () { return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube" }(), d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"), e = a.attr("data-width") || this._core.settings.videoWidth, f = a.attr("data-height") || this._core.settings.videoHeight, g = a.attr("href"); if (!g) throw new Error("Missing video URL."); if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[ 3 ].indexOf("youtu") > -1) c = "youtube"; else if (d[ 3 ].indexOf("vimeo") > -1) c = "vimeo"; else { if (!(d[ 3 ].indexOf("vzaar") > -1)) throw new Error("Video URL not supported."); c = "vzaar" } d = d[ 6 ], this._videos[ g ] = { type: c, id: d, width: e, height: f }, b.attr("data-video", g), this.thumbnail(a, this._videos[ g ]) }, e.prototype.thumbnail = function (b, c) { var d, e, f, g = c.width && c.height ? "width:" + c.width + "px;height:" + c.height + "px;" : "", h = b.find("img"), i = "src", j = "", k = this._core.settings, l = function (c) { e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? a("<div/>", { class: "owl-video-tn " + j, srcType: c }) : a("<div/>", { class: "owl-video-tn", style: "opacity:1;background-image:url(" + c + ")" }), b.after(d), b.after(e) }; if (b.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length) return l(h.attr(i)), h.remove(), !1; "youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({ type: "GET", url: "//vimeo.com/api/v2/video/" + c.id + ".json", jsonp: "callback", dataType: "jsonp", success: function (a) { f = a[ 0 ].thumbnail_large, l(f) } }) : "vzaar" === c.type && a.ajax({ type: "GET", url: "//vzaar.com/api/videos/" + c.id + ".json", jsonp: "callback", dataType: "jsonp", success: function (a) { f = a.framegrab_url, l(f) } }) }, e.prototype.stop = function () { this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video") }, e.prototype.play = function (b) { var c, d = a(b.target), e = d.closest("." + this._core.settings.itemClass), f = this._videos[ e.attr("data-video") ], g = f.width || "100%", h = f.height || this._core.$stage.height(); this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), c = a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'), c.attr("height", h), c.attr("width", g), "youtube" === f.type ? c.attr("src", "//www.youtube.com/embed/" + f.id + "?autoplay=1&rel=0&v=" + f.id) : "vimeo" === f.type ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1") : "vzaar" === f.type && c.attr("src", "//view.vzaar.com/" + f.id + "/player?autoplay=true"), a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing")) }, e.prototype.isInFullScreen = function () { var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement; return b && a(b).parent().hasClass("owl-video-frame") }, e.prototype.destroy = function () { var a, b; this._core.$element.off("click.owl.video"); for (a in this._handlers) this._core.$element.off(a, this._handlers[ a ]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[ b ] && (this[ b ] = null) }, a.fn.owlCarousel.Constructor.Plugins.Video = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) {
	var e = function (b) { this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = { "change.owl.carousel": a.proxy(function (a) { a.namespace && "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value) }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) { a.namespace && (this.swapping = "translated" == a.type) }, this), "translate.owl.carousel": a.proxy(function (a) { a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap() }, this) }, this.core.$element.on(this.handlers) }; e.Defaults = {
		animateOut: !1,
		animateIn: !1
	}, e.prototype.swap = function () { if (1 === this.core.settings.items && a.support.animation && a.support.transition) { this.core.speed(0); var b, c = a.proxy(this.clear, this), d = this.core.$stage.children().eq(this.previous), e = this.core.$stage.children().eq(this.next), f = this.core.settings.animateIn, g = this.core.settings.animateOut; this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({ left: b + "px" }).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f)) } }, e.prototype.clear = function (b) { a(b.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd() }, e.prototype.destroy = function () { var a, b; for (a in this.handlers) this.core.$element.off(a, this.handlers[ a ]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[ b ] && (this[ b ] = null) }, a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { var e = function (b) { this._core = b, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = { "changed.owl.carousel": a.proxy(function (a) { a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._paused && (this._time = 0) }, this), "initialized.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.autoplay && this.play() }, this), "play.owl.autoplay": a.proxy(function (a, b, c) { a.namespace && this.play(b, c) }, this), "stop.owl.autoplay": a.proxy(function (a) { a.namespace && this.stop() }, this), "mouseover.owl.autoplay": a.proxy(function () { this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause() }, this), "mouseleave.owl.autoplay": a.proxy(function () { this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play() }, this), "touchstart.owl.core": a.proxy(function () { this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause() }, this), "touchend.owl.core": a.proxy(function () { this._core.settings.autoplayHoverPause && this.play() }, this) }, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options) }; e.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 }, e.prototype._next = function (d) { this._call = b.setTimeout(a.proxy(this._next, this, d), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || c.hidden || this._core.next(d || this._core.settings.autoplaySpeed) }, e.prototype.read = function () { return (new Date).getTime() - this._time }, e.prototype.play = function (c, d) { var e; this._core.is("rotating") || this._core.enter("rotating"), c = c || this._core.settings.autoplayTimeout, e = Math.min(this._time % (this._timeout || c), c), this._paused ? (this._time = this.read(), this._paused = !1) : b.clearTimeout(this._call), this._time += this.read() % c - e, this._timeout = c, this._call = b.setTimeout(a.proxy(this._next, this, d), c - e) }, e.prototype.stop = function () { this._core.is("rotating") && (this._time = 0, this._paused = !0, b.clearTimeout(this._call), this._core.leave("rotating")) }, e.prototype.pause = function () { this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, b.clearTimeout(this._call)) }, e.prototype.destroy = function () { var a, b; this.stop(); for (a in this._handlers) this._core.$element.off(a, this._handlers[ a ]); for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[ b ] && (this[ b ] = null) }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { "use strict"; var e = function (b) { this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }, this._handlers = { "prepared.owl.carousel": a.proxy(function (b) { b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>") }, this), "added.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop()) }, this), "remove.owl.carousel": a.proxy(function (a) { a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1) }, this), "changed.owl.carousel": a.proxy(function (a) { a.namespace && "position" == a.property.name && this.draw() }, this), "initialized.owl.carousel": a.proxy(function (a) { a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation")) }, this), "refreshed.owl.carousel": a.proxy(function (a) { a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")) }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers) }; e.Defaults = { nav: !1, navText: [ '<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>' ], navSpeed: !1, navElement: 'button type="button" role="presentation"', navContainer: !1, navContainerClass: "owl-nav", navClass: [ "owl-prev", "owl-next" ], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: !0, dotsEach: !1, dotsData: !1, dotsSpeed: !1, dotsContainer: !1 }, e.prototype.initialize = function () { var b, c = this._core.settings; this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[ 0 ]).html(c.navText[ 0 ]).prependTo(this._controls.$relative).on("click", a.proxy(function (a) { this.prev(c.navSpeed) }, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[ 1 ]).html(c.navText[ 1 ]).appendTo(this._controls.$relative).on("click", a.proxy(function (a) { this.next(c.navSpeed) }, this)), c.dotsData || (this._templates = [ a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML") ]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", a.proxy(function (b) { var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index(); b.preventDefault(), this.to(d, c.dotsSpeed) }, this)); for (b in this._overrides) this._core[ b ] = a.proxy(this[ b ], this) }, e.prototype.destroy = function () { var a, b, c, d, e; e = this._core.settings; for (a in this._handlers) this.$element.off(a, this._handlers[ a ]); for (b in this._controls) "$relative" === b && e.navContainer ? this._controls[ b ].html("") : this._controls[ b ].remove(); for (d in this.overides) this._core[ d ] = this._overrides[ d ]; for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[ c ] && (this[ c ] = null) }, e.prototype.update = function () { var a, b, c, d = this._core.clones().length / 2, e = d + this._core.items().length, f = this._core.maximum(!0), g = this._core.settings, h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items; if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy) for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) { if (b >= h || 0 === b) { if (this._pages.push({ start: Math.min(f, a - d), end: a - d + h - 1 }), Math.min(f, a - d) === f) break; b = 0, ++c } b += this._core.mergers(this._core.relative(a)) } }, e.prototype.draw = function () { var b, c = this._core.settings, d = this._core.items().length <= c.items, e = this._core.relative(this._core.current()), f = c.loop || c.rewind; this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[ 0 ])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active")) }, e.prototype.onTrigger = function (b) { var c = this._core.settings; b.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items) } }, e.prototype.current = function () { var b = this._core.relative(this._core.current()); return a.grep(this._pages, a.proxy(function (a, c) { return a.start <= b && a.end >= b }, this)).pop() }, e.prototype.getPosition = function (b) { var c, d, e = this._core.settings; return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[ (c % d + d) % d ].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c }, e.prototype.next = function (b) { a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b) }, e.prototype.prev = function (b) { a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b) }, e.prototype.to = function (b, c, d) { var e; !d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[ (b % e + e) % e ].start, c)) : a.proxy(this._overrides.to, this._core)(b, c) }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { "use strict"; var e = function (c) { this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = { "initialized.owl.carousel": a.proxy(function (c) { c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation") }, this), "prepared.owl.carousel": a.proxy(function (b) { if (b.namespace) { var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash"); if (!c) return; this._hashes[ c ] = b.content } }, this), "changed.owl.carousel": a.proxy(function (c) { if (c.namespace && "position" === c.property.name) { var d = this._core.items(this._core.relative(this._core.current())), e = a.map(this._hashes, function (a, b) { return a === d ? b : null }).join(); if (!e || b.location.hash.slice(1) === e) return; b.location.hash = e } }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function (a) { var c = b.location.hash.substring(1), e = this._core.$stage.children(), f = this._hashes[ c ] && e.index(this._hashes[ c ]); f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0) }, this)) }; e.Defaults = { URLhashListener: !1 }, e.prototype.destroy = function () { var c, d; a(b).off("hashchange.owl.navigation"); for (c in this._handlers) this._core.$element.off(c, this._handlers[ c ]); for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[ d ] && (this[ d ] = null) }, a.fn.owlCarousel.Constructor.Plugins.Hash = e }(window.Zepto || window.jQuery, window, document), function (a, b, c, d) { function e (b, c) { var e = !1, f = b.charAt(0).toUpperCase() + b.slice(1); return a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) { if (g[ b ] !== d) return e = !c || b, !1 }), e } function f (a) { return e(a, !0) } var g = a("<support>").get(0).style, h = "Webkit Moz O ms".split(" "), i = { transition: { end: { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", transition: "transitionend" } }, animation: { end: { WebkitAnimation: "webkitAnimationEnd", MozAnimation: "animationend", OAnimation: "oAnimationEnd", animation: "animationend" } } }, j = { csstransforms: function () { return !!e("transform") }, csstransforms3d: function () { return !!e("perspective") }, csstransitions: function () { return !!e("transition") }, cssanimations: function () { return !!e("animation") } }; j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[ a.support.transition ]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[ a.support.animation ]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d()) }(window.Zepto || window.jQuery, window, document);

/*
 * jQuery Superfish Menu Plugin - v1.7.10
 * Copyright (c) 2018 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */
; !function (a, b) { "use strict"; var c = function () { var c = { bcClass: "sf-breadcrumb", menuClass: "sf-js-enabled", anchorClass: "sf-with-ul", menuArrowClass: "sf-arrows" }, d = function () { var b = /^(?![\w\W]*Windows Phone)[\w\W]*(iPhone|iPad|iPod)/i.test(navigator.userAgent); return b && a("html").css("cursor", "pointer").on("click", a.noop), b }(), e = function () { var a = document.documentElement.style; return "behavior" in a && "fill" in a && /iemobile/i.test(navigator.userAgent) }(), f = function () { return !!b.PointerEvent }(), g = function (a, b, d) { var e, f = c.menuClass; b.cssArrows && (f += " " + c.menuArrowClass), e = d ? "addClass" : "removeClass", a[ e ](f) }, h = function (b, d) { return b.find("li." + d.pathClass).slice(0, d.pathLevels).addClass(d.hoverClass + " " + c.bcClass).filter(function () { return a(this).children(d.popUpSelector).hide().show().length }).removeClass(d.pathClass) }, i = function (a, b) { var d = b ? "addClass" : "removeClass"; a.children("a")[ d ](c.anchorClass) }, j = function (a) { var b = a.css("ms-touch-action"), c = a.css("touch-action"); c = c || b, c = "pan-y" === c ? "auto" : "pan-y", a.css({ "ms-touch-action": c, "touch-action": c }) }, k = function (a) { return a.closest("." + c.menuClass) }, l = function (a) { return k(a).data("sfOptions") }, m = function () { var b = a(this), c = l(b); clearTimeout(c.sfTimer), b.siblings().superfish("hide").end().superfish("show") }, n = function (b) { b.retainPath = a.inArray(this[ 0 ], b.$path) > -1, this.superfish("hide"), this.parents("." + b.hoverClass).length || (b.onIdle.call(k(this)), b.$path.length && a.proxy(m, b.$path)()) }, o = function () { var b = a(this), c = l(b); d ? a.proxy(n, b, c)() : (clearTimeout(c.sfTimer), c.sfTimer = setTimeout(a.proxy(n, b, c), c.delay)) }, p = function (b) { var c = a(this), d = l(c), e = c.siblings(b.data.popUpSelector); return d.onHandleTouch.call(e) === !1 ? this : void (e.length > 0 && e.is(":hidden") && (c.one("click.superfish", !1), "MSPointerDown" === b.type || "pointerdown" === b.type ? c.trigger("focus") : a.proxy(m, c.parent("li"))())) }, q = function (b, c) { var g = "li:has(" + c.popUpSelector + ")"; a.fn.hoverIntent && !c.disableHI ? b.hoverIntent(m, o, g) : b.on("mouseenter.superfish", g, m).on("mouseleave.superfish", g, o); var h = "MSPointerDown.superfish"; f && (h = "pointerdown.superfish"), d || (h += " touchend.superfish"), e && (h += " mousedown.superfish"), b.on("focusin.superfish", "li", m).on("focusout.superfish", "li", o).on(h, "a", c, p) }; return { hide: function (b) { if (this.length) { var c = this, d = l(c); if (!d) return this; var e = d.retainPath === !0 ? d.$path : "", f = c.find("li." + d.hoverClass).add(this).not(e).removeClass(d.hoverClass).children(d.popUpSelector), g = d.speedOut; if (b && (f.show(), g = 0), d.retainPath = !1, d.onBeforeHide.call(f) === !1) return this; f.stop(!0, !0).animate(d.animationOut, g, function () { var b = a(this); d.onHide.call(b) }) } return this }, show: function () { var a = l(this); if (!a) return this; var b = this.addClass(a.hoverClass), c = b.children(a.popUpSelector); return a.onBeforeShow.call(c) === !1 ? this : (c.stop(!0, !0).animate(a.animation, a.speed, function () { a.onShow.call(c) }), this) }, destroy: function () { return this.each(function () { var b, d = a(this), e = d.data("sfOptions"); return !!e && (b = d.find(e.popUpSelector).parent("li"), clearTimeout(e.sfTimer), g(d, e), i(b), j(d), d.off(".superfish").off(".hoverIntent"), b.children(e.popUpSelector).attr("style", function (a, b) { if ("undefined" != typeof b) return b.replace(/display[^;]+;?/g, "") }), e.$path.removeClass(e.hoverClass + " " + c.bcClass).addClass(e.pathClass), d.find("." + e.hoverClass).removeClass(e.hoverClass), e.onDestroy.call(d), void d.removeData("sfOptions")) }) }, init: function (b) { return this.each(function () { var d = a(this); if (d.data("sfOptions")) return !1; var e = a.extend({}, a.fn.superfish.defaults, b), f = d.find(e.popUpSelector).parent("li"); e.$path = h(d, e), d.data("sfOptions", e), g(d, e, !0), i(f, !0), j(d), q(d, e), f.not("." + c.bcClass).superfish("hide", !0), e.onInit.call(this) }) } } }(); a.fn.superfish = function (b, d) { return c[ b ] ? c[ b ].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof b && b ? a.error("Method " + b + " does not exist on jQuery.fn.superfish") : c.init.apply(this, arguments) }, a.fn.superfish.defaults = { popUpSelector: "ul,.sf-mega", hoverClass: "sfHover", pathClass: "overrideThisToUse", pathLevels: 1, delay: 800, animation: { opacity: "show" }, animationOut: { opacity: "hide" }, speed: "normal", speedOut: "fast", cssArrows: !0, disableHI: !1, onInit: a.noop, onBeforeShow: a.noop, onShow: a.noop, onBeforeHide: a.noop, onHide: a.noop, onIdle: a.noop, onDestroy: a.noop, onHandleTouch: a.noop } }(jQuery, window);

/*
 *	jQuery elevateZoom 3.0.8
 *	Demo's and documentation:
 *	www.elevateweb.co.uk/image-zoom
 *	Copyright (c) 2012 Andrew Eades
 *	www.elevateweb.co.uk
 *	Dual licensed under the GPL and MIT licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */
"function" != typeof Object.create && (Object.create = function (o) { function i () { } return i.prototype = o, new i }), function (o, i, t, e) { var n = { init: function (i, t) { var e = this; e.elem = t, e.$elem = o(t), e.imageSrc = e.$elem.data("zoom-image") ? e.$elem.data("zoom-image") : e.$elem.attr("src"), e.options = o.extend({}, o.fn.elevateZoom.options, i), e.options.tint && (e.options.lensColour = "none", e.options.lensOpacity = "1"), "inner" == e.options.zoomType && (e.options.showLens = !1), e.options.zoomContainer ? e.$container = o(e.options.zoomContainer) : e.$container = o("body"), e.$elem.parent().removeAttr("title").removeAttr("alt"), e.zoomImage = e.imageSrc, e.refresh(1), o("#" + e.options.gallery + " a").click(function (i) { return e.options.galleryActiveClass && (o("#" + e.options.gallery + " a").removeClass(e.options.galleryActiveClass), o(this).addClass(e.options.galleryActiveClass)), i.preventDefault(), o(this).data("zoom-image") ? e.zoomImagePre = o(this).data("zoom-image") : e.zoomImagePre = o(this).data("image"), e.swaptheimage(o(this).data("image"), e.zoomImagePre), !1 }) }, refresh: function (o) { var i = this; setTimeout(function () { i.fetch(i.imageSrc) }, o || i.options.refresh) }, fetch: function (o) { var i = this, t = new Image; t.onload = function () { i.largeWidth = t.width, i.largeHeight = t.height, i.startZoom(), i.currentImage = i.imageSrc, i.options.onZoomedImageLoaded(i.$elem) }, t.src = o }, startZoom: function () { var i = this; if (i.nzWidth = i.$elem.width(), i.nzHeight = i.$elem.height(), i.isWindowActive = !1, i.isLensActive = !1, i.isTintActive = !1, i.overWindow = !1, i.options.imageCrossfade && (i.zoomWrap = i.$elem.wrap('<div style="height:' + i.nzHeight + "px;width:" + i.nzWidth + 'px;" class="zoomWrapper" />'), i.$elem.css("position", "absolute")), i.zoomLock = 1, i.scrollingLock = !1, i.changeBgSize = !1, i.currentZoomLevel = i.options.zoomLevel, i.nzOffset = i.$elem.offset(), i.ctOffset = i.$container.offset(), i.widthRatio = i.largeWidth / i.currentZoomLevel / i.nzWidth, i.heightRatio = i.largeHeight / i.currentZoomLevel / i.nzHeight, "window" == i.options.zoomType && (i.zoomWindowStyle = "overflow: hidden;background-position: 0px 0px;text-align:center;background-color: " + String(i.options.zoomWindowBgColour) + ";width: " + String(i.options.zoomWindowWidth) + "px;height: " + String(i.options.zoomWindowHeight) + "px;float: left;background-size: " + i.largeWidth / i.currentZoomLevel + "px " + i.largeHeight / i.currentZoomLevel + "px;display: none;z-index:100;border: " + String(i.options.borderSize) + "px solid " + i.options.borderColour + ";background-repeat: no-repeat;position: absolute;"), "inner" == i.options.zoomType) { var t = i.$elem.css("border-left-width"); i.zoomWindowStyle = "overflow: hidden;margin-left: " + String(t) + ";margin-top: " + String(t) + ";background-position: 0px 0px;width: " + String(i.nzWidth) + "px;height: " + String(i.nzHeight) + "px;px;float: left;display: none;cursor:" + i.options.cursor + ";px solid " + i.options.borderColour + ";background-repeat: no-repeat;position: absolute;" } "window" == i.options.zoomType && (i.nzHeight < i.options.zoomWindowWidth / i.widthRatio ? lensHeight = i.nzHeight : lensHeight = String(i.options.zoomWindowHeight / i.heightRatio), i.largeWidth < i.options.zoomWindowWidth ? lensWidth = i.nzWidth : lensWidth = i.options.zoomWindowWidth / i.widthRatio, i.lensStyle = "background-position: 0px 0px;width: " + String(i.options.zoomWindowWidth / i.widthRatio) + "px;height: " + String(i.options.zoomWindowHeight / i.heightRatio) + "px;float: right;display: none;overflow: hidden;z-index: 999;-webkit-transform: translateZ(0);opacity:" + i.options.lensOpacity + ";filter: alpha(opacity = " + 100 * i.options.lensOpacity + "); zoom:1;width:" + lensWidth + "px;height:" + lensHeight + "px;background-color:" + i.options.lensColour + ";cursor:" + i.options.cursor + ";border: " + i.options.lensBorderSize + "px solid " + i.options.lensBorderColour + ";background-repeat: no-repeat;position: absolute;"), i.tintStyle = "display: block;position: absolute;background-color: " + i.options.tintColour + ";filter:alpha(opacity=0);opacity: 0;width: " + i.nzWidth + "px;height: " + i.nzHeight + "px;", i.lensRound = "", "lens" == i.options.zoomType && (i.lensStyle = "background-position: 0px 0px;float: left;display: none;border: " + String(i.options.borderSize) + "px solid " + i.options.borderColour + ";width:" + String(i.options.lensSize) + "px;height:" + String(i.options.lensSize) + "px;background-repeat: no-repeat;position: absolute;"), "round" == i.options.lensShape && (i.lensRound = "border-top-left-radius: " + String(i.options.lensSize / 2 + i.options.borderSize) + "px;border-top-right-radius: " + String(i.options.lensSize / 2 + i.options.borderSize) + "px;border-bottom-left-radius: " + String(i.options.lensSize / 2 + i.options.borderSize) + "px;border-bottom-right-radius: " + String(i.options.lensSize / 2 + i.options.borderSize) + "px;"), void 0 !== i.ctOffset && (i.zoomContainer = o('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:' + (i.nzOffset.left - i.ctOffset.left) + "px;top:" + (i.nzOffset.top - i.ctOffset.top) + "px;height:" + i.nzHeight + "px;width:" + i.nzWidth + 'px;"></div>'), i.$container.append(i.zoomContainer), i.options.containLensZoom && "lens" == i.options.zoomType && i.zoomContainer.css("overflow", "hidden"), "inner" != i.options.zoomType && (i.zoomLens = o("<div class='zoomLens' style='" + i.lensStyle + i.lensRound + "'>&nbsp;</div>").appendTo(i.zoomContainer).click(function () { i.$elem.trigger("click") }), i.options.tint && (i.tintContainer = o("<div/>").addClass("tintContainer"), i.zoomTint = o("<div class='zoomTint' style='" + i.tintStyle + "'></div>"), i.zoomLens.wrap(i.tintContainer), i.zoomTintcss = i.zoomLens.after(i.zoomTint), i.zoomTintImage = o('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: ' + i.nzWidth + "px; height: " + i.nzHeight + 'px;" src="' + i.imageSrc + '">').appendTo(i.zoomLens).click(function () { i.$elem.trigger("click") }))), isNaN(i.options.zoomWindowPosition) ? i.zoomWindow = o("<div style='z-index:999;left:" + i.windowOffsetLeft + "px;top:" + i.windowOffsetTop + "px;" + i.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo("body").click(function () { i.$elem.trigger("click") }) : i.zoomWindow = o("<div style='z-index:999;left:" + i.windowOffsetLeft + "px;top:" + i.windowOffsetTop + "px;" + i.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo(i.zoomContainer).click(function () { i.$elem.trigger("click") }), i.zoomWindowContainer = o("<div/>").addClass("zoomWindowContainer").css("width", i.options.zoomWindowWidth), i.zoomWindow.wrap(i.zoomWindowContainer), "lens" == i.options.zoomType && i.zoomLens.css({ backgroundImage: "url('" + i.imageSrc + "')" }), "window" == i.options.zoomType && i.zoomWindow.css({ backgroundImage: "url('" + i.imageSrc + "')" }), "inner" == i.options.zoomType && i.zoomWindow.css({ backgroundImage: "url('" + i.imageSrc + "')" }), i.$elem.bind("touchmove", function (o) { o.preventDefault(); var t = o.originalEvent.touches[ 0 ] || o.originalEvent.changedTouches[ 0 ]; i.setPosition(t) }), i.zoomContainer.bind("touchmove", function (o) { "inner" == i.options.zoomType && i.showHideWindow("show"), o.preventDefault(); var t = o.originalEvent.touches[ 0 ] || o.originalEvent.changedTouches[ 0 ]; i.setPosition(t) }), i.zoomContainer.bind("touchend", function (o) { i.showHideWindow("hide"), i.options.showLens && i.showHideLens("hide"), i.options.tint && "inner" != i.options.zoomType && i.showHideTint("hide") }), i.$elem.bind("touchend", function (o) { i.showHideWindow("hide"), i.options.showLens && i.showHideLens("hide"), i.options.tint && "inner" != i.options.zoomType && i.showHideTint("hide") }), i.options.showLens && (i.zoomLens.bind("touchmove", function (o) { o.preventDefault(); var t = o.originalEvent.touches[ 0 ] || o.originalEvent.changedTouches[ 0 ]; i.setPosition(t) }), i.zoomLens.bind("touchend", function (o) { i.showHideWindow("hide"), i.options.showLens && i.showHideLens("hide"), i.options.tint && "inner" != i.options.zoomType && i.showHideTint("hide") })), i.$elem.bind("mousemove", function (o) { 0 == i.overWindow && i.setElements("show"), i.lastX === o.clientX && i.lastY === o.clientY || (i.setPosition(o), i.currentLoc = o), i.lastX = o.clientX, i.lastY = o.clientY }), i.zoomContainer.bind("mousemove", function (o) { 0 == i.overWindow && i.setElements("show"), i.lastX === o.clientX && i.lastY === o.clientY || (i.setPosition(o), i.currentLoc = o), i.lastX = o.clientX, i.lastY = o.clientY }), "inner" != i.options.zoomType && i.zoomLens.bind("mousemove", function (o) { i.lastX === o.clientX && i.lastY === o.clientY || (i.setPosition(o), i.currentLoc = o), i.lastX = o.clientX, i.lastY = o.clientY }), i.options.tint && "inner" != i.options.zoomType && i.zoomTint.bind("mousemove", function (o) { i.lastX === o.clientX && i.lastY === o.clientY || (i.setPosition(o), i.currentLoc = o), i.lastX = o.clientX, i.lastY = o.clientY }), "inner" == i.options.zoomType && i.zoomWindow.bind("mousemove", function (o) { i.lastX === o.clientX && i.lastY === o.clientY || (i.setPosition(o), i.currentLoc = o), i.lastX = o.clientX, i.lastY = o.clientY }), i.zoomContainer.add(i.$elem).mouseenter(function () { 0 == i.overWindow && i.setElements("show") }).mouseleave(function () { i.scrollLock || (i.setElements("hide"), i.options.onDestroy(i.$elem)) }), "inner" != i.options.zoomType && i.zoomWindow.mouseenter(function () { i.overWindow = !0, i.setElements("hide") }).mouseleave(function () { i.overWindow = !1 }), i.options.zoomLevel, i.options.minZoomLevel ? i.minZoomLevel = i.options.minZoomLevel : i.minZoomLevel = 2 * i.options.scrollZoomIncrement, i.options.scrollZoom && i.zoomContainer.add(i.$elem).bind("mousewheel DOMMouseScroll MozMousePixelScroll", function (t) { i.scrollLock = !0, clearTimeout(o.data(this, "timer")), o.data(this, "timer", setTimeout(function () { i.scrollLock = !1 }, 250)); var e = t.originalEvent.wheelDelta || -1 * t.originalEvent.detail; return t.stopImmediatePropagation(), t.stopPropagation(), t.preventDefault(), e / 120 > 0 ? i.currentZoomLevel >= i.minZoomLevel && i.changeZoomLevel(i.currentZoomLevel - i.options.scrollZoomIncrement) : i.options.maxZoomLevel ? i.currentZoomLevel <= i.options.maxZoomLevel && i.changeZoomLevel(parseFloat(i.currentZoomLevel) + i.options.scrollZoomIncrement) : i.changeZoomLevel(parseFloat(i.currentZoomLevel) + i.options.scrollZoomIncrement), !1 })) }, setElements: function (o) { if (!this.options.zoomEnabled) return !1; "show" == o && this.isWindowSet && ("inner" == this.options.zoomType && this.showHideWindow("show"), "window" == this.options.zoomType && this.showHideWindow("show"), this.options.showLens && this.showHideLens("show"), this.options.tint && "inner" != this.options.zoomType && this.showHideTint("show")), "hide" == o && ("window" == this.options.zoomType && this.showHideWindow("hide"), this.options.tint || this.showHideWindow("hide"), this.options.showLens && this.showHideLens("hide"), this.options.tint && this.showHideTint("hide")) }, setPosition: function (o) { if (!this.options.zoomEnabled) return !1; this.nzHeight = this.$elem.height(), this.nzWidth = this.$elem.width(), this.nzOffset = this.$elem.offset(), this.ctOffset = this.$container.offset(), this.options.tint && "inner" != this.options.zoomType && (this.zoomTint.css({ top: 0 }), this.zoomTint.css({ left: 0 })), this.options.responsive && !this.options.scrollZoom && this.options.showLens && (this.nzHeight < this.options.zoomWindowWidth / this.widthRatio ? lensHeight = this.nzHeight : lensHeight = String(this.options.zoomWindowHeight / this.heightRatio), this.largeWidth < this.options.zoomWindowWidth ? lensWidth = this.nzWidth : lensWidth = this.options.zoomWindowWidth / this.widthRatio, this.widthRatio = this.largeWidth / this.nzWidth, this.heightRatio = this.largeHeight / this.nzHeight, "lens" != this.options.zoomType && (this.nzHeight < this.options.zoomWindowWidth / this.widthRatio ? lensHeight = this.nzHeight : lensHeight = String(this.options.zoomWindowHeight / this.heightRatio), this.nzWidth < this.options.zoomWindowHeight / this.heightRatio ? lensWidth = this.nzWidth : lensWidth = String(this.options.zoomWindowWidth / this.widthRatio), this.zoomLens.css("width", lensWidth), this.zoomLens.css("height", lensHeight), this.options.tint && (this.zoomTintImage.css("width", this.nzWidth), this.zoomTintImage.css("height", this.nzHeight))), "lens" == this.options.zoomType && this.zoomLens.css({ width: String(this.options.lensSize) + "px", height: String(this.options.lensSize) + "px" })), this.zoomContainer.css({ top: this.nzOffset.top - this.ctOffset.top }), this.zoomContainer.css({ left: this.nzOffset.left - this.ctOffset.left }), this.mouseLeft = parseInt(o.pageX - this.nzOffset.left), this.mouseTop = parseInt(o.pageY - this.nzOffset.top), "window" == this.options.zoomType && (this.Etoppos = this.mouseTop < this.zoomLens.height() / 2, this.Eboppos = this.mouseTop > this.nzHeight - this.zoomLens.height() / 2 - 2 * this.options.lensBorderSize, this.Eloppos = this.mouseLeft < 0 + this.zoomLens.width() / 2, this.Eroppos = this.mouseLeft > this.nzWidth - this.zoomLens.width() / 2 - 2 * this.options.lensBorderSize), "inner" == this.options.zoomType && (this.Etoppos = this.mouseTop < this.nzHeight / 2 / this.heightRatio, this.Eboppos = this.mouseTop > this.nzHeight - this.nzHeight / 2 / this.heightRatio, this.Eloppos = this.mouseLeft < 0 + this.nzWidth / 2 / this.widthRatio, this.Eroppos = this.mouseLeft > this.nzWidth - this.nzWidth / 2 / this.widthRatio - 2 * this.options.lensBorderSize), this.mouseLeft < 0 || this.mouseTop < 0 || this.mouseLeft > this.nzWidth || this.mouseTop > this.nzHeight ? this.setElements("hide") : (this.options.showLens && (this.lensLeftPos = String(Math.floor(this.mouseLeft - this.zoomLens.width() / 2)), this.lensTopPos = String(Math.floor(this.mouseTop - this.zoomLens.height() / 2))), this.Etoppos && (this.lensTopPos = 0), this.Eloppos && (this.windowLeftPos = 0, this.lensLeftPos = 0, this.tintpos = 0), "window" == this.options.zoomType && (this.Eboppos && (this.lensTopPos = Math.max(this.nzHeight - this.zoomLens.height() - 2 * this.options.lensBorderSize, 0)), this.Eroppos && (this.lensLeftPos = this.nzWidth - this.zoomLens.width() - 2 * this.options.lensBorderSize)), "inner" == this.options.zoomType && (this.Eboppos && (this.lensTopPos = Math.max(this.nzHeight - 2 * this.options.lensBorderSize, 0)), this.Eroppos && (this.lensLeftPos = this.nzWidth - this.nzWidth - 2 * this.options.lensBorderSize)), "lens" == this.options.zoomType && (this.windowLeftPos = String(-1 * ((o.pageX - this.nzOffset.left) * this.widthRatio - this.zoomLens.width() / 2)), this.windowTopPos = String(-1 * ((o.pageY - this.nzOffset.top) * this.heightRatio - this.zoomLens.height() / 2)), this.zoomLens.css({ backgroundPosition: this.windowLeftPos + "px " + this.windowTopPos + "px" }), this.changeBgSize && (this.nzHeight > this.nzWidth ? ("lens" == this.options.zoomType && this.zoomLens.css({ "background-size": this.largeWidth / this.newvalueheight + "px " + this.largeHeight / this.newvalueheight + "px" }), this.zoomWindow.css({ "background-size": this.largeWidth / this.newvalueheight + "px " + this.largeHeight / this.newvalueheight + "px" })) : ("lens" == this.options.zoomType && this.zoomLens.css({ "background-size": this.largeWidth / this.newvaluewidth + "px " + this.largeHeight / this.newvaluewidth + "px" }), this.zoomWindow.css({ "background-size": this.largeWidth / this.newvaluewidth + "px " + this.largeHeight / this.newvaluewidth + "px" })), this.changeBgSize = !1), this.setWindowPostition(o)), this.options.tint && "inner" != this.options.zoomType && this.setTintPosition(o), "window" == this.options.zoomType && this.setWindowPostition(o), "inner" == this.options.zoomType && this.setWindowPostition(o), this.options.showLens && (this.fullwidth && "lens" != this.options.zoomType && (this.lensLeftPos = 0), this.zoomLens.css({ left: this.lensLeftPos + "px", top: this.lensTopPos + "px" }))) }, showHideWindow: function (o) { var i = this; "show" == o && (i.isWindowActive || (i.options.zoomWindowFadeIn ? i.zoomWindow.stop(!0, !0, !1).fadeIn(i.options.zoomWindowFadeIn) : i.zoomWindow.show(), i.isWindowActive = !0)), "hide" == o && i.isWindowActive && (i.options.zoomWindowFadeOut ? i.zoomWindow.stop(!0, !0).fadeOut(i.options.zoomWindowFadeOut, function () { i.loop && (clearInterval(i.loop), i.loop = !1) }) : i.zoomWindow.hide(), i.isWindowActive = !1) }, showHideLens: function (o) { "show" == o && (this.isLensActive || (this.options.lensFadeIn ? this.zoomLens.stop(!0, !0, !1).fadeIn(this.options.lensFadeIn) : this.zoomLens.show(), this.isLensActive = !0)), "hide" == o && this.isLensActive && (this.options.lensFadeOut ? this.zoomLens.stop(!0, !0).fadeOut(this.options.lensFadeOut) : this.zoomLens.hide(), this.isLensActive = !1) }, showHideTint: function (o) { "show" == o && (this.isTintActive || (this.options.zoomTintFadeIn ? this.zoomTint.css({ opacity: this.options.tintOpacity }).animate().stop(!0, !0).fadeIn("slow") : (this.zoomTint.css({ opacity: this.options.tintOpacity }).animate(), this.zoomTint.show()), this.isTintActive = !0)), "hide" == o && this.isTintActive && (this.options.zoomTintFadeOut ? this.zoomTint.stop(!0, !0).fadeOut(this.options.zoomTintFadeOut) : this.zoomTint.hide(), this.isTintActive = !1) }, setLensPostition: function (o) { }, setWindowPostition: function (i) { var t = this; if (isNaN(t.options.zoomWindowPosition)) t.externalContainer = o("#" + t.options.zoomWindowPosition), t.externalContainerWidth = t.externalContainer.width(), t.externalContainerHeight = t.externalContainer.height(), t.externalContainerOffset = t.externalContainer.offset(), t.windowOffsetTop = t.externalContainerOffset.top, t.windowOffsetLeft = t.externalContainerOffset.left; else switch (t.options.zoomWindowPosition) { case 1: t.windowOffsetTop = t.options.zoomWindowOffety, t.windowOffsetLeft = +t.nzWidth; break; case 2: t.options.zoomWindowHeight > t.nzHeight && (t.windowOffsetTop = -1 * (t.options.zoomWindowHeight / 2 - t.nzHeight / 2), t.windowOffsetLeft = t.nzWidth); break; case 3: t.windowOffsetTop = t.nzHeight - t.zoomWindow.height() - 2 * t.options.borderSize, t.windowOffsetLeft = t.nzWidth; break; case 4: t.windowOffsetTop = t.nzHeight, t.windowOffsetLeft = t.nzWidth; break; case 5: t.windowOffsetTop = t.nzHeight, t.windowOffsetLeft = t.nzWidth - t.zoomWindow.width() - 2 * t.options.borderSize; break; case 6: t.options.zoomWindowHeight > t.nzHeight && (t.windowOffsetTop = t.nzHeight, t.windowOffsetLeft = -1 * (t.options.zoomWindowWidth / 2 - t.nzWidth / 2 + 2 * t.options.borderSize)); break; case 7: t.windowOffsetTop = t.nzHeight, t.windowOffsetLeft = 0; break; case 8: t.windowOffsetTop = t.nzHeight, t.windowOffsetLeft = -1 * (t.zoomWindow.width() + 2 * t.options.borderSize); break; case 9: t.windowOffsetTop = t.nzHeight - t.zoomWindow.height() - 2 * t.options.borderSize, t.windowOffsetLeft = -1 * (t.zoomWindow.width() + 2 * t.options.borderSize); break; case 10: t.options.zoomWindowHeight > t.nzHeight && (t.windowOffsetTop = -1 * (t.options.zoomWindowHeight / 2 - t.nzHeight / 2), t.windowOffsetLeft = -1 * (t.zoomWindow.width() + 2 * t.options.borderSize)); break; case 11: t.windowOffsetTop = t.options.zoomWindowOffety, t.windowOffsetLeft = -1 * (t.zoomWindow.width() + 2 * t.options.borderSize); break; case 12: t.windowOffsetTop = -1 * (t.zoomWindow.height() + 2 * t.options.borderSize), t.windowOffsetLeft = -1 * (t.zoomWindow.width() + 2 * t.options.borderSize); break; case 13: t.windowOffsetTop = -1 * (t.zoomWindow.height() + 2 * t.options.borderSize), t.windowOffsetLeft = 0; break; case 14: t.options.zoomWindowHeight > t.nzHeight && (t.windowOffsetTop = -1 * (t.zoomWindow.height() + 2 * t.options.borderSize), t.windowOffsetLeft = -1 * (t.options.zoomWindowWidth / 2 - t.nzWidth / 2 + 2 * t.options.borderSize)); break; case 15: t.windowOffsetTop = -1 * (t.zoomWindow.height() + 2 * t.options.borderSize), t.windowOffsetLeft = t.nzWidth - t.zoomWindow.width() - 2 * t.options.borderSize; break; case 16: t.windowOffsetTop = -1 * (t.zoomWindow.height() + 2 * t.options.borderSize), t.windowOffsetLeft = t.nzWidth; break; default: t.windowOffsetTop = t.options.zoomWindowOffety, t.windowOffsetLeft = t.nzWidth }t.isWindowSet = !0, t.windowOffsetTop = t.windowOffsetTop + t.options.zoomWindowOffety, t.windowOffsetLeft = t.windowOffsetLeft + t.options.zoomWindowOffetx, t.zoomWindow.css({ top: t.windowOffsetTop }), t.zoomWindow.css({ left: t.windowOffsetLeft }), "inner" == t.options.zoomType && (t.zoomWindow.css({ top: 0 }), t.zoomWindow.css({ left: 0 })), t.windowLeftPos = String(-1 * ((i.pageX - t.nzOffset.left) * t.widthRatio - t.zoomWindow.width() / 2)), t.windowTopPos = String(-1 * ((i.pageY - t.nzOffset.top) * t.heightRatio - t.zoomWindow.height() / 2)), t.Etoppos && (t.windowTopPos = 0), t.Eloppos && (t.windowLeftPos = 0), t.Eboppos && (t.windowTopPos = -1 * (t.largeHeight / t.currentZoomLevel - t.zoomWindow.height())), t.Eroppos && (t.windowLeftPos = -1 * (t.largeWidth / t.currentZoomLevel - t.zoomWindow.width())), t.fullheight && (t.windowTopPos = 0), t.fullwidth && (t.windowLeftPos = 0), "window" != t.options.zoomType && "inner" != t.options.zoomType || (1 == t.zoomLock && (t.widthRatio <= 1 && (t.windowLeftPos = 0), t.heightRatio <= 1 && (t.windowTopPos = 0)), "window" == t.options.zoomType && (t.largeHeight < t.options.zoomWindowHeight && (t.windowTopPos = 0), t.largeWidth < t.options.zoomWindowWidth && (t.windowLeftPos = 0)), t.options.easing ? (t.xp || (t.xp = 0), t.yp || (t.yp = 0), t.loop || (t.loop = setInterval(function () { t.xp += (t.windowLeftPos - t.xp) / t.options.easingAmount, t.yp += (t.windowTopPos - t.yp) / t.options.easingAmount, t.scrollingLock ? (clearInterval(t.loop), t.xp = t.windowLeftPos, t.yp = t.windowTopPos, t.xp = -1 * ((i.pageX - t.nzOffset.left) * t.widthRatio - t.zoomWindow.width() / 2), t.yp = -1 * ((i.pageY - t.nzOffset.top) * t.heightRatio - t.zoomWindow.height() / 2), t.changeBgSize && (t.nzHeight > t.nzWidth ? ("lens" == t.options.zoomType && t.zoomLens.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" }), t.zoomWindow.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" })) : ("lens" != t.options.zoomType && t.zoomLens.css({ "background-size": t.largeWidth / t.newvaluewidth + "px " + t.largeHeight / t.newvalueheight + "px" }), t.zoomWindow.css({ "background-size": t.largeWidth / t.newvaluewidth + "px " + t.largeHeight / t.newvaluewidth + "px" })), t.changeBgSize = !1), t.zoomWindow.css({ backgroundPosition: t.windowLeftPos + "px " + t.windowTopPos + "px" }), t.scrollingLock = !1, t.loop = !1) : Math.round(Math.abs(t.xp - t.windowLeftPos) + Math.abs(t.yp - t.windowTopPos)) < 1 ? (clearInterval(t.loop), t.zoomWindow.css({ backgroundPosition: t.windowLeftPos + "px " + t.windowTopPos + "px" }), t.loop = !1) : (t.changeBgSize && (t.nzHeight > t.nzWidth ? ("lens" == t.options.zoomType && t.zoomLens.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" }), t.zoomWindow.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" })) : ("lens" != t.options.zoomType && t.zoomLens.css({ "background-size": t.largeWidth / t.newvaluewidth + "px " + t.largeHeight / t.newvaluewidth + "px" }), t.zoomWindow.css({ "background-size": t.largeWidth / t.newvaluewidth + "px " + t.largeHeight / t.newvaluewidth + "px" })), t.changeBgSize = !1), t.zoomWindow.css({ backgroundPosition: t.xp + "px " + t.yp + "px" })) }, 16))) : (t.changeBgSize && (t.nzHeight > t.nzWidth ? ("lens" == t.options.zoomType && t.zoomLens.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" }), t.zoomWindow.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" })) : ("lens" == t.options.zoomType && t.zoomLens.css({ "background-size": t.largeWidth / t.newvaluewidth + "px " + t.largeHeight / t.newvaluewidth + "px" }), t.largeHeight / t.newvaluewidth < t.options.zoomWindowHeight ? t.zoomWindow.css({ "background-size": t.largeWidth / t.newvaluewidth + "px " + t.largeHeight / t.newvaluewidth + "px" }) : t.zoomWindow.css({ "background-size": t.largeWidth / t.newvalueheight + "px " + t.largeHeight / t.newvalueheight + "px" })), t.changeBgSize = !1), t.zoomWindow.css({ backgroundPosition: t.windowLeftPos + "px " + t.windowTopPos + "px" }))) }, setTintPosition: function (o) { this.nzOffset = this.$elem.offset(), this.tintpos = String(-1 * (o.pageX - this.nzOffset.left - this.zoomLens.width() / 2)), this.tintposy = String(-1 * (o.pageY - this.nzOffset.top - this.zoomLens.height() / 2)), this.Etoppos && (this.tintposy = 0), this.Eloppos && (this.tintpos = 0), this.Eboppos && (this.tintposy = -1 * (this.nzHeight - this.zoomLens.height() - 2 * this.options.lensBorderSize)), this.Eroppos && (this.tintpos = -1 * (this.nzWidth - this.zoomLens.width() - 2 * this.options.lensBorderSize)), this.options.tint && (this.fullheight && (this.tintposy = 0), this.fullwidth && (this.tintpos = 0), this.zoomTintImage.css({ left: this.tintpos + "px" }), this.zoomTintImage.css({ top: this.tintposy + "px" })) }, swaptheimage: function (i, t) { var e = this, n = new Image; e.options.loadingIcon && (e.spinner = o("<div style=\"background: url('" + e.options.loadingIcon + "') no-repeat center;height:" + e.nzHeight + "px;width:" + e.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;"></div>'), e.$elem.after(e.spinner)), e.options.onImageSwap(e.$elem), n.onload = function () { e.largeWidth = n.width, e.largeHeight = n.height, e.zoomImage = t, e.zoomWindow.css({ "background-size": e.largeWidth + "px " + e.largeHeight + "px" }), e.swapAction(i, t) }, n.src = t }, swapAction: function (i, t) { var e = this, n = new Image; if (n.onload = function () { e.nzHeight = n.height, e.nzWidth = n.width, e.options.onImageSwapComplete(e.$elem), e.doneCallback() }, n.src = i, e.currentZoomLevel = e.options.zoomLevel, e.options.maxZoomLevel = !1, "lens" == e.options.zoomType && e.zoomLens.css({ backgroundImage: "url('" + t + "')" }), "window" == e.options.zoomType && e.zoomWindow.css({ backgroundImage: "url('" + t + "')" }), "inner" == e.options.zoomType && e.zoomWindow.css({ backgroundImage: "url('" + t + "')" }), e.currentImage = t, e.options.imageCrossfade) { var s = e.$elem, h = s.clone(); if (e.$elem.attr("src", i), e.$elem.after(h), h.stop(!0).fadeOut(e.options.imageCrossfade, function () { o(this).remove() }), e.$elem.width("auto").removeAttr("width"), e.$elem.height("auto").removeAttr("height"), s.fadeIn(e.options.imageCrossfade), e.options.tint && "inner" != e.options.zoomType) { var a = e.zoomTintImage, d = a.clone(); e.zoomTintImage.attr("src", t), e.zoomTintImage.after(d), d.stop(!0).fadeOut(e.options.imageCrossfade, function () { o(this).remove() }), a.fadeIn(e.options.imageCrossfade), e.zoomTint.css({ height: e.$elem.height() }), e.zoomTint.css({ width: e.$elem.width() }) } e.zoomContainer.css("height", e.$elem.height()), e.zoomContainer.css("width", e.$elem.width()), "inner" == e.options.zoomType && (e.options.constrainType || (e.zoomWrap.parent().css("height", e.$elem.height()), e.zoomWrap.parent().css("width", e.$elem.width()), e.zoomWindow.css("height", e.$elem.height()), e.zoomWindow.css("width", e.$elem.width()))), e.options.imageCrossfade && (e.zoomWrap.css("height", e.$elem.height()), e.zoomWrap.css("width", e.$elem.width())) } else e.$elem.attr("src", i), e.options.tint && (e.zoomTintImage.attr("src", t), e.zoomTintImage.attr("height", e.$elem.height()), e.zoomTintImage.css({ height: e.$elem.height() }), e.zoomTint.css({ height: e.$elem.height() })), e.zoomContainer.css("height", e.$elem.height()), e.zoomContainer.css("width", e.$elem.width()), e.options.imageCrossfade && (e.zoomWrap.css("height", e.$elem.height()), e.zoomWrap.css("width", e.$elem.width())); e.options.constrainType && ("height" == e.options.constrainType && (e.zoomContainer.css("height", e.options.constrainSize), e.zoomContainer.css("width", "auto"), e.options.imageCrossfade ? (e.zoomWrap.css("height", e.options.constrainSize), e.zoomWrap.css("width", "auto"), e.constwidth = e.zoomWrap.width()) : (e.$elem.css("height", e.options.constrainSize), e.$elem.css("width", "auto"), e.constwidth = e.$elem.width()), "inner" == e.options.zoomType && (e.zoomWrap.parent().css("height", e.options.constrainSize), e.zoomWrap.parent().css("width", e.constwidth), e.zoomWindow.css("height", e.options.constrainSize), e.zoomWindow.css("width", e.constwidth)), e.options.tint && (e.tintContainer.css("height", e.options.constrainSize), e.tintContainer.css("width", e.constwidth), e.zoomTint.css("height", e.options.constrainSize), e.zoomTint.css("width", e.constwidth), e.zoomTintImage.css("height", e.options.constrainSize), e.zoomTintImage.css("width", e.constwidth))), "width" == e.options.constrainType && (e.zoomContainer.css("height", "auto"), e.zoomContainer.css("width", e.options.constrainSize), e.options.imageCrossfade ? (e.zoomWrap.css("height", "auto"), e.zoomWrap.css("width", e.options.constrainSize), e.constheight = e.zoomWrap.height()) : (e.$elem.css("height", "auto"), e.$elem.css("width", e.options.constrainSize), e.constheight = e.$elem.height()), "inner" == e.options.zoomType && (e.zoomWrap.parent().css("height", e.constheight), e.zoomWrap.parent().css("width", e.options.constrainSize), e.zoomWindow.css("height", e.constheight), e.zoomWindow.css("width", e.options.constrainSize)), e.options.tint && (e.tintContainer.css("height", e.constheight), e.tintContainer.css("width", e.options.constrainSize), e.zoomTint.css("height", e.constheight), e.zoomTint.css("width", e.options.constrainSize), e.zoomTintImage.css("height", e.constheight), e.zoomTintImage.css("width", e.options.constrainSize)))) }, doneCallback: function () { this.options.loadingIcon && this.spinner.hide(), this.nzOffset = this.$elem.offset(), this.nzWidth = this.$elem.width(), this.nzHeight = this.$elem.height(), this.currentZoomLevel = this.options.zoomLevel, this.widthRatio = this.largeWidth / this.nzWidth, this.heightRatio = this.largeHeight / this.nzHeight, "window" == this.options.zoomType && (this.nzHeight < this.options.zoomWindowWidth / this.widthRatio ? lensHeight = this.nzHeight : lensHeight = String(this.options.zoomWindowHeight / this.heightRatio), this.options.zoomWindowWidth < this.options.zoomWindowWidth ? lensWidth = this.nzWidth : lensWidth = this.options.zoomWindowWidth / this.widthRatio, this.zoomLens && (this.zoomLens.css("width", lensWidth), this.zoomLens.css("height", lensHeight))) }, getCurrentImage: function () { return this.zoomImage }, getGalleryList: function () { var i = this; return i.gallerylist = [], i.options.gallery ? o("#" + i.options.gallery + " a").each(function () { var t = ""; o(this).data("zoom-image") ? t = o(this).data("zoom-image") : o(this).data("image") && (t = o(this).data("image")), t == i.zoomImage ? i.gallerylist.unshift({ href: "" + t, title: o(this).find("img").attr("title") }) : i.gallerylist.push({ href: "" + t, title: o(this).find("img").attr("title") }) }) : i.gallerylist.push({ href: "" + i.zoomImage, title: o(this).find("img").attr("title") }), i.gallerylist }, changeZoomLevel: function (o) { this.scrollingLock = !0, this.newvalue = parseFloat(o).toFixed(2), newvalue = parseFloat(o).toFixed(2), maxheightnewvalue = this.largeHeight / (this.options.zoomWindowHeight / this.nzHeight * this.nzHeight), maxwidthtnewvalue = this.largeWidth / (this.options.zoomWindowWidth / this.nzWidth * this.nzWidth), "inner" != this.options.zoomType && (maxheightnewvalue <= newvalue ? (this.heightRatio = this.largeHeight / maxheightnewvalue / this.nzHeight, this.newvalueheight = maxheightnewvalue, this.fullheight = !0) : (this.heightRatio = this.largeHeight / newvalue / this.nzHeight, this.newvalueheight = newvalue, this.fullheight = !1), maxwidthtnewvalue <= newvalue ? (this.widthRatio = this.largeWidth / maxwidthtnewvalue / this.nzWidth, this.newvaluewidth = maxwidthtnewvalue, this.fullwidth = !0) : (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue, this.fullwidth = !1), "lens" == this.options.zoomType && (maxheightnewvalue <= newvalue ? (this.fullwidth = !0, this.newvaluewidth = maxheightnewvalue) : (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue, this.fullwidth = !1))), "inner" == this.options.zoomType && (maxheightnewvalue = parseFloat(this.largeHeight / this.nzHeight).toFixed(2), maxwidthtnewvalue = parseFloat(this.largeWidth / this.nzWidth).toFixed(2), newvalue > maxheightnewvalue && (newvalue = maxheightnewvalue), newvalue > maxwidthtnewvalue && (newvalue = maxwidthtnewvalue), maxheightnewvalue <= newvalue ? (this.heightRatio = this.largeHeight / newvalue / this.nzHeight, newvalue > maxheightnewvalue ? this.newvalueheight = maxheightnewvalue : this.newvalueheight = newvalue, this.fullheight = !0) : (this.heightRatio = this.largeHeight / newvalue / this.nzHeight, newvalue > maxheightnewvalue ? this.newvalueheight = maxheightnewvalue : this.newvalueheight = newvalue, this.fullheight = !1), maxwidthtnewvalue <= newvalue ? (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, newvalue > maxwidthtnewvalue ? this.newvaluewidth = maxwidthtnewvalue : this.newvaluewidth = newvalue, this.fullwidth = !0) : (this.widthRatio = this.largeWidth / newvalue / this.nzWidth, this.newvaluewidth = newvalue, this.fullwidth = !1)), scrcontinue = !1, "inner" == this.options.zoomType && (this.nzWidth >= this.nzHeight && (this.newvaluewidth <= maxwidthtnewvalue ? scrcontinue = !0 : (scrcontinue = !1, this.fullheight = !0, this.fullwidth = !0)), this.nzHeight > this.nzWidth && (this.newvaluewidth <= maxwidthtnewvalue ? scrcontinue = !0 : (scrcontinue = !1, this.fullheight = !0, this.fullwidth = !0))), "inner" != this.options.zoomType && (scrcontinue = !0), scrcontinue && (this.zoomLock = 0, this.changeZoom = !0, this.options.zoomWindowHeight / this.heightRatio <= this.nzHeight && (this.currentZoomLevel = this.newvalueheight, "lens" != this.options.zoomType && "inner" != this.options.zoomType && (this.changeBgSize = !0, this.zoomLens.css({ height: String(this.options.zoomWindowHeight / this.heightRatio) + "px" })), "lens" != this.options.zoomType && "inner" != this.options.zoomType || (this.changeBgSize = !0)), this.options.zoomWindowWidth / this.widthRatio <= this.nzWidth && ("inner" != this.options.zoomType && this.newvaluewidth > this.newvalueheight && (this.currentZoomLevel = this.newvaluewidth), "lens" != this.options.zoomType && "inner" != this.options.zoomType && (this.changeBgSize = !0, this.zoomLens.css({ width: String(this.options.zoomWindowWidth / this.widthRatio) + "px" })), "lens" != this.options.zoomType && "inner" != this.options.zoomType || (this.changeBgSize = !0)), "inner" == this.options.zoomType && (this.changeBgSize = !0, this.nzWidth > this.nzHeight && (this.currentZoomLevel = this.newvaluewidth), this.nzHeight > this.nzWidth && (this.currentZoomLevel = this.newvaluewidth))), this.setPosition(this.currentLoc) }, closeAll: function () { self.zoomWindow && self.zoomWindow.hide(), self.zoomLens && self.zoomLens.hide(), self.zoomTint && self.zoomTint.hide() }, changeState: function (o) { "enable" == o && (this.options.zoomEnabled = !0), "disable" == o && (this.options.zoomEnabled = !1) } }; o.fn.elevateZoom = function (i) { return this.each(function () { var t = Object.create(n); t.init(i, this), o.data(this, "elevateZoom", t) }) }, o.fn.elevateZoom.options = { zoomActivation: "hover", zoomEnabled: !0, preloading: 1, zoomLevel: 1, scrollZoom: !1, scrollZoomIncrement: .1, minZoomLevel: !1, maxZoomLevel: !1, easing: !1, easingAmount: 12, lensSize: 200, zoomWindowWidth: 400, zoomWindowHeight: 400, zoomWindowOffetx: 0, zoomWindowOffety: 0, zoomWindowPosition: 1, zoomWindowBgColour: "#fff", lensFadeIn: !1, lensFadeOut: !1, debug: !1, zoomWindowFadeIn: !1, zoomWindowFadeOut: !1, zoomWindowAlwaysShow: !1, zoomTintFadeIn: !1, zoomTintFadeOut: !1, borderSize: 4, showLens: !0, borderColour: "#888", lensBorderSize: 1, lensBorderColour: "#000", lensShape: "square", zoomType: "window", containLensZoom: !1, lensColour: "white", lensOpacity: .4, lenszoom: !1, tint: !1, tintColour: "#333", tintOpacity: .4, gallery: !1, galleryActiveClass: "zoomGalleryActive", imageCrossfade: !1, constrainType: !1, constrainSize: !1, loadingIcon: !1, cursor: "default", responsive: !0, onComplete: o.noop, onDestroy: function () { }, onZoomedImageLoaded: function () { }, onImageSwap: o.noop, onImageSwapComplete: o.noop } }(jQuery, window, document);

/* Smart Resize  */
(function ($, sr) {
	'use strict';

	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null;
			}

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	};
	// smartresize 
	jQuery.fn[ sr ] = function (fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');

// Sticky
(function ($) {
	'use strict';

	// jQuery Pin plugin
	$.fn.themePin = function (options) {
		var scrollY = 0, lastScrollY = 0, elements = [], disabled = false, $window = $(window), fixedSideTop = [], fixedSideBottom = [], prevDataTo = [];

		options = options || {};

		var recalculateLimits = function () {
			for (var i = 0, len = elements.length; i < len; i++) {
				var $this = elements[i];

				if (options.minWidth && $window.width() <= options.minWidth) {
					if ($this.parent().is(".pin-wrapper")) { $this.unwrap(); }
					$this.css({ width: "", left: "", top: "", position: "" });
					disabled = true;
					continue;
				} else {
					disabled = false;
				}

				var $container = options.containerSelector ? ($this.closest(options.containerSelector).length ? $this.closest(options.containerSelector) : $(options.containerSelector)) : $(document.body);
				var offset = $this.offset();
				var containerOffset = $container.offset();

				if (typeof containerOffset == 'undefined') {
					continue;
				}

				var parentOffset = $this.parent().offset();

				if (!$this.parent().is(".pin-wrapper")) {
					$this.wrap("<div class='pin-wrapper'>");
				}

				var pad = $.extend({
					top: 0,
					bottom: 0
				}, options.padding || {});

				var pt = parseInt($this.parent().parent().css('padding-top')), pb = parseInt($this.parent().parent().css('padding-bottom'));

				if (typeof options.paddingOffsetTop != 'undefined') {
					pad.top += parseInt(options.paddingOffsetTop, 10);
				} else {
					pad.top += 18;
				}
				if (typeof options.paddingOffsetBottom != 'undefined') {
					pad.bottom = parseInt(options.paddingOffsetBottom, 10);
				} else {
					pad.bottom = 0;
				}

				var bb = $this.css('border-bottom'), h = $this.outerHeight();
				$this.css('border-bottom', '1px solid transparent');
				var o_h = $this.outerHeight() - h - 1;
				$this.css('border-bottom', bb);
				$this.css({ width: $this.outerWidth() <= $this.parent().width() ? $this.outerWidth() : $this.parent().width() });
				$this.parent().css("height", $this.outerHeight() + o_h);

				if ($this.outerHeight() <= $window.height()) {
					$this.data("themePin", {
						pad: pad,
						from: (options.containerSelector ? containerOffset.top : offset.top) - pad.top + pt,
						pb: pb,
						parentTop: parentOffset.top - pt,
						offset: o_h
					});
				} else {
					$this.data("themePin", {
						pad: pad,
						fromFitTop: (options.containerSelector ? containerOffset.top : offset.top) - pad.top + pt,
						from: (options.containerSelector ? containerOffset.top : offset.top) + $this.outerHeight() - $(window).height() + pt,
						pb: pb,
						parentTop: parentOffset.top - pt,
						offset: o_h
					});
				}
			}
		};

		var onScroll = function () {
			if (disabled) { return; }

			scrollY = $window.scrollTop();

			var window_height = window.innerHeight || $window.height();

			for (var i = 0, len = elements.length; i < len; i++) {
				var $this = $(elements[i]),
					data = $this.data("themePin"),
					sidebarTop;

				if (!data) {
					continue;
				}

				var $container = options.containerSelector ? ($this.closest(options.containerSelector).length ? $this.closest(options.containerSelector) : $(options.containerSelector)) : $(document.body),
					isFitToTop = ($this.outerHeight() + data.pad.top) <= window_height;
				data.end = $container.offset().top + $container.height();
				if (isFitToTop) {
					data.to = $container.offset().top + $container.height() - $this.outerHeight() - data.pad.bottom - data.pb;
				} else {
					data.to = $container.offset().top + $container.height() - window_height - data.pb;
					data.to2 = $container.height() - $this.outerHeight() - data.pad.bottom - data.pb;
				}

				if (prevDataTo[i] === 0) {
					prevDataTo[i] = data.to;
				}

				if (prevDataTo[i] != data.to) {
					if (fixedSideBottom[i] && $this.height() + $this.offset().top + data.pad.bottom < scrollY + window_height) {
						fixedSideBottom[i] = false;
					}
				}

				if (isFitToTop) {
					var from = data.from - data.pad.bottom,
						to = data.to - data.pad.top - data.offset;
					if (typeof data.fromFitTop != 'undefined' && data.fromFitTop) {
						from = data.fromFitTop - data.pad.bottom;
					}

					if (from + $this.outerHeight() > data.end || from >= to) {
						$this.css({ position: "", top: "", left: "" });
						if (options.activeClass) { $this.removeClass(options.activeClass); }
						continue;
					}
					if (scrollY > from && scrollY < to) {
						if ($this.css("position") !== "fixed") {
							console.log("Switching to fixed: from -> fixed, element top:", $this.offset().top);
						}
						$this.css({
							left: $this.offset().left,
							top: data.pad.top
						}).css("position", "fixed");
						if (options.activeClass) { $this.addClass(options.activeClass); }
					} else if (scrollY >= to) {
						console.log("Switching to absolute: fixed -> absolute, element top:", to - data.parentTop + data.pad.top);
						$this.css({
							left: "",
							top: to - data.parentTop + data.pad.top
						}).css("position", "absolute");
						if (options.activeClass) { $this.addClass(options.activeClass); }
					} else {
						$this.css({ position: "", top: "", left: "" });
						if (options.activeClass) { $this.removeClass(options.activeClass); }
					}
				} else if (($this.height() + data.pad.top + data.pad.bottom) > window_height || fixedSideTop[i] || fixedSideBottom[i]) {
					var padTop = parseInt($this.parent().parent().css('padding-top'));
					if (scrollY + data.pad.top - padTop <= data.parentTop) {
						$this.css({ position: "", top: "", bottom: "", left: "" });
						fixedSideTop[i] = fixedSideBottom[i] = false;
					} else if (scrollY >= data.to) {
						console.log("Switching to absolute: possibly from fixed, element top:", data.to2);
						$this.css({
							left: "",
							top: data.to2 + 550,
							bottom: ""
						}).css("position", "absolute");
						if (options.activeClass) { $this.addClass(options.activeClass); }
					} else {
						if (scrollY >= lastScrollY) {
							if (fixedSideTop[i]) {
								console.log("Switching to absolute: pinned top -> scrolling down, element top:", $this.offset().top);
								fixedSideTop[i] = false;
								sidebarTop = $this.offset().top - data.parentTop + 550;

								$this.css({
									left: "",
									top: sidebarTop,
									bottom: ""
								}).css("position", "absolute");
								if (options.activeClass) { $this.addClass(options.activeClass); }
							} else if (!fixedSideBottom[i] && $this.height() + $this.offset().top + data.pad.bottom < scrollY + window_height) {
								console.log("Switching to fixed at bottom");
								fixedSideBottom[i] = true;

								$this.css({
									left: $this.offset().left,
									bottom: data.pad.bottom,
									top: ""
								}).css("position", "fixed");
								if (options.activeClass) { $this.addClass(options.activeClass); }
							}
						} else if (scrollY < lastScrollY) {
							if (fixedSideBottom[i]) {
								console.log("Switching to absolute: pinned bottom -> scrolling up, element top:", $this.offset().top);
								fixedSideBottom[i] = false;
								sidebarTop = $this.offset().top - data.parentTop + 550;

								$this.css({
									left: "",
									top: sidebarTop,
									bottom: ""
								}).css("position", "absolute");
								if (options.activeClass) { $this.addClass(options.activeClass); }
							} else if (!fixedSideTop[i] && $this.offset().top >= scrollY + data.pad.top) {
								console.log("Switching to fixed at top");
								fixedSideTop[i] = true;

								$this.css({
									left: $this.offset().left,
									top: data.pad.top,
									bottom: ''
								}).css("position", "fixed");
								if (options.activeClass) { $this.addClass(options.activeClass); }
							}
						}
					}
				} else {
					if (scrollY >= (data.parentTop - data.pad.top)) {
						if ($this.css("position") !== "fixed") {
							console.log("Pinned to top in fixed");
						}
						$this.css({
							position: 'fixed',
							top: data.pad.top
						});
					} else {
						if ($this.css("position") === "fixed") {
							console.log("Unpinned from top");
						}
						$this.css({ position: "", top: "", bottom: "", left: "" });
					}

					fixedSideTop[i] = fixedSideBottom[i] = false;
				}

				prevDataTo[i] = data.to;
			}

			lastScrollY = scrollY;
		};

		var update = function () { recalculateLimits(); onScroll(); };

		this.each(function () {
			var $this = $(this),
				data = $(this).data('themePin') || {};

			if (data && data.update) { return; }
			elements.push($this);
			$("img", this).one("load", recalculateLimits);
			data.update = update;
			$(this).data('themePin', data);
			fixedSideTop.push(false);
			fixedSideBottom.push(false);
			prevDataTo.push(0);
		});

		$window.on('touchmove scroll', onScroll);
		recalculateLimits();

		$window.on('load', update);

		$(this).on('recalc.pin', function () {
			recalculateLimits();
			onScroll();
		});

		return this;
	};

	var instanceName = '__sticky';

	var Sticky = function ($el, opts) {
		return this.initialize($el, opts);
	};

	Sticky.defaults = {
		autoInit: false,
		minWidth: 767,
		padding: {
			top: 0,
			bottom: 0
		},
		offsetTop: 0,
		offsetBottom: 0
	};

	Sticky.prototype = {
		initialize: function ($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function () {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function (opts) {
			this.options = $.extend(true, {}, Sticky.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function () {
			if (!($.isFunction($.fn.themePin))) {
				return this;
			}

			var self = this,
				$el = this.options.wrapper,
				stickyResizeTrigger;

			$el.themePin(this.options);

			$(window).smartresize(function () {
				if (stickyResizeTrigger) {
					clearTimeout(stickyResizeTrigger);
				}
				stickyResizeTrigger = setTimeout(function () {
					$el.trigger('recalc.pin');
				}, 800);

				var $parent = $el.parent();

				$el.outerWidth($parent.width());
				if ($el.css('position') == 'fixed') {
					$el.css('left', $parent.offset().left);
				}
			});

			return this;
		}
	};

	// jquery plugin
	$.fn.themeSticky = function (opts) {
		return this.map(function () {
			var $this = $(this);
			if ($this.data(instanceName)) {
				$this.trigger('recalc.pin');
				setTimeout(function () {
					$this.trigger('recalc.pin');
				}, 800);
				return $this.data(instanceName);
			} else {
				return new Sticky($this, opts);
			}
		});
	}
}).apply(this, [ jQuery ]);



/**
 * jQuery || Zepto Parallax Plugin
 * @author Matthew Wagerfield - @wagerfield
 * @description Creates a parallax effect between an array of layers,
 *              driving the motion from the gyroscope output of a smartdevice.
 *              If no gyroscope is available, the cursor position is used.
 */
; (function ($, window, document, undefined) {

	// Strict Mode
	'use strict';

	// Constants
	var NAME = 'parallax';
	var MAGIC_NUMBER = 30;
	var DEFAULTS = {
		relativeInput: false,
		clipRelativeInput: false,
		calibrationThreshold: 100,
		calibrationDelay: 500,
		supportDelay: 500,
		calibrateX: false,
		calibrateY: true,
		invertX: true,
		invertY: true,
		limitX: false,
		limitY: false,
		scalarX: 10.0,
		scalarY: 10.0,
		frictionX: 0.1,
		frictionY: 0.1,
		originX: 0.5,
		originY: 0.5,
		pointerEvents: true,
		precision: 1
	};

	function Plugin (element, options) {

		// DOM Context
		this.element = element;

		// Selections
		this.$context = $(element).data('api', this);
		this.$layers = this.$context.find('.layer');

		// Data Extraction
		var data = {
			calibrateX: this.$context.data('calibrate-x') || null,
			calibrateY: this.$context.data('calibrate-y') || null,
			invertX: this.$context.data('invert-x') || null,
			invertY: this.$context.data('invert-y') || null,
			limitX: parseFloat(this.$context.data('limit-x')) || null,
			limitY: parseFloat(this.$context.data('limit-y')) || null,
			scalarX: parseFloat(this.$context.data('scalar-x')) || null,
			scalarY: parseFloat(this.$context.data('scalar-y')) || null,
			frictionX: parseFloat(this.$context.data('friction-x')) || null,
			frictionY: parseFloat(this.$context.data('friction-y')) || null,
			originX: parseFloat(this.$context.data('origin-x')) || null,
			originY: parseFloat(this.$context.data('origin-y')) || null,
			pointerEvents: this.$context.data('pointer-events') || true,
			precision: parseFloat(this.$context.data('precision')) || 1
		};

		// Delete Null Data Values
		for (var key in data) {
			if (data[ key ] === null) delete data[ key ];
		}

		// Compose Settings Object
		$.extend(this, DEFAULTS, options, data);

		// States
		this.calibrationTimer = null;
		this.calibrationFlag = true;
		this.enabled = false;
		this.depthsX = [];
		this.depthsY = [];
		this.raf = null;

		// Element Bounds
		this.bounds = null;
		this.ex = 0;
		this.ey = 0;
		this.ew = 0;
		this.eh = 0;

		// Element Center
		this.ecx = 0;
		this.ecy = 0;

		// Element Range
		this.erx = 0;
		this.ery = 0;

		// Calibration
		this.cx = 0;
		this.cy = 0;

		// Input
		this.ix = 0;
		this.iy = 0;

		// Motion
		this.mx = 0;
		this.my = 0;

		// Velocity
		this.vx = 0;
		this.vy = 0;

		// Callbacks
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
		this.onOrientationTimer = this.onOrientationTimer.bind(this);
		this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
		this.onAnimationFrame = this.onAnimationFrame.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);

		// Initialise
		this.initialise();
	}

	Plugin.prototype.transformSupport = function (value) {
		var element = document.createElement('div');
		var propertySupport = false;
		var propertyValue = null;
		var featureSupport = false;
		var cssProperty = null;
		var jsProperty = null;
		for (var i = 0, l = this.vendors.length; i < l; i++) {
			if (this.vendors[ i ] !== null) {
				cssProperty = this.vendors[ i ][ 0 ] + 'transform';
				jsProperty = this.vendors[ i ][ 1 ] + 'Transform';
			} else {
				cssProperty = 'transform';
				jsProperty = 'transform';
			}
			if (element.style[ jsProperty ] !== undefined) {
				propertySupport = true;
				break;
			}
		}
		switch (value) {
			case '2D':
				featureSupport = propertySupport;
				break;
			case '3D':
				if (propertySupport) {
					var body = document.body || document.createElement('body');
					var documentElement = document.documentElement;
					var documentOverflow = documentElement.style.overflow;
					var isCreatedBody = false;
					if (!document.body) {
						isCreatedBody = true;
						documentElement.style.overflow = 'hidden';
						documentElement.appendChild(body);
						body.style.overflow = 'hidden';
						body.style.background = '';
					}
					body.appendChild(element);
					element.style[ jsProperty ] = 'translate3d(1px,1px,1px)';
					propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
					featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none";
					documentElement.style.overflow = documentOverflow;
					body.removeChild(element);
					if (isCreatedBody) {
						body.removeAttribute('style');
						body.parentNode.removeChild(body);
					}
				}
				break;
		}
		return featureSupport;
	};

	Plugin.prototype.ww = null;
	Plugin.prototype.wh = null;
	Plugin.prototype.wcx = null;
	Plugin.prototype.wcy = null;
	Plugin.prototype.wrx = null;
	Plugin.prototype.wry = null;
	Plugin.prototype.portrait = null;
	Plugin.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
	Plugin.prototype.vendors = [ null, [ '-webkit-', 'webkit' ], [ '-moz-', 'Moz' ], [ '-o-', 'O' ], [ '-ms-', 'ms' ] ];
	Plugin.prototype.motionSupport = !!window.DeviceMotionEvent;
	Plugin.prototype.orientationSupport = !!window.DeviceOrientationEvent;
	Plugin.prototype.orientationStatus = 0;
	Plugin.prototype.transform2DSupport = Plugin.prototype.transformSupport('2D');
	Plugin.prototype.transform3DSupport = Plugin.prototype.transformSupport('3D');
	Plugin.prototype.propertyCache = {};

	Plugin.prototype.initialise = function () {

		// Configure Styles
		if (this.$context.css('position') === 'static') {
			this.$context.css({
				position: 'relative'
			});
		}

		// Pointer events
		if (!this.pointerEvents) {
			this.$context.css({
				pointerEvents: 'none'
			});
		}

		// Hardware Accelerate Context
		this.accelerate(this.$context);

		// Setup
		this.updateLayers();
		this.updateDimensions();
		this.enable();
		this.queueCalibration(this.calibrationDelay);
	};

	Plugin.prototype.updateLayers = function () {

		// Cache Layer Elements
		this.$layers = this.$context.find('.layer');
		this.depthsX = [];
		this.depthsY = [];

		// Configure Layer Styles
		this.$layers.css({
			position: 'absolute',
			display: 'block',
			left: 0,
			top: 0
		});
		this.$layers.first().css({
			position: 'relative'
		});

		// Hardware Accelerate Layers
		this.accelerate(this.$layers);

		// Cache Depths
		this.$layers.each($.proxy(function (index, element) {
			//Graceful fallback on depth if depth-x or depth-y is absent
			var depth = $(element).data('depth') || 0;
			this.depthsX.push($(element).data('depth-x') || depth);
			this.depthsY.push($(element).data('depth-y') || depth);
		}, this));
	};

	Plugin.prototype.updateDimensions = function () {
		this.ww = window.innerWidth;
		this.wh = window.innerHeight;
		this.wcx = this.ww * this.originX;
		this.wcy = this.wh * this.originY;
		this.wrx = Math.max(this.wcx, this.ww - this.wcx);
		this.wry = Math.max(this.wcy, this.wh - this.wcy);
	};

	Plugin.prototype.updateBounds = function () {
		this.bounds = this.element.getBoundingClientRect();
		this.ex = this.bounds.left;
		this.ey = this.bounds.top;
		this.ew = this.bounds.width;
		this.eh = this.bounds.height;
		this.ecx = this.ew * this.originX;
		this.ecy = this.eh * this.originY;
		this.erx = Math.max(this.ecx, this.ew - this.ecx);
		this.ery = Math.max(this.ecy, this.eh - this.ecy);
	};

	Plugin.prototype.queueCalibration = function (delay) {
		clearTimeout(this.calibrationTimer);
		this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
	};

	Plugin.prototype.enable = function () {
		if (!this.enabled) {
			this.enabled = true;
			if (this.orientationSupport) {
				this.portrait = null;
				window.addEventListener('deviceorientation', this.onDeviceOrientation);
				setTimeout(this.onOrientationTimer, this.supportDelay);
			} else {
				this.cx = 0;
				this.cy = 0;
				this.portrait = false;
				window.addEventListener('mousemove', this.onMouseMove);
			}
			window.addEventListener('resize', this.onWindowResize);
			this.raf = requestAnimationFrame(this.onAnimationFrame);
		}
	};

	Plugin.prototype.disable = function () {
		if (this.enabled) {
			this.enabled = false;
			if (this.orientationSupport) {
				window.removeEventListener('deviceorientation', this.onDeviceOrientation);
			} else {
				window.removeEventListener('mousemove', this.onMouseMove);
			}
			window.removeEventListener('resize', this.onWindowResize);
			cancelAnimationFrame(this.raf);
		}
	};

	Plugin.prototype.calibrate = function (x, y) {
		this.calibrateX = x === undefined ? this.calibrateX : x;
		this.calibrateY = y === undefined ? this.calibrateY : y;
	};

	Plugin.prototype.invert = function (x, y) {
		this.invertX = x === undefined ? this.invertX : x;
		this.invertY = y === undefined ? this.invertY : y;
	};

	Plugin.prototype.friction = function (x, y) {
		this.frictionX = x === undefined ? this.frictionX : x;
		this.frictionY = y === undefined ? this.frictionY : y;
	};

	Plugin.prototype.scalar = function (x, y) {
		this.scalarX = x === undefined ? this.scalarX : x;
		this.scalarY = y === undefined ? this.scalarY : y;
	};

	Plugin.prototype.limit = function (x, y) {
		this.limitX = x === undefined ? this.limitX : x;
		this.limitY = y === undefined ? this.limitY : y;
	};

	Plugin.prototype.origin = function (x, y) {
		this.originX = x === undefined ? this.originX : x;
		this.originY = y === undefined ? this.originY : y;
	};

	Plugin.prototype.clamp = function (value, min, max) {
		value = Math.max(value, min);
		value = Math.min(value, max);
		return value;
	};

	Plugin.prototype.css = function (element, property, value) {
		var jsProperty = this.propertyCache[ property ];
		if (!jsProperty) {
			for (var i = 0, l = this.vendors.length; i < l; i++) {
				if (this.vendors[ i ] !== null) {
					jsProperty = $.camelCase(this.vendors[ i ][ 1 ] + '-' + property);
				} else {
					jsProperty = property;
				}
				if (element.style[ jsProperty ] !== undefined) {
					this.propertyCache[ property ] = jsProperty;
					break;
				}
			}
		}
		element.style[ jsProperty ] = value;
	};

	Plugin.prototype.accelerate = function ($element) {
		for (var i = 0, l = $element.length; i < l; i++) {
			var element = $element[ i ];
			this.css(element, 'transform', 'translate3d(0,0,0)');
			this.css(element, 'transform-style', 'preserve-3d');
			this.css(element, 'backface-visibility', 'hidden');
		}
	};

	Plugin.prototype.setPosition = function (element, x, y) {
		x += 'px';
		y += 'px';
		if (this.transform3DSupport) {
			this.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)');
		} else if (this.transform2DSupport) {
			this.css(element, 'transform', 'translate(' + x + ',' + y + ')');
		} else {
			element.style.left = x;
			element.style.top = y;
		}
	};

	Plugin.prototype.onOrientationTimer = function (event) {
		if (this.orientationSupport && this.orientationStatus === 0) {
			this.disable();
			this.orientationSupport = false;
			this.enable();
		}
	};

	Plugin.prototype.onCalibrationTimer = function (event) {
		this.calibrationFlag = true;
	};

	Plugin.prototype.onWindowResize = function (event) {
		this.updateDimensions();
	};

	Plugin.prototype.onAnimationFrame = function () {
		this.updateBounds();
		var dx = this.ix - this.cx;
		var dy = this.iy - this.cy;
		if ((Math.abs(dx) > this.calibrationThreshold) || (Math.abs(dy) > this.calibrationThreshold)) {
			this.queueCalibration(0);
		}
		if (this.portrait) {
			this.mx = this.calibrateX ? dy : this.iy;
			this.my = this.calibrateY ? dx : this.ix;
		} else {
			this.mx = this.calibrateX ? dx : this.ix;
			this.my = this.calibrateY ? dy : this.iy;
		}
		this.mx *= this.ew * (this.scalarX / 100);
		this.my *= this.eh * (this.scalarY / 100);
		if (!isNaN(parseFloat(this.limitX))) {
			this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
		}
		if (!isNaN(parseFloat(this.limitY))) {
			this.my = this.clamp(this.my, -this.limitY, this.limitY);
		}
		this.vx += (this.mx - this.vx) * this.frictionX;
		this.vy += (this.my - this.vy) * this.frictionY;
		for (var i = 0, l = this.$layers.length; i < l; i++) {
			var depthX = this.depthsX[ i ];
			var depthY = this.depthsY[ i ];
			var layer = this.$layers[ i ];
			var xOffset = this.vx * (depthX * (this.invertX ? -1 : 1));
			var yOffset = this.vy * (depthY * (this.invertY ? -1 : 1));
			this.setPosition(layer, xOffset, yOffset);
		}
		this.raf = requestAnimationFrame(this.onAnimationFrame);
	};

	Plugin.prototype.onDeviceOrientation = function (event) {

		// Validate environment and event properties.
		if (!this.desktop && event.beta !== null && event.gamma !== null) {

			// Set orientation status.
			this.orientationStatus = 1;

			// Extract Rotation
			var x = (event.beta || 0) / MAGIC_NUMBER; //  -90 :: 90
			var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180

			// Detect Orientation Change
			var portrait = window.innerHeight > window.innerWidth;
			if (this.portrait !== portrait) {
				this.portrait = portrait;
				this.calibrationFlag = true;
			}

			// Set Calibration
			if (this.calibrationFlag) {
				this.calibrationFlag = false;
				this.cx = x;
				this.cy = y;
			}

			// Set Input
			this.ix = x;
			this.iy = y;
		}
	};

	Plugin.prototype.onMouseMove = function (event) {

		// Cache mouse coordinates.
		var clientX = event.clientX;
		var clientY = event.clientY;

		// Calculate Mouse Input
		if (!this.orientationSupport && this.relativeInput) {

			// Clip mouse coordinates inside element bounds.
			if (this.clipRelativeInput) {
				clientX = Math.max(clientX, this.ex);
				clientX = Math.min(clientX, this.ex + this.ew);
				clientY = Math.max(clientY, this.ey);
				clientY = Math.min(clientY, this.ey + this.eh);
			}

			// Calculate input relative to the element.
			this.ix = (clientX - this.ex - this.ecx) / this.erx;
			this.iy = (clientY - this.ey - this.ecy) / this.ery;

		} else {

			// Calculate input relative to the window.
			this.ix = (clientX - this.wcx) / this.wrx;
			this.iy = (clientY - this.wcy) / this.wry;
		}
	};

	var API = {
		enable: Plugin.prototype.enable,
		disable: Plugin.prototype.disable,
		updateLayers: Plugin.prototype.updateLayers,
		calibrate: Plugin.prototype.calibrate,
		friction: Plugin.prototype.friction,
		invert: Plugin.prototype.invert,
		scalar: Plugin.prototype.scalar,
		limit: Plugin.prototype.limit,
		origin: Plugin.prototype.origin
	};

	$.fn[ NAME ] = function (value) {
		var args = arguments;
		return this.each(function () {
			var $this = $(this);
			var plugin = $this.data(NAME);
			if (!plugin) {
				plugin = new Plugin(this, value);
				$this.data(NAME, plugin);
			}
			if (API[ value ]) {
				plugin[ value ].apply(plugin, Array.prototype.slice.call(args, 1));
			}
		});
	};

})(window.jQuery || window.Zepto, window, document);

(function ($) {

	/**
	 * Copyright 2012, Digital Fusion
	 * Licensed under the MIT license.
	 * http://teamdf.com/jquery-plugins/license/
	 *
	 * @author Sam Sehnert
	 * @desc A small plugin that checks whether elements are within
	 *       the user visible viewport of a web browser.
	 *       only accounts for vertical position, not horizontal.
	 */
	$.fn.visible = function (partial, hidden, direction, container) {

		if (this.length < 1)
			return;

		var $t = this.length > 1 ? this.eq(0) : this,
			isContained = typeof container !== 'undefined' && container !== null,
			$w = isContained ? $(container) : $(window),
			wPosition = isContained ? $w.position() : 0,
			t = $t.get(0),
			vpWidth = $w.outerWidth(),
			vpHeight = $w.outerHeight(),
			direction = (direction) ? direction : 'both',
			clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;

		if (typeof t.getBoundingClientRect === 'function') {

			// Use this native browser method, if available.
			var rec = t.getBoundingClientRect(),
				tViz = isContained ?
					rec.top - wPosition.top >= 0 && rec.top < vpHeight + wPosition.top :
					rec.top >= 0 && rec.top < vpHeight,
				bViz = isContained ?
					rec.bottom - wPosition.top > 0 && rec.bottom <= vpHeight + wPosition.top :
					rec.bottom > 0 && rec.bottom <= vpHeight,
				lViz = isContained ?
					rec.left - wPosition.left >= 0 && rec.left < vpWidth + wPosition.left :
					rec.left >= 0 && rec.left < vpWidth,
				rViz = isContained ?
					rec.right - wPosition.left > 0 && rec.right < vpWidth + wPosition.left :
					rec.right > 0 && rec.right <= vpWidth,
				vVisible = partial ? tViz || bViz : tViz && bViz,
				hVisible = partial ? lViz || rViz : lViz && rViz;

			if (direction === 'both')
				return clientSize && vVisible && hVisible;
			else if (direction === 'vertical')
				return clientSize && vVisible;
			else if (direction === 'horizontal')
				return clientSize && hVisible;
		} else {

			var viewTop = isContained ? 0 : wPosition,
				viewBottom = viewTop + vpHeight,
				viewLeft = $w.scrollLeft(),
				viewRight = viewLeft + vpWidth,
				position = $t.position(),
				_top = position.top,
				_bottom = _top + $t.height(),
				_left = position.left,
				_right = _left + $t.width(),
				compareTop = partial === true ? _bottom : _top,
				compareBottom = partial === true ? _top : _bottom,
				compareLeft = partial === true ? _right : _left,
				compareRight = partial === true ? _left : _right;

			if (direction === 'both')
				return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
			else if (direction === 'vertical')
				return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
			else if (direction === 'horizontal')
				return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
		}
	};

})(jQuery);

// Float Element
(function (theme, $) {

	'use strict';

	theme = theme || {};

	var instanceName = '__floatElement';

	var PluginFloatElement = function ($el, opts) {
		return this.initialize($el, opts);
	};

	PluginFloatElement.defaults = {
		startPos: 'top',
		speed: 3,
		horizontal: false,
		transition: false,
		transitionDelay: 0,
		transitionDuration: 500
	};

	PluginFloatElement.prototype = {
		initialize: function ($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function () {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function (opts) {
			this.options = $.extend(true, {}, PluginFloatElement.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function () {
			var self = this,
				$el = this.options.wrapper,
				$window = $(window),
				minus;

			if (self.options.style) {
				$el.attr('style', self.options.style);
			}

			if ($window.width() > 767) {

				// Set Start Position
				if (self.options.startPos == 'none') {
					minus = '';
				} else if (self.options.startPos == 'top') {
					$el.css({
						top: 0
					});
					minus = '';
				} else {
					$el.css({
						bottom: 0
					});
					minus = '-';
				}

				// Set Transition
				if (self.options.transition) {
					$el.css({
						transition: 'ease-out transform ' + self.options.transitionDuration + 'ms ' + self.options.transitionDelay + 'ms'
					});
				}

				// First Load
				self.movement(minus);

				// Scroll
				window.addEventListener('scroll', function () {
					self.movement(minus);
				}, { passive: true });

			}

			return this;
		},

		movement: function (minus) {
			var self = this,
				$el = this.options.wrapper,
				$window = $(window),
				scrollTop = $window.scrollTop(),
				elementOffset = $el.offset().top,
				currentElementOffset = (elementOffset - scrollTop);

			var scrollPercent = 100 * currentElementOffset / ($window.height());

			if ($el.visible(true)) {

				if (!self.options.horizontal) {

					$el.css({
						transform: 'translate3d(0, ' + minus + scrollPercent / self.options.speed + '%, 0)'
					});

				} else {

					$el.css({
						transform: 'translate3d(' + minus + scrollPercent / self.options.speed + '%, ' + minus + scrollPercent / self.options.speed + '%, 0)'
					});

				}
			}
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginFloatElement: PluginFloatElement
	});

	// jquery plugin
	$.fn.themePluginFloatElement = function (opts) {
		return this.map(function () {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginFloatElement($this, opts);
			}

		});
	}

}).apply(this, [ window.theme, jQuery ]);

// Word Rotator
(function (theme, $) {

	theme = theme || {};

	var instanceName = '__wordRotator';

	var PluginWordRotator = function ($el, opts) {
		return this.initialize($el, opts);
	};

	PluginWordRotator.defaults = {
		delay: 2000
	};

	PluginWordRotator.prototype = {
		initialize: function ($el, opts) {
			if ($el.data(instanceName)) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function () {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function (opts) {
			this.options = $.extend(true, {}, PluginWordRotator.defaults, opts, {
				wrapper: this.$el
			});

			return this;
		},

		build: function () {
			var $el = this.options.wrapper,
				itemsWrapper = $el.find(".wort-rotator-items"),
				items = itemsWrapper.find("> span"),
				firstItem = items.eq(0),
				firstItemClone = firstItem.clone(),
				itemHeight = firstItem.height(),
				currentItem = 1,
				currentTop = 0;

			console.log("wird", itemsWrapper);

			itemsWrapper.append(firstItemClone);

			$el
				.height(itemHeight)
				.addClass("active");

			setInterval(function () {

				currentTop = (currentItem * itemHeight);

				itemsWrapper.animate({
					top: -(currentTop) + "px"
				}, 300, function () {

					currentItem++;

					if (currentItem > items.length) {

						itemsWrapper.css("top", 0);
						currentItem = 1;

					}

				});

			}, this.options.delay);

			return this;
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginWordRotator: PluginWordRotator
	});

	// jquery plugin
	$.fn.themePluginWordRotator = function (opts) {
		return this.each(function () {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginWordRotator($this, opts);
			}

		});
	}

}).apply(this, [ window.theme, jQuery ]);