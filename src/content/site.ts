export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export const regionValues = [
  "united-states",
  "canada",
  "united-kingdom",
  "european-union",
  "gcc",
  "asia-pacific",
  "other",
] as const;

export type RegionValue = (typeof regionValues)[number];

export const interestValues = [
  "global-shell",
  "private-configuration",
  "atelier-client",
  "strategic-partner",
  "design-creative-collaboration",
  "press",
  "other",
] as const;

export type InterestValue = (typeof interestValues)[number];

type SiteContent = {
  brand: {
    name: string;
    product: string;
    tagline: string;
    markLabel: string;
    contactEmail: string;
    canonicalBaseUrl: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    ogAlt: string;
    cardDescriptor: string;
  };
  navigation: {
    skip: string;
    menuLabel: string;
    footerLabel: string;
    openMenu: string;
    closeMenu: string;
    items: { label: string; href: string }[];
    accessLabel: string;
  };
  hero: {
    eyebrow: string;
    headline: string[];
    lead: string;
    supporting: string;
    primaryCta: string;
    secondaryCta: string;
    visualTitle: string;
    visualDescription: string;
    visualIndex: string;
    callouts: { label: string; detail: string }[];
    registration: { project: string; revision: string };
    rail: string[];
  };
  manifesto: {
    label: string;
    heading: string[];
    body: string;
    supporting: string;
    sideNote: string;
  };
  principles: {
    label: string;
    heading: string;
    items: {
      index: string;
      title: string;
      body: string;
      detail: string;
    }[];
  };
  architecture: {
    label: string;
    heading: string[];
    intro: string;
    diagramLabel: string;
    modules: {
      index: string;
      title: string;
      scope: string;
      description: string;
      status: string;
      diagram: string;
    }[];
  };
  signal: {
    label: string;
    heading: string[];
    body: string;
    interactionLabel: string;
    connected: {
      label: string;
      title: string;
      description: string;
    };
    isolated: {
      label: string;
      title: string;
      description: string;
    };
    conceptual: string;
    visualTitle: string;
    datumLabel: string;
    note: string;
  };
  edition: {
    label: string;
    heading: string;
    body: string;
    statements: string[];
    cta: string;
    registerLabel: string;
  };
  access: {
    label: string;
    heading: string;
    body: string;
    privacyNote: string;
    fields: {
      email: { label: string; hint: string };
      name: { label: string; hint: string };
      region: { label: string; placeholder: string };
      interest: { label: string; placeholder: string };
      invitationCode: { label: string; hint: string };
      honeypot: { label: string };
    };
    regionOptions: SelectOption<RegionValue>[];
    interestOptions: SelectOption<InterestValue>[];
    consent: string;
    submit: string;
    loading: string;
    success: string;
    successMessage: string;
    unavailable: string;
    error: string;
    validation: {
      emailRequired: string;
      emailInvalid: string;
      formInvalid: string;
    };
  };
  footer: {
    descriptor: string;
    links: { label: string; href: string }[];
    legal: string;
    copyright: string;
  };
  privacy: {
    eyebrow: string;
    heading: string;
    updatedLabel: string;
    updated: string;
    intro: string;
    sections: { heading: string; paragraphs: string[] }[];
    backLabel: string;
  };
  legal: {
    eyebrow: string;
    heading: string;
    intro: string;
    sections: { heading: string; paragraphs: string[] }[];
    backLabel: string;
  };
  notFound: {
    eyebrow: string;
    heading: string;
    body: string;
    action: string;
  };
};

const configuredContact =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  process.env.PUBLIC_CONTACT_EMAIL?.trim() ||
  "access@projectsable.example";

const configuredBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ||
  "https://deleskie.com/cyberpunk";

export const siteContent = {
  brand: {
    name: "PROJECT SABLE",
    product: "SYSTEM 001",
    tagline: "WEAR THE PERIMETER.",
    markLabel: "Project Sable geometric sigil",
    contactEmail: configuredContact,
    canonicalBaseUrl: configuredBaseUrl,
  },
  metadata: {
    title: "PROJECT SABLE — SYSTEM 001",
    description:
      "A private technical garment system for discretion, signal control, and modular resilience.",
    keywords: [
      "technical garment system",
      "private client",
      "modular design",
      "signal isolation",
      "luxury technical clothing",
    ],
    ogAlt:
      "Project Sable System 001 wordmark beside an abstract tailored garment silhouette.",
    cardDescriptor: "PRIVATE TECHNICAL GARMENT SYSTEM",
  },
  navigation: {
    skip: "SKIP TO CONTENT",
    menuLabel: "Primary navigation",
    footerLabel: "Footer navigation",
    openMenu: "OPEN MENU",
    closeMenu: "CLOSE MENU",
    items: [
      { label: "SYSTEM", href: "#system" },
      { label: "PRINCIPLES", href: "#principles" },
      { label: "ACCESS", href: "#access" },
    ],
    accessLabel: "PRIVATE ACCESS",
  },
  hero: {
    eyebrow: "PRIVATE DEVELOPMENT / SYSTEM 001",
    headline: ["WEAR THE", "PERIMETER."],
    lead: "A private technical garment system for discretion, signal control, and modular resilience.",
    supporting:
      "Multiple configurations are in development. Availability will vary by jurisdiction.",
    primaryCta: "REQUEST PRIVATE ACCESS",
    secondaryCta: "EXPLORE THE SYSTEM",
    visualTitle: "Abstract System 001 garment study",
    visualDescription:
      "A tailored hooded torso form emerges from darkness through restrained edge light, seam paths, and three conceptual architecture callouts.",
    visualIndex: "FORM STUDY / 001",
    callouts: [
      { label: "SHELL", detail: "01 / EXTERIOR" },
      { label: "ISOLATION", detail: "02 / DEVICE" },
      { label: "CARRIER", detail: "03 / INTERNAL" },
    ],
    registration: { project: "PS / 001", revision: "REV / A" },
    rail: ["PRIVATE / 001", "CONCEPT / DEVELOPMENT"],
  },
  manifesto: {
    label: "DESIGN POSITION / 001",
    heading: ["THE EXTERIOR SAYS NOTHING.", "THE ARCHITECTURE DOES."],
    body: "Built for people who operate critical systems, move through high-friction environments, and prefer capability without spectacle.",
    supporting:
      "Not armor disguised as fashion. Not fashion decorated with security language. A system in which fit, material, privacy, serviceability, and evidence are designed together.",
    sideNote: "ORDINARY APPEARANCE / EXTRAORDINARY ARCHITECTURE",
  },
  principles: {
    label: "OPERATING PRINCIPLES",
    heading: "CAPABILITY WITHOUT SPECTACLE.",
    items: [
      {
        index: "01",
        title: "DISCRETION",
        body: "Luxury construction, a restrained silhouette, and no visible tactical language.",
        detail: "The garment reads as clothing before it reads as equipment.",
      },
      {
        index: "02",
        title: "ISOLATION",
        body: "A removable device compartment designed for configuration-specific RF testing.",
        detail:
          "Connection and intentional isolation remain distinct device states.",
      },
      {
        index: "03",
        title: "MODULARITY",
        body: "A global non-ballistic shell and separate controlled configurations, developed as distinct products.",
        detail:
          "Legal scope and technical evidence follow the exact configuration.",
      },
      {
        index: "04",
        title: "SERVICEABILITY",
        body: "Replaceable modules, serialized provenance, repair-first ownership, and a persistent service record.",
        detail:
          "Long-term care is part of the architecture, not an afterthought.",
      },
    ],
  },
  architecture: {
    label: "CONFIGURATION ARCHITECTURE",
    heading: ["ONE DESIGN LANGUAGE.", "SEPARATE SYSTEMS."],
    intro:
      "The platform is being developed as more than one legally and technically distinct configuration.",
    diagramLabel: "Conceptual sectional study",
    modules: [
      {
        index: "01",
        title: "SHELL",
        scope: "GLOBAL",
        description:
          "The core garment. Non-ballistic. Technical storage, weather-conscious construction, understated hardware, and serialized provenance.",
        status: "GLOBAL CONCEPT",
        diagram: "EXTERIOR / UTILITY / PROVENANCE",
      },
      {
        index: "02",
        title: "CONTROLLED",
        scope: "PRIVATE",
        description:
          "A separate architecture intended for approved markets, approved users, and independently evaluated protective components.",
        status: "JURISDICTION DEPENDENT",
        diagram: "SEPARATE / CONTROLLED / DOCUMENTED",
      },
      {
        index: "03",
        title: "ATELIER",
        scope: "001",
        description:
          "Private fitting, limited materials, custom finish, configuration records, and long-term service.",
        status: "BY APPOINTMENT",
        diagram: "FIT / FINISH / SERVICE",
      },
    ],
  },
  signal: {
    label: "DEVICE STATE",
    heading: ["CONNECTED WHEN REQUIRED.", "ISOLATED WHEN INTENDED."],
    body: "The system separates ordinary device access from a removable signal-isolation module designed for completed-assembly testing.",
    interactionLabel: "Select conceptual device state",
    connected: {
      label: "CONNECTED",
      title: "ORDINARY ACCESS",
      description:
        "The conceptual enclosure remains open and a restrained signal field is visible.",
    },
    isolated: {
      label: "ISOLATED",
      title: "INTENTIONAL STATE",
      description:
        "The conceptual enclosure closes and the signal field recedes.",
    },
    conceptual: "CONCEPTUAL INTERFACE / NO PERFORMANCE VALUE",
    visualTitle: "Conceptual signal-isolation state",
    datumLabel: "D / 001",
    note: "Final performance will depend on configuration, closure, condition, frequency, and completed-product test results.",
  },
  edition: {
    label: "INITIAL ALLOCATION",
    heading: "NOT A PUBLIC LAUNCH.",
    body: "The first release is planned as a small serialized edition, placed through private allocation rather than open retail distribution.",
    statements: [
      "No public release date.",
      "No mass-market preorder.",
      "No open protective-product checkout.",
      "Access requests are reviewed individually.",
    ],
    cta: "REQUEST CONSIDERATION",
    registerLabel: "ALLOCATION REGISTER / STATUS PRIVATE",
  },
  access: {
    label: "PRIVATE ACCESS",
    heading: "ENTER THE PRIVATE CHANNEL.",
    body: "Request development updates, private previews, or consideration for an initial allocation.",
    privacyNote: "Minimal data. Limited contact. No public list.",
    fields: {
      email: { label: "EMAIL", hint: "REQUIRED" },
      name: { label: "NAME", hint: "OPTIONAL" },
      region: { label: "REGION", placeholder: "SELECT REGION / OPTIONAL" },
      interest: {
        label: "AREA OF INTEREST",
        placeholder: "SELECT INTEREST / OPTIONAL",
      },
      invitationCode: { label: "INVITATION CODE", hint: "OPTIONAL" },
      honeypot: { label: "Company website" },
    },
    regionOptions: [
      { value: "united-states", label: "United States" },
      { value: "canada", label: "Canada" },
      { value: "united-kingdom", label: "United Kingdom" },
      { value: "european-union", label: "European Union" },
      { value: "gcc", label: "GCC" },
      { value: "asia-pacific", label: "Asia-Pacific" },
      { value: "other", label: "Other" },
    ],
    interestOptions: [
      { value: "global-shell", label: "Global shell" },
      { value: "private-configuration", label: "Private configuration" },
      { value: "atelier-client", label: "Atelier client" },
      { value: "strategic-partner", label: "Strategic partner" },
      {
        value: "design-creative-collaboration",
        label: "Design or creative collaboration",
      },
      { value: "press", label: "Press" },
      { value: "other", label: "Other" },
    ],
    consent:
      "By requesting access, you agree to receive limited project and allocation updates. We do not sell access-request data.",
    submit: "REQUEST ACCESS",
    loading: "TRANSMITTING",
    success: "REQUEST RECORDED",
    successMessage:
      "If the project is relevant to your request, we will make contact.",
    unavailable: "Private channel temporarily unavailable.",
    error: "The request could not be transmitted. Please try again later.",
    validation: {
      emailRequired: "Enter an email address.",
      emailInvalid: "Enter a valid email address.",
      formInvalid: "Review the highlighted field and try again.",
    },
  },
  footer: {
    descriptor: "PRIVATE DEVELOPMENT / SYSTEM 001",
    links: [
      { label: "Privacy", href: "/cyberpunk/privacy/" },
      { label: "Legal", href: "/cyberpunk/legal/" },
      { label: "Contact", href: `mailto:${configuredContact}` },
    ],
    legal:
      "Concept under development. Nothing on this site is an offer for sale or a protective-performance claim. Any future protective configuration will be offered only where lawful and with configuration-specific testing, documentation, and disclosures.",
    copyright: "PRIVATE DEVELOPMENT. ALL RIGHTS RESERVED.",
  },
  privacy: {
    eyebrow: "INFORMATION PRACTICE / 001",
    heading: "PRIVACY, WITHOUT THE THEATER.",
    updatedLabel: "LAST UPDATED",
    updated: "23 JULY 2026",
    intro:
      "Project Sable collects only the information needed to review a private-access request and communicate limited project updates.",
    sections: [
      {
        heading: "WHAT WE COLLECT",
        paragraphs: [
          "Email is required. Name, region, area of interest, and invitation code are optional. We may also receive a referring page and campaign labels when they are present in the link you used.",
          "We do not use browser fingerprinting and do not store a visitor’s complete IP address with an access request.",
        ],
      },
      {
        heading: "HOW WE USE IT",
        paragraphs: [
          "We use request data to assess relevance, contact you about development or allocation updates, prevent abuse, and maintain an accurate private-access record.",
          "We do not sell access-request data or use it for third-party advertising.",
        ],
      },
      {
        heading: "COOKIES AND ANALYTICS",
        paragraphs: [
          "The default site uses no cookies and loads no advertising, session-replay, or cross-site tracking technology.",
          "Privacy-first, cookieless analytics may be enabled later only through the documented configuration. The site continues to work when analytics are absent.",
        ],
      },
      {
        heading: "STORAGE AND RETENTION",
        paragraphs: [
          "Production requests are intended to be stored with a restricted server-side provider. Access is limited to people operating the project.",
          "Records are kept only while they remain relevant to development, allocation, legal, or security needs. You may request deletion by using the contact address below.",
        ],
      },
      {
        heading: "CONTACT",
        paragraphs: [
          `For a privacy question or deletion request, contact ${configuredContact}.`,
        ],
      },
    ],
    backLabel: "RETURN TO SYSTEM 001",
  },
  legal: {
    eyebrow: "DEVELOPMENT STATUS / 001",
    heading: "CONCEPT, SCOPE, AND JURISDICTION.",
    intro:
      "Project Sable is a private development concept. Public information is deliberately limited and should not be read as a technical specification.",
    sections: [
      {
        heading: "DEVELOPMENT STATUS",
        paragraphs: [
          "No statement on this site means that a completed, tested, certified, commercially available, or allocated product currently exists.",
          "Design direction, materials, components, services, timing, and availability may change during development.",
        ],
      },
      {
        heading: "SEPARATE CONFIGURATIONS",
        paragraphs: [
          "The globally oriented shell is a non-ballistic garment concept. Any future controlled configuration would be a separate product intended only for approved markets and users.",
          "Any controlled configuration may use independently evaluated protective components and would require its own configuration-specific testing, documentation, and disclosures.",
        ],
      },
      {
        heading: "CLAIM LIMITATIONS",
        paragraphs: [
          "No text, drawing, interaction, or diagram on this site states a specific signal, protective, weather, or environmental performance value.",
          "The signal-control interaction is conceptual. Final results would depend on the exact completed assembly, closure, condition, frequency, use, and test method.",
        ],
      },
      {
        heading: "JURISDICTION",
        paragraphs: [
          "Availability varies by jurisdiction. Any future offering would be subject to applicable import, export, possession, transfer, use, and eligibility requirements.",
          "Submitting an access request creates no entitlement, allocation, approval, or commercial relationship.",
        ],
      },
      {
        heading: "NOTICE",
        paragraphs: [
          "Concept under development. Nothing on this site is an offer for sale or a protective-performance claim. Any future protective configuration will be offered only where lawful and with configuration-specific testing, documentation, and disclosures.",
        ],
      },
    ],
    backLabel: "RETURN TO SYSTEM 001",
  },
  notFound: {
    eyebrow: "CHANNEL / 404",
    heading: "NO RECORD AT THIS COORDINATE.",
    body: "The requested Project Sable channel does not exist or is no longer exposed.",
    action: "RETURN TO SYSTEM 001",
  },
} as const satisfies SiteContent;
