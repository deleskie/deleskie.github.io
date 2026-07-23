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
      <p class="hero__supporting">${escapeHtml(hero.supporting)}</p>
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
        <p>${escapeHtml(section.body)}</p>
        <p>${escapeHtml(section.supporting)}</p>
      </div>
    </div>
    <p class="manifesto__note">${escapeHtml(section.sideNote)}</p>
  </section>`;
}

export function renderPrinciples(content: Content): string {
  const section = content.principles;

  return `<section class="principles section-shell" id="principles" aria-labelledby="principles-heading">
    <div class="section-intro" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="principles-heading">${escapeHtml(section.heading)}</h2>
    </div>
    <div class="principles__list">
      ${section.items
        .map(
          (item) => `<article class="principle" tabindex="0" data-reveal>
            <span class="principle__index">${escapeHtml(item.index)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <div class="principle__copy">
              <p>${escapeHtml(item.body)}</p>
              <p class="principle__detail">${escapeHtml(item.detail)}</p>
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
      <p>${escapeHtml(section.intro)}</p>
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
              <h3>${escapeHtml(module.title)} <small>/ ${escapeHtml(module.scope)}</small></h3>
            </div>
            <p class="architecture-module__description">${escapeHtml(module.description)}</p>
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
      <p>${escapeHtml(section.body)}</p>
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
    <p class="signal__note" data-reveal>“${escapeHtml(section.note)}”</p>
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
      <h2 id="edition-heading">${escapeHtml(section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>
      <ul>
        ${section.statements.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
      <a class="text-link" href="#access" data-access-trigger>${escapeHtml(section.cta)} <span aria-hidden="true">↘</span></a>
    </div>
  </section>`;
}

export function renderAccessForm(content: Content): string {
  const section = content.access;
  const field = section.fields;

  return `<section class="access section-shell" id="access" aria-labelledby="access-heading">
    <div class="access__intro" data-reveal>
      ${renderSectionLabel(section.label)}
      <h2 id="access-heading">${escapeHtml(section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>
      <p class="access__privacy-note">${escapeHtml(section.privacyNote)}</p>
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
