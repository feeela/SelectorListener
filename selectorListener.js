define(function () {

    var animationNamePrefix = 'selector-listener-',
        sequence = 0,
        client = (function () {
            "use strict";
            var vendors = {
                w3c: {
                    prefix: "",
                    animationEndEvent: "animationend"
                },
                webkit: {
                    prefix: "-webkit-",
                    animationEndEvent: "webkitAnimationEnd"
                },
                moz: {
                    prefix: "-moz-",
                    animationEndEvent: "animationend"
                },
                MS: {
                    prefix: "-ms-",
                    animationEndEvent: "MSAnimationEnd"
                },
                o: {
                    prefix: "-o-",
                    animationEndEvent: "oanimationend"
                }
            };

            for (var vendor in vendors) {
                if (document.body.style[vendors[vendor].prefix + "animation"] !== undefined) {
                    return vendors[vendor];
                }
            }
        })(),
        listener = {};


    /**
     * @param {String} selector
     * @param {String} animationName
     */
    function appendAnimationStyles(selector, animationName) {
        "use strict";

        var styleAnimation = document.createElement('style');
        styleAnimation.innerHTML = '@' + client.prefix + 'keyframes ' + animationName + ' { from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent } }'
            + "\n" + selector + ' { animation-duration: 0.001s; animation-name: ' + animationName + '; '
            + client.prefix + 'animation-duration: 0.001s; '
            + client.prefix + 'animation-name: ' + animationName + ';  }';

        document.head.appendChild(styleAnimation);
    }

    /**
     * Add an event listener for the animationEndEvent
     * @param {String} animationName
     */
    function addEvent(animationName) {
        "use strict";
        document.addEventListener(client.animationEndEvent, function (event) {
            if (listener[animationName] !== undefined) {
                listener[animationName].callback.call(event.target, event.target);
            }
        });
    }

    var module = {

        /**
         *
         * @param {String} selector
         * @param {Function} callback
         */
        add: function (selector, callback) {
            "use strict";

            var animationName = animationNamePrefix + (sequence++);

            listener[animationName] = {
                selector: selector,
                callback: callback
            };

            appendAnimationStyles(selector, animationName);
            addEvent(animationName);
        }

    };

    return module;
});