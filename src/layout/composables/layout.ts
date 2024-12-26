import { computed, reactive } from "vue";

const layoutConfig = reactive({
  preset: "Aura",
  primary: "noir",
  surface: null,
  darkTheme: true,
});

const loadFromLocalStorage = () => {
  const savedConfig = getParsedItem("layoutConfig");
  if (savedConfig) applyConfig(savedConfig);
};

if (!localStorage.getItem("layoutConfig") && layoutConfig.darkTheme) {
  document.documentElement.classList.add("app-dark");
}

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
  };

  const toggleDarkMode = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme;
    document.documentElement.classList.toggle(
      "app-dark",
      layoutConfig.darkTheme,
    );
    saveToLocalStorage();
  };

  const isDarkTheme = computed(() => layoutConfig.darkTheme);
  const getPrimary = computed(() => layoutConfig.primary);
  const getSurface = computed(() => layoutConfig.surface);

  return {
    layoutConfig,
    isDarkTheme,
    getPrimary,
    getSurface,
    toggleDarkMode,
    saveToLocalStorage,
  };
};

loadFromLocalStorage();

export { useLayout };
