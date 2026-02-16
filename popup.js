const consoleDebug = console.debug;
let startDebug = function() { console.debug = consoleDebug; }
let stopDebug = function() { console.debug = function() {}; }

document.addEventListener('DOMContentLoaded', function () {
  const versionSelect = document.getElementById('version');
  const modeSelect = document.getElementById('mode');
  const linksDiv = document.getElementById('links');
  const debugcheckbox = document.getElementById('debug');
  const milestoneSelect = document.getElementById('milestone');

  function loadSettings() {
    return new Promise((resolve) => {
      browser.storage.local.get(['version', 'mode', 'debug'], function(result) {
        if (result.version) {
          versionSelect.value = result.version;
        } else {
          versionSelect.value = '2.2'; // Default value
        }

        if (result.mode) {
          modeSelect.value = result.mode;
        } else {
          modeSelect.value = 'local'; // Default value
        }

        if (result.debug) {
          debugcheckbox.checked = true;
          startDebug();
        } else {
          debugcheckbox.checked = false;
          stopDebug();
        }

        console.debug("loaded settings:", [result.version, result.mode, result.debug]);
        resolve();
      });
    });
  }

  function saveSettings() {
    browser.storage.local.set({
      version: versionSelect.value,
      mode: modeSelect.value,
      debug: debugcheckbox.checked,
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
    "DE-GDNG": "/legal/de/gdng",
    "IEEE-7012": "/standards/ieee/7012",
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
        if (value.includes('/guides') || value.includes('/mappings')) {
          link.href = `${base}${value}`;
        } else if (value.includes('/meetings')) {
          link.href = `${base}${value}`;
        } else if (value.includes('/search')) {
          link.href = `${baseUrl}/search`;
        } else {
          link.href = `${baseUrl}${value}/`;
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
      let selectModule = document.getElementById('dpv-module');
      console.debug("opening DPV module:" + selectModule.value);
      if (selectModule.value) {
        let href = baseUrl + "/dpv/modules/";
        href = href + selectModule.value + ".html";
        window.open(href, '_blank').focus();
      }
    }

    let btnLegal = document.getElementById('legal-open');
    btnLegal.onclick = function() {
      let selectLegal = document.getElementById('legal');
      let href = baseUrl + "/legal/";
      if (selectLegal.value != 'index') {
        href = href + selectLegal.value + "/";
      }
      window.open(href, '_blank').focus();
    }

    let btnSector = document.getElementById('sector-open');
    btnSector.onclick = function() {
      let selectSector = document.getElementById('sector');
      let href = baseUrl + "/sector/" + selectSector.value;
      window.open(href, '_blank').focus();
    }

    let btnGuide = document.getElementById('guide-open');
    btnGuide.onclick = function() {
      let selectGuide = document.getElementById('guide');
      let href = base + selectGuide.value + ".html";
      window.open(href, '_blank').focus();
    }

    let btnMilestone = document.getElementById('milestone-open');
    btnMilestone.onclick = function() {
      let milestoneSelect = document.getElementById('milestone');
      let href = "https://github.com/w3c/dpv/milestone/" + milestoneSelect.value;
      window.open(href, '_blank').focus();
    }

  }

  document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault();
    console.debug(document.getElementById('search').value);
    let href = baseUrl + "/search.html?query=" + document.getElementById('search').value ;
    window.open(href, '_blank').focus();
  });

  function f_check_version() {
    let version = document.getElementById("version").value;
    let mode = document.getElementById("mode").value;
    if (version.includes("-dev") && mode == "live") {
      let notice = document.getElementById("notice");
      notice.innerHTML = "<span>warning: version is not live</span>"
      notice.style.display = 'block';
    } else {
      notice.style.display = 'none';
    }
    return new Promise((resolve) => {resolve();});
  };

  function changeMilestone() {
    for (let index=0; index<milestoneSelect.options.length; index++) {
      if (milestoneSelect.options[index].text == version.value) {
        milestoneSelect.selectedIndex = index;
        console.debug("milestone changed:", milestoneSelect.options[index].text);
        return;
      }
    }
    console.debug("milestone not changed");
  }

  loadSettings()
    .then(f_check_version)
    .then(updateLinks);

  versionSelect.addEventListener('change', () => {
    f_check_version();
    saveSettings();
    updateLinks();
    changeMilestone();
  });

  modeSelect.addEventListener('change', () => {
    f_check_version();
    saveSettings();
    updateLinks();
  });

  debugcheckbox.addEventListener('change', () => {
    if (debugcheckbox.checked) { startDebug(); }
    else { stopDebug(); }
    saveSettings();
  });

});
