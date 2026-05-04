(function () {
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(eventName, detail) {
    const payload = Object.assign({ market: 'Miami' }, detail || {});
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, payload));
    }
    window.dispatchEvent(new CustomEvent('tcMiamiAnalytics', { detail: { eventName, payload } }));
  }

  if (motionAllowed && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
  } else {
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-track]').forEach((node) => {
    node.addEventListener('click', () => {
      track(node.getAttribute('data-track'), {
        label: node.textContent.trim(),
        href: node.getAttribute('href') || ''
      });
    });
  });

  document.querySelectorAll('.miami-faq details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        track('faq_expand', { question: detail.querySelector('summary')?.textContent.trim() || '' });
      }
    });
  });

  const form = document.querySelector('[data-miami-lead-form]');
  if (!form) {
    return;
  }

  const recommendationBox = form.querySelector('[data-recommendation]');
  const recommendationTitle = form.querySelector('[data-recommendation-title]');
  const recommendationCopy = form.querySelector('[data-recommendation-copy]');
  const successBox = form.querySelector('[data-success]');
  const conditionalBlocks = form.querySelectorAll('[data-show-for]');
  let hasTrackedStart = false;

  function getValue(name) {
    const field = form.elements[name];
    if (!field) {
      return '';
    }
    if (field instanceof RadioNodeList) {
      return field.value || '';
    }
    return field.value || '';
  }

  function getChecked(name) {
    const field = form.elements[name];
    if (!field) {
      return false;
    }
    if (field instanceof RadioNodeList) {
      return Array.from(field).some((node) => node.checked);
    }
    return Boolean(field.checked);
  }

  function getCheckedList(name) {
    return Array.from(form.querySelectorAll(`[name="${name}"]:checked`)).map((node) => node.value);
  }

  function parseBudget(value) {
    const ranges = {
      under900: 700,
      '900-1500': 1200,
      '1500-2500': 2100,
      '2500-4000': 3200,
      '4000plus': 4500
    };
    return ranges[value] || 0;
  }

  function daysUntilEvent(dateValue) {
    if (!dateValue) {
      return null;
    }
    const today = new Date();
    const eventDate = new Date(`${dateValue}T12:00:00`);
    if (Number.isNaN(eventDate.getTime())) {
      return null;
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((eventDate - today) / msPerDay);
  }

  function recommendPackage(data) {
    if (data.eventType === 'corporate-hotel') {
      return 'Corporate / Private Event Production';
    }
    if (data.eventType === 'quinceanera' || data.eventType === 'private-celebration') {
      return 'Quince / Private Celebration';
    }
    if (data.eventType === 'wedding' && data.bilingualMc) {
      return 'Bilingual Premium Wedding';
    }
    if (data.eventType === 'wedding' && data.ceremonyAudio) {
      return 'Ceremony + Reception';
    }
    if (data.lighting) {
      return 'Miami Reception DJ + Lighting Add-On';
    }
    return 'Miami Reception DJ';
  }

  function calculateLeadScore(data) {
    let score = 0;
    const guestCount = Number(data.guestCount || 0);
    const budget = parseBudget(data.budgetRange);
    const daysOut = daysUntilEvent(data.eventDate);
    const hasOutdoorService = data.servicesNeeded.some((service) => service === 'outdoor-sound' || service === 'beach-ceremony');
    const hasRainNote = /rain|cover|tent|indoor|backup|weather/i.test(data.message || '');

    if (data.eventType === 'wedding') score += 25;
    if (data.eventType === 'quinceanera' || data.eventType === 'private-celebration') score += 18;
    if (data.eventType === 'corporate-hotel') score += 20;
    if ((data.venue || '').trim().length > 2) score += 15;
    if (guestCount > 100) score += 10;
    if (data.ceremonyAudio) score += 15;
    if (data.bilingualMc) score += 15;
    if (data.lighting) score += 10;
    if (budget > 2000) score += 20;
    if (daysOut !== null && daysOut >= 90 && daysOut <= 365) score += 10;
    if (budget > 0 && budget < 900) score -= 30;
    if (hasOutdoorService && !hasRainNote) score -= 20;
    if (daysOut !== null && daysOut >= 0 && daysOut <= 7) score -= 20;

    return score;
  }

  function leadCategory(score) {
    if (score >= 80) return 'Priority lead';
    if (score >= 50) return 'Qualified lead';
    if (score >= 25) return 'Nurture lead';
    return 'Low-fit lead';
  }

  function collectLeadData() {
    const servicesNeeded = getCheckedList('servicesNeeded');
    const data = {
      market: 'Miami',
      name: getValue('name').trim(),
      email: getValue('email').trim(),
      phone: getValue('phone').trim(),
      eventType: getValue('eventType'),
      eventDate: getValue('eventDate'),
      venue: getValue('venue').trim(),
      guestCount: getValue('guestCount'),
      servicesNeeded,
      bilingualMc: getChecked('bilingualMc'),
      ceremonyAudio: getChecked('ceremonyAudio'),
      lighting: getChecked('lighting'),
      budgetRange: getValue('budgetRange'),
      message: getValue('message').trim(),
      sourcePage: window.location.pathname,
      submittedAt: new Date().toISOString()
    };

    data.recommendedPackage = recommendPackage(data);
    data.leadScore = calculateLeadScore(data);
    data.leadCategory = leadCategory(data.leadScore);
    return data;
  }

  function updateConditionalFields() {
    const eventType = getValue('eventType');
    conditionalBlocks.forEach((block) => {
      const allowed = block.getAttribute('data-show-for').split(',').map((item) => item.trim());
      block.hidden = !allowed.includes(eventType);
    });
  }

  function updateRecommendation() {
    const data = collectLeadData();
    const enoughData = Boolean(data.eventType && data.eventDate && data.guestCount);
    if (!enoughData || !recommendationBox) {
      recommendationBox?.classList.remove('is-visible');
      return;
    }

    recommendationTitle.textContent = `This looks like a strong fit for ${data.recommendedPackage}.`;
    recommendationCopy.textContent = data.lighting
      ? 'We will confirm the right sound, lighting, and staffing plan after reviewing your venue, timeline, and guest count.'
      : 'We will confirm availability and the right setup after reviewing your details.';
    recommendationBox.classList.add('is-visible');
  }

  form.addEventListener('input', () => {
    if (!hasTrackedStart) {
      hasTrackedStart = true;
      track('lead_form_start', { sourcePage: window.location.pathname });
    }
    updateConditionalFields();
    updateRecommendation();
  });

  form.addEventListener('change', () => {
    updateConditionalFields();
    updateRecommendation();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = collectLeadData();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Reviewing details';

    const payload = {
      market: data.market,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: data.guestCount,
      servicesNeeded: data.servicesNeeded,
      bilingualMc: data.bilingualMc,
      ceremonyAudio: data.ceremonyAudio,
      lighting: data.lighting,
      budgetRange: data.budgetRange,
      leadScore: data.leadScore,
      recommendedPackage: data.recommendedPackage,
      sourcePage: data.sourcePage,
      submittedAt: data.submittedAt
    };

    // TODO: Replace this safe local stub with CRM, SMS, email, and calendar integrations.
    // Suggested production flow: POST payload and contact details to an API route, then notify sales.
    const storedLeads = JSON.parse(window.localStorage.getItem('tcMiamiLeadDrafts') || '[]');
    storedLeads.push(Object.assign({}, data, { payload }));
    window.localStorage.setItem('tcMiamiLeadDrafts', JSON.stringify(storedLeads.slice(-20)));

    form.dataset.lastLeadPayload = JSON.stringify(payload);
    track('lead_form_submit', {
      sourcePage: window.location.pathname,
      recommendedPackage: data.recommendedPackage,
      leadCategory: data.leadCategory
    });

    window.setTimeout(() => {
      successBox?.classList.add('is-visible');
      if (successBox) {
        successBox.querySelector('[data-success-package]').textContent = data.recommendedPackage;
      }
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      form.reset();
      updateConditionalFields();
      updateRecommendation();
    }, 360);
  });

  updateConditionalFields();
  updateRecommendation();
}());
