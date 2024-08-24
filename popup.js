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
      mode: modeSelect.value
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
    "LEGAL": "/legal",
    "LEGAL-EU": "/legal/eu",
    "EU-GDPR": "/legal/eu/gdpr",
    "EU-DGA": "/legal/eu/dga",
    "EU-AIAct": "/legal/eu/aiact",
    "EU-NIS2": "/legal/eu/nis2",
    "EU-Rights": "/legal/eu/rights",
    "Guides": "/guides",
    "Guide DPV-OWL": "/guides/dpv-owl.html",
    "Guide Consent 27560": "/guides/consent-27560.html",
    "Guide Notice 29184": "/guides/notice-29184.html",    
    "Search": "/search.html",
    "Minutes": "/meetings"
  };

  function updateLinks() {
    const version = versionSelect.value;
    const mode = modeSelect.value;
    let baseUrl, base;

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

    // for (const [key, value] of Object.entries(links)) {
    //   const link = document.createElement('a');
    //   link.href = `${baseUrl}${value}`;
    //   link.textContent = key;
    //   link.target = '_blank';
    //   linksDiv.appendChild(link);
    // }

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
        link.style.flex = '1 1 25%';
        // link.style.boxSizing = 'border-box';
        link.style.padding = '1px';
        link.style.margin = "2px";
        link.style.border = "1px solid black";
        link.style.textAlign = 'center';
        link.style.backgroundColor = 'white';
        link.style.color = 'black';
        link.style.textDecoration = 'none';
        link.style.borderRadius = '5px';
        link.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        link.style.fontWeight = 'bold';
        link.style.transition = 'box-shadow 0.3s ease';

        link.addEventListener('mouseover', () => {
            link.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)';
        });

        link.addEventListener('mouseout', () => {
            link.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        });

        rowDiv.appendChild(link);
    }

    linksDiv.appendChild(rowDiv);
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
});
