import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to Wanderly",
        stays: "Stays",
        flights: "Flights",
        packages: "Packages",
        cars: "Car rental",
        attractions: "Attractions",
        cabs: "Airport cabs",
        register: "Register",
        signin: "Sign in",
      },
    },
    hi: {
      translation: {
        welcome: "वांडरली में आपका स्वागत है",
        stays: "रुकने की जगहें",
        flights: "उड़ानें",
        packages: "पैकेज",
        cars: "कार किराया",
        attractions: "आकर्षण",
        cabs: "एयरपोर्ट टैक्सी",
        register: "रजिस्टर करें",
        signin: "साइन इन करें",
      },
    },
    es: {
      translation: {
        welcome: "Bienvenido a Wanderly",
        stays: "Estancias",
        flights: "Vuelos",
        packages: "Paquetes",
        cars: "Alquiler de coches",
        attractions: "Atracciones",
        cabs: "Taxis de aeropuerto",
        register: "Registrarse",
        signin: "Iniciar sesión",
      },
    },
    fr: {
      translation: {
        welcome: "Bienvenue à Wanderly",
        stays: "Séjours",
        flights: "Vols",
        packages: "Forfaits",
        cars: "Location de voiture",
        attractions: "Attractions",
        cabs: "Taxis d'aéroport",
        register: "S'inscrire",
        signin: "Se connecter",
      },
    },
    de: {
      translation: {
        welcome: "Willkommen bei Wanderly",
        stays: "Unterkünfte",
        flights: "Flüge",
        packages: "Pakete",
        cars: "Autovermietung",
        attractions: "Sehenswürdigkeiten",
        cabs: "Flughafentaxis",
        register: "Registrieren",
        signin: "Einloggen",
      },
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
