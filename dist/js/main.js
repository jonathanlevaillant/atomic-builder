(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = modal;
/* modals
 ========================================================================== */

function modal(component) {
    component.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = state;
/* states
 ========================================================================== */

var add = 'add';
var remove = 'remove';
var toggle = 'toggle';
var arias = [{
    type: 'aria-hidden',
    init: false
}, {
    type: 'aria-disabled',
    init: false
}, {
    type: 'aria-selected',
    init: true
}, {
    type: 'aria-expanded',
    init: true
}, {
    type: 'aria-pressed',
    init: true
}, {
    type: 'aria-checked',
    init: true
}];

var setClass = function setClass(elem, stateClass, behaviour) {
    if (stateClass !== 'false') {
        if (behaviour === add) {
            elem.classList.add(stateClass);
        } else if (behaviour === remove) {
            elem.classList.remove(stateClass);
        } else {
            elem.classList.toggle(stateClass);
        }
    }
};

var setAria = function setAria(elem, behaviour) {
    arias.forEach(function (aria) {
        var type = aria.type;
        var init = aria.init;


        if (elem.hasAttribute(type)) {
            if (behaviour === add) {
                if (!init) {
                    elem.setAttribute(type, false);
                } else {
                    elem.setAttribute(type, true);
                }
            } else if (behaviour === remove) {
                if (!init) {
                    elem.setAttribute(type, true);
                } else {
                    elem.setAttribute(type, false);
                }
            } else {
                elem.setAttribute(type, elem.getAttribute(type) !== 'true');
            }
        }
    });
};

var setTabindex = function setTabindex(elem, tabindex, behaviour) {
    if (tabindex === 'true') {
        if (behaviour === add) {
            elem.setAttribute('tabindex', 0);
        } else if (behaviour === remove) {
            elem.setAttribute('tabindex', -1);
        } else {
            elem.setAttribute('tabindex', elem.getAttribute('tabindex') === '-1' ? 0 : -1);
        }
    }
};

var setState = function setState(parameters) {
    parameters.behaviours.forEach(function (behaviour, index) {
        var elems = document.querySelectorAll('.' + parameters.targets[index]);
        var stateClass = parameters.states[index];
        var tabindex = parameters.tabindexes !== null ? parameters.tabindexes[index] : null;

        elems.forEach(function (elem) {
            if (behaviour === add) {
                setClass(elem, stateClass, add);
                setAria(elem, add);
                setTabindex(elem, tabindex, add);
            } else if (behaviour === remove) {
                setClass(elem, stateClass, remove);
                setAria(elem, remove);
                setTabindex(elem, tabindex, remove);
            } else {
                setClass(elem, stateClass, toggle);
                setAria(elem, toggle);
                setTabindex(elem, tabindex, toggle);
            }
        });
    });
};

function state(component) {
    var parameters = {
        behaviours: component.dataset.behaviour.split(', '),
        states: component.dataset.state.split(', '),
        tabindexes: component.dataset.tabindex ? component.dataset.tabindex.split(', ') : null,
        targets: component.dataset.target.split(', ')
    };

    component.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        setState(parameters);
    });
    component.addEventListener('keypress', function (event) {
        if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();

            setState(parameters);
        }
    });
}

},{}],3:[function(require,module,exports){
'use strict';

var _states = require('./components/states');

var _states2 = _interopRequireDefault(_states);

var _modals = require('./components/modals');

var _modals2 = _interopRequireDefault(_modals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* main
 ========================================================================== */

var isComponent = function isComponent(component) {
    var dataComponent = component.dataset.component;

    if (dataComponent === 'state') {
        (0, _states2.default)(component);
    }
    if (dataComponent === 'modal') {
        (0, _modals2.default)(component);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var components = document.querySelectorAll('[data-component]');

    components.forEach(function (component) {
        isComponent(component);
    });

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (component) {
                if (typeof component.getAttribute === 'function') {
                    if (component.getAttribute('data-component')) {
                        isComponent(component);
                    }
                }
            });
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

},{"./components/modals":1,"./components/states":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9tb2RhbHMuanMiLCJzcmMvanMvY29tcG9uZW50cy9zdGF0ZXMuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0d3QixLO0FBSHhCOzs7QUFHZSxTQUFTLEtBQVQsQ0FBZSxTQUFmLEVBQTBCO0FBQ3JDLGNBQVUsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBQyxLQUFELEVBQVc7QUFDM0MsY0FBTSxjQUFOO0FBQ0EsY0FBTSxlQUFOO0FBQ0gsS0FIRDtBQUlIOzs7Ozs7OztrQkNrR3VCLEs7QUExR3hCOzs7QUFHQSxJQUFNLE1BQU0sS0FBWjtBQUNBLElBQU0sU0FBUyxRQUFmO0FBQ0EsSUFBTSxTQUFTLFFBQWY7QUFDQSxJQUFNLFFBQVEsQ0FDVjtBQUNJLFVBQU0sYUFEVjtBQUVJLFVBQU07QUFGVixDQURVLEVBS1Y7QUFDSSxVQUFNLGVBRFY7QUFFSSxVQUFNO0FBRlYsQ0FMVSxFQVNWO0FBQ0ksVUFBTSxlQURWO0FBRUksVUFBTTtBQUZWLENBVFUsRUFhVjtBQUNJLFVBQU0sZUFEVjtBQUVJLFVBQU07QUFGVixDQWJVLEVBaUJWO0FBQ0ksVUFBTSxjQURWO0FBRUksVUFBTTtBQUZWLENBakJVLEVBcUJWO0FBQ0ksVUFBTSxjQURWO0FBRUksVUFBTTtBQUZWLENBckJVLENBQWQ7O0FBMkJBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBVSxJQUFWLEVBQWdCLFVBQWhCLEVBQTRCLFNBQTVCLEVBQXVDO0FBQ3BELFFBQUksZUFBZSxPQUFuQixFQUE0QjtBQUN4QixZQUFJLGNBQWMsR0FBbEIsRUFBdUI7QUFDbkIsaUJBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsVUFBbkI7QUFDSCxTQUZELE1BRU8sSUFBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQzdCLGlCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNC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O0FBV0EsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNoRCxRQUFNLGFBQWEsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsQ0FBbkI7O0FBRUEsZUFBVyxPQUFYLENBQW1CLFVBQUMsU0FBRCxFQUFlO0FBQzlCLG9CQUFZLFNBQVo7QUFDSCxLQUZEOztBQUlBLFFBQU0sV0FBVyxJQUFJLGdCQUFKLENBQXFCLFVBQUMsU0FBRCxFQUFlO0FBQ2pELGtCQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFELEVBQWM7QUFDNUIscUJBQVMsVUFBVCxDQUFvQixPQUFwQixDQUE0QixVQUFDLFNBQUQsRUFBZTtBQUN2QyxvQkFBSSxPQUFPLFVBQVUsWUFBakIsS0FBa0MsVUFBdEMsRUFBa0Q7QUFDOUMsd0JBQUksVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzFDLG9DQUFZLFNBQVo7QUFDSDtBQUNKO0FBQ0osYUFORDtBQU9ILFNBUkQ7QUFTSCxLQVZnQixDQUFqQjtBQVdBLGFBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzVCLG1CQUFXLElBRGlCO0FBRTVCLGlCQUFTO0FBRm1CLEtBQWhDO0FBSUgsQ0F0QkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogbW9kYWxzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9kYWwoY29tcG9uZW50KSB7XG4gICAgY29tcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xufVxuIiwiLyogc3RhdGVzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuY29uc3QgYWRkID0gJ2FkZCc7XG5jb25zdCByZW1vdmUgPSAncmVtb3ZlJztcbmNvbnN0IHRvZ2dsZSA9ICd0b2dnbGUnO1xuY29uc3QgYXJpYXMgPSBbXG4gICAge1xuICAgICAgICB0eXBlOiAnYXJpYS1oaWRkZW4nLFxuICAgICAgICBpbml0OiBmYWxzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogJ2FyaWEtZGlzYWJsZWQnLFxuICAgICAgICBpbml0OiBmYWxzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdHlwZTogJ2FyaWEtc2VsZWN0ZWQnLFxuICAgICAgICBpbml0OiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnYXJpYS1leHBhbmRlZCcsXG4gICAgICAgIGluaXQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHR5cGU6ICdhcmlhLXByZXNzZWQnLFxuICAgICAgICBpbml0OiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0eXBlOiAnYXJpYS1jaGVja2VkJyxcbiAgICAgICAgaW5pdDogdHJ1ZSxcbiAgICB9LFxuXTtcblxuY29uc3Qgc2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgc3RhdGVDbGFzcywgYmVoYXZpb3VyKSB7XG4gICAgaWYgKHN0YXRlQ2xhc3MgIT09ICdmYWxzZScpIHtcbiAgICAgICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoc3RhdGVDbGFzcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShzdGF0ZUNsYXNzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZShzdGF0ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IHNldEFyaWEgPSBmdW5jdGlvbiAoZWxlbSwgYmVoYXZpb3VyKSB7XG4gICAgYXJpYXMuZm9yRWFjaCgoYXJpYSkgPT4ge1xuICAgICAgICBjb25zdCB7IHR5cGUgfSA9IGFyaWE7XG4gICAgICAgIGNvbnN0IHsgaW5pdCB9ID0gYXJpYTtcblxuICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUodHlwZSkpIHtcbiAgICAgICAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICAgICAgICAgIGlmICghaW5pdCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgICAgICAgICAgIGlmICghaW5pdCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBlbGVtLmdldEF0dHJpYnV0ZSh0eXBlKSAhPT0gJ3RydWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZWxlbSwgdGFiaW5kZXgsIGJlaGF2aW91cikge1xuICAgIGlmICh0YWJpbmRleCA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGVsZW0uZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID09PSAnLTEnID8gMCA6IC0xKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IHNldFN0YXRlID0gZnVuY3Rpb24gKHBhcmFtZXRlcnMpIHtcbiAgICBwYXJhbWV0ZXJzLmJlaGF2aW91cnMuZm9yRWFjaCgoYmVoYXZpb3VyLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3BhcmFtZXRlcnMudGFyZ2V0c1tpbmRleF19YCk7XG4gICAgICAgIGNvbnN0IHN0YXRlQ2xhc3MgPSBwYXJhbWV0ZXJzLnN0YXRlc1tpbmRleF07XG4gICAgICAgIGNvbnN0IHRhYmluZGV4ID0gcGFyYW1ldGVycy50YWJpbmRleGVzICE9PSBudWxsID8gcGFyYW1ldGVycy50YWJpbmRleGVzW2luZGV4XSA6IG51bGw7XG5cbiAgICAgICAgZWxlbXMuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICAgICAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgYWRkKTtcbiAgICAgICAgICAgICAgICBzZXRBcmlhKGVsZW0sIGFkZCk7XG4gICAgICAgICAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIGFkZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgcmVtb3ZlKTtcbiAgICAgICAgICAgICAgICBzZXRBcmlhKGVsZW0sIHJlbW92ZSk7XG4gICAgICAgICAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHJlbW92ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHRvZ2dsZSk7XG4gICAgICAgICAgICAgICAgc2V0QXJpYShlbGVtLCB0b2dnbGUpO1xuICAgICAgICAgICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCB0b2dnbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXRlKGNvbXBvbmVudCkge1xuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgIGJlaGF2aW91cnM6IGNvbXBvbmVudC5kYXRhc2V0LmJlaGF2aW91ci5zcGxpdCgnLCAnKSxcbiAgICAgICAgc3RhdGVzOiBjb21wb25lbnQuZGF0YXNldC5zdGF0ZS5zcGxpdCgnLCAnKSxcbiAgICAgICAgdGFiaW5kZXhlczogY29tcG9uZW50LmRhdGFzZXQudGFiaW5kZXggPyBjb21wb25lbnQuZGF0YXNldC50YWJpbmRleC5zcGxpdCgnLCAnKSA6IG51bGwsXG4gICAgICAgIHRhcmdldHM6IGNvbXBvbmVudC5kYXRhc2V0LnRhcmdldC5zcGxpdCgnLCAnKSxcbiAgICB9O1xuXG4gICAgY29tcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICAgIH0pO1xuICAgIGNvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCIvKiBtYWluXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuaW1wb3J0IHN0YXRlIGZyb20gJy4vY29tcG9uZW50cy9zdGF0ZXMnO1xuaW1wb3J0IG1vZGFsIGZyb20gJy4vY29tcG9uZW50cy9tb2RhbHMnO1xuXG5jb25zdCBpc0NvbXBvbmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICBjb25zdCBkYXRhQ29tcG9uZW50ID0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50O1xuXG4gICAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdzdGF0ZScpIHtcbiAgICAgICAgc3RhdGUoY29tcG9uZW50KTtcbiAgICB9XG4gICAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgbW9kYWwoY29tcG9uZW50KTtcbiAgICB9XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb21wb25lbnRdJyk7XG5cbiAgICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBpc0NvbXBvbmVudChjb21wb25lbnQpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29tcG9uZW50JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICB9KTtcbn0pO1xuIl19
