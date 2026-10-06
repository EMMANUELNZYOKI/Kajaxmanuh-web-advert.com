(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  const themeButton = document.querySelector("#theme-toggle");
  const themeLabel = themeButton?.querySelector(".theme-toggle-label");
  const year = document.querySelector("#current-year");
  const form = document.querySelector("#project-form");
  const status = document.querySelector("#form-status");

  if (year) year.textContent = String(new Date().getFullYear());

  const applyTheme = (theme, persist = false) => {
    const selected = theme === "dark" ? "dark" : "light";
    root.dataset.theme = selected;
    const nextMode = selected === "dark" ? "light" : "dark";

    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(selected === "dark"));
      themeButton.setAttribute("aria-label", `Switch to ${nextMode} mode`);
    }
    if (themeLabel) {
      themeLabel.textContent = `${nextMode[0].toUpperCase()}${nextMode.slice(1)} mode`;
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute(
        "content",
        selected === "dark" ? "#101926" : "#f7f8fa",
      );
    }

    if (persist) {
      try {
        localStorage.setItem("kajax-theme", selected);
      } catch {
        // The visual preference still applies for the current page if storage is unavailable.
      }
    }
  };

  applyTheme(root.dataset.theme || "light");
  themeButton?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  if (menuButton && navigation) {
    const closeMenu = (restoreFocus = false) => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation",
      );
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu(true);
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const fields = [
        ["Name", data.get("name")],
        ["Email", data.get("email")],
        ["Phone", data.get("phone")],
        ["Business / company", data.get("company") || "Not provided"],
        ["Service required", data.get("service")],
        ["Project budget", data.get("budget") || "Not provided"],
        ["Project description", data.get("description")],
      ];
      const body = fields
        .map(([label, value]) => `${label}:\n${String(value).trim()}`)
        .join("\n\n");
      const subject = `Project enquiry — ${String(data.get("name")).trim()}`;
      const mailto = `mailto:kajaxcodelab@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent =
        "Opening your email app with the project enquiry ready to review and send. If it does not open, email kajaxcodelab@gmail.com or contact us on WhatsApp.";
      window.location.href = mailto;
    });
  }
})();
