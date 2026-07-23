"use strict";
document.documentElement.classList.replace("no-js", "js");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
initializeHeader();
initializeAccessLinks();
initializeSignalControl();
initializeScrollReveal();
initializeGarmentParallax();
initializeAccessForm();
function initializeHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) {
        return;
    }
    const toggle = header.querySelector(".menu-toggle");
    const menu = header.querySelector(".site-nav");
    const label = toggle?.querySelector("[data-menu-label]");
    const updateScrollState = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    const closeMenu = (returnFocus = false) => {
        if (!toggle) {
            return;
        }
        header.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
        if (label) {
            label.textContent = toggle.dataset.openLabel || "";
        }
        if (returnFocus) {
            toggle.focus();
        }
    };
    toggle?.addEventListener("click", () => {
        const willOpen = !header.classList.contains("is-menu-open");
        header.classList.toggle("is-menu-open", willOpen);
        toggle.setAttribute("aria-expanded", String(willOpen));
        if (label) {
            label.textContent = willOpen
                ? toggle.dataset.closeLabel || ""
                : toggle.dataset.openLabel || "";
        }
        if (willOpen) {
            menu?.querySelector("a")?.focus();
        }
    });
    menu?.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            closeMenu();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && header.classList.contains("is-menu-open")) {
            closeMenu(true);
        }
    });
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
}
function initializeAccessLinks() {
    const emailField = document.querySelector("#access-email");
    if (!emailField) {
        return;
    }
    document
        .querySelectorAll("[data-access-trigger]")
        .forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            emailField.scrollIntoView({
                behavior: reducedMotion.matches ? "auto" : "smooth",
                block: "center",
            });
            emailField.focus({ preventScroll: true });
        });
    });
}
function initializeSignalControl() {
    const consoleElement = document.querySelector(".signal-console");
    if (!consoleElement) {
        return;
    }
    const buttons = consoleElement.querySelectorAll("[data-signal-button]");
    const status = consoleElement.querySelector("[data-signal-status]");
    const description = consoleElement.querySelector("[data-signal-description]");
    const visibleCopy = consoleElement.querySelector("[data-signal-copy]");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const state = button.dataset.signalButton;
            if (state !== "connected" && state !== "isolated") {
                return;
            }
            consoleElement.dataset.signalState = state;
            buttons.forEach((candidate) => {
                candidate.setAttribute("aria-pressed", String(candidate === button));
            });
            const title = state === "connected"
                ? consoleElement.dataset.connectedTitle
                : consoleElement.dataset.isolatedTitle;
            const copy = state === "connected"
                ? consoleElement.dataset.connectedDescription
                : consoleElement.dataset.isolatedDescription;
            if (status && title) {
                status.textContent = title;
            }
            if (description && copy) {
                description.textContent = copy;
            }
            if (visibleCopy && copy) {
                visibleCopy.textContent = copy;
            }
        });
    });
}
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll("[data-reveal]");
    if (revealElements.length === 0 ||
        reducedMotion.matches ||
        !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealElements.forEach((element) => observer.observe(element));
}
function initializeGarmentParallax() {
    const visual = document.querySelector(".hero__visual");
    const capablePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!visual || !capablePointer.matches || reducedMotion.matches) {
        return;
    }
    window.addEventListener("pointermove", (event) => {
        const x = ((event.clientX / window.innerWidth) * 2 - 1) * 4;
        const y = ((event.clientY / window.innerHeight) * 2 - 1) * 4;
        visual.style.setProperty("--pointer-x", x.toFixed(2));
        visual.style.setProperty("--pointer-y", y.toFixed(2));
    }, { passive: true });
}
function initializeAccessForm() {
    const form = document.querySelector("[data-access-form]");
    if (!form) {
        return;
    }
    const email = form.elements.namedItem("email");
    const submitButton = form.querySelector("[data-submit-button]");
    const submitLabel = form.querySelector("[data-submit-label]");
    const status = form.querySelector("[data-form-status]");
    if (!(email instanceof HTMLInputElement) || !submitButton || !status) {
        return;
    }
    const clearFieldError = (fieldName) => {
        const field = form.elements.namedItem(fieldName);
        const error = form.querySelector(`[data-error-for="${fieldName}"]`);
        if (field instanceof HTMLInputElement ||
            field instanceof HTMLSelectElement) {
            field.removeAttribute("aria-invalid");
        }
        if (error) {
            error.textContent = "";
        }
    };
    const showFieldError = (fieldName, message) => {
        const field = form.elements.namedItem(fieldName);
        const error = form.querySelector(`[data-error-for="${fieldName}"]`);
        if (field instanceof HTMLInputElement ||
            field instanceof HTMLSelectElement) {
            field.setAttribute("aria-invalid", "true");
        }
        if (error) {
            error.textContent = message;
        }
    };
    email.addEventListener("input", () => clearFieldError("email"));
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "";
        clearFieldError("email");
        const normalizedEmail = email.value.trim().toLowerCase();
        if (!normalizedEmail) {
            showFieldError("email", form.dataset.emailRequired || "");
            status.textContent = form.dataset.formInvalid || "";
            email.focus();
            return;
        }
        if (!email.checkValidity()) {
            showFieldError("email", form.dataset.emailInvalid || "");
            status.textContent = form.dataset.formInvalid || "";
            email.focus();
            return;
        }
        const formData = new FormData(form);
        const payload = {
            email: normalizedEmail,
            name: String(formData.get("name") || "").trim(),
            region: String(formData.get("region") || ""),
            interest: String(formData.get("interest") || ""),
            invitationCode: String(formData.get("invitationCode") || "").trim(),
            companyWebsite: String(formData.get("companyWebsite") || "").trim(),
        };
        const parameters = new URLSearchParams(window.location.search);
        copyOptional(payload, "referrer", document.referrer);
        copyOptional(payload, "utmSource", parameters.get("utm_source"));
        copyOptional(payload, "utmMedium", parameters.get("utm_medium"));
        copyOptional(payload, "utmCampaign", parameters.get("utm_campaign"));
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        if (submitLabel) {
            submitLabel.textContent = form.dataset.loadingLabel || "";
        }
        try {
            const response = await fetch("/api/access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "same-origin",
            });
            const result = (await response.json());
            if (response.ok && result.ok) {
                form.reset();
                status.textContent = `${form.dataset.successLabel || ""} — ${result.message || form.dataset.successMessage || ""}`;
            }
            else if (result.state === "invalid") {
                for (const [fieldName, message] of Object.entries(result.fieldErrors || {})) {
                    showFieldError(fieldName, message);
                }
                status.textContent = result.message || form.dataset.formInvalid || "";
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                firstInvalid?.focus();
            }
            else if (response.status === 503) {
                status.textContent =
                    form.dataset.unavailableMessage || result.message || "";
            }
            else {
                status.textContent = result.message || form.dataset.errorMessage || "";
            }
        }
        catch {
            status.textContent = form.dataset.errorMessage || "";
        }
        finally {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
            if (submitLabel) {
                submitLabel.textContent = form.dataset.submitLabel || "";
            }
        }
    });
}
function copyOptional(target, key, value) {
    const normalized = value?.trim();
    if (normalized) {
        target[key] = normalized;
    }
}
