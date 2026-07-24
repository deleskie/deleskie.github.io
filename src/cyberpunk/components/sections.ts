import type { siteContent } from "../../content/site";
import { escapeHtml, renderLines } from "../../lib/utils";
import { renderGarmentVisual } from "./garment-visual";
import { renderSigil } from "./mark";

type Content = typeof siteContent;

function renderSectionLabel(label: string): string {
  return `<p class="section-label"><span aria-hidden="true"></span>${escapeHtml(label)}</p>`;
}

export function renderHero(content: Content): string {
  const hero = content.hero;

  return `<section class="hero" aria-labelledby="hero-heading">
    <div class="hero__copy">
      <div class="hero__sigil hero-sequence hero-sequence--sigil" aria-hidden="true">
        ${renderSigil(undefined, "hero-sigil")}
      </div>
      <p class="hero__eyebrow hero-sequence hero-sequence--eyebrow">${escapeHtml(hero.eyebrow)}</p>
      <h1 id="hero-heading" class="hero__headline">
        ${hero.headline
          .map(
            (line) =>
              `<span class="hero-sequence hero-sequence--line">${escapeHtml(line)}</span>`,
          )
          .join("\n")}
      </h1>
      <p class="hero__lead">${escapeHtml(hero.lead)}</p>
      <div class="hero__context">
        ${hero.context.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
      <p class="hero__brand-statement">${escapeHtml(hero.brandStatement)}</p>
      <p class="hero__supporting">${escapeHtml(hero.supporting)}</p>
      <p class="hero__development">${escapeHtml(hero.development)}</p>
      <div class="hero__actions hero-sequence hero-sequence--actions">
        <a class="button button--primary" href="#access" data-access-trigger>
          <span>${escapeHtml(hero.primaryCta)}</span>
          <span class="button__arrow" aria-hidden="true">↘</span>
        </a>
        <a class="button button--secondary" href="#system">
          <span>${escapeHtml(hero.secondaryCta)}</span>
          <span class="button__arrow" aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
    <div class="hero__visual hero-sequence hero-sequence--visual">
      ${renderGarmentVisual(hero)}
    </div>
    <div class="hero__rail" aria-hidden="true">
      ${hero.rail.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
    </div>
  </section>`;
}

export function renderManifesto(content: Content): string {
  const section = content.manifesto;

  return `<section class="manifesto section-shell" aria-labelledby="manifesto-heading" data-reveal>
    <div class="manifesto__label">${renderSectionLabel(section.label)}</div>
    <div class="manifesto__content">
      <h2 id="manifesto-heading">${renderLines(section.heading)}</h2>
      <div class="manifesto__body">
        ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
      <p class="manifesto__closing">${renderLines(section.closing)}</p>
    </div>
  </section>`;
}

export function renderProvenance(content: Content): string {
  const section = content.provenance;

  return `<section class="provenance section-shell" id="provenance" aria-labelledby="provenance-heading">
    <div class="provenance__intro" data-reveal>
      ${renderSectionLabel(section.label)}
      <div class="provenance__heading-row">
        <h2 id="provenance-heading">${renderLines(section.heading)}</h2>
        <div class="provenance__body">
          ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      </div>
    </div>
    <div class="founder-grid">
      ${section.founders
        .map(
          (founder, index) => `<article class="founder-card" data-reveal>
            <span class="founder-card__index">0${index + 1}</span>
            <h3>${escapeHtml(founder.name)}</h3>
            <p class="founder-card__discipline">${escapeHtml(founder.discipline)}</p>
            <p class="founder-card__description">${escapeHtml(founder.description)}</p>
          </article>`,
        )
        .join("")}
    </div>
    <div class="method-line" data-reveal>
      <p>${escapeHtml(section.methodLabel)}</p>
      <ol>
        ${section.method
          .map(
            (stage) =>
              `<li><span>${escapeHtml(stage)}</span><i aria-hidden="true">→</i></li>`,
          )
          .join("")}
      </ol>
    </div>
    <p class="provenance__closing section-closing" data-reveal>${renderLines(section.closing)}</p>
  </section>`;
}

export function renderFounderNote(content: Content): string {
  const section = content.founderNote;
  if (!section.enabled) {
    return "";
  }

  return `<section class="founder-note section-shell" aria-labelledby="founder-note-heading">
    <div class="founder-note__rail">
      ${renderSectionLabel(section.label)}
      <span aria-hidden="true">${escapeHtml(section.railCode)}</span>
    </div>
    <article class="founder-note__letter" data-reveal>
      <h2 id="founder-note-heading">${escapeHtml(section.heading)}</h2>
      <div class="founder-note__body">
        ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
      <p class="founder-note__signature">${renderLines(section.signature)}</p>
    </article>
  </section>`;
}

export function renderPrinciples(content: Content): string {
  const section = content.principles;

  return `<section class="principles section-shell" id="principles" aria-labelledby="principles-heading">
    <div class="section-intro" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="principles-heading" class="sr-only">${escapeHtml(section.heading)}</h2>
    </div>
    <div class="principles__list">
      ${section.items
        .map(
          (item) => `<article class="principle" tabindex="0" data-reveal>
            <span class="principle__index">${escapeHtml(item.index)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <div class="principle__copy">
              <p>${escapeHtml(item.body)}</p>
              <div class="principle__detail">
                ${item.detail.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              </div>
            </div>
            <span class="principle__line" aria-hidden="true"></span>
          </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

export function renderArchitecture(content: Content): string {
  const section = content.architecture;

  return `<section class="architecture section-shell" id="system" aria-labelledby="architecture-heading">
    <div class="architecture__intro" data-reveal>
      <div>
        ${renderSectionLabel(section.label)}
        <h2 id="architecture-heading">${renderLines(section.heading)}</h2>
      </div>
      <div class="architecture__intro-copy">
        ${section.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
    </div>
    <div class="architecture__modules">
      ${section.modules
        .map(
          (
            module,
            moduleIndex,
          ) => `<article class="architecture-module" data-reveal>
            <div class="architecture-module__identity">
              <span>${escapeHtml(module.index)}</span>
              <p class="architecture-module__name">${escapeHtml(module.title)} <small>/ ${escapeHtml(module.scope)}</small></p>
            </div>
            <h3 class="architecture-module__heading">${renderLines(module.heading)}</h3>
            <div class="architecture-module__description">
              ${module.description.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
            <div class="sectional-diagram" role="img" aria-label="${escapeHtml(section.diagramLabel)}: ${escapeHtml(module.diagram)}">
              <span class="sectional-diagram__axis" aria-hidden="true"></span>
              <span class="sectional-diagram__layer sectional-diagram__layer--one" aria-hidden="true"></span>
              <span class="sectional-diagram__layer sectional-diagram__layer--two" aria-hidden="true"></span>
              <span class="sectional-diagram__layer sectional-diagram__layer--three" aria-hidden="true"></span>
              <span class="sectional-diagram__code">${escapeHtml(module.diagram)}</span>
              <span class="sectional-diagram__revision">0${moduleIndex + 1} / A</span>
            </div>
            <p class="status-label"><span aria-hidden="true"></span>${escapeHtml(module.status)}</p>
          </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

export function renderSignalControl(content: Content): string {
  const section = content.signal;

  return `<section class="signal section-shell" aria-labelledby="signal-heading">
    <div class="signal__copy" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="signal-heading">${renderLines(section.heading)}</h2>
      <div class="signal__body">
        ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
    </div>
    <div class="signal-console" data-signal-state="connected" data-connected-title="${escapeHtml(section.connected.title)}" data-connected-description="${escapeHtml(section.connected.description)}" data-isolated-title="${escapeHtml(section.isolated.title)}" data-isolated-description="${escapeHtml(section.isolated.description)}" data-reveal>
      <div class="signal-console__header">
        <span>${escapeHtml(section.conceptual)}</span>
        <span class="signal-console__status" data-signal-status>${escapeHtml(section.connected.title)}</span>
      </div>
      <div class="signal-console__visual" role="img" aria-labelledby="signal-visual-title signal-visual-description">
        <span id="signal-visual-title" class="sr-only">${escapeHtml(section.visualTitle)}</span>
        <span id="signal-visual-description" class="sr-only" data-signal-description>${escapeHtml(section.connected.description)}</span>
        <div class="signal-field" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i>
        </div>
        <div class="device-outline" aria-hidden="true">
          <span class="device-outline__door"></span>
          <span class="device-outline__device"></span>
          <span class="device-outline__datum">${escapeHtml(section.datumLabel)}</span>
        </div>
      </div>
      <div class="signal-toggle" role="group" aria-label="${escapeHtml(section.interactionLabel)}">
        <button type="button" data-signal-button="connected" aria-pressed="true">
          <span>01</span>${escapeHtml(section.connected.label)}
        </button>
        <button type="button" data-signal-button="isolated" aria-pressed="false">
          <span>02</span>${escapeHtml(section.isolated.label)}
        </button>
      </div>
      <p class="signal-console__description" aria-live="polite" data-signal-copy>${escapeHtml(section.connected.description)}</p>
    </div>
    <p class="signal__note" data-reveal>${escapeHtml(section.note)}</p>
    <p class="signal__closing section-closing" data-reveal>${renderLines(section.closing)}</p>
  </section>`;
}

export function renderDevelopment(content: Content): string {
  const section = content.development;

  return `<section class="development section-shell" aria-labelledby="development-heading">
    <div class="development__intro" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="development-heading">${renderLines(section.heading)}</h2>
    </div>
    <div class="development__record" data-reveal>
      <ul>
        ${section.failures.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
      <div class="development__body">
        ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
      <p class="development__closing section-closing">${renderLines(section.closing)}</p>
    </div>
  </section>`;
}

export function renderEdition(content: Content): string {
  const section = content.edition;

  return `<section class="edition section-shell" aria-labelledby="edition-heading">
    <div class="edition__register" aria-hidden="true" data-reveal>
      <span>${escapeHtml(section.registerLabel)}</span>
      <div>
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
      <strong>001</strong>
    </div>
    <div class="edition__content" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="edition-heading">${renderLines(section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>
      <ul>
        ${section.statements.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
      <a class="text-link" href="#access" data-access-trigger>${escapeHtml(section.cta)} <span aria-hidden="true">↘</span></a>
      <p class="edition__supporting">${escapeHtml(section.supporting)}</p>
    </div>
  </section>`;
}

export function renderAccessForm(content: Content): string {
  const section = content.access;
  const field = section.fields;

  return `<section class="access section-shell" id="access" aria-labelledby="access-heading">
    <div class="access__intro" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="access-heading">${renderLines(section.heading)}</h2>
      <div class="access__body">
        ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </div>
    </div>
    <form class="access-form" data-access-form data-email-required="${escapeHtml(section.validation.emailRequired)}" data-email-invalid="${escapeHtml(section.validation.emailInvalid)}" data-form-invalid="${escapeHtml(section.validation.formInvalid)}" data-loading-label="${escapeHtml(section.loading)}" data-submit-label="${escapeHtml(section.submit)}" data-success-label="${escapeHtml(section.success)}" data-success-message="${escapeHtml(section.successMessage)}" data-unavailable-message="${escapeHtml(section.unavailable)}" data-error-message="${escapeHtml(section.error)}" novalidate data-reveal>
      <div class="form-field form-field--wide">
        <label for="access-email">
          <span>${escapeHtml(field.email.label)}</span>
          <small>${escapeHtml(field.email.hint)}</small>
        </label>
        <input id="access-email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required aria-describedby="access-email-error">
        <p class="field-error" id="access-email-error" data-error-for="email"></p>
      </div>
      <div class="form-field">
        <label for="access-name">
          <span>${escapeHtml(field.name.label)}</span>
          <small>${escapeHtml(field.name.hint)}</small>
        </label>
        <input id="access-name" name="name" type="text" autocomplete="name" maxlength="100">
        <p class="field-error" id="access-name-error" data-error-for="name"></p>
      </div>
      <div class="form-field">
        <label for="access-region"><span>${escapeHtml(field.region.label)}</span></label>
        <select id="access-region" name="region" autocomplete="country-name">
          <option value="">${escapeHtml(field.region.placeholder)}</option>
          ${section.regionOptions
            .map(
              (option) =>
                `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`,
            )
            .join("")}
        </select>
        <p class="field-error" id="access-region-error" data-error-for="region"></p>
      </div>
      <div class="form-field">
        <label for="access-interest"><span>${escapeHtml(field.interest.label)}</span></label>
        <select id="access-interest" name="interest">
          <option value="">${escapeHtml(field.interest.placeholder)}</option>
          ${section.interestOptions
            .map(
              (option) =>
                `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`,
            )
            .join("")}
        </select>
        <p class="field-error" id="access-interest-error" data-error-for="interest"></p>
      </div>
      <div class="form-field">
        <label for="access-code">
          <span>${escapeHtml(field.invitationCode.label)}</span>
          <small>${escapeHtml(field.invitationCode.hint)}</small>
        </label>
        <input id="access-code" name="invitationCode" type="text" autocomplete="off" maxlength="80">
        <p class="field-error" id="access-code-error" data-error-for="invitationCode"></p>
      </div>
      <div class="honeypot" aria-hidden="true">
        <label for="company-website">${escapeHtml(field.honeypot.label)}</label>
        <input id="company-website" name="companyWebsite" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="form-submit">
        <p>${escapeHtml(section.consent)}</p>
        <button class="button button--primary" type="submit" data-submit-button>
          <span data-submit-label>${escapeHtml(section.submit)}</span>
          <span class="button__arrow" aria-hidden="true">↘</span>
        </button>
      </div>
      <div class="form-status" data-form-status role="status" aria-live="polite" aria-atomic="true"></div>
    </form>
  </section>`;
}
