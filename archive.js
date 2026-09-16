/* Native disclosure controls retain state and content within the setting page. */
(() => {
  "use strict";
  const sections = [...document.querySelectorAll(".archive-disclosure")];
  const reveal = (id, scroll = true) => {
    const section = sections.find((item) => item.id === id);
    if (!section) return;
    section.open = true;
    if (scroll)
      requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
  };
  const fromURL = () => {
    const id = location.hash.slice(1);
    const params = new URLSearchParams(location.search);
    reveal(
      id ||
        (params.has("creature")
          ? "bestiary"
          : params.has("character")
            ? "characters"
            : params.has("civilization")
              ? "factions"
              : ""),
    );
  };
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (
      !anchor ||
      !sections.some(
        (section) => `#${section.id}` === anchor.getAttribute("href"),
      )
    )
      return;
    event.preventDefault();
    const hash = anchor.getAttribute("href");
    if (location.hash !== hash) history.pushState(null, "", hash);
    reveal(hash.slice(1));
  });
  window.addEventListener("hashchange", fromURL);
  window.addEventListener("popstate", fromURL);
  fromURL();
})();
