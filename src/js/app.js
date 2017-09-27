/* app
 ========================================================================== */

import state from './components/states';
import dialog from './components/dialogs';

const keyCodes = {
  enter: 13,
  escape: 27,
  tab: 9,
};

const testComponentType = function (component) {
  const dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    state(component, keyCodes);
  }
  if (dataComponent === 'dialog') {
    dialog(component, keyCodes);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('[data-component]');

  components.forEach((component) => {
    testComponentType(component);
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((component) => {
        if (typeof component.getAttribute === 'function') {
          if (component.getAttribute('data-component')) {
            testComponentType(component);
          }
        }
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
