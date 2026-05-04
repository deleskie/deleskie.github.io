# Miami English vs Spanish Content Strategy

## Principle

Do not mirror one blog across two languages. Build two editorial lanes:

- English-first: destination couples, planners, hotels, corporate buyers, private event clients, and English-dominant local couples.
- Spanish-first / Latin-first: local families, bilingual weddings, quinceaneras, Latin wedding traditions, family-centered events, and culturally specific MC/music expectations.

Some posts can be true translations. Others should be related but culturally different.

## URL Architecture

English:

- `/blog/`
- `/blog/how-to-choose-miami-wedding-dj/`
- `/blog/miami-wedding-dj-cost/`
- `/blog/ceremony-audio-miami/`

Spanish:

- `/es/blog/`
- `/es/blog/como-elegir-dj-bilingue-boda-latina-miami/`
- `/es/blog/dj-quinceanera-miami-musica-entradas-vals-energia/`
- `/es/blog/importancia-mc-bilingue-boda-familia-latina-americana/`

Service pages:

- `/miami-wedding-dj/`
- `/miami-bilingual-wedding-dj/`
- `/miami-quinceanera-dj/`
- `/es/dj-para-bodas-miami/`
- `/es/dj-bilingue-para-bodas-miami/`
- `/es/dj-para-quinceanera-miami/`

## Hreflang Rules

Use hreflang only for true alternate versions or close localized equivalents.

- English Miami pages: `en-US`
- Spanish Miami pages: `es-US`
- Add `x-default` where appropriate.
- Every page should self-canonical unless there is a clear technical reason not to.
- Do not auto-redirect based on browser language.
- Make the language switcher visible near the top, not buried only in the footer.

Google source: https://developers.google.com/search/docs/specialty/international/localized-versions

## English-First Blog Themes

English articles should feel polished, production-minded, and planner-friendly.

Priority topics:

- How to Choose a Miami Wedding DJ Without Getting Burned
- Miami Wedding DJ Cost: What Couples Should Actually Budget
- Ceremony Audio in Miami: What Most Couples Forget
- Miami Corporate Event DJ: Sound, Mics, Music, and Flow
- Miami Event Lighting: Uplighting, Dance Lighting, and Room Transformation
- What Makes a DJ Planner-Friendly?
- Miami Beach Wedding DJ Guide
- Coral Gables Wedding DJ Guide
- Brickell Corporate Event DJ Guide
- Coconut Grove Wedding Sound and Lighting Guide

Buyer psychology:

- Is this vendor reliable?
- Will the planner/venue trust them?
- Will ceremony audio work outdoors?
- Will they avoid cheesy DJ behavior?
- Do they understand destination/event logistics?
- Can they handle sound, lighting, mics, and flow?

## Spanish-First Blog Themes

Spanish content should be Latin American Spanish appropriate for Miami, not Spain-specific Spanish. It should feel warm, professional, family-aware, and culturally fluent.

Priority topics:

- Como elegir un DJ bilingue para una boda latina en Miami
- DJ para quinceanera en Miami: musica, entradas, vals y energia
- La importancia del MC bilingue en una boda con familia latina y americana
- Como organizar una hora loca en Miami sin que se vuelva un desorden
- Como balancear salsa, merengue, bachata, reggaeton y clasicos en una boda
- Preguntas que los padres deben hacer antes de contratar un DJ para quinceanera
- DJ para bodas en Hialeah, Doral, Kendall, Coral Gables y Miami Beach

Buyer psychology:

- Will both sides of the family feel included?
- Can the MC move between English and Spanish naturally?
- Will parents, grandparents, and younger guests all enjoy the music?
- Will the quinceanera formalities be handled cleanly?
- Can Hora Loca feel exciting without becoming chaotic?
- Will traditions be respected without making the event feel outdated?

## Translation Types

| Type | Use When | Example |
|---|---|---|
| Direct translation | Same search intent and same buyer need | Wedding DJ cost in Miami / Cuanto cuesta un DJ para bodas en Miami |
| Adapted localization | Same broad topic, different examples and framing | Choosing a Miami wedding DJ / Elegir DJ bilingue para boda latina |
| English-first original | Corporate, planner, destination, technical topics | Hotel event sound checklist |
| Spanish-first original | Latin traditions, quinceaneras, family music flow | Como organizar una hora loca |

## Current Implementation Notes

The repo now has starter Miami blog content in `/data/miami-blog-posts.json` and generated English/Spanish blog pages. Draft articles should stay clearly marked until real long-form copy is approved.

Digital.gov supports making multilingual access prominent rather than hiding it in a footer: https://digital.gov/resources/creating-multilingual-websites/
