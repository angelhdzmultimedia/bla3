import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
nitro: {
  esbuild: {
    options: {
      keepNames: true
    }
  }
},
esbuild: {
    options: {
      keepNames: true
    }
  },
  vite: {
   esbuild: {
     keepNames: true,
   },
   plugins: [tailwindcss()],
 },

  css: ["./src/app/assets/app.css"],

  dir: {
    
  },
  macros: {
       setupSFC: true,
  },
  modules: ["nuxt-quasar-ui", "@vueuse/nuxt", "@vue-macros/nuxt"],
  quasar: {
    extras: {
      fontIcons: ['fontawesome-v6', 'material-icons']
    },
    plugins: ['Dark', 'Notify']
  },
  extends: [
   "/home/angelhdz/Documents/Programming/TypeScript/bla3/src/app",
   "/home/angelhdz/Documents/Programming/TypeScript/bla3/src/domain/user",
   "/home/angelhdz/Documents/Programming/TypeScript/bla3/src/infrastructure/auth",
   "/home/angelhdz/Documents/Programming/TypeScript/bla3/src/infrastructure/theme",
   "/home/angelhdz/Documents/Programming/TypeScript/bla3/src/shared",
   "/home/angelhdz/Documents/Programming/TypeScript/bla3/src/infrastructure/email"
  ],

  typescript: {
    tsConfig: {
      
  compilerOptions: {
    strict: true
  }
    }
  }
})