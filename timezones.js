(() => {
  const WORK_START = 7;
  const WORK_END = 18;
  const LUNCH_START_MIN = 12 * 60;
  const LUNCH_END_MIN = 13 * 60 + 30;
  const CELL_MINUTES = 60;
  const MAX_SUGGESTIONS = 60;
  const SNAP_MINUTES = 30;
  const SNAP_SLOTS = (24 * 60) / SNAP_MINUTES;
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Regions, countries and nicknames that have no IANA entry of their own.
  const ALIASES = {
    "America/Los_Angeles": [
      "California",
      "Los Angeles",
      "San Francisco",
      "San Diego",
      "Silicon Valley",
      "Bay Area",
      "Washington State",
      "Seattle",
      "Oregon",
      "Portland",
      "Nevada",
      "Las Vegas",
      "Pacific Time",
      "PST",
      "PDT",
    ],
    "America/Denver": [
      "Colorado",
      "Utah",
      "New Mexico",
      "Salt Lake City",
      "Mountain Time",
      "MST",
      "MDT",
    ],
    "America/Phoenix": ["Arizona"],
    "America/Chicago": [
      "Texas",
      "Illinois",
      "Austin",
      "Dallas",
      "Houston",
      "Minnesota",
      "Missouri",
      "Louisiana",
      "New Orleans",
      "Central Time",
      "CST",
      "CDT",
    ],
    "America/New_York": [
      "New York",
      "NYC",
      "Florida",
      "Miami",
      "Georgia",
      "Atlanta",
      "Massachusetts",
      "Boston",
      "Washington DC",
      "Pennsylvania",
      "Philadelphia",
      "Eastern Time",
      "EST",
      "EDT",
    ],
    "America/Anchorage": ["Alaska"],
    "Pacific/Honolulu": ["Hawaii"],
    "America/Toronto": ["Canada", "Ontario", "Quebec", "Montreal"],
    "America/Vancouver": ["British Columbia"],
    "America/Mexico_City": ["Mexico"],
    "America/Sao_Paulo": ["Brazil", "Brasil", "Rio de Janeiro", "Brasilia"],
    "America/Argentina/Buenos_Aires": ["Argentina"],
    "America/Bogota": ["Colombia"],
    "America/Santiago": ["Chile"],
    "America/Lima": ["Peru"],
    "America/Caracas": ["Venezuela"],
    "Europe/London": [
      "UK",
      "United Kingdom",
      "England",
      "Britain",
      "Great Britain",
      "Scotland",
      "Wales",
      "Edinburgh",
      "Manchester",
      "GMT",
      "BST",
    ],
    "Europe/Dublin": ["Ireland"],
    "Europe/Lisbon": ["Portugal"],
    "Europe/Madrid": ["Spain", "Barcelona"],
    "Europe/Paris": ["France"],
    "Europe/Berlin": ["Germany", "Munich", "Frankfurt", "Hamburg"],
    "Europe/Zurich": ["Switzerland", "Geneva"],
    "Europe/Amsterdam": ["Netherlands", "Holland"],
    "Europe/Brussels": ["Belgium"],
    "Europe/Rome": ["Italy", "Milan"],
    "Europe/Vienna": ["Austria"],
    "Europe/Stockholm": ["Sweden"],
    "Europe/Oslo": ["Norway"],
    "Europe/Copenhagen": ["Denmark"],
    "Europe/Helsinki": ["Finland"],
    "Europe/Warsaw": ["Poland"],
    "Europe/Prague": ["Czech Republic", "Czechia"],
    "Europe/Athens": ["Greece"],
    "Europe/Bucharest": ["Romania"],
    "Europe/Kyiv": ["Ukraine", "Kiev"],
    "Europe/Moscow": ["Russia"],
    "Europe/Istanbul": ["Turkey", "Turkiye"],
    "Asia/Jerusalem": ["Israel", "Tel Aviv"],
    "Asia/Dubai": ["UAE", "United Arab Emirates", "Abu Dhabi"],
    "Asia/Riyadh": ["Saudi Arabia"],
    "Asia/Karachi": ["Pakistan"],
    "Asia/Kolkata": ["India", "Calcutta", "Bangalore", "Bengaluru", "Mumbai", "Delhi", "IST"],
    "Asia/Dhaka": ["Bangladesh"],
    "Asia/Bangkok": ["Thailand"],
    "Asia/Jakarta": ["Indonesia", "Bali"],
    "Asia/Singapore": ["Singapore"],
    "Asia/Manila": ["Philippines"],
    "Asia/Hong_Kong": ["Hong Kong"],
    "Asia/Shanghai": ["China", "Beijing", "Shenzhen"],
    "Asia/Taipei": ["Taiwan"],
    "Asia/Seoul": ["South Korea", "Korea"],
    "Asia/Tokyo": ["Japan", "Osaka", "Kyoto"],
    "Australia/Sydney": ["Australia", "New South Wales", "Canberra"],
    "Australia/Melbourne": ["Victoria"],
    "Australia/Brisbane": ["Queensland"],
    "Australia/Perth": ["Western Australia"],
    "Australia/Adelaide": ["South Australia"],
    "Pacific/Auckland": ["New Zealand"],
    "Africa/Johannesburg": ["South Africa", "Cape Town"],
    "Africa/Lagos": ["Nigeria"],
    "Africa/Nairobi": ["Kenya"],
    "Africa/Cairo": ["Egypt"],
    "Africa/Casablanca": ["Morocco"],
    UTC: ["UTC", "GMT", "Coordinated Universal Time", "Zulu"],
  };

  const FALLBACK_TIMEZONES = [
    "Africa/Cairo",
    "Africa/Johannesburg",
    "Africa/Lagos",
    "Africa/Nairobi",
    "America/Anchorage",
    "America/Argentina/Buenos_Aires",
    "America/Bogota",
    "America/Caracas",
    "America/Chicago",
    "America/Denver",
    "America/Halifax",
    "America/Los_Angeles",
    "America/Mexico_City",
    "America/New_York",
    "America/Phoenix",
    "America/Santiago",
    "America/Sao_Paulo",
    "America/Toronto",
    "America/Vancouver",
    "Asia/Bangkok",
    "Asia/Dhaka",
    "Asia/Dubai",
    "Asia/Hong_Kong",
    "Asia/Jakarta",
    "Asia/Jerusalem",
    "Asia/Karachi",
    "Asia/Kolkata",
    "Asia/Manila",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Atlantic/Azores",
    "Atlantic/Reykjavik",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Amsterdam",
    "Europe/Athens",
    "Europe/Berlin",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Dublin",
    "Europe/Helsinki",
    "Europe/Istanbul",
    "Europe/Lisbon",
    "Europe/London",
    "Europe/Madrid",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Prague",
    "Europe/Rome",
    "Europe/Stockholm",
    "Europe/Warsaw",
    "Pacific/Auckland",
    "Pacific/Honolulu",
    "UTC",
  ];

  const ALL_TIMEZONES = (() => {
    try {
      if (typeof Intl.supportedValuesOf === "function") {
        return Intl.supportedValuesOf("timeZone");
      }
    } catch (_) {
      /* ignore */
    }
    return FALLBACK_TIMEZONES;
  })();

  const HOME_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const els = {
    side: document.getElementById("side"),
    hourRows: document.getElementById("hour-rows"),
    hoursInner: document.getElementById("hours-inner"),
    hoursScroller: document.getElementById("hours-scroller"),
    playhead: document.getElementById("playhead"),
    nowMarker: document.getElementById("now-marker"),
    search: document.getElementById("tz-search"),
    list: document.getElementById("tz-list"),
  };

  const partFormatters = new Map();
  const clockFormatters = new Map();

  let extraZones = readZonesFromUrl();
  let followNow = true;
  let selectedFraction = nowFraction(HOME_TZ);
  let highlightIndex = 0;
  let suggestions = [];

  function cityName(tz) {
    return tz.split("/").pop().replace(/_/g, " ");
  }

  function isValidTimeZone(tz) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
      return true;
    } catch (_) {
      return false;
    }
  }

  function readZonesFromUrl() {
    const raw = new URLSearchParams(location.search).get("tz") || "";
    const seen = new Set();
    const zones = [];
    for (const piece of raw.split(",")) {
      if (!piece) continue;
      let tz;
      try {
        tz = decodeURIComponent(piece.trim());
      } catch (_) {
        tz = piece.trim();
      }
      if (!tz || tz === HOME_TZ || seen.has(tz) || !isValidTimeZone(tz)) continue;
      seen.add(tz);
      zones.push(tz);
    }
    return zones;
  }

  function writeZonesToUrl() {
    const url = new URL(location.href);
    if (extraZones.length) {
      url.searchParams.set("tz", extraZones.join(","));
    } else {
      url.searchParams.delete("tz");
    }
    history.replaceState(null, "", url);
  }

  function getFormatter(tz) {
    let fmt = partFormatters.get(tz);
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        weekday: "short",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      partFormatters.set(tz, fmt);
    }
    return fmt;
  }

  function getClockFormatter(tz) {
    let fmt = clockFormatters.get(tz);
    if (!fmt) {
      fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
      clockFormatters.set(tz, fmt);
    }
    return fmt;
  }

  function getParts(date, tz) {
    const map = {};
    for (const part of getFormatter(tz).formatToParts(date)) {
      if (part.type !== "literal") map[part.type] = part.value;
    }
    return map;
  }

  function lunchSlice(hour, minute) {
    const cellStart = hour * 60 + minute;
    const cellEnd = cellStart + CELL_MINUTES;
    const overlapStart = Math.max(cellStart, LUNCH_START_MIN);
    const overlapEnd = Math.min(cellEnd, LUNCH_END_MIN);
    if (overlapEnd <= overlapStart) return null;
    const left = ((overlapStart - cellStart) / CELL_MINUTES) * 100;
    const width = ((overlapEnd - overlapStart) / CELL_MINUTES) * 100;
    return { left, width, full: left <= 0 && width >= 100 };
  }

  function zonedToUtc(tz, year, month, day, hour = 0, minute = 0, second = 0) {
    const target = Date.UTC(year, month - 1, day, hour, minute, second);
    let utc = target;
    for (let i = 0; i < 4; i++) {
      const p = getParts(new Date(utc), tz);
      const asUtc = Date.UTC(
        Number(p.year),
        Number(p.month) - 1,
        Number(p.day),
        Number(p.hour),
        Number(p.minute),
        Number(p.second)
      );
      utc += target - asUtc;
    }
    return utc;
  }

  function addCivilDay(year, month, day) {
    const dt = new Date(Date.UTC(year, month - 1, day + 1));
    return {
      year: dt.getUTCFullYear(),
      month: dt.getUTCMonth() + 1,
      day: dt.getUTCDate(),
    };
  }

  function homeCivilDate(date) {
    const p = getParts(date, HOME_TZ);
    return {
      year: Number(p.year),
      month: Number(p.month),
      day: Number(p.day),
    };
  }

  function nowFraction(tz, date = new Date()) {
    const p = getParts(date, tz);
    return (
      (Number(p.hour) + Number(p.minute) / 60 + Number(p.second) / 3600) / 24
    );
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  const TZ_COUNTRY = (() => {
    const map = Object.create(null);
    const table = typeof TZ_COUNTRY_TABLE === "string" ? TZ_COUNTRY_TABLE : "";
    for (const line of table.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("Etc/")) continue;
      const splitAt = trimmed.lastIndexOf(" ");
      if (splitAt < 1) continue;
      map[trimmed.slice(0, splitAt)] = trimmed.slice(splitAt + 1);
    }
    return map;
  })();

  const regionNames =
    typeof Intl.DisplayNames === "function"
      ? new Intl.DisplayNames("en", { type: "region" })
      : null;

  function countryName(tz) {
    if (tz === "UTC" || tz === "GMT" || tz.startsWith("Etc/")) return "UTC";
    const code = TZ_COUNTRY[tz];
    if (!code) return "";
    try {
      return regionNames ? regionNames.of(code) : code;
    } catch (_) {
      return code;
    }
  }

  function instantAtFraction(civil, fraction) {
    const t = clamp(fraction, 0, 0.999999) * 24;
    const hour = Math.min(23, Math.floor(t));
    const rem = t - hour;
    const start = zonedToUtc(
      HOME_TZ,
      civil.year,
      civil.month,
      civil.day,
      hour,
      0,
      0
    );
    let end;
    if (hour >= 23) {
      const next = addCivilDay(civil.year, civil.month, civil.day);
      end = zonedToUtc(HOME_TZ, next.year, next.month, next.day, 0, 0, 0);
    } else {
      end = zonedToUtc(
        HOME_TZ,
        civil.year,
        civil.month,
        civil.day,
        hour + 1,
        0,
        0
      );
    }
    return start + rem * (end - start);
  }

  function allZones() {
    return [HOME_TZ, ...extraZones];
  }

  function columnInstants(civil) {
    const instants = [];
    for (let hour = 0; hour < 24; hour++) {
      instants.push(
        zonedToUtc(HOME_TZ, civil.year, civil.month, civil.day, hour, 0, 0)
      );
    }
    return instants;
  }

  function render() {
    const now = new Date();
    const civil = homeCivilDate(now);
    if (followNow) selectedFraction = nowFraction(HOME_TZ, now);
    const selected = new Date(instantAtFraction(civil, selectedFraction));
    const columns = columnInstants(civil);
    const zones = allZones();

    els.side.innerHTML = "";
    els.hourRows.innerHTML = "";

    zones.forEach((tz, index) => {
      const isHome = index === 0;
      const meta = document.createElement("div");
      meta.className = "meta";

      const country = document.createElement("div");
      country.className = "meta-country";
      country.textContent = countryName(tz);

      const name = document.createElement("div");
      name.className = "meta-name";
      name.textContent = cityName(tz);
      if (isHome) {
        const badge = document.createElement("span");
        badge.className = "local-badge";
        badge.textContent = "Local";
        name.appendChild(badge);
      }

      const clock = document.createElement("div");
      clock.className = "meta-clock";
      clock.textContent = getClockFormatter(tz).format(selected);

      if (country.textContent) meta.appendChild(country);
      meta.append(name, clock);

      if (!isHome) {
        const remove = document.createElement("button");
        remove.className = "remove-tz";
        remove.type = "button";
        remove.setAttribute("aria-label", `Remove ${cityName(tz)}`);
        remove.textContent = "×";
        remove.addEventListener("click", () => removeZone(tz));
        meta.appendChild(remove);
      }

      els.side.appendChild(meta);

      const row = document.createElement("div");
      row.className = "hour-row";

      let prevDay = null;
      columns.forEach((ms) => {
        const cellDate = new Date(ms);
        const p = getParts(cellDate, tz);
        const hour = Number(p.hour);
        const dayKey = `${p.year}-${p.month}-${p.day}`;
        const cell = document.createElement("div");
        const work = hour >= WORK_START && hour < WORK_END;
        const lunch = lunchSlice(hour, Number(p.minute));
        if (lunch?.full) {
          cell.className = "hour lunch";
        } else if (lunch) {
          cell.className = `hour ${work ? "work" : "off"} lunch-partial`;
          cell.style.setProperty("--lunch-left", `${lunch.left}%`);
          cell.style.setProperty("--lunch-width", `${lunch.width}%`);
        } else {
          cell.className = `hour ${work ? "work" : "off"}`;
        }

        const num = document.createElement("span");
        num.className = "hour-num";
        num.textContent = String(hour).padStart(2, "0");
        cell.appendChild(num);

        if (prevDay !== dayKey) {
          const chip = document.createElement("span");
          chip.className = "hour-date";
          chip.textContent = `${p.weekday} ${MONTHS[Number(p.month) - 1]} ${Number(p.day)}`;
          cell.appendChild(chip);
          prevDay = dayKey;
        }

        row.appendChild(cell);
      });

      els.hourRows.appendChild(row);
    });

    updateMarkers();
  }

  function updateClocksOnly() {
    const now = new Date();
    const civil = homeCivilDate(now);
    if (followNow) selectedFraction = nowFraction(HOME_TZ, now);
    const selected = new Date(instantAtFraction(civil, selectedFraction));
    const clocks = els.side.querySelectorAll(".meta-clock");
    allZones().forEach((tz, i) => {
      if (clocks[i]) clocks[i].textContent = getClockFormatter(tz).format(selected);
    });
    updateMarkers();
  }

  function updateMarkers() {
    const width = els.hoursInner.offsetWidth || 24 * 52;
    els.playhead.style.left = `${selectedFraction * width}px`;
    const nowF = nowFraction(HOME_TZ);
    els.nowMarker.style.left = `${nowF * width}px`;
    els.nowMarker.style.opacity = followNow ? "0" : "0.7";
  }

  function addZone(tz) {
    if (!tz || tz === HOME_TZ || extraZones.includes(tz) || !isValidTimeZone(tz)) {
      return;
    }
    extraZones.push(tz);
    writeZonesToUrl();
    closeList();
    els.search.value = "";
    render();
  }

  function removeZone(tz) {
    extraZones = extraZones.filter((z) => z !== tz);
    writeZonesToUrl();
    render();
  }

  // Lower rank sorts first. Alias hits rank just below the equivalent
  // city-name hit so typing "Los Angeles" still beats "California".
  function searchIndex(tz, query) {
    const q = query.toLowerCase().trim();
    if (!q) return { rank: 0, alias: null };

    const name = cityName(tz).toLowerCase();
    const id = tz.toLowerCase().replace(/_/g, " ");

    if (name === q || id === q) return { rank: 0, alias: null };

    let best = null;
    for (const alias of ALIASES[tz] || []) {
      const a = alias.toLowerCase();
      let rank = -1;
      if (a === q) rank = 0.5;
      else if (a.startsWith(q)) rank = 1.5;
      else if (a.includes(q)) rank = 3.5;
      if (rank >= 0 && (best === null || rank < best.rank)) {
        best = { rank, alias };
      }
    }

    if (name.startsWith(q)) return { rank: 1, alias: null };
    if (best && best.rank < 2) return best;
    if (id.startsWith(q) || tz.toLowerCase().startsWith(q)) {
      return { rank: 2, alias: null };
    }
    if (name.includes(q) || id.includes(q) || tz.toLowerCase().includes(q)) {
      return { rank: 3, alias: null };
    }
    return best || { rank: -1, alias: null };
  }

  function usedSet() {
    return new Set(allZones());
  }

  function filterZones(query) {
    const used = usedSet();
    const ranked = [];
    for (const tz of ALL_TIMEZONES) {
      if (used.has(tz)) continue;
      const { rank, alias } = searchIndex(tz, query);
      if (rank < 0) continue;
      ranked.push({ tz, rank, alias });
    }
    ranked.sort((a, b) => a.rank - b.rank || a.tz.localeCompare(b.tz));
    return ranked.slice(0, MAX_SUGGESTIONS);
  }

  function renderSuggestions() {
    const query = els.search.value;
    suggestions = filterZones(query);
    highlightIndex = 0;
    els.list.innerHTML = "";

    if (!suggestions.length) {
      const empty = document.createElement("li");
      empty.className = "tz-empty";
      empty.textContent = "No matching timezones";
      els.list.appendChild(empty);
      els.list.hidden = false;
      els.search.setAttribute("aria-expanded", "true");
      return;
    }

    suggestions.forEach(({ tz, alias }, i) => {
      const li = document.createElement("li");
      li.className = "tz-option";
      li.setAttribute("role", "option");
      li.id = `tz-opt-${i}`;
      li.setAttribute("aria-selected", i === highlightIndex ? "true" : "false");
      const name = document.createElement("span");
      name.className = "opt-name";
      name.textContent = alias ? `${cityName(tz)} — ${alias}` : cityName(tz);
      const id = document.createElement("span");
      id.className = "opt-id";
      id.textContent = tz;
      li.append(name, id);
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        addZone(tz);
      });
      els.list.appendChild(li);
    });

    els.list.hidden = false;
    els.search.setAttribute("aria-expanded", "true");
    els.search.setAttribute("aria-activedescendant", "tz-opt-0");
  }

  function updateHighlight() {
    const options = els.list.querySelectorAll(".tz-option");
    options.forEach((el, i) => {
      el.setAttribute("aria-selected", i === highlightIndex ? "true" : "false");
    });
    const active = options[highlightIndex];
    if (active) {
      els.search.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    }
  }

  function closeList() {
    els.list.hidden = true;
    els.search.setAttribute("aria-expanded", "false");
    els.search.removeAttribute("aria-activedescendant");
    suggestions = [];
  }

  function fractionFromClientX(clientX) {
    const rect = els.hoursScroller.getBoundingClientRect();
    const x = clientX - rect.left + els.hoursScroller.scrollLeft;
    return clamp(x / els.hoursInner.offsetWidth, 0, 1);
  }

  // Selections land on :00 or :30 only, so the last slot of the day is 23:30.
  function snapFraction(fraction) {
    const slot = clamp(Math.round(fraction * SNAP_SLOTS), 0, SNAP_SLOTS - 1);
    return slot / SNAP_SLOTS;
  }

  function onPointer(clientX) {
    followNow = false;
    selectedFraction = snapFraction(fractionFromClientX(clientX));
    updateClocksOnly();
  }

  els.search.addEventListener("input", renderSuggestions);
  els.search.addEventListener("focus", renderSuggestions);
  els.search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeList();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (els.list.hidden) renderSuggestions();
      highlightIndex = Math.min(suggestions.length - 1, highlightIndex + 1);
      updateHighlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightIndex = Math.max(0, highlightIndex - 1);
      updateHighlight();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[highlightIndex]) addZone(suggestions[highlightIndex].tz);
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".combobox")) closeList();
  });

  let dragging = false;
  els.hoursScroller.addEventListener("pointerdown", (e) => {
    dragging = true;
    els.hoursScroller.setPointerCapture(e.pointerId);
    onPointer(e.clientX);
  });
  els.hoursScroller.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    onPointer(e.clientX);
  });
  els.hoursScroller.addEventListener("pointerup", () => {
    dragging = false;
  });
  els.hoursScroller.addEventListener("pointercancel", () => {
    dragging = false;
  });

  window.addEventListener("resize", updateMarkers);

  setInterval(() => {
    if (followNow) updateClocksOnly();
    else updateMarkers();
  }, 1000);

  function scrollPlayheadIntoView() {
    const width = els.hoursInner.offsetWidth;
    const target =
      selectedFraction * width - els.hoursScroller.clientWidth / 3;
    els.hoursScroller.scrollLeft = Math.max(0, target);
  }

  render();
  scrollPlayheadIntoView();
})();
