const fs = require('fs');
const path = require('path');
const posts = require('../data/miami-blog-posts.json');
const {
  getPostPath,
  getAlternateLanguageUrls
} = require('./miami-blog-helpers');

const pages = [
  'miami/index.html',
  'miami-wedding-dj/index.html',
  'miami-bilingual-wedding-dj/index.html',
  'miami-quinceanera-dj/index.html',
  'miami-corporate-event-dj/index.html',
  'miami-event-lighting/index.html',
  'miami-ceremony-audio/index.html',
  'es/blog/index.html',
  'es/dj-para-bodas-miami/index.html',
  'es/dj-bilingue-para-bodas-miami/index.html',
  'es/dj-para-quinceanera-miami/index.html',
  'es/dj-para-eventos-corporativos-miami/index.html',
  'es/iluminacion-para-eventos-miami/index.html',
  ...posts.map((post) => path.join(getPostPath(post).slice(1), 'index.html'))
];

const requiredMeta = [
  '<title>',
  'name="description"',
  'rel="canonical"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"',
  'application/ld+json'
];

const requiredLeadFields = [
  'name',
  'email',
  'phone',
  'eventType',
  'eventDate',
  'venue',
  'guestCount',
  'servicesNeeded',
  'bilingualMc',
  'ceremonyAudio',
  'lighting',
  'budgetRange',
  'message'
];

const errors = [];

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');

  for (const token of requiredMeta) {
    if (!html.includes(token)) {
      errors.push(`${file}: missing ${token}`);
    }
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD: ${error.message}`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(match[0])) {
      errors.push(`${file}: image missing alt text`);
    }
  }

  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
    const target = match[1];
    if (target.startsWith('//')) {
      continue;
    }
    const localPath = target.endsWith('/') ? path.join(target.slice(1), 'index.html') : target.slice(1);
    if (!fs.existsSync(localPath)) {
      errors.push(`${file}: missing linked target ${target}`);
    }
  }
}

const leadFormHtml = fs.readFileSync('miami/index.html', 'utf8');
for (const field of requiredLeadFields) {
  if (!leadFormHtml.includes(`name="${field}"`)) {
    errors.push(`miami/index.html: missing lead field ${field}`);
  }
}

const css = fs.readFileSync('assets/miami.css', 'utf8');
const js = fs.readFileSync('assets/miami.js', 'utf8');
if (!css.includes('prefers-reduced-motion')) {
  errors.push('assets/miami.css: missing prefers-reduced-motion handling');
}
if (!js.includes('leadScore') || !js.includes('recommendedPackage')) {
  errors.push('assets/miami.js: missing lead scoring or package recommendation payload');
}

for (const post of posts) {
  if (post.language === 'es-US' && !getPostPath(post).startsWith('/es/blog/')) {
    errors.push(`${post.slug}: Spanish posts must live under /es/blog/`);
  }
  if (post.language === 'en-US' && !getPostPath(post).startsWith('/blog/')) {
    errors.push(`${post.slug}: English posts must live under /blog/`);
  }
  if (post.language === 'es-US' && /How to|Wedding|Corporate|Lighting|Planner-Friendly/.test(post.metaTitle)) {
    errors.push(`${post.slug}: Spanish post appears to have English metadata`);
  }
  if (post.language === 'en-US' && /Cómo|boda|quinceañera|iluminación|familia/i.test(post.metaTitle)) {
    errors.push(`${post.slug}: English post appears to have Spanish metadata`);
  }
  const alternates = getAlternateLanguageUrls(post, posts);
  const html = fs.readFileSync(path.join(getPostPath(post).slice(1), 'index.html'), 'utf8');
  if (alternates.length === 0 && html.includes('rel="alternate" hreflang=')) {
    errors.push(`${post.slug}: hreflang should not appear without a true alternate`);
  }
  if (post.draft && html.includes('<meta name="robots" content="noindex, nofollow">') === false) {
    errors.push(`${post.slug}: draft post should be noindex`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${pages.length} Miami routes, metadata, structured data, links, media alt text, and lead-form fields.`);
