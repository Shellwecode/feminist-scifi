/*
  The manifest deliberately keeps only browse metadata in the page. The detailed
  research files are fetched only when a reader opens an entry.
*/
(() => {
  'use strict';

  const AUTHOR_MANIFEST = [
    ['abdel-aziz-basma.md', 'Basma Abdel Aziz', 'Arabic', 'Egypt (MENA)', '2007–present', 'dystopia, power, labor, religion/myth, biology, embodiment'],
    ['al-maria-sophia.md', 'Sophia Al-Maria', 'English', 'Qatar / United States (MENA / diaspora)', '2008–present', 'colonialism, labor, gender, dystopia, ecology, power, embodiment'],
    ['atwood-margaret.md', 'Margaret Atwood', 'English', 'Canada (Anglophone)', '1961–present', 'dystopia, gender, biology, power, religion/myth, ecology'],
    ['bazterrica-agustina.md', 'Agustina Bazterrica', 'Spanish', 'Argentina (Latin American)', '2013–present', 'dystopia, ecology, gender, biology, religion/myth, embodiment'],
    ['beukes-lauren.md', 'Lauren Beukes', 'English', 'South Africa (African, continental)', '2008–present', 'gender, cyberpunk, power, colonialism, weird/horror, dystopia'],
    ['brackett-leigh.md', 'Leigh Brackett', 'English', 'United States (Anglophone)', '1940–1978', 'post-apocalypse, space-opera, weird/horror, colonialism'],
    ['bujold-lois-mcmaster.md', 'Lois McMaster Bujold', 'English', 'United States (Anglophone)', '1985–present', 'family/kinship, embodiment, power, biology, gender, space-opera'],
    ['burdekin-katharine.md', 'Katharine Burdekin', 'English', 'United Kingdom (Anglophone)', '1922–1960 (published 1922–mid-1940s; rediscovered 1985)', 'gender, dystopia, power, religion/myth'],
    ['butler-octavia.md', 'Octavia E. Butler', 'English', 'United States (Anglophone)', '1971–2006', 'race, gender, power, biology, post-apocalypse, religion/myth, first-contact, colonialism'],
    ['cadigan-pat.md', 'Pat Cadigan', 'English', 'United States / United Kingdom (Anglophone)', '1978–present', 'cyberpunk, AI/machine-consciousness, embodiment, gender, labor'],
    ['carter-angela.md', 'Angela Carter', 'English', 'United Kingdom (Anglophone)', '1966–1992', 'gender, power, weird/horror, dystopia, embodiment, post-apocalypse'],
    ['chabria-priya-sarukkai.md', 'Priya Sarukkai Chabria', 'English (also publishes poetry with Sanskrit engagement)', 'India (South Asian)', '1986–present', 'AI/machine-consciousness, time, biology, gender, religion/myth, embodiment'],
    ['chambers-becky.md', 'Becky Chambers', 'English', 'United States (Anglophone)', '2014–present', 'family/kinship, AI/machine-consciousness, utopia, ecology, gender, first-contact'],
    ['chapela-andrea.md', 'Andrea Chapela', 'Spanish', 'Mexico (Latin American)', '2009–present', 'AI/machine-consciousness, gender, embodiment, time, language'],
    ['chaviano-daina.md', 'Daína Chaviano', 'Spanish', 'Cuba (Latin American); based in the United States since 1991', '1979–present', 'gender, family/kinship, religion/myth, utopia, time, colonialism'],
    ['cherryh-c-j.md', 'C. J. Cherryh', 'English', 'United States (Anglophone)', '1976–present', 'first-contact, power, labor, language, space-opera, colonialism'],
    ['chi-hui.md', 'Chi Hui', 'Chinese (Mandarin)', 'China (East Asian)', '2003–present', 'AI/machine-consciousness, biology, language, first-contact, gender'],
    ['chung-bora.md', 'Bora Chung', 'Korean', 'South Korea (East Asian)', '1998–present', 'weird/horror, gender, labor, biology, religion/myth'],
    ['damian-miravete-gabriela.md', 'Gabriela Damián Miravete', 'Spanish', 'Mexico (Latin American)', '2010s–present', 'gender, power, religion/myth, weird/horror, time'],
    ['djuna.md', 'Djuna', 'Korean', 'South Korea (East Asian)', '1992–present', 'cyberpunk, colonialism, power, AI/machine-consciousness, first-contact'],
    ['due-tananarive.md', 'Tananarive Due', 'English', 'United States (African diaspora)', '1995–present', 'race, religion/myth, weird/horror, family/kinship, biology'],
    ['fideli-finisia.md', 'Finisia Fideli', 'Portuguese', 'Brazil (Latin American)', '1970s–2000s (primary SF period)', 'first-contact, gender, language, dystopia'],
    ['gilman-charlotte-perkins.md', 'Charlotte Perkins Gilman', 'English', 'United States (Anglophone)', '1860–1935', 'gender, utopia, ecology, labor, family/kinship'],
    ['gorodischer-angelica.md', 'Angélica Gorodischer', 'Spanish', 'Argentina (Latin American)', '1964–2022', 'utopia, power, time, language, colonialism, gender'],
    ['griffith-nicola.md', 'Nicola Griffith', 'English', 'United Kingdom / United States (Anglophone)', '1988–present', 'gender, biology, ecology, labor, embodiment'],
    ['hao-jingfang.md', 'Hao Jingfang', 'Chinese (Mandarin)', 'China (East Asian)', '2006–present', 'dystopia, power, labor, AI/machine-consciousness, utopia, time'],
    ['hareven-gail.md', 'Gail Hareven', 'Hebrew', 'Israel (MENA)', '1988–present', 'gender, religion/myth, weird/horror, power, family/kinship, time'],
    ['haushofer-marlen.md', 'Marlen Haushofer', 'German', 'Austria (European non-English)', '1946–1970', 'post-apocalypse, ecology, embodiment, family/kinship, gender, biology'],
    ['hopkinson-nalo.md', 'Nalo Hopkinson', 'English (with extensive Caribbean Creole and Jamaican Patois usage)', 'Jamaica / Canada / United States (African/Caribbean diaspora)', '1997–present', 'race, gender, religion/myth, language, power, colonialism, family/kinship'],
    ['hossain-rokeya.md', 'Rokeya Sakhawat Hossain', 'Bengali; also English', 'British India (now Bangladesh) (South Asian)', '1902–1932', 'utopia, gender, religion/myth, ecology, labor, language'],
    ['jemisin-n-k.md', 'N. K. Jemisin', 'English', 'United States (Anglophone)', '2002–present', 'race, power, ecology, colonialism, embodiment, gender'],
    ['jones-gwyneth.md', 'Gwyneth Jones', 'English', 'United Kingdom (Anglophone)', '1980–present', 'gender, first-contact, colonialism, power, biology, dystopia'],
    ['kahiu-wanuri.md', 'Wanuri Kahiu', 'English', 'Kenya (African, continental)', '2008–present', 'ecology, post-apocalypse, gender, colonialism, utopia'],
    ['kim-bo-young.md', 'Kim Bo-Young', 'Korean', 'South Korea (East Asian)', '2004–present', 'time, family/kinship, AI/machine-consciousness, power, embodiment'],
    ['kim-choyeop.md', 'Kim Choyeop', 'Korean', 'South Korea (East Asian)', '2017–present', 'embodiment, biology, family/kinship, AI/machine-consciousness, time'],
    ['kress-nancy.md', 'Nancy Kress', 'English', 'United States (Anglophone)', '1976–present', 'biology, power, labor, first-contact, dystopia'],
    ['kurahashi-yumiko.md', 'Kurahashi Yumiko', 'Japanese', 'Japan (East Asian)', '1960–2005', 'gender, dystopia, power, weird/horror, religion/myth'],
    ['lanagan-margo.md', 'Margo Lanagan', 'English', 'Australia (Anglophone)', '1990–present', 'weird/horror, gender, family/kinship, embodiment, religion/myth'],
    ['le-guin-ursula.md', 'Ursula K. Le Guin', 'English', 'United States (Anglophone)', '1959–2018', 'gender, utopia, first-contact, ecology, colonialism, language, AI/machine-consciousness'],
    ['leckie-ann.md', 'Ann Leckie', 'English', 'United States (Anglophone)', '2006–present', 'AI/machine-consciousness, gender, power, colonialism, language, space-opera'],
    ['lee-tanith.md', 'Tanith Lee', 'English', 'United Kingdom (Anglophone)', '1968–2015', 'gender, embodiment, AI/machine-consciousness, biology, dystopia, weird/horror'],
    ['lessing-doris.md', 'Doris Lessing', 'English', 'United Kingdom / born Iran, raised in Southern Rhodesia (now Zimbabwe) (Anglophone)', '1950–2013', 'dystopia, religion/myth, weird/horror, power, post-apocalypse, gender'],
    ['mccaffrey-anne.md', 'Anne McCaffrey', 'English', 'United States / Ireland (Anglophone)', '1953–2011', 'embodiment, AI/machine-consciousness, family/kinship, biology, space-opera'],
    ['mcintyre-vonda.md', 'Vonda N. McIntyre', 'English', 'United States (Anglophone)', '1970–2019', 'biology, post-apocalypse, embodiment, space-opera, time'],
    ['mira-de-echeverria-teresa.md', 'Teresa P. Mira de Echeverría', 'Spanish', 'Argentina (Latin American)', '2000s–present', 'gender, time, weird/horror, language, AI/machine-consciousness'],
    ['mitchison-naomi.md', 'Naomi Mitchison', 'English', 'United Kingdom / Scotland (Anglophone)', '1923–1999 (publishing career; born 1897, died 1999)', 'first-contact, gender, biology, ecology, family/kinship'],
    ['moore-c-l.md', 'C. L. Moore', 'English', 'United States (Anglophone)', '1933–1963 (primary SF period)', 'embodiment, gender, weird/horror, space-opera, AI/machine-consciousness'],
    ['norton-andre.md', 'Andre Norton', 'English', 'United States (Anglophone)', '1934–2005', 'post-apocalypse, time, colonialism, family/kinship, space-opera'],
    ['ogawa-yoko.md', 'Ogawa Yōko', 'Japanese', 'Japan (East Asian)', '1988–present', 'dystopia, weird/horror, embodiment, family/kinship, biology'],
    ['ohara-mariko.md', 'Ōhara Mariko', 'Japanese', 'Japan (East Asian)', '1980–present', 'cyberpunk, AI/machine-consciousness, gender, embodiment, family/kinship, biology'],
    ['okorafor-nnedi.md', 'Nnedi Okorafor', 'English', 'Nigerian-American (African diaspora)', '2001–present', 'race, gender, post-apocalypse, first-contact, religion/myth, colonialism, biology'],
    ['onwualu-chinelo.md', 'Chinelo Onwualu', 'English', 'Nigeria / Canada (African, continental / diaspora)', '2012–present', 'colonialism, religion/myth, gender, power, first-contact'],
    ['oyeyemi-helen.md', 'Helen Oyeyemi', 'English', 'Nigeria / United Kingdom (African diaspora)', '2005–present', 'weird/horror, gender, family/kinship, race, religion/myth'],
    ['padmanabhan-manjula.md', 'Manjula Padmanabhan', 'English', 'India (South Asian)', '1970s–present', 'biology, gender, power, dystopia, post-apocalypse, colonialism, labor'],
    ['roanhorse-rebecca.md', 'Rebecca Roanhorse', 'English', 'United States — Ohkay Owingeh Pueblo and African-American heritage (Indigenous Americas; included here as “other” — an under-represented category in the geographic scheme)', '2017–present', 'post-apocalypse, religion/myth, colonialism, race, gender, power'],
    ['russ-joanna.md', 'Joanna Russ', 'English', 'United States (Anglophone)', '1959–2011', 'gender, utopia, dystopia, power, language, labor'],
    ['sansour-larissa.md', 'Larissa Sansour', 'English and Arabic (primary medium is film/visual art, not prose)', 'Palestine / Denmark (MENA)', '2003–present', 'colonialism, post-apocalypse, religion/myth, ecology, time, embodiment, language'],
    ['schweblin-samanta.md', 'Samanta Schweblin', 'Spanish', 'Argentina (Latin American); based in Berlin', '2002–present', 'weird/horror, ecology, biology, power, family/kinship, embodiment'],
    ['serpell-namwali.md', 'Namwali Serpell', 'English', 'Zambia / United States (African diaspora)', '2010–present', 'post-apocalypse, race, colonialism, power, family/kinship, ecology, time'],
    ['shah-bina.md', 'Bina Shah', 'English', 'Pakistan (South Asian)', '2001–present', 'gender, dystopia, power, religion/myth, biology, family/kinship'],
    ['shawl-nisi.md', 'Nisi Shawl', 'English', 'United States (African diaspora)', '1989–present', 'race, colonialism, power, gender, post-apocalypse, utopia'],
    ['shelley-mary.md', 'Mary Shelley', 'English', 'United Kingdom (Anglophone)', '1797–1851', 'embodiment, biology, dystopia, post-apocalypse, gender, religion/myth'],
    ['singh-vandana.md', 'Vandana Singh', 'English', 'India / United States (South Asian; US-resident)', '2002–present', 'ecology, first-contact, gender, colonialism, biology, time, language'],
    ['sinisalo-johanna.md', 'Johanna Sinisalo', 'Finnish', 'Finland (European non-English)', '1985–present', 'ecology, gender, religion/myth, biology, weird/horror, dystopia'],
    ['suzuki-izumi.md', 'Suzuki Izumi', 'Japanese', 'Japan (East Asian)', '1969–1986', 'gender, dystopia, embodiment, biology, family/kinship, weird/horror'],
    ['tang-fei.md', 'Tang Fei', 'Chinese (Mandarin)', 'China (East Asian)', 'mid-2000s–present', 'weird/horror, gender, power, embodiment, first-contact'],
    ['tidbeck-karin.md', 'Karin Tidbeck', 'Swedish and English (writes in both; self-translates)', 'Sweden (European non-English, though also writes directly in English)', '2002–present', 'language, weird/horror, power, embodiment, religion/myth, time'],
    ['tiptree-james-jr.md', 'James Tiptree Jr. (Alice B. Sheldon)', 'English', 'United States (Anglophone)', '1967–1987', 'gender, biology, first-contact, dystopia, embodiment, ecology'],
    ['tokarczuk-olga.md', 'Olga Tokarczuk', 'Polish', 'Poland (European non-English)', '1989–present', 'religion/myth, ecology, time, power, gender, weird/horror'],
    ['tolstaya-tatiana.md', 'Tatiana Tolstaya', 'Russian', 'Russia (European non-English)', '1983–present', 'post-apocalypse, language, power, religion/myth, dystopia'],
    ['vonarburg-elisabeth.md', 'Élisabeth Vonarburg', 'French', 'France / Québec, Canada (European non-English; Francophone Canadian)', '1977–present', 'gender, post-apocalypse, ecology, biology, first-contact, time'],
    ['wilhelm-kate.md', 'Kate Wilhelm', 'English', 'United States (Anglophone)', '1956–2018', 'biology, ecology, post-apocalypse, AI/machine-consciousness, language'],
    ['willis-connie.md', 'Connie Willis', 'English', 'United States (Anglophone)', '1971–present', 'time, war, religion/myth, labor, dystopia'],
    ['wittig-monique.md', 'Monique Wittig', 'French', 'France (European non-English)', '1964–2003', 'gender, utopia, language, power, embodiment, religion/myth'],
    ['wolf-christa.md', 'Christa Wolf', 'German', 'East Germany (GDR) / Germany (European non-English)', '1961–2010', 'war, religion/myth, ecology, gender, power, post-apocalypse'],
    ['xia-jia.md', 'Xia Jia', 'Chinese (Mandarin)', 'China (East Asian)', '2004–present', 'AI/machine-consciousness, family/kinship, religion/myth, time, ecology']
  ];

  const AUTHORS = AUTHOR_MANIFEST.map(([file, name, language, region, years, themes]) => ({
    file,
    name,
    language,
    region,
    years,
    themes: themes.split(',').map((theme) => theme.trim()).filter(Boolean),
    firstYear: Number((years.match(/\d{4}/) || [9999])[0])
  }));

  // These featured writers are deliberately not presented as corpus files: the current
  // repository has no matching authors-raw Markdown for them. They keep the site’s
  // existing reading-path links useful while naming that limitation plainly.
  const RELATED_PATHWAYS = [
    {
      name: 'Zhang Xiaofeng',
      detail: 'A 1968 Taiwanese SF lead in the site’s opening reading. A standalone source file is still to be added to this archive.',
      href: 'index.html#v1',
      terms: 'zhang xiaofeng 張曉風 pandora taiwan 1968 chinese'
    },
    {
      name: 'Karin Boye',
      detail: 'A 1940 Swedish dystopian lead in the opening reading. A standalone source file is still to be added to this archive.',
      href: 'index.html#s-opening',
      terms: 'karin boye kallocain sweden swedish dystopia 1940'
    },
    {
      name: 'Léonora Miano',
      detail: 'A 2019 Cameroon–France Africanfuturist lead in the opening reading. A standalone source file is still to be added to this archive.',
      href: 'index.html#s-opening',
      terms: 'léonora leonora miano rouge impératrice red empress cameroon france african futurism 2019'
    },
    {
      name: 'Misha (Misha Nogha)',
      detail: 'A featured lead from the opening reading. A standalone source file is still to be added to this archive.',
      href: 'index.html#s-opening',
      terms: 'misha nogha red spider white web metis cree nordic cyberpunk indigenous'
    }
  ];

  const dom = {
    form: document.querySelector('#archive-controls'),
    search: document.querySelector('#archive-search'),
    clearSearch: document.querySelector('#clear-search'),
    region: document.querySelector('#filter-region'),
    language: document.querySelector('#filter-language'),
    period: document.querySelector('#filter-period'),
    theme: document.querySelector('#filter-theme'),
    sort: document.querySelector('#sort-authors'),
    clearFilters: document.querySelector('#clear-filters'),
    results: document.querySelector('#author-results'),
    count: document.querySelector('#result-count'),
    empty: document.querySelector('#empty-state'),
    emptyReset: document.querySelector('#empty-reset'),
    dialog: document.querySelector('#author-dialog'),
    dialogTitle: document.querySelector('#dialog-title'),
    dialogKicker: document.querySelector('#dialog-kicker'),
    dialogMeta: document.querySelector('#dialog-meta'),
    dialogContent: document.querySelector('#dialog-content'),
    dialogClose: document.querySelector('#dialog-close'),
    dialogSource: document.querySelector('#dialog-source')
  };

  const markdownCache = new Map();
  let activeFile = null;
  let pendingFile = null;
  let dialogRequest = 0;

  const escapeHTML = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const normalize = (value) => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();

  const sortedUnique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

  function regionGroup(author) {
    const value = author.region;
    if (/Indigenous Americas|Ohkay Owingeh/i.test(value)) return 'Indigenous Americas';
    if (/MENA|Egypt|Palestine|Israel|Qatar/i.test(value)) return 'MENA';
    if (/East Asian|China|Japan|Korea/i.test(value)) return 'East Asia';
    if (/Latin American|Argentina|Brazil|Cuba|Mexico/i.test(value)) return 'Latin America';
    if (/South Asian|India|Pakistan|Bangladesh/i.test(value)) return 'South Asia';
    if (/African|Kenya|Nigeria|Zambia|Caribbean/i.test(value)) return 'Africa & diaspora';
    if (/European non-English|Austria|Finland|France|Germany|Poland|Québec|Russia|Sweden/i.test(value)) return 'Europe, non-English';
    return 'Anglophone traditions';
  }

  function languageGroup(author) {
    const value = author.language;
    if (/Bengali/i.test(value)) return 'Bengali + English';
    if (/Swedish/i.test(value) && /English/i.test(value)) return 'Swedish + English';
    if (/Arabic/i.test(value) && /English/i.test(value)) return 'Arabic + English';
    if (/English/i.test(value)) return 'English';
    if (/Chinese/i.test(value)) return 'Chinese';
    if (/Spanish/i.test(value)) return 'Spanish';
    if (/Korean/i.test(value)) return 'Korean';
    if (/Japanese/i.test(value)) return 'Japanese';
    if (/Portuguese/i.test(value)) return 'Portuguese';
    if (/Hebrew/i.test(value)) return 'Hebrew';
    if (/German/i.test(value)) return 'German';
    if (/Finnish/i.test(value)) return 'Finnish';
    if (/Polish/i.test(value)) return 'Polish';
    if (/Russian/i.test(value)) return 'Russian';
    if (/French/i.test(value)) return 'French';
    return value;
  }

  function periodGroup(author) {
    if (author.firstYear < 1950) return 'before-1950';
    if (author.firstYear < 1980) return '1950-1979';
    if (author.firstYear < 2000) return '1980-1999';
    return '2000-plus';
  }

  function appendOptions(control, values) {
    const fragment = document.createDocumentFragment();
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      fragment.append(option);
    });
    control.append(fragment);
  }

  function hydrateFilters() {
    appendOptions(dom.region, sortedUnique(AUTHORS.map(regionGroup)));
    appendOptions(dom.language, sortedUnique(AUTHORS.map(languageGroup)));
    appendOptions(dom.theme, sortedUnique(AUTHORS.flatMap((author) => author.themes)));
  }

  function hasOption(control, value) {
    return [...control.options].some((option) => option.value === value);
  }

  function applyURLState() {
    const params = new URLSearchParams(window.location.search);
    dom.search.value = params.get('search') || params.get('q') || '';

    [['region', dom.region], ['language', dom.language], ['period', dom.period], ['theme', dom.theme], ['sort', dom.sort]].forEach(([name, control]) => {
      const value = params.get(name) || '';
      control.value = hasOption(control, value) ? value : '';
    });
  }

  function getState() {
    return {
      search: dom.search.value.trim(),
      region: dom.region.value,
      language: dom.language.value,
      period: dom.period.value,
      theme: dom.theme.value,
      sort: dom.sort.value
    };
  }

  function updateURL(mode = 'replace', authorFile = activeFile) {
    const state = getState();
    const url = new URL(window.location.href);
    ['search', 'q', 'region', 'language', 'period', 'theme', 'sort', 'author'].forEach((key) => url.searchParams.delete(key));

    if (state.search) url.searchParams.set('search', state.search);
    if (state.region) url.searchParams.set('region', state.region);
    if (state.language) url.searchParams.set('language', state.language);
    if (state.period) url.searchParams.set('period', state.period);
    if (state.theme) url.searchParams.set('theme', state.theme);
    if (state.sort && state.sort !== 'name') url.searchParams.set('sort', state.sort);
    if (authorFile) url.searchParams.set('author', authorFile.replace(/\.md$/, ''));

    const target = `${url.pathname}${url.search}${url.hash}`;
    history[mode === 'push' ? 'pushState' : 'replaceState']({}, '', target);
  }

  function compareAuthors(first, second, sort) {
    if (sort === 'earliest') return first.firstYear - second.firstYear || first.name.localeCompare(second.name);
    if (sort === 'latest') return second.firstYear - first.firstYear || first.name.localeCompare(second.name);
    return first.name.localeCompare(second.name);
  }

  function matches(author, state) {
    const haystack = normalize([
      author.name,
      author.language,
      languageGroup(author),
      author.region,
      regionGroup(author),
      author.years,
      ...author.themes
    ].join(' '));

    return (!state.search || haystack.includes(normalize(state.search)))
      && (!state.region || regionGroup(author) === state.region)
      && (!state.language || languageGroup(author) === state.language)
      && (!state.period || periodGroup(author) === state.period)
      && (!state.theme || author.themes.includes(state.theme));
  }

  function cardMarkup(author, index) {
    const themes = author.themes.slice(0, 3).map((theme) => `<span class="card-theme">${escapeHTML(theme)}</span>`).join('');
    const remaining = author.themes.length - 3;
    const extra = remaining > 0 ? `<span class="card-theme">+${remaining}</span>` : '';

    return `
      <li>
        <button class="author-card" type="button" data-file="${escapeHTML(author.file)}" aria-label="Open research file for ${escapeHTML(author.name)}">
          <span class="card-index">FILE ${String(index + 1).padStart(2, '0')}</span>
          <span class="card-name">${escapeHTML(author.name)}</span>
          <span class="card-language">${escapeHTML(author.language)}</span>
          <span class="card-region">${escapeHTML(author.region)}</span>
          <span class="card-themes">${themes}${extra}</span>
          <span class="card-bottom">
            <span class="card-years">${escapeHTML(author.years)}</span>
            <span class="card-open">Open file <span aria-hidden="true">↗</span></span>
          </span>
        </button>
      </li>`;
  }

  function pathwayMarkup(pathway) {
    return `
      <li>
        <a class="author-card pathway-card" href="${escapeHTML(pathway.href)}">
          <span class="card-index">READING PATHWAY</span>
          <span class="card-name">${escapeHTML(pathway.name)}</span>
          <span class="card-language">Featured in the site’s reading</span>
          <span class="card-region">${escapeHTML(pathway.detail)}</span>
          <span class="card-bottom">
            <span class="card-years">Not yet a research file</span>
            <span class="card-open">Open reading <span aria-hidden="true">→</span></span>
          </span>
        </a>
      </li>`;
  }

  function render() {
    const state = getState();
    const visible = AUTHORS.filter((author) => matches(author, state)).sort((a, b) => compareAuthors(a, b, state.sort));
    const matchingPathways = visible.length === 0 && state.search
      ? RELATED_PATHWAYS.filter((pathway) => normalize(`${pathway.name} ${pathway.terms}`).includes(normalize(state.search)))
      : [];
    const hasFilters = Boolean(state.search || state.region || state.language || state.period || state.theme || state.sort !== 'name');

    dom.results.innerHTML = visible.map(cardMarkup).join('') + matchingPathways.map(pathwayMarkup).join('');
    dom.results.hidden = visible.length === 0 && matchingPathways.length === 0;
    dom.empty.hidden = visible.length !== 0 || matchingPathways.length !== 0;
    dom.clearSearch.hidden = !state.search;
    dom.clearFilters.hidden = !hasFilters;
    dom.results.setAttribute('aria-label', `${visible.length} research files${matchingPathways.length ? ` and ${matchingPathways.length} reading pathway` : ''}`);
    dom.count.textContent = matchingPathways.length
      ? 'No source file yet · 1 related reading pathway'
      : visible.length === AUTHORS.length && !hasFilters
      ? `${AUTHORS.length} research files`
      : `Showing ${visible.length} of ${AUTHORS.length} files`;
  }

  function resetControls() {
    dom.search.value = '';
    dom.region.value = '';
    dom.language.value = '';
    dom.period.value = '';
    dom.theme.value = '';
    dom.sort.value = 'name';
    render();
    updateURL('replace');
  }

  function inlineMarkdown(value) {
    let output = escapeHTML(value);
    output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
    output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    output = output.replace(/(https?:\/\/[^\s<]+)/g, (rawURL) => {
      const punctuation = rawURL.match(/[.,;:)]*$/)?.[0] || '';
      const href = rawURL.slice(0, rawURL.length - punctuation.length);
      return `<a href="${href}" target="_blank" rel="noreferrer">${href}</a>${punctuation}`;
    });
    return output;
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r/g, '').split('\n');
    const output = [];
    let paragraph = [];
    let listOpen = false;

    const flushParagraph = () => {
      if (paragraph.length) output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    };
    const closeList = () => {
      if (listOpen) output.push('</ul>');
      listOpen = false;
    };

    lines.forEach((line) => {
      if (!line.trim()) {
        flushParagraph();
        closeList();
        return;
      }

      const topHeading = line.match(/^#\s+(.+)$/);
      const heading = line.match(/^##\s+(.+)$/);
      const subheading = line.match(/^###\s+(.+)$/);
      const bullet = line.match(/^(\s*)[-*]\s+(.+)$/);

      if (topHeading) {
        flushParagraph();
        closeList();
        return;
      }
      if (heading || subheading) {
        flushParagraph();
        closeList();
        output.push(`<h3>${inlineMarkdown((heading || subheading)[1])}</h3>`);
        return;
      }
      if (bullet) {
        flushParagraph();
        if (!listOpen) {
          output.push('<ul>');
          listOpen = true;
        }
        const depth = Math.min(3, Math.floor(bullet[1].replace(/\t/g, '    ').length / 2));
        output.push(`<li data-indent="${depth}">${inlineMarkdown(bullet[2])}</li>`);
        return;
      }
      closeList();
      paragraph.push(line.trim());
    });

    flushParagraph();
    closeList();
    return output.join('');
  }

  function setDialogContent(content) {
    dom.dialogContent.innerHTML = content;
    dom.dialogContent.scrollTop = 0;
  }

  function showAuthor(file, { historyMode = 'push' } = {}) {
    const author = AUTHORS.find((entry) => entry.file === file || entry.file.replace(/\.md$/, '') === file);
    if (!author) return;

    activeFile = author.file;
    pendingFile = author.file;
    dialogRequest += 1;
    const requestId = dialogRequest;
    dom.dialogTitle.textContent = author.name;
    dom.dialogKicker.textContent = 'Research file';
    dom.dialogMeta.textContent = `${author.language} · ${author.region} · active ${author.years}`;
    dom.dialogSource.href = `authors-raw/${author.file}`;
    setDialogContent('<p class="loading-file"><span class="loading-dot" aria-hidden="true"></span>Loading the source notes…</p>');

    if (!dom.dialog.open) dom.dialog.showModal();
    if (historyMode) updateURL(historyMode, author.file);

    if (markdownCache.has(author.file)) {
      setDialogContent(renderMarkdown(markdownCache.get(author.file)));
      return;
    }

    fetch(`authors-raw/${author.file}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not open source file (${response.status}).`);
        return response.text();
      })
      .then((markdown) => {
        markdownCache.set(author.file, markdown);
        if (requestId === dialogRequest && pendingFile === author.file) setDialogContent(renderMarkdown(markdown));
      })
      .catch(() => {
        if (requestId === dialogRequest && pendingFile === author.file) {
          setDialogContent('<p class="file-error">This file could not be loaded here. Use “Open raw Markdown” below to read the source directly.</p>');
        }
      });
  }

  function syncDialogFromURL() {
    const author = new URLSearchParams(window.location.search).get('author');
    if (author) {
      const desired = AUTHORS.find((entry) => entry.file.replace(/\.md$/, '') === author || entry.file === author);
      if (desired && (!dom.dialog.open || activeFile !== desired.file)) showAuthor(desired.file, { historyMode: null });
      return;
    }

    if (dom.dialog.open) {
      activeFile = null;
      pendingFile = null;
      dom.dialog.close();
    }
  }

  function onControlChange() {
    render();
    updateURL('replace');
  }

  hydrateFilters();
  applyURLState();
  render();
  syncDialogFromURL();

  dom.form.addEventListener('submit', (event) => event.preventDefault());
  dom.search.addEventListener('input', onControlChange);
  [dom.region, dom.language, dom.period, dom.theme, dom.sort].forEach((control) => control.addEventListener('change', onControlChange));
  dom.clearSearch.addEventListener('click', () => {
    dom.search.value = '';
    onControlChange();
    dom.search.focus();
  });
  dom.clearFilters.addEventListener('click', (event) => {
    event.preventDefault();
    resetControls();
  });
  dom.emptyReset.addEventListener('click', resetControls);

  dom.results.addEventListener('click', (event) => {
    const card = event.target.closest('[data-file]');
    if (card) showAuthor(card.dataset.file);
  });

  dom.dialogClose.addEventListener('click', () => dom.dialog.close());
  dom.dialog.addEventListener('click', (event) => {
    if (event.target === dom.dialog) dom.dialog.close();
  });
  dom.dialog.addEventListener('close', () => {
    pendingFile = null;
    if (activeFile) {
      activeFile = null;
      updateURL('replace', null);
    }
  });

  window.addEventListener('popstate', () => {
    applyURLState();
    render();
    syncDialogFromURL();
  });
  window.addEventListener('keydown', (event) => {
    const target = event.target;
    const inControl = target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !inControl && !dom.dialog.open) {
      event.preventDefault();
      dom.search.focus();
    }
  });
})();
