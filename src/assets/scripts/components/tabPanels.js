/* tab panels
 ========================================================================== */

import preventNested from './../tools/preventNested';

const closeTab = function (tab, panel) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-selected', false);
  panel.setAttribute('aria-hidden', true);
};

const closeTabs = function (tabs, panels) {
  tabs.forEach((tab, index) => {
    closeTab(tab, panels[index]);
  });
};

const openTab = function (tab, panel, { tabs, panels }) {
  closeTabs(tabs, panels);

  tab.focus();
  tab.setAttribute('tabindex', 0);
  tab.setAttribute('aria-selected', true);
  panel.setAttribute('aria-hidden', false);
};

export default function tabPanel(component, keyCodes) {
  const tabs = preventNested(component.querySelectorAll('[role="tab"]'), component);
  const panels = preventNested(component.querySelectorAll('[role="tabpanel"]'), component);
  const tabPanels = { tabs, panels };
  const firstTab = tabs[0];
  const lastTab = tabs[tabs.length - 1];
  const firstPanel = document.getElementById(firstTab.getAttribute('aria-controls'));
  const lastPanel = document.getElementById(lastTab.getAttribute('aria-controls'));

  tabs.forEach((tab, index) => {
    const prevTab = tabs[index - 1] || lastTab;
    const nextTab = tabs[index + 1] || firstTab;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    const prevPanel = document.getElementById(prevTab.getAttribute('aria-controls'));
    const nextPanel = document.getElementById(nextTab.getAttribute('aria-controls'));

    // open tab
    tab.addEventListener('click', (event) => {
      event.preventDefault();

      openTab(tab, panel, tabPanels);
    });

    // open prev tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.left || event.which === keyCodes.up) {
        event.preventDefault();

        openTab(prevTab, prevPanel, tabPanels);
      }
    });

    // open next tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        openTab(nextTab, nextPanel, tabPanels);
      }
    });

    // open first tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        openTab(firstTab, firstPanel, tabPanels);
      }
    });

    // open last tab
    tab.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        openTab(lastTab, lastPanel, tabPanels);
      }
    });
  });
}
