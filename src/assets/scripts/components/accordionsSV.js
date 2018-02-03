/* accordions
 ========================================================================== */

import preventNested from './../tools/preventNested';

const closeTab = function (tab, panel) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-expanded', false);
  panel.setAttribute('aria-hidden', true);
};

const closeTabs = function (currentTab, tabs, panels) {
  tabs.forEach((tab, index) => {
    if (tab !== currentTab) {
      closeTab(tab, panels[index]);
    }
  });
};

const deselectTab = function (tab) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-selected', false);
};

const deselectTabs = function (tabs) {
  tabs.forEach((tab) => {
    deselectTab(tab);
  });
};

const toggleTab = function (tab, panel, { tabs, panels }, { multiselectable }) {
  if (!multiselectable) {
    closeTabs(tab, tabs, panels);
  }

  tab.focus();
  tab.setAttribute('tabindex', 0);
  tab.setAttribute('aria-selected', true);
  tab.setAttribute('aria-expanded', tab.getAttribute('aria-expanded') !== 'true');
  panel.setAttribute('aria-hidden', panel.getAttribute('aria-hidden') !== 'true');
};

const selectTab = function (tab, tabs) {
  if (tabs) {
    deselectTabs(tabs);
    tab.focus();
  }

  tab.setAttribute('tabindex', 0);
  tab.setAttribute('aria-selected', true);
};

export default function accordion(component, keyCodes) {
  const tabs = preventNested(component.querySelectorAll('[role="tab"]'), component);
  const panels = preventNested(component.querySelectorAll('[role="tabpanel"]'), component);
  const tabPanels = { tabs, panels };
  const firstTab = tabs[0];
  const lastTab = tabs[tabs.length - 1];
  const multiselectable = (component.getAttribute('aria-multiselectable') || 'true') === 'true';

  tabs.forEach((tab, index) => {
    const prevTab = tabs[index - 1] || lastTab;
    const nextTab = tabs[index + 1] || firstTab;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));

    // toggle tab
    tab.addEventListener('click', (event) => {
      event.preventDefault();

      toggleTab(tab, panel, tabPanels, { multiselectable });
    });

    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.enter || event.which === keyCodes.escape) {
        event.preventDefault();

        toggleTab(tab, panel, tabPanels, { multiselectable });
      }
    });

    // select tab
    tab.addEventListener('focus', () => {
      selectTab(tab);
    });

    // select prev tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.left || event.which === keyCodes.up) {
        event.preventDefault();

        selectTab(prevTab, tabs);
      }
    });

    // select next tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        selectTab(nextTab, tabs);
      }
    });

    // select first tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        selectTab(firstTab, tabs);
      }
    });

    // select last tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        selectTab(lastTab, tabs);
      }
    });
  });
}
