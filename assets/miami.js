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
  const successCrm = form.querySelector('[data-success-crm]');
  const errorBox = form.querySelector('[data-error]');
  const errorCopy = form.querySelector('[data-error-copy]');
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

  function parseBudgetBounds(value) {
    const ranges = {
      under900: [0, 899],
      '900-1500': [900, 1500],
      '1500-2500': [1500, 2500],
      '2500-4000': [2500, 4000],
      '4000plus': [4000, null]
    };
    return ranges[value] || [null, null];
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

  function mapEventType(eventType) {
    const eventTypes = {
      wedding: 'wedding',
      quinceanera: 'quince',
      'private-celebration': 'private_celebration',
      'corporate-hotel': 'corporate',
      'lighting-production': 'other'
    };
    return eventTypes[eventType] || 'other';
  }

  function inferVenueCity(venue) {
    const normalized = (venue || '').toLowerCase();
    if (normalized.includes('miami beach')) return 'Miami Beach';
    if (normalized.includes('coral gables')) return 'Coral Gables';
    if (normalized.includes('coconut grove')) return 'Coconut Grove';
    if (normalized.includes('doral')) return 'Doral';
    if (normalized.includes('key biscayne')) return 'Key Biscayne';
    if (normalized.includes('aventura')) return 'Aventura';
    if (normalized.includes('kendall')) return 'Kendall';
    if (normalized.includes('homestead')) return 'Homestead';
    return 'Miami';
  }

  function inferIndoorOutdoor(data) {
    const services = data.servicesNeeded || [];
    const notes = `${data.venue || ''} ${data.formalMoments || ''} ${data.productionNotes || ''} ${data.message || ''}`;
    if (services.includes('beach-ceremony')) return 'outdoor_uncovered';
    if (/outdoor uncovered|beach|garden|lawn|terrace|patio|pool|waterfront/i.test(notes)) return 'mixed';
    if (services.includes('outdoor-sound')) return 'mixed';
    if (/indoor|ballroom|banquet|hotel room|reception room/i.test(notes)) return 'indoor';
    return 'unknown';
  }

  function hasPlannerInvolved(data) {
    const notes = `${data.productionNotes || ''} ${data.message || ''}`;
    return /planner|coordinator|venue manager|event manager|hotel contact|catering manager/i.test(notes);
  }

  function formatServices(servicesNeeded) {
    const labels = {
      'dj-mc': 'DJ/MC',
      'ceremony-audio': 'Ceremony audio',
      'event-lighting': 'Lighting',
      'bilingual-mc': 'Bilingual MC',
      'outdoor-sound': 'Outdoor sound',
      'beach-ceremony': 'Beach ceremony'
    };
    return servicesNeeded.map((service) => labels[service] || service).join(', ');
  }

  function compactLines(lines) {
    return lines.filter((line) => line && String(line).trim()).join('\n');
  }

  function collectLeadData() {
    const servicesNeeded = getCheckedList('servicesNeeded');
    const data = {
      market: 'Miami',
      name: getValue('name').trim(),
      website: getValue('website').trim(),
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
      formalMoments: getValue('formalMoments').trim(),
      productionNotes: getValue('productionNotes').trim(),
      message: getValue('message').trim(),
      sourcePage: window.location.pathname,
      submittedAt: new Date().toISOString()
    };

    data.recommendedPackage = recommendPackage(data);
    data.leadScore = calculateLeadScore(data);
    data.leadCategory = leadCategory(data.leadScore);
    return data;
  }

  function buildCrmPayload(data) {
    const [budgetMin, budgetMax] = parseBudgetBounds(data.budgetRange);
    const needsCeremony = data.ceremonyAudio
      || data.servicesNeeded.includes('ceremony-audio')
      || data.servicesNeeded.includes('beach-ceremony');
    const needsLighting = data.lighting || data.servicesNeeded.includes('event-lighting');
    const needsBilingualMc = data.bilingualMc || data.servicesNeeded.includes('bilingual-mc');

    return {
      event_type: mapEventType(data.eventType),
      event_date: data.eventDate || null,
      venue_name: data.venue || null,
      venue_city: data.venue ? inferVenueCity(data.venue) : null,
      guest_count: data.guestCount ? Number(data.guestCount) : null,
      budget_min: budgetMin,
      budget_max: budgetMax,
      needs_ceremony: needsCeremony,
      needs_cocktail: /cocktail/i.test(`${data.formalMoments || ''} ${data.message || ''}`),
      needs_reception: data.eventType !== 'lighting-production',
      needs_bilingual_mc: needsBilingualMc,
      needs_lighting: needsLighting,
      indoor_outdoor: inferIndoorOutdoor(data),
      planner_involved: hasPlannerInvolved(data),
      contract_deposit_resistance: false,
      client_name: data.name,
      client_email: data.email,
      client_phone: data.phone || null,
      source_page: data.sourcePage,
      submitted_at: data.submittedAt,
      website: data.website || null,
      music_notes: compactLines([
        data.servicesNeeded.length ? `Services requested: ${formatServices(data.servicesNeeded)}` : '',
        data.formalMoments ? `Formal moments: ${data.formalMoments}` : '',
        data.productionNotes ? `Planner / venue notes: ${data.productionNotes}` : '',
        data.message ? `Client notes: ${data.message}` : '',
        `Recommended package: ${data.recommendedPackage}`
      ]),
      urgency_notes: compactLines([
        `Source page: ${data.sourcePage}`,
        `Submitted at: ${data.submittedAt}`,
        `Website lead score: ${data.leadScore}`,
        `Website lead category: ${data.leadCategory}`
      ])
    };
  }

  function getCrmEndpoint() {
    const configuredEndpoint = window.TC_MIAMI_CRM_ENDPOINT || form.getAttribute('data-crm-endpoint') || '';
    return configuredEndpoint.trim() || '/api/leads/intake';
  }

  async function submitLeadToCrm(payload) {
    const response = await fetch(getCrmEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.detail || 'CRM intake request failed');
    }
    return body;
  }

  function persistLeadDraft(data, crmPayload, crmResult, status) {
    try {
      const storedLeads = JSON.parse(window.localStorage.getItem('tcMiamiLeadDrafts') || '[]');
      storedLeads.push(Object.assign({}, data, {
        crmPayload,
        crmResult: crmResult || null,
        crmStatus: status
      }));
      window.localStorage.setItem('tcMiamiLeadDrafts', JSON.stringify(storedLeads.slice(-20)));
      return true;
    } catch (error) {
      track('lead_form_local_persist_failed', { sourcePage: data.sourcePage });
      return false;
    }
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

    recommendationTitle.textContent = `This looks like a strong starting direction for ${data.recommendedPackage}.`;
    recommendationCopy.textContent = data.lighting
      ? 'We will confirm the right sound, lighting, and staffing plan after reviewing your venue, timeline, and guest count.'
      : 'We will confirm availability and the right event scope after reviewing your details.';
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = collectLeadData();
    const crmPayload = buildCrmPayload(data);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending to CRM';
    successBox?.classList.remove('is-visible');
    errorBox?.classList.remove('is-visible');

    try {
      const crmResult = await submitLeadToCrm(crmPayload);
      persistLeadDraft(data, crmPayload, crmResult, 'submitted');
      form.dataset.lastLeadPayload = JSON.stringify(crmPayload);
      form.dataset.lastCrmResult = JSON.stringify(crmResult);
      track('lead_form_submit', {
        sourcePage: window.location.pathname,
        recommendedPackage: data.recommendedPackage,
        leadCategory: data.leadCategory,
        crmLeadId: crmResult.lead_id || ''
      });

      successBox?.classList.add('is-visible');
      if (successBox) {
        successBox.querySelector('strong').textContent = 'Your Miami event details were sent to the CRM.';
        successBox.querySelector('[data-success-package]').textContent = data.recommendedPackage;
      }
      if (successCrm) {
        successCrm.textContent = crmResult.lead_id ? `CRM lead ID: ${crmResult.lead_id}` : '';
      }
      form.reset();
      updateConditionalFields();
      updateRecommendation();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'CRM intake request failed';
      const savedDraft = persistLeadDraft(data, crmPayload, { message }, 'crm_error');
      track('lead_form_submit_failed', {
        sourcePage: window.location.pathname,
        recommendedPackage: data.recommendedPackage,
        leadCategory: data.leadCategory
      });
      errorBox?.classList.add('is-visible');
      if (errorCopy) {
        errorCopy.textContent = savedDraft
          ? 'The details were saved in this browser as a draft, but the CRM did not accept the request. Check the DJ World API endpoint and try again.'
          : 'The CRM did not accept the request. Check the DJ World API endpoint and try again.';
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });

  updateConditionalFields();
  updateRecommendation();
}());
