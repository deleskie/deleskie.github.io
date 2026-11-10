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
    context: string[];
    brandStatement: string;
    supporting: string;
    development: string;
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
    body: string[];
    closing: string[];
  };
  provenance: {
    label: string;
    heading: string[];
    body: string[];
    founders: {
      name: string;
      discipline: string;
      description: string;
    }[];
    methodLabel: string;
    method: string[];
    closing: string[];
  };
  founderNote: {
    enabled: boolean;
    label: string;
    railCode: string;
    heading: string;
    body: string[];
    signature: string[];
  };
  principles: {
    label: string;
    heading: string;
    items: {
      index: string;
      title: string;
      body: string;
      detail: string[];
    }[];
  };
  architecture: {
    label: string;
    heading: string[];
    intro: string[];
    diagramLabel: string;
    modules: {
      index: string;
      title: string;
      scope: string;
      status: string;
      heading: string[];
      description: string[];
      diagram: string;
    }[];
  };
  signal: {
    label: string;
    heading: string[];
    body: string[];
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
    closing: string[];
  };
  development: {
    label: string;
    heading: string[];
    failures: string[];
    body: string[];
    closing: string[];
  };
  edition: {
    label: string;
    heading: string[];
    body: string;
    statements: string[];
    cta: string;
    supporting: string;
    registerLabel: string;
  };
  access: {
    label: string;
    heading: string[];
    body: string[];
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
    line: string[];
    microcopy: string;
    links: { label: string; href: string }[];
    legal: string;
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
  "https://www.deleskie.com/cyberpunk";

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
      "A private technical garment system built around discretion, intentional isolation, modular architecture, and claims that have to survive contact with evidence.",
    keywords: [
      "technical garment system",
      "private client",
      "modular design",
      "intentional isolation",
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
      { label: "PROVENANCE", href: "#provenance" },
      { label: "ACCESS", href: "#access" },
    ],
    accessLabel: "ENTER PRIVATE CHANNEL",
  },
  hero: {
    eyebrow: "PRIVATE DEVELOPMENT / SYSTEM 001",
    headline: ["THE FUTURE DIDN’T", "ARRIVE IN NEON."],
    lead: "It arrived as infrastructure.",
    context: [
      "Dark fiber. Machine rooms. Border controls. Dead zones. Systems that fail at 03:17 and still have to be standing at sunrise.",
      "We are building clothing for that world.",
    ],
    brandStatement: "WEAR THE PERIMETER.",
    supporting:
      "A private technical garment system built around discretion, intentional isolation, modular architecture, and claims that have to survive contact with evidence.",
    development:
      "A global non-ballistic shell and separate controlled configurations are under development. Availability will vary by jurisdiction.",
    primaryCta: "ENTER THE PRIVATE CHANNEL",
    secondaryCta: "SEE THE SYSTEM",
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
    heading: [
      "NOT A HOODIE",
      "WITH FEATURES.",
      "",
      "A SYSTEM",
      "YOU CAN WEAR.",
    ],
    body: [
      "We have spent our careers around systems that do not care about intention.",
      "They care about load. Latency. Congestion. Isolation. Failure. What gets through, what stays out, and what happens next.",
      "We are not decorating clothing with technology.",
      "We are treating the garment as a system: separate functions, controlled interfaces, replaceable modules, documented boundaries, and a shell worth wearing even if every technical component is removed.",
      "No tactical cosplay.",
      "No miracle language.",
      "No neon future.",
      "Just clothing, architecture, and evidence brought closer to the body.",
    ],
    closing: ["THE OUTSIDE STAYS QUIET.", "THE INSIDE DOES THE WORK."],
  },
  provenance: {
    label: "PROVENANCE / 001",
    heading: ["BUILT BELOW", "THE APPLICATION LAYER."],
    body: [
      "The founders have spent decades working where isolation, latency, adversarial traffic, and failure are measurable rather than theoretical.",
      "James and Steve have worked together at the packet level. Their shared history crosses global routing, DDoS resilience, RDMA behavior, network fabrics, and the infrastructure beneath large-scale AI systems.",
      "Ági approaches the system from the human side.",
      "She brings a Hungarian and Central European eye to the project: severe, precise, unsentimental, and deeply aware that the future does not need neon to feel dangerous—or beautiful.",
      "Three disciplines.",
      "One system.",
    ],
    founders: [
      {
        name: "ÁGI [SURNAME]",
        discipline: "CULTURE & FORM",
        description:
          "Ági leads the project’s cultural direction, public voice, and private-client experience. She keeps capability subordinate to fit, discretion, and human use.",
      },
      {
        name: "JAMES DELESKIE",
        discipline: "RESILIENCE & TRUST",
        description:
          "Network and security architect with decades of experience designing and defending carrier-scale and hyperscale infrastructure, with deep work in global routing, BGP, DDoS, and operational resilience.",
      },
      {
        name: "STEVE MANLEY",
        discipline: "COMPUTE & NETWORK FABRICS",
        description:
          "Network architect focused on the high-performance infrastructure beneath accelerated computing and large-scale AI systems. His work spans RDMA, packet-level engineering, network fabrics, and resilient systems operating under extreme load.",
      },
    ],
    methodLabel: "METHOD / CLAIM PATH",
    method: [
      "THREAT MODEL",
      "ARCHITECTURE",
      "SPECIALIST ENGINEERING",
      "INDEPENDENT EVALUATION",
      "SUPPORTED CLAIM",
    ],
    closing: ["CLAIMS FOLLOW EVIDENCE.", "NEVER THE REVERSE."],
  },
  founderNote: {
    enabled: true,
    label: "ORIGIN / 001",
    railCode: "J / 001",
    heading: "A NOTE FROM JIM",
    body: [
      "I have spent most of my life in the part of the world nobody sees.",
      "Routes. Packets. Failure domains. Attacks. The machinery underneath the machinery.",
      "Steve and I have worked together where packets stop being diagrams and start becoming consequences. He builds network fabrics beneath large-scale AI. I build and defend networks that cannot simply go dark.",
      "Ági came at the question from the human side.",
      "A Hungarian eye. Central European restraint. Steel, stone, memory, beauty, and consequence.",
      "She understood something immediately: cyberpunk had been ruined by its own costume department.",
      "So we stripped it back.",
      "No neon.",
      "No fake terminals.",
      "No tactical theater.",
      "No miracle materials.",
      "Just a hard question:",
      "What happens when clothing is designed with the same discipline we use for critical infrastructure?",
      "You define the threat model.",
      "You separate the functions.",
      "You plan for failure.",
      "You make the important parts replaceable.",
      "Then you test the thing you actually built.",
      "That is PROJECT SABLE.",
      "The outside stays quiet.",
      "The inside does the work.",
    ],
    signature: ["JIM", "SYSTEMS & RESILIENCE"],
  },
  principles: {
    label: "OPERATING PRINCIPLES",
    heading: "OPERATING PRINCIPLES",
    items: [
      {
        index: "01",
        title: "DISCRETION",
        body: "If the garment announces its capability, the design has already failed.",
        detail: [
          "The exterior remains quiet. No visible tactical language. No unnecessary signaling. No costume.",
        ],
      },
      {
        index: "02",
        title: "INTENTIONAL ISOLATION",
        body: "Connected when required. Isolated when intended.",
        detail: [
          "Device state should be a deliberate choice, not an accident hidden inside marketing language.",
        ],
      },
      {
        index: "03",
        title: "SEPARATION",
        body: "Different functions belong in separate systems.",
        detail: [
          "The global shell and any future controlled configuration are technically, legally, and commercially distinct products.",
        ],
      },
      {
        index: "04",
        title: "SERVICEABILITY",
        body: "Everything serious has a lifecycle.",
        detail: [
          "Inspect it. Maintain it. Replace what wears. Preserve what remains useful. Do not turn the entire garment into waste because one module has reached the end of its life.",
        ],
      },
    ],
  },
  architecture: {
    label: "CONFIGURATION ARCHITECTURE",
    heading: ["ONE DESIGN LANGUAGE.", "SEPARATE SYSTEMS."],
    intro: [
      "The platform is being developed as several distinct configurations.",
      "Not one vague garment with a list of impossible promises.",
      "Clear boundaries. Clear documentation. Clear responsibilities.",
    ],
    diagramLabel: "Conceptual sectional study",
    modules: [
      {
        index: "01",
        title: "SHELL",
        scope: "GLOBAL",
        status: "GLOBAL CONCEPT",
        heading: ["THE GARMENT BEFORE", "THE MACHINERY."],
        description: [
          "A non-ballistic technical shell built around fit, movement, secure storage, weather-conscious construction, understated hardware, and serialized provenance.",
          "It must be desirable with every optional module removed.",
          "Otherwise, it is not clothing. It is a demonstration.",
        ],
        diagram: "EXTERIOR / UTILITY / PROVENANCE",
      },
      {
        index: "02",
        title: "CONTROLLED",
        scope: "PRIVATE",
        status: "JURISDICTION DEPENDENT",
        heading: ["CAPABILITY WITH", "A PAPER TRAIL."],
        description: [
          "A separate architecture intended for approved markets, approved users, and independently evaluated protective components.",
          "Any future claim will belong to an exact configuration.",
          "Not the mood.",
          "Not the fabric alone.",
          "Not the marketing department.",
          "The complete system.",
        ],
        diagram: "SEPARATE / CONTROLLED / DOCUMENTED",
      },
      {
        index: "03",
        title: "ATELIER",
        scope: "001",
        status: "BY APPOINTMENT",
        heading: ["FITTED.", "NUMBERED.", "MAINTAINED."],
        description: [
          "Private fitting, controlled materials, individual configuration records, custom finish, alterations, and long-term service.",
          "Less product drop.",
          "More private system.",
        ],
        diagram: "FIT / FINISH / SERVICE",
      },
    ],
  },
  signal: {
    label: "DEVICE STATE",
    heading: ["CONNECTED BY CHOICE.", "ISOLATED ON PURPOSE."],
    body: [
      "A device compartment should not make promises it cannot keep.",
      "The signal-isolation module is being developed as a removable and replaceable component intended for completed-assembly testing.",
      "Closure matters.",
      "Condition matters.",
      "Orientation matters.",
      "Frequency matters.",
      "Evidence matters.",
    ],
    interactionLabel: "Select conceptual device state",
    connected: {
      label: "CONNECTED",
      title: "CONNECTED",
      description: "Ordinary access. Ordinary radio behavior.",
    },
    isolated: {
      label: "ISOLATED",
      title: "ISOLATED",
      description:
        "The module is fully closed and the device is intentionally separated from ordinary radio access.",
    },
    conceptual: "CONCEPTUAL INTERFACE / NO PERFORMANCE VALUE",
    visualTitle: "Conceptual signal-isolation state",
    datumLabel: "D / 001",
    note: "Final performance will depend on configuration, closure, condition, frequency, device orientation, and completed-product test results.",
    closing: ["WE DO NOT USE MAGIC WORDS", "FOR MEASURABLE PHYSICS."],
  },
  development: {
    label: "DEVELOPMENT STATUS",
    heading: ["REAL DEVELOPMENT", "HAS SCARS."],
    failures: [
      "Development means prototypes that fail.",
      "Closures that leak.",
      "Patterns that move badly.",
      "Materials that look perfect until they are worn.",
      "Claims that get smaller when the measurements arrive.",
    ],
    body: [
      "That is not a problem.",
      "That is the work.",
      "We would rather say “not yet” than build a company around a sentence the product cannot defend.",
    ],
    closing: ["TEST THE THING", "YOU ACTUALLY BUILT."],
  },
  edition: {
    label: "INITIAL ALLOCATION",
    heading: ["NOT A DROP.", "NOT A PREORDER."],
    body: "The first release is planned as a small serialized edition, placed through private allocation rather than open retail distribution.",
    statements: [
      "No countdown clock.",
      "No artificial sellout.",
      "No open protective-product checkout.",
      "No attempt to manufacture urgency before the product has earned trust.",
      "Access requests are reviewed individually.",
    ],
    cta: "REQUEST CONSIDERATION",
    supporting: "WE ARE NOT BUILDING A QUEUE FOR HYPE.",
    registerLabel: "ALLOCATION REGISTER / STATUS PRIVATE",
  },
  access: {
    label: "PRIVATE ACCESS",
    heading: ["ENTER THE", "PRIVATE CHANNEL."],
    body: [
      "Tell us who you are and why this matters to you.",
      "We are not collecting an audience.",
      "We are looking for serious early clients, engineers, makers, private-client advisers, and collaborators who understand the difference between a feature and a system.",
    ],
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
      { value: "global-shell", label: "GLOBAL SHELL" },
      { value: "private-configuration", label: "PRIVATE CONFIGURATION" },
      { value: "atelier-client", label: "ATELIER CLIENT" },
      { value: "strategic-partner", label: "STRATEGIC PARTNER" },
      {
        value: "design-creative-collaboration",
        label: "DESIGN OR CREATIVE COLLABORATION",
      },
      { value: "press", label: "PRESS" },
      { value: "other", label: "OTHER" },
    ],
    consent:
      "By requesting access, you agree to receive limited project and allocation updates. We do not sell access-request data.",
    submit: "TRANSMIT REQUEST",
    loading: "TRANSMITTING",
    success: "SIGNAL RECEIVED",
    successMessage:
      "Your request has been recorded. If there is a reason to continue the conversation, we will make contact.",
    unavailable:
      "PRIVATE CHANNEL TEMPORARILY UNAVAILABLE — The request was not recorded. Try again later.",
    error:
      "PRIVATE CHANNEL TEMPORARILY UNAVAILABLE — The request was not recorded. Try again later.",
    validation: {
      emailRequired: "Enter an email address.",
      emailInvalid: "Enter a valid email address.",
      formInvalid: "Review the highlighted field and try again.",
    },
  },
  footer: {
    descriptor: "PRIVATE DEVELOPMENT / SYSTEM 001",
    line: ["BUILT FOR THE WORLD", "AS IT IS BECOMING."],
    microcopy: "NO NEON REQUIRED.",
    links: [
      { label: "Privacy", href: "/cyberpunk/privacy/" },
      { label: "Legal", href: "/cyberpunk/legal/" },
      { label: "Contact", href: `mailto:${configuredContact}` },
    ],
    legal:
      "Concept under development. Nothing on this site is an offer for sale or a protective-performance claim. Any future protective configuration will be offered only where lawful and with configuration-specific testing, documentation, and disclosures.",
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
    eyebrow: "ROUTE / 404",
    heading: "THIS ROUTE DOES NOT EXIST.",
    body: "Return to System 001.",
    action: "RETURN TO SYSTEM 001",
  },
} as const satisfies SiteContent;
