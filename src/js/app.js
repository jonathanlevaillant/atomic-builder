/* app
 ========================================================================== */

import state from './components/states';

const isComponent = function (component) {
  const dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    state(component);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('[data-component]');

  components.forEach((component) => {
    isComponent(component);
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((component) => {
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
    subtree: true,
  });
});
