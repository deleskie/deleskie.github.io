const fs = require('fs');
const path = require('path');
const posts = require('../data/miami-blog-posts.json');
const {
  getPostPath,
  getCanonicalUrl,
  renderHreflangLinks,
  getLanguageSwitcherLinks,
  groupPostsByLanguage
} = require('./miami-blog-helpers');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function jsonLd(post) {
  const graph = [
    {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      inLanguage: post.language,
      author: { '@type': 'Organization', name: post.author || 'TC Audio Productions' },
      publisher: { '@type': 'Organization', name: 'TC Audio Productions' },
      datePublished: post.publishDate,
      dateModified: post.updatedDate,
      image: post.ogImage,
      mainEntityOfPage: getCanonicalUrl(post)
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: post.language === 'es-US' ? 'Blog en español' : 'Blog',
          item: post.language === 'es-US' ? 'https://deleskie.com/es/blog/' : 'https://deleskie.com/blog/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: post.title,
          item: getCanonicalUrl(post)
        }
      ]
    }
  ];

  if (post.faqItems?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function postBody(post) {
  const spanish = post.language === 'es-US';
  const sections = spanish
    ? [
        ['Borrador editorial', 'Este artículo es un borrador estructurado para la estrategia de contenido en español de TC Audio Productions Miami. TODO: completar con ejemplos reales, detalles de paquetes aprobados, fotos reales y enlaces internos finales antes de publicarlo como contenido definitivo.'],
        ['Por qué importa en Miami', 'Miami combina familias bilingües, tradiciones latinas, invitados de diferentes generaciones, hoteles, salones, espacios privados y celebraciones con mucha energía. El DJ/MC no solo pone música; ayuda a que el evento tenga claridad, ritmo, elegancia y respeto por los momentos importantes.'],
        ['Qué debe confirmar la familia', 'Antes de contratar, conviene confirmar el tipo de evento, fecha, lugar, número de invitados, necesidades de MC bilingüe, sonido para ceremonia, iluminación, momentos formales, canciones importantes y restricciones de música.'],
        ['Cómo TC Audio lo planifica', 'El flujo de planificación captura detalles clave para preparar el evento: nombres, pronunciación, línea de tiempo, géneros musicales, entradas, micrófonos, logística del venue y notas para proveedores. La ejecución sigue siendo humana, refinada y profesional.']
      ]
    : [
        ['Editorial draft', 'This article is a structured draft for the TC Audio Productions Miami content strategy. TODO: complete with approved package details, real media, internal links, and any verified proof points before treating it as final editorial content.'],
        ['Why it matters in Miami', 'Miami events often combine luxury venues, bilingual guests, outdoor constraints, tight timelines, separate ceremony and reception spaces, and high expectations for sound, lighting, and MC flow. A DJ choice is really a production and presentation choice.'],
        ['What buyers should confirm', 'Before booking, confirm the event type, date, venue, guest count, ceremony audio needs, bilingual MC requirements, lighting goals, planner or venue restrictions, load-in windows, power, and backup expectations.'],
        ['How the planning starts', 'Your inquiry should capture the details that shape the real experience: date, venue, guest count, ceremony needs, language needs, lighting goals, planner notes, and timeline priorities. From there, TC Audio can recommend the right starting package and confirm fit.']
      ];

  return sections
    .map(([heading, copy]) => `<h2>${escapeHtml(heading)}</h2>\n<p>${escapeHtml(copy)}</p>`)
    .join('\n');
}

function renderPost(post) {
  const spanish = post.language === 'es-US';
  const switcher = getLanguageSwitcherLinks(post, posts)[0];
  const switcherText = switcher.isDirectAlternate
    ? switcher.label
    : spanish
      ? '¿Prefieres contenido en inglés? Visita nuestro blog en inglés.'
      : 'Looking for Spanish resources? Visit our Spanish blog.';
  const relatedServices = (post.relatedServices || [])
    .map((href) => `<a href="${href}">${href.replaceAll('/', ' ').trim()}</a>`)
    .join('');
  const relatedPosts = (post.relatedPosts || [])
    .map((slug) => posts.find((candidate) => candidate.slug === slug))
    .filter(Boolean)
    .map((related) => `<a href="${getPostPath(related)}">${escapeHtml(related.title)}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="${spanish ? 'es-US' : 'en-US'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(post.metaTitle)}</title>
<meta name="description" content="${escapeHtml(post.metaDescription)}">
${post.draft ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="canonical" href="${getCanonicalUrl(post)}">
${renderHreflangLinks(post, posts)}
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(post.metaTitle)}">
<meta property="og:description" content="${escapeHtml(post.metaDescription)}">
<meta property="og:url" content="${getCanonicalUrl(post)}">
<meta property="og:image" content="${post.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(post.metaTitle)}">
<meta name="twitter:description" content="${escapeHtml(post.metaDescription)}">
<meta name="twitter:image" content="${post.ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/miami.css">
<script type="application/ld+json">${jsonLd(post)}</script>
</head>
<body class="miami-page">
<nav class="miami-nav">
  <div class="miami-nav__inner">
    <a class="miami-brand" href="${spanish ? '/es/blog/' : '/miami/'}"><strong>TC Audio Productions</strong><span>${spanish ? 'Miami en español' : 'Miami'}</span></a>
    <div class="miami-nav__links">
      <a href="${spanish ? '/es/blog/' : '/blog/'}">${spanish ? 'Blog' : 'Blog'}</a>
      <a href="${spanish ? '/es/dj-para-bodas-miami/' : '/miami-wedding-dj/'}">${spanish ? 'Bodas' : 'Weddings'}</a>
      <a href="${spanish ? '/es/dj-para-quinceanera-miami/' : '/miami-quinceanera-dj/'}">${spanish ? 'Quinceañeras' : 'Quinceaneras'}</a>
      <a href="${switcher.href}">${switcherText}</a>
      <a class="miami-link-button" href="/miami/#availability">${spanish ? 'Consultar disponibilidad' : 'Check Availability'}</a>
    </div>
  </div>
</nav>
<main>
  <header class="miami-service-hero">
    <div class="miami-service-hero__inner">
      <div class="reveal">
        <p class="miami-kicker">${spanish ? 'Recurso editorial Miami' : 'Miami editorial resource'} • ${escapeHtml(post.contentOrigin)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.excerpt)}</p>
        <div class="miami-hero__actions">
          <a class="miami-button miami-button--primary" href="/miami/#availability">${spanish ? 'Consultar disponibilidad' : 'Check Availability'}</a>
          <a class="miami-button miami-button--secondary" href="${spanish ? '/es/blog/' : '/blog/'}">${spanish ? 'Ver blog' : 'View Blog'}</a>
        </div>
      </div>
      <article class="miami-service-panel reveal">
        <p class="miami-card__kicker">${post.draft ? (spanish ? 'Borrador' : 'Draft') : (spanish ? 'Publicado' : 'Published')}</p>
        <h3>${spanish ? 'Contenido editorial en revisión.' : 'Editorial content under review.'}</h3>
        <p>${spanish ? 'Este contenido está marcado como borrador hasta que se complete la versión editorial final con detalles aprobados.' : 'This content is marked as a draft until the final editorial version is completed with approved details.'}</p>
      </article>
    </div>
  </header>
  <section class="miami-section miami-section--tight">
    <div class="miami-section__inner miami-split">
      <article class="miami-service-panel reveal">
        ${postBody(post)}
      </article>
      <aside class="miami-service-panel reveal">
        <p class="miami-card__kicker">${spanish ? 'Contexto' : 'Context'}</p>
        <h3>${spanish ? 'Audiencias' : 'Audiences'}</h3>
        <ul class="miami-service-list">${post.audience.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        <h3>${spanish ? 'Servicios relacionados' : 'Related services'}</h3>
        <div class="miami-related">${relatedServices}</div>
        <h3>${spanish ? 'Lecturas relacionadas' : 'Related posts'}</h3>
        <div class="miami-related">${relatedPosts}</div>
      </aside>
    </div>
  </section>
  ${post.faqItems?.length ? `<section class="miami-section miami-section--tight"><div class="miami-section__inner"><div class="miami-faq reveal">${post.faqItems.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</div></div></section>` : ''}
  <section class="miami-section miami-section--tight">
    <div class="miami-section__inner">
      <div class="miami-final-cta reveal">
        <h2>${spanish ? 'Empecemos con la experiencia que quieres crear.' : 'Start with the experience you want to create.'}</h2>
        <p>${spanish ? 'Comparte fecha, lugar, invitados, idioma, sonido, iluminación y presupuesto estimado para recibir una recomendación inicial.' : 'Share the date, venue, guest count, language needs, sound, lighting, and budget range so TC Audio can recommend the right starting direction.'}</p>
        <a class="miami-button miami-button--primary" href="/miami/#availability">${spanish ? 'Consultar disponibilidad' : 'Check Availability'}</a>
      </div>
    </div>
  </section>
</main>
<script src="/assets/miami.js" defer></script>
</body>
</html>
`;
}

function renderIndex(language) {
  const spanish = language === 'es-US';
  const languagePosts = groupPostsByLanguage(posts, language);
  const sections = spanish
    ? [
        ['Bodas Latinas', 'latin-wedding'],
        ['Bodas Bilingües', 'bilingual-wedding'],
        ['Quinceañeras', 'quinceanera'],
        ['Música y Tradiciones', 'private-event'],
        ['Iluminación', 'lighting'],
        ['Consejos para Familias', 'quinceanera'],
        ['Guías por zona de Miami', 'venue']
      ]
    : [
        ['Weddings', 'wedding'],
        ['Corporate Events', 'corporate'],
        ['Ceremony Audio', 'ceremony-audio'],
        ['Event Lighting', 'lighting'],
        ['Planning Guides', 'planner'],
        ['Miami Venues & Neighborhoods', 'venue']
      ];

  const cards = languagePosts.map((post) => `<article class="miami-card reveal">
    <p class="miami-card__kicker">${escapeHtml(post.contentOrigin)}${post.draft ? ` • ${spanish ? 'Borrador' : 'Draft'}` : ''}</p>
    <h3>${escapeHtml(post.title)}</h3>
    <p>${escapeHtml(post.excerpt)}</p>
    <a class="miami-link-button" href="${getPostPath(post)}">${spanish ? 'Leer borrador' : 'Read draft'}</a>
  </article>`).join('\n');

  const sectionLinks = sections.map(([label, audience]) => `<a class="miami-link-button" href="#${audience}">${label}</a>`).join('');
  const indexUrl = `https://deleskie.com/${spanish ? 'es/blog/' : 'blog/'}`;
  const indexSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: spanish ? 'Blog en español para eventos en Miami' : 'Miami Event Planning Blog',
        url: indexUrl,
        inLanguage: language,
        description: spanish
          ? 'Recursos en español para bodas latinas, bodas bilingües, quinceañeras, música, iluminación y eventos familiares en Miami.'
          : 'Miami event planning resources for weddings, corporate events, ceremony audio, lighting, planners, and premium private celebrations.'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: spanish ? 'Blog en español' : 'Blog',
            item: indexUrl
          }
        ]
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="${spanish ? 'es-US' : 'en-US'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${spanish ? 'Blog en español para eventos en Miami | TC Audio Productions' : 'Miami Event Planning Blog | TC Audio Productions'}</title>
<meta name="description" content="${spanish ? 'Recursos en español para bodas latinas, bodas bilingües, quinceañeras, música, iluminación y eventos familiares en Miami.' : 'Miami event planning resources for weddings, corporate events, ceremony audio, lighting, planners, and premium private celebrations.'}">
<link rel="canonical" href="https://deleskie.com/${spanish ? 'es/blog/' : 'blog/'}">
<meta property="og:type" content="website">
<meta property="og:title" content="${spanish ? 'Blog en español para eventos en Miami' : 'Miami Event Planning Blog'}">
<meta property="og:description" content="${spanish ? 'Contenido en español, latino y familiar para eventos en Miami.' : 'Premium Miami event planning resources from TC Audio Productions.'}">
<meta property="og:image" content="https://deleskie.com/TommyC/assets/tommy-hero-bg.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" hreflang="${spanish ? 'en-US' : 'es-US'}" href="https://deleskie.com/${spanish ? 'blog/' : 'es/blog/'}">
<link rel="alternate" hreflang="${spanish ? 'es-US' : 'en-US'}" href="https://deleskie.com/${spanish ? 'es/blog/' : 'blog/'}">
<link rel="alternate" hreflang="x-default" href="https://deleskie.com/blog/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/miami.css">
<script type="application/ld+json">${JSON.stringify(indexSchema)}</script>
</head>
<body class="miami-page">
<nav class="miami-nav">
  <div class="miami-nav__inner">
    <a class="miami-brand" href="${spanish ? '/es/blog/' : '/miami/'}"><strong>TC Audio Productions</strong><span>${spanish ? 'Miami en español' : 'Miami'}</span></a>
    <div class="miami-nav__links">
      <a href="${spanish ? '/es/dj-para-bodas-miami/' : '/miami-wedding-dj/'}">${spanish ? 'Bodas' : 'Weddings'}</a>
      <a href="${spanish ? '/es/dj-para-quinceanera-miami/' : '/miami-quinceanera-dj/'}">${spanish ? 'Quinceañeras' : 'Quinceaneras'}</a>
      <a href="${spanish ? '/blog/' : '/es/blog/'}">${spanish ? 'English' : 'Español'}</a>
      <a class="miami-link-button" href="/miami/#availability">${spanish ? 'Consultar disponibilidad' : 'Check Availability'}</a>
    </div>
  </div>
</nav>
<main>
  <header class="miami-service-hero">
    <div class="miami-service-hero__inner">
      <div class="reveal">
        <p class="miami-kicker">${spanish ? 'Contenido Miami en español' : 'Miami editorial strategy'}</p>
        <h1>${spanish ? 'Bodas latinas, quinceañeras y eventos familiares merecen contenido propio.' : 'Planning guides for Miami events that need more than a playlist.'}</h1>
        <p>${spanish ? 'Este blog está escrito como una línea editorial en español para Miami: cálida, profesional, familiar y culturalmente consciente. No es una carpeta de traducciones automáticas.' : 'This English lane speaks to couples, planners, corporate buyers, hotels, and private-event clients who need production-minded guidance.'}</p>
        <div class="miami-hero__actions">${sectionLinks}</div>
      </div>
      <article class="miami-service-panel reveal"><p class="miami-card__kicker">${spanish ? 'Estrategia' : 'Strategy'}</p><h3>${spanish ? 'Algunos artículos se traducen. Otros nacen en español.' : 'Some posts translate. Others are language-first originals.'}</h3><p>${spanish ? 'La prioridad es intención editorial, no espejo palabra por palabra.' : 'The priority is editorial fit, not one-to-one mirroring.'}</p></article>
    </div>
  </header>
  <section class="miami-section miami-section--tight">
    <div class="miami-section__inner">
      <div class="miami-grid miami-grid--three">${cards}</div>
    </div>
  </section>
</main>
<script src="/assets/miami.js" defer></script>
</body>
</html>`;
}

for (const post of posts) {
  const outputPath = path.join(process.cwd(), getPostPath(post).slice(1), 'index.html');
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, renderPost(post));
}

ensureDir(path.join(process.cwd(), 'es/blog'));
fs.writeFileSync(path.join(process.cwd(), 'es/blog/index.html'), renderIndex('es-US'));

console.log(`Generated ${posts.length} Miami blog draft posts and the Spanish blog index.`);
