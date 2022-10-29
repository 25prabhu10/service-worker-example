const registerServiceWorker = () => {
  // first check for the existence of serviceWorker on the navigator object
  // register Service worker
  // if service worker is supported
  if ("serviceWorker" in navigator) {
    try {
      window.addEventListener("load", async () => {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active 👍🏼");
        }
      });
    } catch (error) {
      console.error(`Registration failed 😱 with ${error}`);
    }
  }
};

registerServiceWorker();
