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
    doc.setAttribute('aria-hidden', false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9ncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7QUFDQTs7Ozs7O0FBSkE7OztBQU1BLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxTQUFWLEVBQXFCO0FBQ3ZDLE1BQU0sZ0JBQWdCLFVBQVUsT0FBVixDQUFrQixTQUF4Qzs7QUFFQSxNQUFJLGtCQUFrQixPQUF0QixFQUErQjtBQUM3QiwwQkFBTSxTQUFOO0FBQ0Q7QUFDRCxNQUFJLGtCQUFrQixRQUF0QixFQUFnQztBQUM5QiwyQkFBTyxTQUFQO0FBQ0Q7QUFDRixDQVREOztBQVdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbEQsTUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5COztBQUVBLGFBQVcsT0FBWCxDQUFtQixVQUFDLFNBQUQsRUFBZTtBQUNoQyxnQkFBWSxTQUFaO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLFdBQVcsSUFBSSxnQkFBSixDQUFxQixVQUFDLFNBQUQsRUFBZTtBQUNuRCxjQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFELEVBQWM7QUFDOUIsZUFBUyxVQUFULENBQW9CLE9BQXBCLENBQTRCLFVBQUMsU0FBRCxFQUFlO0FBQ3pDLFlBQUksT0FBTyxVQUFVLFlBQWpCLEtBQWtDLFVBQXRDLEVBQWtEO0FBQ2hELGNBQUksVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzVDLHdCQUFZLFNBQVo7QUFDRDtBQUNGO0FBQ0YsT0FORDtBQU9ELEtBUkQ7QUFTRCxHQVZnQixDQUFqQjtBQVdBLFdBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzlCLGVBQVcsSUFEbUI7QUFFOUIsYUFBUztBQUZx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cEIsRUFBd0I7QUFDdEIsWUFBTSxjQUFOO0FBQ0EsWUFBTSxlQUFOOztBQUVBLGVBQVMsVUFBVDtBQUNEO0FBQ0YsR0FQRDtBQVFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGFwcFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmltcG9ydCBzdGF0ZSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGVzJztcbmltcG9ydCBkaWFsb2cgZnJvbSAnLi9jb21wb25lbnRzL2RpYWxvZ3MnO1xuXG5jb25zdCBpc0NvbXBvbmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgY29uc3QgZGF0YUNvbXBvbmVudCA9IGNvbXBvbmVudC5kYXRhc2V0LmNvbXBvbmVudDtcblxuICBpZiAoZGF0YUNvbXBvbmVudCA9PT0gJ3N0YXRlJykge1xuICAgIHN0YXRlKGNvbXBvbmVudCk7XG4gIH1cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdkaWFsb2cnKSB7XG4gICAgZGlhbG9nKGNvbXBvbmVudCk7XG4gIH1cbn07XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGNvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb21wb25lbnRdJyk7XG5cbiAgY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICBpc0NvbXBvbmVudChjb21wb25lbnQpO1xuICB9KTtcblxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmdldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpKSB7XG4gICAgICAgICAgICBpc0NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSk7XG59KTtcbiIsIi8qIGRpYWxvZ3NcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBhZ2UnKTtcbmNvbnN0IGRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1kb2N1bWVudCcpO1xuXG5jb25zdCBrZXlDb2RlcyA9IHtcbiAgZW50ZXI6IDEzLFxuICBlc2NhcGU6IDI3LFxuICB0YWI6IDksXG59O1xuXG5jb25zdCBzaG93RGlhbG9nID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgY29uc3QgZm9jdXNhYmxlRWxlbXMgPSBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmXSwgYnV0dG9uLCBpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0nKTtcbiAgY29uc3QgZmlyc3RGb2N1c2FibGVFbGVtID0gZm9jdXNhYmxlRWxlbXNbMF07XG4gIGNvbnN0IHNlY29uZEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1sxXTtcbiAgY29uc3QgbGFzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1tmb2N1c2FibGVFbGVtcy5sZW5ndGggLSAxXTtcblxuICBlbGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gIGRvYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gIHBhZ2UuY2xhc3NMaXN0LmFkZCgnaXMtaW5hY3RpdmUnKTtcblxuICBpZiAoIWZpcnN0Rm9jdXNhYmxlRWxlbSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoc2Vjb25kRm9jdXNhYmxlRWxlbSkge1xuICAgICAgc2Vjb25kRm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaXJzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBmb2N1c2FibGVFbGVtcy5mb3JFYWNoKChmb2N1c2FibGVFbGVtKSA9PiB7XG4gICAgICBpZiAoZm9jdXNhYmxlRWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGZvY3VzYWJsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzVGFiUHJlc3NlZCA9IGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy50YWI7XG5cbiAgICAgICAgICBpZiAoIWlzVGFiUHJlc3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGZpcnN0Rm9jdXNhYmxlRWxlbSkgeyAvLyBzaGlmdCArIHRhYlxuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgIGxhc3RGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGxhc3RGb2N1c2FibGVFbGVtKSB7IC8vIHRhYlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgZmlyc3RGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgMTAwKTtcbn07XG5cbmNvbnN0IGhpZGVEaWFsb2cgPSBmdW5jdGlvbiAoZWxlbSwgc291cmNlRWxlbSkge1xuICBjb25zdCB7IGluY2VwdGlvbiB9ID0gc291cmNlRWxlbS5kYXRhc2V0O1xuXG4gIGlmICghaW5jZXB0aW9uIHx8IGluY2VwdGlvbiA9PT0gJ2ZhbHNlJykge1xuICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5hY3RpdmUnKTtcbiAgfVxuXG4gIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gIHNvdXJjZUVsZW0uZm9jdXMoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpYWxvZyhlbGVtKSB7XG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2VsZW0uZGF0YXNldC50YXJnZXR9YCk7XG4gIGNvbnN0IGNsb3NlcyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpO1xuXG4gIC8vIHNob3cgZGlhbG9nXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgc2hvd0RpYWxvZyh0YXJnZXQpO1xuICB9KTtcblxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVudGVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBzaG93RGlhbG9nKHRhcmdldCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBoaWRlIGRpYWxvZ1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZXNjYXBlKSB7XG4gICAgICBoaWRlRGlhbG9nKHRhcmdldCwgZWxlbSk7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZXMuZm9yRWFjaCgoY2xvc2UpID0+IHtcbiAgICBjb25zdCBkaXNtaXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7Y2xvc2UuZGF0YXNldC5kaXNtaXNzfWApO1xuXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGhpZGVEaWFsb2coZGlzbWlzcywgZWxlbSk7XG4gICAgfSk7XG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlcikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGhpZGVEaWFsb2coZGlzbWlzcywgZWxlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRhcmdldCkge1xuICAgICAgaGlkZURpYWxvZyh0YXJnZXQsIGVsZW0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiBzdGF0ZXNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBhZGQgPSAnYWRkJztcbmNvbnN0IHJlbW92ZSA9ICdyZW1vdmUnO1xuY29uc3QgdG9nZ2xlID0gJ3RvZ2dsZSc7XG5jb25zdCBhcmlhcyA9IFtcbiAge1xuICAgIHR5cGU6ICdhcmlhLWhpZGRlbicsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1kaXNhYmxlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1zZWxlY3RlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWV4cGFuZGVkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtcHJlc3NlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWNoZWNrZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG5dO1xuXG5jb25zdCBzZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGVtLCBzdGF0ZUNsYXNzLCBiZWhhdmlvdXIpIHtcbiAgaWYgKHN0YXRlQ2xhc3MgIT09ICdmYWxzZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChzdGF0ZUNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoc3RhdGVDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZShzdGF0ZUNsYXNzKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNldEFyaWEgPSBmdW5jdGlvbiAoZWxlbSwgYmVoYXZpb3VyKSB7XG4gIGFyaWFzLmZvckVhY2goKGFyaWEpID0+IHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IGFyaWE7XG4gICAgY29uc3QgeyBpbml0IH0gPSBhcmlhO1xuXG4gICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKHR5cGUpKSB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIGlmICghaW5pdCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZWxlbS5nZXRBdHRyaWJ1dGUodHlwZSkgIT09ICd0cnVlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHNldFRhYmluZGV4ID0gZnVuY3Rpb24gKGVsZW0sIHRhYmluZGV4LCBiZWhhdmlvdXIpIHtcbiAgaWYgKHRhYmluZGV4ID09PSAndHJ1ZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgZWxlbS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPT09ICctMScgPyAwIDogLTEpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmJlaGF2aW91cnMuZm9yRWFjaCgoYmVoYXZpb3VyLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7cGFyYW1ldGVycy50YXJnZXRzW2luZGV4XX1gKTtcbiAgICBjb25zdCBzdGF0ZUNsYXNzID0gcGFyYW1ldGVycy5zdGF0ZXNbaW5kZXhdO1xuICAgIGNvbnN0IHRhYmluZGV4ID0gcGFyYW1ldGVycy50YWJpbmRleGVzICE9PSBudWxsID8gcGFyYW1ldGVycy50YWJpbmRleGVzW2luZGV4XSA6IG51bGw7XG5cbiAgICBlbGVtcy5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgYWRkKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCBhZGQpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgYWRkKTtcbiAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgcmVtb3ZlKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCByZW1vdmUpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgcmVtb3ZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHRvZ2dsZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgdG9nZ2xlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHRvZ2dsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhdGUoZWxlbSkge1xuICBjb25zdCBwYXJhbWV0ZXJzID0ge1xuICAgIGJlaGF2aW91cnM6IGVsZW0uZGF0YXNldC5iZWhhdmlvdXIuc3BsaXQoJywgJyksXG4gICAgc3RhdGVzOiBlbGVtLmRhdGFzZXQuc3RhdGUuc3BsaXQoJywgJyksXG4gICAgdGFiaW5kZXhlczogZWxlbS5kYXRhc2V0LnRhYmluZGV4ID8gZWxlbS5kYXRhc2V0LnRhYmluZGV4LnNwbGl0KCcsICcpIDogbnVsbCxcbiAgICB0YXJnZXRzOiBlbGVtLmRhdGFzZXQudGFyZ2V0LnNwbGl0KCcsICcpLFxuICB9O1xuXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgc2V0U3RhdGUocGFyYW1ldGVycyk7XG4gIH0pO1xuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
