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
var doc = document.querySelector('.js-document');

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
  doc.setAttribute('aria-hidden', true);
  page.classList.add('is-inactive');

  // return if no focusable elements
  if (!firstFocusableElem) {
    return;
  }

  window.setTimeout(function () {
    if (secondFocusableElem) {
      secondFocusableElem.focus();
    } else {
      firstFocusableElem.focus();
    }

    // trapping focus inside the dialog
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

  // check if dialog is inside another dialog

  if (!inception || inception === 'false') {
    doc.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  elem.setAttribute('aria-hidden', true);

  // restoring focus
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
    var dismiss = document.querySelector('.' + close.dataset.dismiss);

    close.addEventListener('click', function (event) {
      event.preventDefault();

      hideDialog(dismiss, elem);
    });
    close.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        hideDialog(dismiss, elem);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9ncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7QUFDQTs7Ozs7O0FBSkE7OztBQU1BLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxTQUFWLEVBQXFCO0FBQ3ZDLE1BQU0sZ0JBQWdCLFVBQVUsT0FBVixDQUFrQixTQUF4Qzs7QUFFQSxNQUFJLGtCQUFrQixPQUF0QixFQUErQjtBQUM3QiwwQkFBTSxTQUFOO0FBQ0Q7QUFDRCxNQUFJLGtCQUFrQixRQUF0QixFQUFnQztBQUM5QiwyQkFBTyxTQUFQO0FBQ0Q7QUFDRixDQVREOztBQVdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbEQsTUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5COztBQUVBLGFBQVcsT0FBWCxDQUFtQixVQUFDLFNBQUQsRUFBZTtBQUNoQyxnQkFBWSxTQUFaO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLFdBQVcsSUFBSSxnQkFBSixDQUFxQixVQUFDLFNBQUQsRUFBZTtBQUNuRCxjQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFELEVBQWM7QUFDOUIsZUFBUyxVQUFULENBQW9CLE9BQXBCLENBQTRCLFVBQUMsU0FBRCxFQUFlO0FBQ3pDLFlBQUksT0FBTyxVQUFVLFlBQWpCLEtBQWtDLFVBQXRDLEVBQWtEO0FBQ2hELGNBQUksVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzVDLHdCQUFZLFNBQVo7QUFDRDtBQUNGO0FBQ0YsT0FORDtBQU9ELEtBUkQ7QUFTRCxHQVZnQixDQUFqQjtBQVdBLFdBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzlCLGVBQVcsSUFEbUI7QUFFOUIsYUFBUztBQUZx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SSxNQUFNLEtBQU4sS0FBZ0IsRUFBcEIsRUFBd0I7QUFDdEIsWUFBTSxjQUFOO0FBQ0EsWUFBTSxlQUFOOztBQUVBLGVBQVMsVUFBVDtBQUNEO0FBQ0YsR0FQRDtBQVFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGFwcFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmltcG9ydCBzdGF0ZSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGVzJztcbmltcG9ydCBkaWFsb2cgZnJvbSAnLi9jb21wb25lbnRzL2RpYWxvZ3MnO1xuXG5jb25zdCBpc0NvbXBvbmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgY29uc3QgZGF0YUNvbXBvbmVudCA9IGNvbXBvbmVudC5kYXRhc2V0LmNvbXBvbmVudDtcblxuICBpZiAoZGF0YUNvbXBvbmVudCA9PT0gJ3N0YXRlJykge1xuICAgIHN0YXRlKGNvbXBvbmVudCk7XG4gIH1cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdkaWFsb2cnKSB7XG4gICAgZGlhbG9nKGNvbXBvbmVudCk7XG4gIH1cbn07XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGNvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb21wb25lbnRdJyk7XG5cbiAgY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICBpc0NvbXBvbmVudChjb21wb25lbnQpO1xuICB9KTtcblxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmdldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpKSB7XG4gICAgICAgICAgICBpc0NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSk7XG59KTtcbiIsIi8qIGRpYWxvZ3NcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBhZ2UnKTtcbmNvbnN0IGRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1kb2N1bWVudCcpO1xuXG5jb25zdCBrZXlDb2RlcyA9IHtcbiAgZW50ZXI6IDEzLFxuICBlc2NhcGU6IDI3LFxuICB0YWI6IDksXG59O1xuXG5jb25zdCBzaG93RGlhbG9nID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgY29uc3QgZm9jdXNhYmxlRWxlbXMgPSBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmXSwgYnV0dG9uLCBpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0nKTtcbiAgY29uc3QgZmlyc3RGb2N1c2FibGVFbGVtID0gZm9jdXNhYmxlRWxlbXNbMF07XG4gIGNvbnN0IHNlY29uZEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1sxXTtcbiAgY29uc3QgbGFzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1tmb2N1c2FibGVFbGVtcy5sZW5ndGggLSAxXTtcblxuICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gIGRvYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gIHBhZ2UuY2xhc3NMaXN0LmFkZCgnaXMtaW5hY3RpdmUnKTtcblxuICAvLyByZXR1cm4gaWYgbm8gZm9jdXNhYmxlIGVsZW1lbnRzXG4gIGlmICghZmlyc3RGb2N1c2FibGVFbGVtKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChzZWNvbmRGb2N1c2FibGVFbGVtKSB7XG4gICAgICBzZWNvbmRGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIHRyYXBwaW5nIGZvY3VzIGluc2lkZSB0aGUgZGlhbG9nXG4gICAgZm9jdXNhYmxlRWxlbXMuZm9yRWFjaCgoZm9jdXNhYmxlRWxlbSkgPT4ge1xuICAgICAgaWYgKGZvY3VzYWJsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBmb2N1c2FibGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpc1RhYlByZXNzZWQgPSBldmVudC53aGljaCA9PT0ga2V5Q29kZXMudGFiO1xuXG4gICAgICAgICAgaWYgKCFpc1RhYlByZXNzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaXJzdEZvY3VzYWJsZUVsZW0pIHsgLy8gc2hpZnQgKyB0YWJcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICBsYXN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBsYXN0Rm9jdXNhYmxlRWxlbSkgeyAvLyB0YWJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIDEwMCk7XG59O1xuXG5jb25zdCBoaWRlRGlhbG9nID0gZnVuY3Rpb24gKGVsZW0sIHNvdXJjZUVsZW0pIHtcbiAgY29uc3QgeyBpbmNlcHRpb24gfSA9IHNvdXJjZUVsZW0uZGF0YXNldDtcblxuICAvLyBjaGVjayBpZiBkaWFsb2cgaXMgaW5zaWRlIGFub3RoZXIgZGlhbG9nXG4gIGlmICghaW5jZXB0aW9uIHx8IGluY2VwdGlvbiA9PT0gJ2ZhbHNlJykge1xuICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5hY3RpdmUnKTtcbiAgfVxuXG4gIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gIC8vIHJlc3RvcmluZyBmb2N1c1xuICBzb3VyY2VFbGVtLmZvY3VzKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWFsb2coZWxlbSkge1xuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtlbGVtLmRhdGFzZXQudGFyZ2V0fWApO1xuICBjb25zdCBjbG9zZXMgPSB0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKTtcblxuICAvLyBzaG93IGRpYWxvZ1xuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHNob3dEaWFsb2codGFyZ2V0KTtcbiAgfSk7XG5cbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlcikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgc2hvd0RpYWxvZyh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gaGlkZSBkaWFsb2dcbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVzY2FwZSkge1xuICAgICAgaGlkZURpYWxvZyh0YXJnZXQsIGVsZW0pO1xuICAgIH1cbiAgfSk7XG5cbiAgY2xvc2VzLmZvckVhY2goKGNsb3NlKSA9PiB7XG4gICAgY29uc3QgZGlzbWlzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2Nsb3NlLmRhdGFzZXQuZGlzbWlzc31gKTtcblxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBoaWRlRGlhbG9nKGRpc21pc3MsIGVsZW0pO1xuICAgIH0pO1xuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBoaWRlRGlhbG9nKGRpc21pc3MsIGVsZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0YXJnZXQpIHtcbiAgICAgIGhpZGVEaWFsb2codGFyZ2V0LCBlbGVtKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiLyogc3RhdGVzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuY29uc3QgYWRkID0gJ2FkZCc7XG5jb25zdCByZW1vdmUgPSAncmVtb3ZlJztcbmNvbnN0IHRvZ2dsZSA9ICd0b2dnbGUnO1xuY29uc3QgYXJpYXMgPSBbXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1oaWRkZW4nLFxuICAgIGluaXQ6IGZhbHNlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtZGlzYWJsZWQnLFxuICAgIGluaXQ6IGZhbHNlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtc2VsZWN0ZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1leHBhbmRlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLXByZXNzZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1jaGVja2VkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuXTtcblxuY29uc3Qgc2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgc3RhdGVDbGFzcywgYmVoYXZpb3VyKSB7XG4gIGlmIChzdGF0ZUNsYXNzICE9PSAnZmFsc2UnKSB7XG4gICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoc3RhdGVDbGFzcyk7XG4gICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHN0YXRlQ2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoc3RhdGVDbGFzcyk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzZXRBcmlhID0gZnVuY3Rpb24gKGVsZW0sIGJlaGF2aW91cikge1xuICBhcmlhcy5mb3JFYWNoKChhcmlhKSA9PiB7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBhcmlhO1xuICAgIGNvbnN0IHsgaW5pdCB9ID0gYXJpYTtcblxuICAgIGlmIChlbGVtLmhhc0F0dHJpYnV0ZSh0eXBlKSkge1xuICAgICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICAgIGlmICghaW5pdCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgICBpZiAoIWluaXQpIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGVsZW0uZ2V0QXR0cmlidXRlKHR5cGUpICE9PSAndHJ1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBzZXRUYWJpbmRleCA9IGZ1bmN0aW9uIChlbGVtLCB0YWJpbmRleCwgYmVoYXZpb3VyKSB7XG4gIGlmICh0YWJpbmRleCA9PT0gJ3RydWUnKSB7XG4gICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGVsZW0uZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID09PSAnLTEnID8gMCA6IC0xKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNldFN0YXRlID0gZnVuY3Rpb24gKHBhcmFtZXRlcnMpIHtcbiAgcGFyYW1ldGVycy5iZWhhdmlvdXJzLmZvckVhY2goKGJlaGF2aW91ciwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3BhcmFtZXRlcnMudGFyZ2V0c1tpbmRleF19YCk7XG4gICAgY29uc3Qgc3RhdGVDbGFzcyA9IHBhcmFtZXRlcnMuc3RhdGVzW2luZGV4XTtcbiAgICBjb25zdCB0YWJpbmRleCA9IHBhcmFtZXRlcnMudGFiaW5kZXhlcyAhPT0gbnVsbCA/IHBhcmFtZXRlcnMudGFiaW5kZXhlc1tpbmRleF0gOiBudWxsO1xuXG4gICAgZWxlbXMuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIGFkZCk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgYWRkKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIGFkZCk7XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHJlbW92ZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgcmVtb3ZlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHJlbW92ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCB0b2dnbGUpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIHRvZ2dsZSk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCB0b2dnbGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXRlKGVsZW0pIHtcbiAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICBiZWhhdmlvdXJzOiBlbGVtLmRhdGFzZXQuYmVoYXZpb3VyLnNwbGl0KCcsICcpLFxuICAgIHN0YXRlczogZWxlbS5kYXRhc2V0LnN0YXRlLnNwbGl0KCcsICcpLFxuICAgIHRhYmluZGV4ZXM6IGVsZW0uZGF0YXNldC50YWJpbmRleCA/IGVsZW0uZGF0YXNldC50YWJpbmRleC5zcGxpdCgnLCAnKSA6IG51bGwsXG4gICAgdGFyZ2V0czogZWxlbS5kYXRhc2V0LnRhcmdldC5zcGxpdCgnLCAnKSxcbiAgfTtcblxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICB9KTtcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBzZXRTdGF0ZShwYXJhbWV0ZXJzKTtcbiAgICB9XG4gIH0pO1xufVxuIl19
