const fs = require('fs');
const path = require('path');

const services = [
  {
    slug: 'dj-para-bodas-miami',
    englishPath: '/miami-wedding-dj/',
    title: 'DJ para bodas en Miami',
    metaTitle: 'DJ para bodas en Miami | TC Audio Productions',
    description: 'DJ/MC, sonido para ceremonia, recepción, música, iluminación y planificación para bodas latinas, bilingües y multiculturales en Miami.',
    h1: 'DJ para bodas en Miami con sonido, flujo y energía a la altura del momento.',
    intro: 'Tu boda en Miami puede combinar ceremonia, recepción, familia bilingüe, invitados de varias generaciones, música latina, clásicos y momentos formales. El sonido, los anuncios y la música deben sentirse elegantes, preparados y naturales desde el principio.',
    related: ['/es/dj-bilingue-para-bodas-miami/', '/es/iluminacion-para-eventos-miami/', '/miami/#availability']
  },
  {
    slug: 'dj-bilingue-para-bodas-miami',
    englishPath: '/miami-bilingual-wedding-dj/',
    title: 'DJ bilingüe para bodas en Miami',
    metaTitle: 'DJ bilingüe para bodas en Miami | TC Audio Productions',
    description: 'DJ y MC bilingüe para bodas latinas y multiculturales en Miami, con planificación de pronunciación, música, ceremonia y recepción.',
    h1: 'Un DJ bilingüe para bodas latinas, multiculturales y familiares.',
    intro: 'Cuando tu boda combina inglés, español, familia latina, invitados americanos y tradiciones importantes, el MC necesita preparación y buen criterio. Los nombres, entradas, anuncios, música y momentos familiares deben sentirse naturales y respetados.',
    related: ['/es/dj-para-bodas-miami/', '/es/blog/como-elegir-dj-bilingue-boda-latina-miami/', '/miami/#availability']
  },
  {
    slug: 'dj-para-quinceanera-miami',
    englishPath: '/miami-quinceanera-dj/',
    title: 'DJ para quinceañera en Miami',
    metaTitle: 'DJ para quinceañera en Miami | TC Audio Productions',
    description: 'DJ/MC, música, entradas, vals, iluminación y planificación para quinceañeras y celebraciones familiares en Miami.',
    h1: 'Una quinceañera merece tradición, energía y dominio del momento.',
    intro: 'Tus entradas, vals, familia, amigos, música para jóvenes y adultos, iluminación y momentos especiales necesitan dirección. La celebración debe sentirse elegante, organizada y emocionante.',
    related: ['/es/iluminacion-para-eventos-miami/', '/es/blog/dj-para-quinceanera-miami-musica-entradas-vals-energia/', '/miami/#availability']
  },
  {
    slug: 'dj-para-eventos-corporativos-miami',
    englishPath: '/miami-corporate-event-dj/',
    title: 'DJ para eventos corporativos en Miami',
    metaTitle: 'DJ para eventos corporativos en Miami | TC Audio Productions',
    description: 'DJ/MC, sonido, micrófonos, música e iluminación para eventos corporativos, hoteles, marcas y celebraciones privadas en Miami.',
    h1: 'Sonido y música para eventos corporativos donde la presentación importa.',
    intro: 'Tu evento en hotel, reunión de marca, cena privada o celebración corporativa necesita comunicación clara, audio controlado, música adecuada y una presentación que respete la agenda.',
    related: ['/miami-corporate-event-dj/', '/es/iluminacion-para-eventos-miami/', '/miami/#availability']
  },
  {
    slug: 'iluminacion-para-eventos-miami',
    englishPath: '/miami-event-lighting/',
    title: 'Iluminación para eventos en Miami',
    metaTitle: 'Iluminación para eventos en Miami | TC Audio Productions',
    description: 'Iluminación, ambiente, efectos de pista y apoyo visual para bodas, quinceañeras, eventos corporativos y celebraciones privadas en Miami.',
    h1: 'Iluminación para eventos en Miami con presencia, no caos.',
    intro: 'Tu salón debe sentirse diseñado cuando entran los invitados. La iluminación correcta eleva las fotos, marca momentos importantes y transforma la pista cuando llega el momento de bailar.',
    related: ['/miami-event-lighting/', '/es/dj-para-bodas-miami/', '/es/dj-para-quinceanera-miami/']
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function page(service) {
  const url = `https://deleskie.com/es/${service.slug}/`;
  const relatedLinks = service.related.map((href) => `<a class="miami-link-button" href="${href}">${href.replaceAll('/', ' ').trim()}</a>`).join('');
  const pageClass = {
    'dj-para-bodas-miami': 'miami-page--wedding',
    'dj-bilingue-para-bodas-miami': 'miami-page--bilingual',
    'dj-para-quinceanera-miami': 'miami-page--quince',
    'dj-para-eventos-corporativos-miami': 'miami-page--corporate',
    'iluminacion-para-eventos-miami': 'miami-page--lighting'
  }[service.slug] || '';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        provider: { '@type': 'ProfessionalService', name: 'TC Audio Productions Miami' },
        areaServed: ['Miami', 'Miami Beach', 'Coral Gables', 'Coconut Grove', 'Brickell', 'Doral', 'Kendall', 'Homestead'],
        serviceType: service.title,
        url
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Miami en español', item: 'https://deleskie.com/es/blog/' },
          { '@type': 'ListItem', position: 2, name: service.title, item: url }
        ]
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${service.metaTitle}</title>
<meta name="description" content="${service.description}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="es-US" href="${url}">
<link rel="alternate" hreflang="en-US" href="https://deleskie.com${service.englishPath}">
<link rel="alternate" hreflang="x-default" href="https://deleskie.com${service.englishPath}">
<meta property="og:type" content="website">
<meta property="og:title" content="${service.metaTitle}">
<meta property="og:description" content="${service.description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://deleskie.com/TommyC/assets/tommy-hero-bg.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${service.metaTitle}">
<meta name="twitter:description" content="${service.description}">
<meta name="twitter:image" content="https://deleskie.com/TommyC/assets/tommy-hero-bg.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/miami.css">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="miami-page ${pageClass}">
<nav class="miami-nav"><div class="miami-nav__inner"><a class="miami-brand" href="/es/blog/"><strong>TC Audio Productions</strong><span>Miami en español</span></a><div class="miami-nav__links"><a href="/es/blog/">Blog</a><a href="/es/dj-para-bodas-miami/">Bodas</a><a href="/es/dj-para-quinceanera-miami/">Quinceañeras</a><a href="/miami/">English</a><a class="miami-link-button" href="/miami/#availability">Consultar disponibilidad</a></div></div></nav>
<main>
  <header class="miami-service-hero">
    <div class="miami-service-hero__inner">
      <div class="reveal"><p class="miami-kicker">Servicios en Miami</p><h1>${service.h1}</h1><p>${service.intro}</p><div class="miami-hero__actions"><a class="miami-button miami-button--primary" href="/miami/#availability">Consultar disponibilidad</a><a class="miami-button miami-button--secondary" href="/es/blog/">Ver blog en español</a></div></div>
      <article class="miami-service-panel reveal"><p class="miami-card__kicker">Detalles del evento</p><h3>Empecemos por la experiencia que quieres crear.</h3><p>Fecha, lugar, invitados, idioma, sonido, iluminación, momentos formales y presupuesto estimado ayudan a recomendar la configuración correcta.</p></article>
    </div>
  </header>
  <section class="miami-section miami-section--tight"><div class="miami-section__inner miami-grid miami-grid--three"><article class="miami-card reveal"><h3>MC y flujo</h3><p>Anuncios claros, nombres preparados y un ritmo profesional para que la familia y los invitados sepan qué viene después.</p></article><article class="miami-card reveal"><h3>Sonido refinado</h3><p>Micrófonos, música y cobertura pensados para ceremonia, recepción, discursos o momentos especiales.</p></article><article class="miami-card reveal"><h3>Iluminación y energía</h3><p>Ambiente visual que eleva el evento sin sentirse exagerado ni recargado.</p></article></div></section>
  <section class="miami-section miami-section--tight"><div class="miami-section__inner"><div class="miami-final-cta reveal"><h2>Empecemos con lo que tu evento debe sentir.</h2><p>Comparte fecha, lugar, invitados y servicios necesarios para revisar disponibilidad y recomendar una configuración inicial.</p><div class="miami-hero__actions">${relatedLinks}</div></div></div></section>
</main>
<script src="/assets/miami.js" defer></script>
</body>
</html>`;
}

for (const service of services) {
  const outputDir = path.join(process.cwd(), 'es', service.slug);
  ensureDir(outputDir);
  fs.writeFileSync(path.join(outputDir, 'index.html'), page(service));
}

console.log(`Generated ${services.length} Spanish Miami service pages.`);
