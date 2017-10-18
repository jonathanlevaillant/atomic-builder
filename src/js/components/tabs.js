/* tabs
 ========================================================================== */

const openTab = function (tabItem, panel, parameters = { focus: false }) {
  const { focus } = parameters;

  if (focus) {
    tabItem.focus();
  }

  tabItem.setAttribute('tabindex', 0);
  tabItem.setAttribute('aria-selected', true);
  panel.setAttribute('aria-hidden', false);
};

const closeTab = function (tabItem, panel) {
  tabItem.setAttribute('tabindex', -1);
  tabItem.setAttribute('aria-selected', false);
  panel.setAttribute('aria-hidden', true);
};

const closeTabs = function (tabItems, panels) {
  tabItems.forEach((tabItem, index) => {
    closeTab(tabItem, panels[index]);
  });
};

export default function tabs(tabsWidget, keyCodes) {
  const tabItems = tabsWidget.querySelectorAll('[role="tab"');
  const panels = tabsWidget.querySelectorAll('[role="tabpanel"');

  tabItems.forEach((tabItem, index) => {
    const firstTabItem = tabItems[0];
    const lastTabItem = tabItems[tabItems.length - 1];
    const prevTabItem = tabItems[index - 1] ? tabItems[index - 1] : tabItems[tabItems.length - 1];
    const nextTabItem = tabItems[index + 1] ? tabItems[index + 1] : tabItems[0];
    const panel = document.getElementById(tabItem.getAttribute('aria-controls'));
    const firstPanel = document.getElementById(firstTabItem.getAttribute('aria-controls'));
    const lastPanel = document.getElementById(lastTabItem.getAttribute('aria-controls'));
    const prevPanel = document.getElementById(prevTabItem.getAttribute('aria-controls'));
    const nextPanel = document.getElementById(nextTabItem.getAttribute('aria-controls'));

    // open current tab
    tabItem.addEventListener('click', (event) => {
      event.preventDefault();

      closeTabs(tabItems, panels);
      openTab(tabItem, panel);
    });

    // open prev tab
    tabItem.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.left || event.which === keyCodes.up) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(prevTabItem, prevPanel, { focus: true });
      }
    });

    // open next tab
    tabItem.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(nextTabItem, nextPanel, { focus: true });
      }
    });

    // open first tab
    tabItem.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(firstTabItem, firstPanel, { focus: true });
      }
    });

    // open last tab
    tabItem.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(lastTabItem, lastPanel, { focus: true });
      }
    });
  });
}
