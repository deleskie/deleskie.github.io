const SITE_URL = 'https://deleskie.com';

function getPostPath(post) {
  return post.language === 'es-US'
    ? `/es/blog/${post.slug}/`
    : `/blog/${post.slug}/`;
}

function getCanonicalUrl(page) {
  return page.canonicalUrl || `${SITE_URL}${getPostPath(page)}`;
}

function getAlternateLanguageUrls(page, allPosts) {
  if (!page.alternateLanguageSlug && !page.translationGroupId) {
    return [];
  }

  return allPosts
    .filter((candidate) => {
      if (candidate.slug === page.slug && candidate.language === page.language) {
        return true;
      }
      if (page.alternateLanguageSlug && candidate.slug === page.alternateLanguageSlug) {
        return true;
      }
      return Boolean(page.translationGroupId && candidate.translationGroupId === page.translationGroupId);
    })
    .filter((candidate) => candidate.language === 'en-US' || candidate.language === 'es-US')
    .map((candidate) => ({
      language: candidate.language,
      href: getCanonicalUrl(candidate),
      slug: candidate.slug
    }));
}

function renderHreflangLinks(page, allPosts) {
  const alternates = getAlternateLanguageUrls(page, allPosts);
  const hasEnglish = alternates.some((alternate) => alternate.language === 'en-US');
  const hasSpanish = alternates.some((alternate) => alternate.language === 'es-US');

  if (!hasEnglish || !hasSpanish) {
    return '';
  }

  const defaultHref = alternates.find((alternate) => alternate.language === 'en-US')?.href || getCanonicalUrl(page);
  return alternates
    .map((alternate) => `<link rel="alternate" hreflang="${alternate.language}" href="${alternate.href}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${defaultHref}">`)
    .join('\n');
}

function getLanguageSwitcherLinks(page, allPosts) {
  const alternates = getAlternateLanguageUrls(page, allPosts).filter((alternate) => alternate.slug !== page.slug);
  if (alternates.length > 0) {
    return alternates.map((alternate) => ({
      label: alternate.language === 'es-US' ? 'Español' : 'English',
      href: alternate.href.replace(SITE_URL, ''),
      isDirectAlternate: true
    }));
  }

  return [
    page.language === 'es-US'
      ? { label: 'English blog', href: '/blog/', isDirectAlternate: false }
      : { label: 'Español', href: '/es/blog/', isDirectAlternate: false }
  ];
}

function groupPostsByLanguage(posts, language) {
  return posts.filter((post) => post.language === language);
}

module.exports = {
  SITE_URL,
  getPostPath,
  getCanonicalUrl,
  getAlternateLanguageUrls,
  renderHreflangLinks,
  getLanguageSwitcherLinks,
  groupPostsByLanguage
};
