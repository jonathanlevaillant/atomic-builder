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

var page = document.querySelector('.js-page');
var article = document.querySelector('.js-article');

var keyCodes = {
  enter: 13,
  escape: 27,
  tab: 9
};

var showDialog = function showDialog(elem) {
  var focusableElems = elem.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  var firstFocusableElem = focusableElems[0];
  var secondFocusableElem = focusableElems[1];
  var lastFocusableElem = focusableElems[focusableElems.length - 1];

  elem.setAttribute('aria-hidden', false);
  article.setAttribute('aria-hidden', true);
  page.classList.add('is-inactive');

  if (!firstFocusableElem) {
    return;
  }

  window.setTimeout(function () {
    if (secondFocusableElem) {
      secondFocusableElem.focus();
    } else {
      firstFocusableElem.focus();
    }

    focusableElems.forEach(function (focusableElem) {
      if (focusableElem.addEventListener) {
        focusableElem.addEventListener('keydown', function (event) {
          var isTabPressed = event.which === keyCodes.tab;

          if (!isTabPressed) {
            return;
          }
          if (event.shiftKey) {
            if (event.target === firstFocusableElem) {
              // shift + tab
              event.preventDefault();

              lastFocusableElem.focus();
            }
          } else if (event.target === lastFocusableElem) {
            // tab
            event.preventDefault();

            firstFocusableElem.focus();
          }
        });
      }
    });
  }, 100);
};

var hideDialog = function hideDialog(elem, sourceElem) {
  var inception = sourceElem.dataset.inception;


  if (!inception || inception === 'false') {
    article.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  elem.setAttribute('aria-hidden', true);

  sourceElem.focus();
};

function dialog(elem) {
  var target = document.querySelector('.' + elem.dataset.target);
  var closes = target.querySelectorAll('[data-dismiss]');

  // show dialog
  elem.addEventListener('click', function (event) {
    event.preventDefault();

    showDialog(target);
  });

  elem.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      showDialog(target);
    }
  });

  // hide dialog
  target.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.escape) {
      hideDialog(target, elem);
    }
  });

  closes.forEach(function (close) {
    close.addEventListener('click', function (event) {
      event.preventDefault();

      hideDialog(target, elem);
    });
    close.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        hideDialog(target, elem);
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9ncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7QUFDQTs7Ozs7O0FBSkE7OztBQU1BLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxTQUFWLEVBQXFCO0FBQ3ZDLE1BQU0sZ0JBQWdCLFVBQVUsT0FBVixDQUFrQixTQUF4Qzs7QUFFQSxNQUFJLGtCQUFrQixPQUF0QixFQUErQjtBQUM3QiwwQkFBTSxTQUFOO0FBQ0Q7QUFDRCxNQUFJLGtCQUFrQixRQUF0QixFQUFnQztBQUM5QiwyQkFBTyxTQUFQO0FBQ0Q7QUFDRixDQVREOztBQVdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbEQsTUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5COztBQUVBLGFBQVcsT0FBWCxDQUFtQixVQUFDLFNBQUQsRUFBZTtBQUNoQyxnQkFBWSxTQUFaO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLFdBQVcsSUFBSSxnQkFBSixDQUFxQixVQUFDLFNBQUQsRUFBZTtBQUNuRCxjQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFELEVBQWM7QUFDOUIsZUFBUyxVQUFULENBQW9CLE9BQXBCLENBQTRCLFVBQUMsU0FBRCxFQUFlO0FBQ3pDLFlBQUksT0FBTyxVQUFVLFlBQWpCLEtBQWtDLFVBQXRDLEVBQWtEO0FBQ2hELGNBQUksVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzVDLHdCQUFZLFNBQVo7QUFDRDtBQUNGO0FBQ0YsT0FORDtBQU9ELEtBUkQ7QUFTRCxHQVZnQixDQUFqQjtBQVdBLFdBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzlCLGVBQVcsSUFEbUI7QUFFOUIsYUFBUztBQUZx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RDtBQUNGLEdBUEQ7QUFRRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBhcHBcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5pbXBvcnQgc3RhdGUgZnJvbSAnLi9jb21wb25lbnRzL3N0YXRlcyc7XG5pbXBvcnQgZGlhbG9nIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2dzJztcblxuY29uc3QgaXNDb21wb25lbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gIGNvbnN0IGRhdGFDb21wb25lbnQgPSBjb21wb25lbnQuZGF0YXNldC5jb21wb25lbnQ7XG5cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdzdGF0ZScpIHtcbiAgICBzdGF0ZShjb21wb25lbnQpO1xuICB9XG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnZGlhbG9nJykge1xuICAgIGRpYWxvZyhjb21wb25lbnQpO1xuICB9XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBjb21wb25lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50XScpO1xuXG4gIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgaXNDb21wb25lbnQoY29tcG9uZW50KTtcbiAgfSk7XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSkge1xuICAgICAgICAgICAgaXNDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gIH0pO1xufSk7XG4iLCIvKiBkaWFsb2dzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuY29uc3QgcGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wYWdlJyk7XG5jb25zdCBhcnRpY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWFydGljbGUnKTtcblxuY29uc3Qga2V5Q29kZXMgPSB7XG4gIGVudGVyOiAxMyxcbiAgZXNjYXBlOiAyNyxcbiAgdGFiOiA5LFxufTtcblxuY29uc3Qgc2hvd0RpYWxvZyA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1zID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZl0sIGJ1dHRvbiwgaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdJyk7XG4gIGNvbnN0IGZpcnN0Rm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zWzBdO1xuICBjb25zdCBzZWNvbmRGb2N1c2FibGVFbGVtID0gZm9jdXNhYmxlRWxlbXNbMV07XG4gIGNvbnN0IGxhc3RGb2N1c2FibGVFbGVtID0gZm9jdXNhYmxlRWxlbXNbZm9jdXNhYmxlRWxlbXMubGVuZ3RoIC0gMV07XG5cbiAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICBhcnRpY2xlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgcGFnZS5jbGFzc0xpc3QuYWRkKCdpcy1pbmFjdGl2ZScpO1xuXG4gIGlmICghZmlyc3RGb2N1c2FibGVFbGVtKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChzZWNvbmRGb2N1c2FibGVFbGVtKSB7XG4gICAgICBzZWNvbmRGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgIH1cblxuICAgIGZvY3VzYWJsZUVsZW1zLmZvckVhY2goKGZvY3VzYWJsZUVsZW0pID0+IHtcbiAgICAgIGlmIChmb2N1c2FibGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZm9jdXNhYmxlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaXNUYWJQcmVzc2VkID0gZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLnRhYjtcblxuICAgICAgICAgIGlmICghaXNUYWJQcmVzc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmlyc3RGb2N1c2FibGVFbGVtKSB7IC8vIHNoaWZ0ICsgdGFiXG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gbGFzdEZvY3VzYWJsZUVsZW0pIHsgLy8gdGFiXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LCAxMDApO1xufTtcblxuY29uc3QgaGlkZURpYWxvZyA9IGZ1bmN0aW9uIChlbGVtLCBzb3VyY2VFbGVtKSB7XG4gIGNvbnN0IHsgaW5jZXB0aW9uIH0gPSBzb3VyY2VFbGVtLmRhdGFzZXQ7XG5cbiAgaWYgKCFpbmNlcHRpb24gfHwgaW5jZXB0aW9uID09PSAnZmFsc2UnKSB7XG4gICAgYXJ0aWNsZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5hY3RpdmUnKTtcbiAgfVxuXG4gIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gIHNvdXJjZUVsZW0uZm9jdXMoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpYWxvZyhlbGVtKSB7XG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2VsZW0uZGF0YXNldC50YXJnZXR9YCk7XG4gIGNvbnN0IGNsb3NlcyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpO1xuXG4gIC8vIHNob3cgZGlhbG9nXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgc2hvd0RpYWxvZyh0YXJnZXQpO1xuICB9KTtcblxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVudGVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBzaG93RGlhbG9nKHRhcmdldCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBoaWRlIGRpYWxvZ1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZXNjYXBlKSB7XG4gICAgICBoaWRlRGlhbG9nKHRhcmdldCwgZWxlbSk7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZXMuZm9yRWFjaCgoY2xvc2UpID0+IHtcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaGlkZURpYWxvZyh0YXJnZXQsIGVsZW0pO1xuICAgIH0pO1xuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBoaWRlRGlhbG9nKHRhcmdldCwgZWxlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgaGlkZURpYWxvZyh0YXJnZXQsIGVsZW0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiBzdGF0ZXNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBhZGQgPSAnYWRkJztcbmNvbnN0IHJlbW92ZSA9ICdyZW1vdmUnO1xuY29uc3QgdG9nZ2xlID0gJ3RvZ2dsZSc7XG5jb25zdCBhcmlhcyA9IFtcbiAge1xuICAgIHR5cGU6ICdhcmlhLWhpZGRlbicsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1kaXNhYmxlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1zZWxlY3RlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWV4cGFuZGVkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtcHJlc3NlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWNoZWNrZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG5dO1xuXG5jb25zdCBzZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGVtLCBzdGF0ZUNsYXNzLCBiZWhhdmlvdXIpIHtcbiAgaWYgKHN0YXRlQ2xhc3MgIT09ICdmYWxzZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChzdGF0ZUNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoc3RhdGVDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZShzdGF0ZUNsYXNzKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNldEFyaWEgPSBmdW5jdGlvbiAoZWxlbSwgYmVoYXZpb3VyKSB7XG4gIGFyaWFzLmZvckVhY2goKGFyaWEpID0+IHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IGFyaWE7XG4gICAgY29uc3QgeyBpbml0IH0gPSBhcmlhO1xuXG4gICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKHR5cGUpKSB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIGlmICghaW5pdCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZWxlbS5nZXRBdHRyaWJ1dGUodHlwZSkgIT09ICd0cnVlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHNldFRhYmluZGV4ID0gZnVuY3Rpb24gKGVsZW0sIHRhYmluZGV4LCBiZWhhdmlvdXIpIHtcbiAgaWYgKHRhYmluZGV4ID09PSAndHJ1ZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgZWxlbS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPT09ICctMScgPyAwIDogLTEpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmJlaGF2aW91cnMuZm9yRWFjaCgoYmVoYXZpb3VyLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7cGFyYW1ldGVycy50YXJnZXRzW2luZGV4XX1gKTtcbiAgICBjb25zdCBzdGF0ZUNsYXNzID0gcGFyYW1ldGVycy5zdGF0ZXNbaW5kZXhdO1xuICAgIGNvbnN0IHRhYmluZGV4ID0gcGFyYW1ldGVycy50YWJpbmRleGVzICE9PSBudWxsID8gcGFyYW1ldGVycy50YWJpbmRleGVzW2luZGV4XSA6IG51bGw7XG5cbiAgICBlbGVtcy5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgYWRkKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCBhZGQpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgYWRkKTtcbiAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgcmVtb3ZlKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCByZW1vdmUpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgcmVtb3ZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHRvZ2dsZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgdG9nZ2xlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHRvZ2dsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhdGUoZWxlbSkge1xuICBjb25zdCBwYXJhbWV0ZXJzID0ge1xuICAgIGJlaGF2aW91cnM6IGVsZW0uZGF0YXNldC5iZWhhdmlvdXIuc3BsaXQoJywgJyksXG4gICAgc3RhdGVzOiBlbGVtLmRhdGFzZXQuc3RhdGUuc3BsaXQoJywgJyksXG4gICAgdGFiaW5kZXhlczogZWxlbS5kYXRhc2V0LnRhYmluZGV4ID8gZWxlbS5kYXRhc2V0LnRhYmluZGV4LnNwbGl0KCcsICcpIDogbnVsbCxcbiAgICB0YXJnZXRzOiBlbGVtLmRhdGFzZXQudGFyZ2V0LnNwbGl0KCcsICcpLFxuICB9O1xuXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgc2V0U3RhdGUocGFyYW1ldGVycyk7XG4gIH0pO1xuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
