// Importando modulos
const url = window.location.href;
let scriptLocation = "/twittor/js/sw-utils.js";
if (url.includes("localhost")) scriptLocation = "js/sw-utils.js";
importScripts(scriptLocation);

// Constantes de nombres y versionamiento de caches
const STATIC_CACHE = "static-v1";
const INMUTABLE_CACHE = "inmutable-v1";
const DYNAMIC_CACHE = "dynamic-v1";

// Constantes para app_shell statico e inmutable
const APP_SHELL = [
  // "/",
  "/index.html",
  "/css/style.css",
  "/img/favicon.ico",
  "/img/avatars/spiderman.jpg",
  "/img/avatars/hulk.jpg",
  "/img/avatars/ironman.jpg",
  "/img/avatars/thor.jpg",
  "/img/avatars/wolverine.jpg",
  "/js/app.js",
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

// Proceso de instalación
self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll(APP_SHELL);
  });

  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

// Limpiando cache en cambios
self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      // Barriendo keys
      if (
        key !== STATIC_CACHE &&
        key !== INMUTABLE_CACHE &&
        key !== DYNAMIC_CACHE
      ) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

// Estrategia: Cache con Network Fallback
self.addEventListener("fetch", (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) return res;
    else
      return fetch(e.request.url).then((newRes) => {
        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
      });
  });

  e.respondWith(respuesta);
});
