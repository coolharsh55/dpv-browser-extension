document.addEventListener('DOMContentLoaded', function () {
  const versionSelect = document.getElementById('version');
  const modeSelect = document.getElementById('mode');
  const linksDiv = document.getElementById('links');

  function loadSettings() {
    browser.storage.local.get(['version', 'mode'], function(result) {
      if (result.version) {
        versionSelect.value = result.version;
      } else {
        versionSelect.value = '2.1-dev'; // Default value
      }

      if (result.mode) {
        modeSelect.value = result.mode;
      } else {
        modeSelect.value = 'local'; // Default value
      }

      updateLinks(); // Update links based on loaded settings
    });
  }

  function saveSettings() {
    browser.storage.local.set({
      version: versionSelect.value,
      mode: modeSelect.value,
    });
  }

  const links = {
    "DPV": "/dpv",
    "PD": "/pd",
    "LOC": "/loc",
    "RISK": "/risk",
    "TECH": "/tech",
    "AI": "/ai",
    "Justifications": "/justifications",
    "EU-GDPR": "/legal/eu/gdpr",
    "EU-DGA": "/legal/eu/dga",
    "EU-AIAct": "/legal/eu/aiact",
    "EU-NIS2": "/legal/eu/nis2",
    "EU-EHDS": "/legal/eu/ehds",
    "EU-Rights": "/legal/eu/rights",
    "P7012": "/standards/p7012",
    "Mappings-ODRL": "/mappings/odrl",
    "Search": "/search.html",
    "Minutes": "/meetings"
  };

  let baseUrl, base;

  function updateLinks() {
    const version = versionSelect.value;
    const mode = modeSelect.value;

    if (mode === 'local') {
      baseUrl = `http://localhost:8000/${version}`;
      base = `http://localhost:8000`;
    } else if (mode === 'dev') {
      baseUrl = `https://dev.dpvcg.org/${version}`;
      base = `https://dev.dpvcg.org`;
    } else if (mode === 'live') {
      baseUrl = `https://w3id.org/dpv/${version}`;
      base = `https://w3id.org/dpv`;
    }

    linksDiv.innerHTML = '';

    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.flexWrap = 'wrap';
    
    for (const [key, value] of Object.entries(links)) {
        const link = document.createElement('a');
        if (value.includes('/guides')) {
          link.href = `${base}${value}`;
        } else if (value.includes('/meetings')) {
          link.href = `${base}${value}`;
        } else {
          link.href = `${baseUrl}${value}`;
        }
        link.textContent = key;
        link.target = '_blank';
        link.classList.add('link');
        link.addEventListener('mouseover', () => {
            link.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)';
        });

        link.addEventListener('mouseout', () => {
            link.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        });

        rowDiv.appendChild(link);
    }

    linksDiv.appendChild(rowDiv);

    let btnModule = document.getElementById('dpv-module-open');
    btnModule.onclick = function() {
      let selectLegal = document.getElementById('dpv-module');
      let href = baseUrl + "/dpv/modules/";
      href = href + selectLegal.value + ".html";
      window.open(href, '_blank').focus();
    }

    let btnLegal = document.getElementById('legal-open');
    btnLegal.onclick = function() {
      let selectLegal = document.getElementById('legal');
      let href = baseUrl + "/legal";
      if (selectLegal.value != 'index') {
        href = href + "/" + selectLegal.value;
      }
      window.open(href, '_blank').focus();
    }

    let btnGuide = document.getElementById('guide-open');
    btnGuide.onclick = function() {
      let selectGuide = document.getElementById('guide');
      let href = base + "/guides/";
      href = href + selectGuide.value + ".html";
      window.open(href, '_blank').focus();
    }
  }

  loadSettings();
  updateLinks();

  versionSelect.addEventListener('change', () => {
    saveSettings();
    updateLinks();
  });

  modeSelect.addEventListener('change', () => {
    saveSettings();
    updateLinks();
  });

  document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault();
    console.log(document.getElementById('search').value);
    let href = baseUrl + "/search.html?q=" + document.getElementById('search').value ;
    window.open(href, '_blank').focus();
  });
});
