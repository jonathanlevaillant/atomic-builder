(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _states = require('./components/states');

var _states2 = _interopRequireDefault(_states);

var _dialogs = require('./components/dialogs');

var _dialogs2 = _interopRequireDefault(_dialogs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* app
 ========================================================================== */

var isComponent = function isComponent(component) {
  var dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    (0, _states2.default)(component);
  }
  if (dataComponent === 'dialog') {
    (0, _dialogs2.default)(component);
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

},{"./components/dialogs":2,"./components/states":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dialog;
/* dialogs
 ========================================================================== */

var showDialog = function showDialog(elem) {
  var focusableElems = elem.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  var firstFocusableElem = focusableElems[0];
  var lastFocusableElem = focusableElems[focusableElems.length - 1];

  elem.setAttribute('aria-hidden', false);

  window.setTimeout(function () {
    firstFocusableElem.focus();

    focusableElems.forEach(function (focusableElem) {
      if (focusableElem.addEventListener) {
        focusableElem.addEventListener('keydown', function (event) {
          if (event.which === 9) {
            if (event.target === lastFocusableElem) {
              event.preventDefault();
              event.stopPropagation();

              firstFocusableElem.focus();
            }
            /*if (event.shiftKey) {
              if (event.target === firstFocusableElem) {
                lastFocusableElem.focus();
              }
            }*/
          }
        });
      }
    });
    /*if (lastFocusableElem.addEventListener) {
      lastFocusableElem.addEventListener('keydown', (event) => {
        if (event.which === 9) {
          event.preventDefault();
          event.stopPropagation();
           firstFocusableElem.focus();
        }
      });
    }*/
  }, 100);
};

var hideDialog = function hideDialog(elem, sourceElem) {
  elem.setAttribute('aria-hidden', true);

  sourceElem.focus();
};

function dialog(elem) {
  var target = document.querySelector('.' + elem.dataset.target);
  var closes = target.querySelectorAll('[data-dismiss]');

  // elem events
  elem.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    showDialog(target);
  });

  elem.addEventListener('keydown', function (event) {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();

      showDialog(target);
    }
  });

  // dialog events
  target.addEventListener('keydown', function (event) {
    if (event.which === 27) {
      hideDialog(target, elem);
    }
  });

  closes.forEach(function (close) {
    close.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      hideDialog(target, elem);
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target === target) {
      hideDialog(target, elem);
    }
  });
}

},{}],3:[function(require,module,exports){
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

function state(elem) {
  var parameters = {
    behaviours: elem.dataset.behaviour.split(', '),
    states: elem.dataset.state.split(', '),
    tabindexes: elem.dataset.tabindex ? elem.dataset.tabindex.split(', ') : null,
    targets: elem.dataset.target.split(', ')
  };

  elem.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    setState(parameters);
  });
  elem.addEventListener('keydown', function (event) {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();

      setState(parameters);
    }
  });
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9ncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7QUFDQTs7Ozs7O0FBSkE7OztBQU1BLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxTQUFWLEVBQXFCO0FBQ3ZDLE1BQU0sZ0JBQWdCLFVBQVUsT0FBVixDQUFrQixTQUF4Qzs7QUFFQSxNQUFJLGtCQUFrQixPQUF0QixFQUErQjtBQUM3QiwwQkFBTSxTQUFOO0FBQ0Q7QUFDRCxNQUFJLGtCQUFrQixRQUF0QixFQUFnQztBQUM5QiwyQkFBTyxTQUFQO0FBQ0Q7QUFDRixDQVREOztBQVdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbEQsTUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5COztBQUVBLGFBQVcsT0FBWCxDQUFtQixVQUFDLFNBQUQsRUFBZTtBQUNoQyxnQkFBWSxTQUFaO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLFdBQVcsSUFBSSxnQkFBSixDQUFxQixVQUFDLFNBQUQsRUFBZTtBQUNuRCxjQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFELEVBQWM7QUFDOUIsZUFBUyxVQUFULENBQW9CLE9BQXBCLENBQTRCLFVBQUMsU0FBRCxFQUFlO0FBQ3pDLFlBQUksT0FBTyxVQUFVLFlBQWpCLEtBQWtDLFVBQXRDLEVBQWtEO0FBQ2hELGNBQUksVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzVDLHdCQUFZLFNBQVo7QUFDRDtBQUNGO0FBQ0YsT0FORDtBQU9ELEtBUkQ7QUFTRCxHQVZnQixDQUFqQjtBQVdBLFdBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzlCLGVBQVcsSUFEbUI7QUFFOUIsYUFBUztBQUZx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QUFzQixTQUF0QixFQUFpQyxVQUFDLEtBQUQsRUFBVztBQUMxQyxRQUFJLE1BQU0sS0FBTixLQUFnQixFQUFwQixFQUF3QjtBQUN0QixZQUFNLGNBQU47QUFDQSxZQUFNLGVBQU47O0FBRUEsZUFBUyxVQUFUO0FBQ0Q7QUFDRixHQVBEO0FBUUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYXBwXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuaW1wb3J0IHN0YXRlIGZyb20gJy4vY29tcG9uZW50cy9zdGF0ZXMnO1xuaW1wb3J0IGRpYWxvZyBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9ncyc7XG5cbmNvbnN0IGlzQ29tcG9uZW50ID0gZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICBjb25zdCBkYXRhQ29tcG9uZW50ID0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50O1xuXG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnc3RhdGUnKSB7XG4gICAgc3RhdGUoY29tcG9uZW50KTtcbiAgfVxuICBpZiAoZGF0YUNvbXBvbmVudCA9PT0gJ2RpYWxvZycpIHtcbiAgICBkaWFsb2coY29tcG9uZW50KTtcbiAgfVxufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgY29uc3QgY29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudF0nKTtcblxuICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgIGlzQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gIH0pO1xuXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuZ2V0QXR0cmlidXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29tcG9uZW50JykpIHtcbiAgICAgICAgICAgIGlzQ29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICB9KTtcbn0pO1xuIiwiLyogZGlhbG9nc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmNvbnN0IHNob3dEaWFsb2cgPSBmdW5jdGlvbiAoZWxlbSkge1xuICBjb25zdCBmb2N1c2FibGVFbGVtcyA9IGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnW2hyZWZdLCBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXScpO1xuICBjb25zdCBmaXJzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1swXTtcbiAgY29uc3QgbGFzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1tmb2N1c2FibGVFbGVtcy5sZW5ndGggLSAxXTtcblxuICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuXG4gICAgZm9jdXNhYmxlRWxlbXMuZm9yRWFjaCgoZm9jdXNhYmxlRWxlbSkgPT4ge1xuICAgICAgaWYgKGZvY3VzYWJsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBmb2N1c2FibGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDkpIHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGxhc3RGb2N1c2FibGVFbGVtKSB7XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyppZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmlyc3RGb2N1c2FibGVFbGVtKSB7XG4gICAgICAgICAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSovXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvKmlmIChsYXN0Rm9jdXNhYmxlRWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICBsYXN0Rm9jdXNhYmxlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PT0gOSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSovXG4gIH0sIDEwMCk7XG59O1xuXG5jb25zdCBoaWRlRGlhbG9nID0gZnVuY3Rpb24gKGVsZW0sIHNvdXJjZUVsZW0pIHtcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgc291cmNlRWxlbS5mb2N1cygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlhbG9nKGVsZW0pIHtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7ZWxlbS5kYXRhc2V0LnRhcmdldH1gKTtcbiAgY29uc3QgY2xvc2VzID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJyk7XG5cbiAgLy8gZWxlbSBldmVudHNcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBzaG93RGlhbG9nKHRhcmdldCk7XG4gIH0pO1xuXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2hvd0RpYWxvZyh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gZGlhbG9nIGV2ZW50c1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgIGhpZGVEaWFsb2codGFyZ2V0LCBlbGVtKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNsb3Nlcy5mb3JFYWNoKChjbG9zZSkgPT4ge1xuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGhpZGVEaWFsb2codGFyZ2V0LCBlbGVtKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICBoaWRlRGlhbG9nKHRhcmdldCwgZWxlbSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIHN0YXRlc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmNvbnN0IGFkZCA9ICdhZGQnO1xuY29uc3QgcmVtb3ZlID0gJ3JlbW92ZSc7XG5jb25zdCB0b2dnbGUgPSAndG9nZ2xlJztcbmNvbnN0IGFyaWFzID0gW1xuICB7XG4gICAgdHlwZTogJ2FyaWEtaGlkZGVuJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWRpc2FibGVkJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLXNlbGVjdGVkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtZXhwYW5kZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1wcmVzc2VkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtY2hlY2tlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbl07XG5cbmNvbnN0IHNldENsYXNzID0gZnVuY3Rpb24gKGVsZW0sIHN0YXRlQ2xhc3MsIGJlaGF2aW91cikge1xuICBpZiAoc3RhdGVDbGFzcyAhPT0gJ2ZhbHNlJykge1xuICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKHN0YXRlQ2xhc3MpO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShzdGF0ZUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKHN0YXRlQ2xhc3MpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0QXJpYSA9IGZ1bmN0aW9uIChlbGVtLCBiZWhhdmlvdXIpIHtcbiAgYXJpYXMuZm9yRWFjaCgoYXJpYSkgPT4ge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gYXJpYTtcbiAgICBjb25zdCB7IGluaXQgfSA9IGFyaWE7XG5cbiAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUodHlwZSkpIHtcbiAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICBpZiAoIWluaXQpIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBlbGVtLmdldEF0dHJpYnV0ZSh0eXBlKSAhPT0gJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZWxlbSwgdGFiaW5kZXgsIGJlaGF2aW91cikge1xuICBpZiAodGFiaW5kZXggPT09ICd0cnVlJykge1xuICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBlbGVtLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSA9PT0gJy0xJyA/IDAgOiAtMSk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJzKSB7XG4gIHBhcmFtZXRlcnMuYmVoYXZpb3Vycy5mb3JFYWNoKChiZWhhdmlvdXIsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtwYXJhbWV0ZXJzLnRhcmdldHNbaW5kZXhdfWApO1xuICAgIGNvbnN0IHN0YXRlQ2xhc3MgPSBwYXJhbWV0ZXJzLnN0YXRlc1tpbmRleF07XG4gICAgY29uc3QgdGFiaW5kZXggPSBwYXJhbWV0ZXJzLnRhYmluZGV4ZXMgIT09IG51bGwgPyBwYXJhbWV0ZXJzLnRhYmluZGV4ZXNbaW5kZXhdIDogbnVsbDtcblxuICAgIGVsZW1zLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCBhZGQpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIGFkZCk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCBhZGQpO1xuICAgICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCByZW1vdmUpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIHJlbW92ZSk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCByZW1vdmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgdG9nZ2xlKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCB0b2dnbGUpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgdG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGF0ZShlbGVtKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgYmVoYXZpb3VyczogZWxlbS5kYXRhc2V0LmJlaGF2aW91ci5zcGxpdCgnLCAnKSxcbiAgICBzdGF0ZXM6IGVsZW0uZGF0YXNldC5zdGF0ZS5zcGxpdCgnLCAnKSxcbiAgICB0YWJpbmRleGVzOiBlbGVtLmRhdGFzZXQudGFiaW5kZXggPyBlbGVtLmRhdGFzZXQudGFiaW5kZXguc3BsaXQoJywgJykgOiBudWxsLFxuICAgIHRhcmdldHM6IGVsZW0uZGF0YXNldC50YXJnZXQuc3BsaXQoJywgJyksXG4gIH07XG5cbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBzZXRTdGF0ZShwYXJhbWV0ZXJzKTtcbiAgfSk7XG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2V0U3RhdGUocGFyYW1ldGVycyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
