/* main
 ========================================================================== */

import state from './components/states';
import tabPanel from './components/tabPanels';
import Accordions from './components/accordions';

const keyCodes = {
  tab: 9,
  enter: 13,
  escape: 27,
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const testComponentType = function (component) {
  const dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    state(component, keyCodes);
  }
  if (dataComponent === 'tab') {
    tabPanel(component, keyCodes);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('[data-component]');

  const toto = Accordions;
  console.log(toto);

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
