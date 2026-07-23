import type { siteContent } from "../../content/site";
import { escapeHtml } from "../../lib/utils";

type HeroContent = (typeof siteContent)["hero"];

export function renderGarmentVisual(hero: HeroContent): string {
  const [shell, isolation, carrier] = hero.callouts;

  return `<figure class="garment-study" data-garment>
    <figcaption class="garment-study__index">${escapeHtml(hero.visualIndex)}</figcaption>
    <svg class="garment-svg" viewBox="0 0 720 880" role="img" aria-labelledby="garment-title garment-description">
      <title id="garment-title">${escapeHtml(hero.visualTitle)}</title>
      <desc id="garment-description">${escapeHtml(hero.visualDescription)}</desc>
      <defs>
        <linearGradient id="sable-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#050505" />
          <stop offset=".48" stop-color="#0d0f10" />
          <stop offset=".78" stop-color="#090a0b" />
          <stop offset="1" stop-color="#030303" />
        </linearGradient>
        <linearGradient id="sable-edge" x1="0" y1="0" x2="1" y2=".35">
          <stop offset="0" stop-color="#666b70" stop-opacity="0" />
          <stop offset=".48" stop-color="#d4d7d9" stop-opacity=".55" />
          <stop offset=".68" stop-color="#8d9399" stop-opacity=".18" />
          <stop offset="1" stop-color="#8d9399" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="sable-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#d9dde0" stop-opacity="0" />
          <stop offset=".5" stop-color="#f2f3f3" stop-opacity=".34" />
          <stop offset="1" stop-color="#d9dde0" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="sable-falloff" cx=".55" cy=".28" r=".68">
          <stop offset="0" stop-color="#6f7478" stop-opacity=".16" />
          <stop offset=".55" stop-color="#141618" stop-opacity=".04" />
          <stop offset="1" stop-color="#050505" stop-opacity="0" />
        </radialGradient>
        <clipPath id="sable-form-clip">
          <path d="M266 185 C271 99 317 55 360 53 C407 55 450 103 456 185 L503 222 C552 261 577 345 582 457 L602 803 L118 803 L138 457 C144 345 169 262 217 222 Z" />
        </clipPath>
        <filter id="sable-soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <ellipse cx="368" cy="333" rx="300" ry="322" fill="url(#sable-falloff)" />

      <g class="garment-form">
        <path class="garment-body" d="M266 185 C271 99 317 55 360 53 C407 55 450 103 456 185 L503 222 C552 261 577 345 582 457 L602 803 L118 803 L138 457 C144 345 169 262 217 222 Z" fill="url(#sable-body)" />
        <path class="garment-hood-depth" d="M281 184 C288 118 323 81 360 79 C397 81 433 119 440 184 C414 166 388 157 360 157 C332 157 305 166 281 184 Z" />
        <path class="garment-neck" d="M284 183 C314 205 337 217 360 219 C383 217 407 205 437 183" />
        <path class="garment-shoulder garment-shoulder--left" d="M267 185 C246 202 229 215 217 222 C180 243 155 311 142 405" />
        <path class="garment-shoulder garment-shoulder--right" d="M454 185 C475 202 491 215 503 222 C542 245 565 314 578 407" />
        <path class="garment-center" d="M360 219 L360 803" />
        <path class="garment-seam garment-seam--left" d="M217 222 C248 305 254 380 250 461 C245 568 230 681 225 803" />
        <path class="garment-seam garment-seam--right" d="M503 222 C472 305 466 380 470 461 C475 568 490 681 495 803" />
        <path class="garment-pocket" d="M393 360 L478 383 L463 517 L389 506 Z" />
        <path class="garment-hardware" d="M367 260 L367 473" />
        <rect class="garment-pull" x="363" y="311" width="9" height="25" rx="1" />
        <path class="garment-hem" d="M120 802 C272 791 449 791 601 802" />
      </g>

      <g class="garment-light" clip-path="url(#sable-form-clip)" aria-hidden="true">
        <rect class="garment-light__sweep" x="-280" y="20" width="160" height="830" fill="url(#sable-sweep)" transform="skewX(-12)" />
      </g>

      <g class="garment-edge" aria-hidden="true">
        <path d="M266 185 C271 99 317 55 360 53 C407 55 450 103 456 185" stroke="url(#sable-edge)" />
        <path d="M456 185 L503 222 C552 261 577 345 582 457" stroke="url(#sable-edge)" />
        <path d="M267 185 L217 222 C169 262 144 345 138 457" stroke="url(#sable-edge)" opacity=".48" />
      </g>

      <g class="garment-callouts" aria-hidden="true">
        <g>
          <path d="M194 322 H67 V294" />
          <circle cx="194" cy="322" r="2.5" />
          <text x="67" y="278">${escapeHtml(shell.label)}</text>
          <text class="callout-index" x="67" y="296">${escapeHtml(shell.detail)}</text>
        </g>
        <g>
          <path d="M418 432 H659 V404" />
          <circle cx="418" cy="432" r="2.5" />
          <text x="532" y="387">${escapeHtml(isolation.label)}</text>
          <text class="callout-index" x="532" y="405">${escapeHtml(isolation.detail)}</text>
        </g>
        <g>
          <path d="M301 627 H57 V655" />
          <circle cx="301" cy="627" r="2.5" />
          <text x="57" y="681">${escapeHtml(carrier.label)}</text>
          <text class="callout-index" x="57" y="699">${escapeHtml(carrier.detail)}</text>
        </g>
      </g>

      <g class="garment-registration" aria-hidden="true">
        <path d="M24 24 H52 M24 24 V52 M696 24 H668 M696 24 V52 M24 856 H52 M24 856 V828 M696 856 H668 M696 856 V828" />
        <text x="24" y="92">${escapeHtml(hero.registration.project)}</text>
        <text x="620" y="843">${escapeHtml(hero.registration.revision)}</text>
      </g>
    </svg>
  </figure>`;
}
