(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _states = require('./components/states');

var _states2 = _interopRequireDefault(_states);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isComponent = function isComponent(component) {
  var dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    (0, _states2.default)(component);
  }
}; /* app
    ========================================================================== */

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

},{"./components/states":2}],2:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvc3RhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNHQTs7Ozs7O0FBRUEsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFVLFNBQVYsRUFBcUI7QUFDdkMsTUFBTSxnQkFBZ0IsVUFBVSxPQUFWLENBQWtCLFNBQXhDOztBQUVBLE1BQUksa0JBQWtCLE9BQXRCLEVBQStCO0FBQzdCLDBCQUFNLFNBQU47QUFDRDtBQUNGLENBTkQsQyxDQUxBOzs7QUFhQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFNO0FBQ2xELE1BQU0sYUFBYSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixDQUFuQjs7QUFFQSxhQUFXLE9BQVgsQ0FBbUIsVUFBQyxTQUFELEVBQWU7QUFDaEMsZ0JBQVksU0FBWjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxXQUFXLElBQUksZ0JBQUosQ0FBcUIsVUFBQyxTQUFELEVBQWU7QUFDbkQsY0FBVSxPQUFWLENBQWtCLFVBQUMsUUFBRCxFQUFjO0FBQzlCLGVBQVMsVUFBVCxDQUFvQixPQUFwQixDQUE0QixVQUFDLFNBQUQsRUFBZTtBQUN6QyxZQUFJLE9BQU8sVUFBVSxZQUFqQixLQUFrQyxVQUF0QyxFQUFrRDtBQUNoRCxjQUFJLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBSixFQUE4QztBQUM1Qyx3QkFBWSxTQUFaO0FBQ0Q7QUFDRjtBQUNGLE9BTkQ7QUFPRCxLQVJEO0FBU0QsR0FWZ0IsQ0FBakI7QUFXQSxXQUFTLE9BQVQsQ0FBaUIsU0FBUyxJQUExQixFQUFnQztBQUM5QixlQUFXLElBRG1CO0FBRTlCLGFBQVM7QUFGcUIsR0FBaEM7QUFJRCxDQXRCRDs7Ozs7Ozs7a0JDNkZ3QixLO0FBMUd4Qjs7O0FBR0EsSUFBTSxNQUFNLEtBQVo7QUFDQSxJQUFNLFNBQVMsUUFBZjtBQUNB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R0FBbkI7O0FBT0EsWUFBVSxnQkFBVixDQUEyQixPQUEzQixFQUFvQyxVQUFDLEtBQUQsRUFBVztBQUM3QyxVQUFNLGNBQU47QUFDQSxVQUFNLGVBQU47O0FBRUEsYUFBUyxVQUFUO0FBQ0QsR0FMRDtBQU1BLFlBQVUsZ0JBQVYsQ0FBMkIsVUFBM0IsRUFBdUMsVUFBQyxLQUFELEVBQVc7QUFDaEQsUUFBSSxNQUFNLEtBQU4sS0FBZ0IsRUFBcEIsRUFBd0I7QUFDdEIsWUFBTSxjQUFOO0FBQ0EsWUFBTSxlQUFOOztBQUVBLGVBQVMsVUFBVDtBQUNEO0FBQ0YsR0FQRDtBQVFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGFwcFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmltcG9ydCBzdGF0ZSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGVzJztcblxuY29uc3QgaXNDb21wb25lbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gIGNvbnN0IGRhdGFDb21wb25lbnQgPSBjb21wb25lbnQuZGF0YXNldC5jb21wb25lbnQ7XG5cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdzdGF0ZScpIHtcbiAgICBzdGF0ZShjb21wb25lbnQpO1xuICB9XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBjb21wb25lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50XScpO1xuXG4gIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgaXNDb21wb25lbnQoY29tcG9uZW50KTtcbiAgfSk7XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSkge1xuICAgICAgICAgICAgaXNDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gIH0pO1xufSk7XG4iLCIvKiBzdGF0ZXNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBhZGQgPSAnYWRkJztcbmNvbnN0IHJlbW92ZSA9ICdyZW1vdmUnO1xuY29uc3QgdG9nZ2xlID0gJ3RvZ2dsZSc7XG5jb25zdCBhcmlhcyA9IFtcbiAge1xuICAgIHR5cGU6ICdhcmlhLWhpZGRlbicsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1kaXNhYmxlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1zZWxlY3RlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWV4cGFuZGVkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtcHJlc3NlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWNoZWNrZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG5dO1xuXG5jb25zdCBzZXRDbGFzcyA9IGZ1bmN0aW9uIChlbGVtLCBzdGF0ZUNsYXNzLCBiZWhhdmlvdXIpIHtcbiAgaWYgKHN0YXRlQ2xhc3MgIT09ICdmYWxzZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChzdGF0ZUNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoc3RhdGVDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZShzdGF0ZUNsYXNzKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNldEFyaWEgPSBmdW5jdGlvbiAoZWxlbSwgYmVoYXZpb3VyKSB7XG4gIGFyaWFzLmZvckVhY2goKGFyaWEpID0+IHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IGFyaWE7XG4gICAgY29uc3QgeyBpbml0IH0gPSBhcmlhO1xuXG4gICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKHR5cGUpKSB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIGlmICghaW5pdCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZWxlbS5nZXRBdHRyaWJ1dGUodHlwZSkgIT09ICd0cnVlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHNldFRhYmluZGV4ID0gZnVuY3Rpb24gKGVsZW0sIHRhYmluZGV4LCBiZWhhdmlvdXIpIHtcbiAgaWYgKHRhYmluZGV4ID09PSAndHJ1ZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgZWxlbS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPT09ICctMScgPyAwIDogLTEpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmJlaGF2aW91cnMuZm9yRWFjaCgoYmVoYXZpb3VyLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7cGFyYW1ldGVycy50YXJnZXRzW2luZGV4XX1gKTtcbiAgICBjb25zdCBzdGF0ZUNsYXNzID0gcGFyYW1ldGVycy5zdGF0ZXNbaW5kZXhdO1xuICAgIGNvbnN0IHRhYmluZGV4ID0gcGFyYW1ldGVycy50YWJpbmRleGVzICE9PSBudWxsID8gcGFyYW1ldGVycy50YWJpbmRleGVzW2luZGV4XSA6IG51bGw7XG5cbiAgICBlbGVtcy5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgYWRkKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCBhZGQpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgYWRkKTtcbiAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgcmVtb3ZlKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCByZW1vdmUpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgcmVtb3ZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHRvZ2dsZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgdG9nZ2xlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHRvZ2dsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhdGUoY29tcG9uZW50KSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgYmVoYXZpb3VyczogY29tcG9uZW50LmRhdGFzZXQuYmVoYXZpb3VyLnNwbGl0KCcsICcpLFxuICAgIHN0YXRlczogY29tcG9uZW50LmRhdGFzZXQuc3RhdGUuc3BsaXQoJywgJyksXG4gICAgdGFiaW5kZXhlczogY29tcG9uZW50LmRhdGFzZXQudGFiaW5kZXggPyBjb21wb25lbnQuZGF0YXNldC50YWJpbmRleC5zcGxpdCgnLCAnKSA6IG51bGwsXG4gICAgdGFyZ2V0czogY29tcG9uZW50LmRhdGFzZXQudGFyZ2V0LnNwbGl0KCcsICcpLFxuICB9O1xuXG4gIGNvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBzZXRTdGF0ZShwYXJhbWV0ZXJzKTtcbiAgfSk7XG4gIGNvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2V0U3RhdGUocGFyYW1ldGVycyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
