const rescueEmail = "Info@coastalk9.ca";
const donateUrl = "https://coastalk9.ca/donate";
const allowedMediaCodes = new Set(["coastal", "ck9", "ck9media", "foster"]);
const formOpenedAt = Date.now();

const dogs = [];

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const dogGrid = document.querySelector("[data-dog-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");
const intakeForm = document.querySelector("[data-intake-form]");
const formOutput = document.querySelector("[data-form-output]");
const gateForm = document.querySelector("[data-gate-form]");
const gateOutput = document.querySelector("[data-gate-output]");
const uploadForm = document.querySelector("[data-upload-form]");
const uploadOutput = document.querySelector("[data-media-output]");
const uploadStatus = document.querySelector("[data-upload-status]");
const previewGrid = document.querySelector("[data-preview-grid]");
const dropZone = document.querySelector("[data-drop-zone]");
const printQrButton = document.querySelector("[data-print-qr]");

function refreshIcons() {
  window.lucide?.createIcons();
}

function slugify(value) {
  return String(value || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "upload";
}

function renderDogs(filter = "all") {
  if (!dogGrid) return;
  const visibleDogs = dogs.filter((dog) => filter === "all" || dog.tags.includes(filter));

  dogGrid.innerHTML = visibleDogs
    .map(
      (dog) => `
        <article class="dog-card">
          <img src="${dog.image}" alt="${dog.name}, a Coastal K9 rescue dog" loading="lazy">
          <div class="dog-card-body">
            <header>
              <div>
                <h3>${dog.name}</h3>
                <div class="dog-meta">
                  <span>${dog.age}</span>
                  <span>${dog.sex}</span>
                  <span>${dog.size}</span>
                </div>
              </div>
              <span class="status">${dog.status}</span>
            </header>
            <p>${dog.note}</p>
            <p class="dog-fit">${dog.fit}</p>
            <a class="button primary" href="#apply" data-dog-apply="${dog.name}" aria-label="Apply for ${dog.name}">Apply for ${dog.name}</a>
          </div>
        </article>
      `,
    )
    .join("");
  refreshIcons();
}

function buildMailto({ to = rescueEmail, subject, body }) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function formatPayload(payload) {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("\n");
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function fileSummary(files) {
  return Array.from(files).map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
  }));
}

function setOutput(output, message, isError = false) {
  if (!output) return;
  output.value = message;
  output.classList.toggle("error", isError);
}

function looksLikeBot(form) {
  const honeypot = form.querySelector('[name="website"]');
  const elapsedMs = Date.now() - formOpenedAt;
  return Boolean(honeypot?.value) || elapsedMs < 1800;
}

async function submitToEmail(form, output, successMessage, payload) {
  if (looksLikeBot(form)) {
    setOutput(output, "Submission blocked by the spam filter.", true);
    return false;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent || "";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  try {
    const endpoint = form.dataset.emailEndpoint;
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Email endpoint failed");
      setOutput(output, successMessage);
      return true;
    }
  } catch (error) {
    const mailto = buildMailto({
      to: form.dataset.emailTo || rescueEmail,
      subject: payload.subject,
      body: `${payload.intro}\n\n${formatPayload(payload.fields)}`,
    });
    window.location.href = mailto;
    setOutput(output, "Your email app has been opened with the packet filled in. Send it to complete the handoff.");
    return true;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  return false;
}

function unlockUploadForm() {
  if (!uploadForm) return;
  uploadForm.classList.remove("locked");
  uploadForm.setAttribute("aria-hidden", "false");
  uploadForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
    field.disabled = false;
  });
}

function updatePreview(files) {
  if (!previewGrid || !uploadStatus) return;
  previewGrid.innerHTML = "";
  const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
  uploadStatus.textContent = imageFiles.length
    ? `${imageFiles.length} photo${imageFiles.length === 1 ? "" : "s"} selected.`
    : "No photos selected.";

  imageFiles.forEach((file) => {
    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = `Selected upload preview: ${file.name}`;
    image.onload = () => URL.revokeObjectURL(image.src);
    previewGrid.appendChild(image);
  });
}

renderDogs();

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  });
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (nav && menuToggle) {
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    renderDogs(button.dataset.filter);
  });
});

if (dogGrid && intakeForm) {
  dogGrid.addEventListener("click", (event) => {
    const applyLink = event.target.closest("[data-dog-apply]");
    if (!applyLink) return;
    const dogName = applyLink.dataset.dogApply;
    intakeForm.type.value = "Adopt";
    intakeForm.notes.value = `I am interested in ${dogName}. `;
  });
}

if (intakeForm) {
  intakeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!intakeForm.reportValidity()) return;

    const data = Object.fromEntries(new FormData(intakeForm).entries());
    data.submittedAt = new Date().toISOString();

    await submitToEmail(intakeForm, formOutput, `Thanks, ${data.name}. Your ${data.type.toLowerCase()} request has been sent.`, {
      subject: `Coastal K9 ${data.type} request`,
      intro: "New Coastal K9 website intake:",
      fields: data,
    });
  });
}

if (gateForm) {
  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = String(new FormData(gateForm).get("accessCode") || "").trim().toLowerCase();
    if (!allowedMediaCodes.has(code)) {
      setOutput(gateOutput, "That code did not unlock the demo workflow.", true);
      return;
    }
    unlockUploadForm();
    setOutput(gateOutput, "Upload access unlocked for this session.");
    uploadForm?.querySelector('[name="dogName"]')?.focus();
  });
}

if (uploadForm?.photos) {
  uploadForm.photos.addEventListener("change", () => {
    updatePreview(uploadForm.photos.files);
  });
}

["dragenter", "dragover"].forEach((eventName) => {
  dropZone?.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!uploadForm?.classList.contains("locked")) dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone?.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
});

dropZone?.addEventListener("drop", (event) => {
  if (uploadForm?.classList.contains("locked")) return;
  const files = event.dataTransfer?.files;
  if (!files?.length || !uploadForm?.photos) return;
  uploadForm.photos.files = files;
  updatePreview(files);
});

if (uploadForm) {
  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!uploadForm.reportValidity()) return;
    if (!uploadForm.photos.files.length) {
      setOutput(uploadOutput, "Choose at least one photo before sending the media packet.", true);
      return;
    }

    const formData = new FormData(uploadForm);
    const packet = {
      subject: "Coastal K9 media intake",
      dogName: formData.get("dogName"),
      context: formData.get("context"),
      uploaderName: formData.get("uploaderName"),
      uploaderEmail: formData.get("uploaderEmail"),
      notes: formData.get("mediaNotes"),
      files: fileSummary(uploadForm.photos.files).map((file) => `${file.name} (${file.type || "unknown type"})`),
      uploadedAt: new Date().toISOString(),
    };

    const sent = await submitToEmail(uploadForm, uploadOutput, "Media concept packet prepared. Confirm the final storage and email workflow before using this for real uploads.", {
      subject: "Coastal K9 media intake",
      intro: "Coastal K9 media upload concept packet. Photo files were selected in the browser; confirm attachment handling, storage, privacy, and consent before any real use.",
      fields: packet,
    });

    if (sent) {
      downloadJson(`coastal-k9-media-${slugify(packet.dogName)}-${Date.now()}.json`, packet);
    }
  });
}

printQrButton?.addEventListener("click", () => {
  window.print();
});

if (window.lucide) {
  refreshIcons();
} else {
  window.addEventListener("load", refreshIcons);
}

document.documentElement.style.setProperty("--donate-url", `"${donateUrl}"`);
