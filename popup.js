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
    "Search": "/search.html"
  };

  function updateLinks() {
    const version = versionSelect.value;
    const mode = modeSelect.value;
    let baseUrl;

    if (mode === 'local') {
      baseUrl = `http://localhost:8000/${version}`;
    } else if (mode === 'dev') {
      baseUrl = `https://dev.dpvcg.org/${version}`;
    } else if (mode === 'live') {
      baseUrl = `https://w3id.org/dpv/${version}`;
    }

    linksDiv.innerHTML = '';

    for (const [key, value] of Object.entries(links)) {
      const link = document.createElement('a');
      link.href = `${baseUrl}${value}`;
      link.textContent = key;
      link.target = '_blank';
      linksDiv.appendChild(link);
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
});
