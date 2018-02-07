// Nav buttons

const filterCheckedValues = arrayLike => [...arrayLike].filter(({checked}) => checked).map(({value}) => value)

const SECTIONS = ['prefarea', 'talkgroups', 'speccont', 'channels', 'generate', 'comments'];
const navi_buttons = Array.from(document.getElementsByClassName("navbutton"));
navi_buttons.forEach(button => {
  button.addEventListener("click", () => {
    navi_buttons.forEach(btn => {
      btn.classList.remove('is-active')
    });
    button.classList.toggle('is-active');
    SECTIONS.forEach(section => {
      document.getElementById(section).classList.add('is-hidden');
    });
    document.getElementById(button.getAttribute('section')).classList.toggle('is-hidden');
  });
});

const channels_sections = ['repeaters', 'services', 'pmr', 'kab'];

const chann_sect_buttons = Array.from(document.getElementsByClassName("chan_section_btn"));
chann_sect_buttons.forEach(button => {
  button.addEventListener("click",() => {
    chann_sect_buttons.forEach(btn => {
      btn.classList.remove('is-active');
    });
    button.classList.toggle('is-active');
    channels_sections.forEach(function (section) {
      const x = document.getElementById('chan_tab_' + section);
      if (x) {
        x.classList.add('is-hidden');
      }
    });
    document.getElementById('chan_tab_' + guzik.getAttribute('section')).classList.toggle('is-hidden');
  });
});


// Prefix & area section
const prefix_checkboxes = [...document.getElementsByClassName('prefix_selection')];
const area_checkboxes = [...document.getElementsByClassName('area_selection')];
const prefix_sel_all = document.getElementById('prefix_all');
const area_sel_all = document.getElementById('area_all');

[[prefix_sel_all, prefix_checkboxes], [area_sel_all, area_checkboxes]].forEach(([button ,set]) => {
  button.addEventListener("click", () => {
    set.forEach( checkbox => {
      checkbox.checked = button.checked;
    });
  });
});

// Channels
const services_group_checkboxes = [...document.getElementsByClassName('service_checkbox_all')];
const service_checkboxes = [...document.getElementsByClassName('service_checkbox')];
const apmr_checkboxes = [...document.getElementsByClassName('apmr_checkbox')];
const dpmr_checkboxes = [...document.getElementsByClassName('dpmr_checkbox')];

services_group_checkboxes.forEach(function (services_group_ckbox) {
  const service = services_group_ckbox.getAttribute('service');
  services_group_ckbox.addEventListener("click", function () {
    const trigger = services_group_ckbox;
    console.log('klik');
    service_checkboxes.filter(ckbox => ckbox.getAttribute('service') == service).forEach(ckbox => {
      ckbox.checked = trigger.checked;
    });
  });
});

const apmr_all_cb = document.getElementById('apmr_sel_all');
apmr_all_cb.addEventListener("click", function () {
  apmr_checkboxes.forEach(ckbox => ckbox.checked = apmr_all_cb.checked);
});

const dpmr_all_cb = document.getElementById('dpmr_sel_all');
dpmr_all_cb.addEventListener("click", function () {
  dpmr_checkboxes.forEach(ckbox => ckbox.checked = dpmr_all_cb.checked);
});

// Error Message
const error_modal = document.getElementById("error");
const error_dismiss = document.getElementById("alert_close");
const error_msg = document.getElementById("error_message");

error_dismiss.addEventListener("click", function () {
  error_modal.classList.toggle("is-active");
});

// About
const about_modal = document.getElementById("about");
const about_dismiss = document.getElementById("about_close");

about_dismiss.addEventListener("click", function () {
  about_modal.classList.toggle("is-active");
});
document.getElementById('about_btn').addEventListener("click", function () {
  about_modal.classList.toggle('is-active')
});


// Storage
const priocals = document.getElementById("priocals");
const priosave = document.getElementById("priosave");
const ignocals = document.getElementById("ignocals");
const ignosave = document.getElementById("ignosave");
if (typeof(Storage) !== "undefined") {
  priocals.value = localStorage.getItem("gd77.priocals");
  if (priocals.value !== "") {
    priosave.checked = true;
  }
  ignocals.value = localStorage.getItem("gd77.ignocals");
  if (ignocals.value !== "") {
    ignosave.checked = true;
  }
}


//Generate!
const send = document.getElementById("submit");
send.addEventListener("click", () => {
  const tgs = document.getElementsByClassName('tg_checkbox');
  const speccontacts = document.getElementsByClassName('speccontact');
  const rep_bands = document.getElementsByClassName('band_checkbox');
  const rep_modes = document.getElementsByClassName('mode_checkbox');
  const rep_areas = document.getElementsByClassName('rep_area_checkbox');

  const payload = {
    contacts: {
      sp_prefix: filterCheckedValues(prefix_checkboxes),
      sp_area: filterCheckedValues(area_checkboxes),
      tgs: filterCheckedValues(tgs),
      adds: filterCheckedValues(speccontacts),
      prio: priocals.value,
      igno: ignocals.value
    },

    channels: {
      repeaters: {
        bands: filterCheckedValues(rep_bands),
        modes: filterCheckedValues(rep_modes),
        areas: filterCheckedValues(rep_areas),
        digi_first: document.getElementsByClassName('digi_first_checkbox')[0].checked,
        digi_double: document.getElementsByClassName('double_digi_checkbox')[0].checked
      },
      services: [],
      apmr: [],
      dpmr: []
    }
  };

  const service_checkboxes = [...document.getElementsByClassName('service_checkbox')];
  const service_categories = [...document.getElementsByClassName('service_checkbox_all')].map(cb => cb.getAttribute('service'));

  const services = service_categories.reduce((services, service_name) => {
    services[service_name] = service_checkboxes.filter(cb => cb.getAttribute('service') === service_name && cb.checked).map(cb => cb.value)
    return services
  }, {})

  payload.channels.services = services;
  payload.channels.apmr = filterCheckedValues(document.getElementsByClassName('apmr_checkbox'));
  payload.channels.dpmr = filterCheckedValues(document.getElementsByClassName('dpmr_checkbox'));

  console.log(payload);
  // save prio list for later
  if (typeof(Storage) !== "undefined") {
    if (priosave.checked) {
      localStorage.setItem("gd77.priocals", priocals.value);
    }
    if (ignosave.checked) {
      localStorage.setItem("gd77.ignocals", ignocals.value);
    }
  } else {
    if (priosave.checked || ignosave.checked) {
      error_msg.innerText = "Sorry kolego/koleżanko. Twoja przeglądarka nie pozwala zapisać twojej listy kontaktów priorytetowych.";
      sel_toggle(error_modal, "is-active");
    }
  }
  window.open("/csv/" + msgpack.encode(payload).toString('hex'));
});