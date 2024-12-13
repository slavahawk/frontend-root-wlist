import {computed, reactive, ref, watch} from 'vue';

const layoutConfig = reactive({
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout() {
    const hasInitialized = ref(false); // Флаг для отслеживания инициализации
    const hasLoadedFromLocalStorage = ref(false); // Флаг для отслеживания загрузки из локального хранилища

    const loadFromLocalStorage = () => {
        const savedConfig = JSON.parse(localStorage.getItem('layoutConfig'));
        const savedState = JSON.parse(localStorage.getItem('layoutState'));

        if (savedConfig) {
            Object.assign(layoutConfig, savedConfig);

            if(layoutConfig.darkTheme) {
                document.documentElement.classList.add('app-dark');
            }
        }

        if (savedState) {
            Object.assign(layoutState, savedState);
        }

        hasLoadedFromLocalStorage.value = true; // Установите флаг после загрузки
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
        localStorage.setItem('layoutState', JSON.stringify(layoutState));
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
        saveToLocalStorage(); // Save state after setting active menu item
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }

        document.startViewTransition(() => executeDarkModeToggle());
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
        saveToLocalStorage(); // Save state after toggling dark mode
    };

    const toggleMenu = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }

        saveToLocalStorage(); // Save state after toggling menu
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);
    const isDarkTheme = computed(() => layoutConfig.darkTheme);
    const getPrimary = computed(() => layoutConfig.primary);
    const getSurface = computed(() => layoutConfig.surface);

    loadFromLocalStorage(); // Load state from local storage when the component is mounted
    hasInitialized.value = true; // Установите флаг инициализации в true

    // Watch for changes in layoutConfig and layoutState and save them to localStorage
    watch(layoutConfig, () => {
        if (hasInitialized.value && hasLoadedFromLocalStorage.value) {
            saveToLocalStorage();
            console.log('layoutConfig changed');
        }
    }, { deep: true });

    watch(layoutState, () => {
        if (hasInitialized.value && hasLoadedFromLocalStorage.value) {
            saveToLocalStorage();
            console.log('layoutState changed');
        }
    }, { deep: true });

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode
    };
}
