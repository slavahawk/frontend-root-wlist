import { computed, reactive } from "vue";

const layoutConfig = reactive({
  preset: "Aura",
  primary: "noir",
  surface: null,
  darkTheme: true,
  menuMode: "static",
});

const layoutState = reactive({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  activeMenuItem: null,
});

const loadFromLocalStorage = () => {
  const savedConfig = getParsedItem("layoutConfig");
  const savedState = getParsedItem("layoutState");

  if (savedConfig) applyConfig(savedConfig);
  if (savedState) Object.assign(layoutState, savedState);
};

const getParsedItem = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(`Error parsing item from localStorage (${key}):`, error);
    return null;
  }
};

const applyConfig = (config) => {
  Object.assign(layoutConfig, config);
  document.documentElement.classList.toggle("app-dark", config.darkTheme);
};

const useLayout = () => {
  const saveToLocalStorage = () => {
    localStorage.setItem("layoutConfig", JSON.stringify(layoutConfig));
    localStorage.setItem("layoutState", JSON.stringify(layoutState));
  };

  const setActiveMenuItem = (item) => {
    layoutState.activeMenuItem = item.value || item;
    saveToLocalStorage();
  };

  const toggleMenu = () => {
    const isDesktop = window.innerWidth > 991;

    if (layoutConfig.menuMode === "overlay") {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
    }

    if (isDesktop) {
      layoutState.staticMenuDesktopInactive =
        !layoutState.staticMenuDesktopInactive;
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
    }

    saveToLocalStorage();
  };

  const toggleDarkMode = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme;
    document.documentElement.classList.toggle(
      "app-dark",
      layoutConfig.darkTheme,
    );
    saveToLocalStorage();
  };

  const isSidebarActive = computed(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive,
  );
  const isDarkTheme = computed(() => layoutConfig.darkTheme);
  const getPrimary = computed(() => layoutConfig.primary);
  const getSurface = computed(() => layoutConfig.surface);

  return {
    layoutConfig,
    layoutState,
    toggleMenu,
    isSidebarActive,
    isDarkTheme,
    getPrimary,
    getSurface,
    setActiveMenuItem,
    toggleDarkMode,
    saveToLocalStorage,
  };
};

loadFromLocalStorage();

export { useLayout };
