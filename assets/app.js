(() => {
  const KEYS = {
    products: "cmj_products",
    services: "cmj_services",
    projectEntries: "cmj_project_entries",
    slides: "cmj_slides",
    videos: "cmj_videos",
    auth: "cmj_logged_in"
  };

  const contact = {
    address: "L2 B2 Fidela Herrera Subd., Brgy. Santol, Tanza, Cavite",
    email: "cmjalcorp@gmail.com",
    phone: "+63 917 541 1920",
    facebook: "https://www.facebook.com/cmjcorp"
  };

  const defaults = {
    products: [
      {
        id: uid(),
        name: "Aluminum Composite Panel (4x8)",
        description: "Durable ACP sheet for exterior and interior cladding applications.",
        specs: "1220mm x 4880mm, panel thickness: 3mm/4mm/5mm, skin thickness: 0.12-0.21mm",
        image: placeholder("ACP Panel")
      },
      {
        id: uid(),
        name: "Polycarbonate Sheet",
        description: "Lightweight roofing material with good UV resistance and long life.",
        specs: "Available in clear/bronze, common thicknesses 6mm to 10mm",
        image: placeholder("Polycarbonate")
      }
    ],
    services: [
      {
        id: uid(),
        name: "Aluminum Composite Panel Trading",
        description: "Supply of quality ACP materials for residential, commercial, and institutional use."
      },
      {
        id: uid(),
        name: "ACP Installation",
        description: "On-site installation with proper framing, alignment, and finishing standards."
      },
      {
        id: uid(),
        name: "Polycarbonate Installation",
        description: "Fabrication and installation for roofing, awnings, and enclosure applications."
      },
      {
        id: uid(),
        name: "PVC Wall Installation",
        description: "Interior wall paneling solutions for functional and modern spaces."
      },
      {
        id: uid(),
        name: "Welding and Main Frame Works",
        description: "Structural support and custom frame works for signage and façade systems."
      },
      {
        id: uid(),
        name: "Signage Fabrication",
        description: "Design support and production of project signage and branding installations."
      }
    ],
    projectEntries: {
      finished: [
        { id: uid(), name: "Coffee Shop at SM Batangas" },
        { id: uid(), name: "Commercial Building at Molino, Bacoor" },
        { id: uid(), name: "Bureau of Fire - National Headquarters" },
        { id: uid(), name: "Rosario Cavite Gymnasium" },
        { id: uid(), name: "Bataan Port - Limay" },
        { id: uid(), name: "Main Regional DPWH - La Union" }
      ],
      ongoing: [
        { id: uid(), name: "Healthstar Medical Center - GMA Cavite" },
        { id: uid(), name: "Camp John Jay Hotel (Baguio)" },
        { id: uid(), name: "North-South Commuter Railway (NSCR) stations" },
        { id: uid(), name: "Tempered Glass 10mm Installation" }
      ]
    },
    slides: {
      home: [
        { id: uid(), src: placeholder("Upcoming Activity 1", "#0d3b66"), caption: "Upcoming event planning and client consultation." },
        { id: uid(), src: placeholder("Upcoming Activity 2", "#1d4e89"), caption: "On-site progress checks and quality inspection." }
      ],
      projects: [
        { id: uid(), src: placeholder("Finished Projects", "#234e70"), caption: "Selected finished construction and façade works." },
        { id: uid(), src: placeholder("Ongoing Projects", "#3d5a80"), caption: "Current site implementation and welding works." }
      ],
      team: [
        { id: uid(), src: placeholder("CMJ Team", "#0f4c81"), caption: "Meet our dedicated installation and project support team." }
      ],
      products: [
        { id: uid(), src: placeholder("Featured Products", "#3d5a80"), caption: "High-quality construction products for your project needs." }
      ]
    },
    videos: [
      { id: uid(), title: "Company Introduction", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ]
  };

  const page = document.body.dataset.page || "";

  document.addEventListener("DOMContentLoaded", () => {
    seed();
    setFooter();
    setActiveNav();
    setAuthNav();

    if (page === "home") initHome();
    if (page === "about") initAbout();
    if (page === "products") initProducts();
    if (page === "services") initServices();
    if (page === "projects") initProjects();
    if (page === "videos") initVideos();
    if (page === "login") initLogin();
    if (page === "admin") initAdmin();
  });

  function uid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  function placeholder(text, bg = "#3d5a80") {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'><rect fill='${bg}' width='100%' height='100%'/><text x='50%' y='50%' font-size='50' fill='white' text-anchor='middle' font-family='Arial'>${text}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function read(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      firebase.database().ref(key).set(value).catch((err) => {
        console.error('[CMJ Firebase] write failed for', key, ':', err.message);
      });
    }
  }

  function seed() {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      // Firebase is available: sync each key from the database.
      // If the database node is empty (first-ever run), write the defaults.
      // Otherwise pull the live value into localStorage so the first render is correct.
      const db = firebase.database();
      const pairs = [
        [KEYS.products,       defaults.products],
        [KEYS.services,       defaults.services],
        [KEYS.projectEntries, defaults.projectEntries],
        [KEYS.slides,         defaults.slides],
        [KEYS.videos,         defaults.videos],
      ];
      pairs.forEach(([key, val]) => {
        db.ref(key).once('value', (snap) => {
          if (snap.exists()) {
            localStorage.setItem(key, JSON.stringify(snap.val()));
          } else {
            db.ref(key).set(val).catch(() => {});
            localStorage.setItem(key, JSON.stringify(val));
          }
        });
      });
    } else {
      // No Firebase yet — fall back to localStorage seeding.
      if (!localStorage.getItem(KEYS.products))       write(KEYS.products,       defaults.products);
      if (!localStorage.getItem(KEYS.services))       write(KEYS.services,       defaults.services);
      if (!localStorage.getItem(KEYS.projectEntries)) write(KEYS.projectEntries, defaults.projectEntries);
      if (!localStorage.getItem(KEYS.slides))         write(KEYS.slides,         defaults.slides);
      if (!localStorage.getItem(KEYS.videos))         write(KEYS.videos,         defaults.videos);
    }
  }

  function setFooter() {
    document.querySelectorAll("[data-contact='address']").forEach((el) => (el.textContent = contact.address));
    document.querySelectorAll("[data-contact='email']").forEach((el) => (el.textContent = contact.email));
    document.querySelectorAll("[data-contact='phone']").forEach((el) => (el.textContent = contact.phone));
    document.querySelectorAll("[data-contact='facebook']").forEach((el) => {
      el.setAttribute("href", contact.facebook);
      el.textContent = contact.facebook;
    });
  }

  function setActiveNav() {
    document.querySelectorAll(".nav-links a[data-link]").forEach((a) => {
      if (a.dataset.link === page) a.classList.add("active");
    });
  }

  function setAuthNav() {
    const loggedIn = sessionStorage.getItem(KEYS.auth) === "1";
    document.querySelectorAll("[data-role='admin-link']").forEach((el) => el.classList.toggle("hidden", !loggedIn));
    document.querySelectorAll("[data-role='login-link']").forEach((el) => el.classList.toggle("hidden", loggedIn));
    document.querySelectorAll("[data-role='logout-link']").forEach((el) => {
      el.classList.toggle("hidden", !loggedIn);
      el.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem(KEYS.auth);
        window.location.href = "index.html";
      });
    });
  }

  function mountSlideshow(holderId, items, autoMs = 4000) {
    const holder = document.getElementById(holderId);
    if (!holder) return;

    const slides = items && items.length ? items : [{ id: uid(), src: placeholder("No images"), caption: "No slideshow images uploaded yet." }];
    let index = 0;

    holder.innerHTML = `
      <div class="slides-track"></div>
      <div class="slide-controls">
        <button type="button" data-action="prev">&#10094;</button>
        <button type="button" data-action="next">&#10095;</button>
      </div>
    `;

    const track = holder.querySelector(".slides-track");
    track.innerHTML = slides
      .map(
        (s) => `
      <article class="slide-item" style="background-image:url('${normalizeImageUrl(s.src)}')">
        <div class="slide-caption">${escapeHtml(s.caption || "")}</div>
      </article>`
      )
      .join("");

    const draw = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const prev = holder.querySelector("[data-action='prev']");
    const next = holder.querySelector("[data-action='next']");
    prev.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      draw();
    });
    next.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      draw();
    });

    if (slides.length > 1) {
      setInterval(() => {
        index = (index + 1) % slides.length;
        draw();
      }, autoMs);
    }
  }

  function initHome() {
    const localSlides = read(KEYS.slides, defaults.slides);
    mountSlideshow('homeSlideshow', localSlides.home);

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      firebase.database().ref(KEYS.slides).once('value', (snap) => {
        if (!snap.exists()) return;
        const fbSlides = snap.val();
        localStorage.setItem(KEYS.slides, JSON.stringify(fbSlides));
        mountSlideshow('homeSlideshow', fbSlides.home);
      });
    }
  }

  function initAbout() {
    const localSlides = read(KEYS.slides, defaults.slides);
    mountSlideshow('teamSlideshow', localSlides.team);

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      firebase.database().ref(KEYS.slides).once('value', (snap) => {
        if (!snap.exists()) return;
        const fbSlides = snap.val();
        localStorage.setItem(KEYS.slides, JSON.stringify(fbSlides));
        mountSlideshow('teamSlideshow', fbSlides.team);
      });
    }
  }

  function initProjects() {
    const finishedList = document.getElementById('finishedProjectsList');
    const ongoingList = document.getElementById('ongoingProjectsList');

    const renderList = (items, emptyText) =>
      items.length
        ? items.map((item) => `<li>${escapeHtml(item.name)}</li>`).join('')
        : `<li class='notice'>${escapeHtml(emptyText)}</li>`;

    const renderProjects = (entries) => {
      if (!finishedList || !ongoingList) return;
      finishedList.innerHTML = renderList(entries.finished || [], 'No finished projects configured yet.');
      ongoingList.innerHTML  = renderList(entries.ongoing  || [], 'No ongoing projects configured yet.');
    };

    // Render immediately from cache
    const localSlides  = read(KEYS.slides,         defaults.slides);
    const localEntries = read(KEYS.projectEntries, defaults.projectEntries);
    mountSlideshow('projectSlideshow', localSlides.projects);
    renderProjects(localEntries);

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      const db = firebase.database();
      db.ref(KEYS.slides).once('value', (snap) => {
        if (!snap.exists()) return;
        const fbSlides = snap.val();
        localStorage.setItem(KEYS.slides, JSON.stringify(fbSlides));
        mountSlideshow('projectSlideshow', fbSlides.projects);
      });
      db.ref(KEYS.projectEntries).on('value', (snap) => {
        if (!snap.exists()) return;
        const entries = snap.val();
        localStorage.setItem(KEYS.projectEntries, JSON.stringify(entries));
        renderProjects(entries);
      }, (err) => console.error('[CMJ Firebase] projectEntries:', err.message));
    }
  }

  function initProducts() {
    const wrap = document.getElementById('productsGrid');

    const renderProducts = (products) => {
      if (!wrap) return;
      wrap.innerHTML = products
        .map((p) => `
      <article class="card product-card">
        <img src="${normalizeImageUrl(p.image)}" alt="${escapeHtml(p.name)}" />
        <span class="badge">Product</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <p><strong>Dimensions / Specs:</strong> ${escapeHtml(p.specs)}</p>
      </article>`)
        .join('');
    };

    // Render immediately from cache
    const localSlides   = read(KEYS.slides,   defaults.slides);
    const localProducts = read(KEYS.products, defaults.products);
    mountSlideshow('productSlideshow', localSlides.products);
    renderProducts(localProducts);

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      const db = firebase.database();
      db.ref(KEYS.slides).once('value', (snap) => {
        if (!snap.exists()) return;
        const fbSlides = snap.val();
        localStorage.setItem(KEYS.slides, JSON.stringify(fbSlides));
        mountSlideshow('productSlideshow', fbSlides.products);
      });
      db.ref(KEYS.products).on('value', (snap) => {
        if (!snap.exists()) return;
        const fbProducts = snap.val();
        localStorage.setItem(KEYS.products, JSON.stringify(fbProducts));
        renderProducts(fbProducts);
      }, (err) => console.error('[CMJ Firebase] products:', err.message));
    }
  }

  function initServices() {
    const wrap = document.getElementById('servicesGrid');

    const renderServices = (services) => {
      if (!wrap) return;
      if (!services.length) {
        wrap.innerHTML = "<p class='notice'>No services configured yet.</p>";
        return;
      }
      wrap.innerHTML = services
        .map((service) => `
      <article class="card">
        <span class="badge">Service</span>
        <h3>${escapeHtml(service.name)}</h3>
        <p>${escapeHtml(service.description)}</p>
      </article>`)
        .join('');
    };

    renderServices(read(KEYS.services, defaults.services));

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      firebase.database().ref(KEYS.services).on('value', (snap) => {
        if (!snap.exists()) return;
        const fbServices = snap.val();
        localStorage.setItem(KEYS.services, JSON.stringify(fbServices));
        renderServices(fbServices);
      }, (err) => console.error('[CMJ Firebase] services:', err.message));
    }
  }

  function initVideos() {
    const wrap = document.getElementById('videoGrid');

    const renderVideos = (videos) => {
      if (!wrap) return;
      if (!videos.length) {
        wrap.innerHTML = "<p class='notice'>No videos configured yet.</p>";
        return;
      }
      const isLocalFile = window.location.protocol === 'file:';
      wrap.innerHTML = videos
        .map((v) => {
          const embedSrc = toYoutubeEmbed(v.url);
          const watchUrl = toYoutubeWatchUrl(v.url);
          return isLocalFile
            ? `
          <article class="card embed-wrap">
            <h3>${escapeHtml(v.title || 'Video')}</h3>
            <p class='notice'>YouTube preview is unavailable when the site is opened directly from local files. Upload the site to a domain or run it from a local web server to enable embedded playback.</p>
            <p><a href="${escapeHtml(watchUrl)}" target="_blank" rel="noopener">Watch video on YouTube</a></p>
          </article>`
            : `
          <article class="card embed-wrap">
            <h3>${escapeHtml(v.title || 'Video')}</h3>
            <iframe src="${embedSrc}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="${escapeHtml(v.title || 'Video')}"></iframe>
            <p><a href="${escapeHtml(watchUrl)}" target="_blank" rel="noopener">Watch video on YouTube</a></p>
          </article>`;
        })
        .join('');
    };

    renderVideos(read(KEYS.videos, defaults.videos));

    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      firebase.database().ref(KEYS.videos).on('value', (snap) => {
        if (!snap.exists()) return;
        const fbVideos = snap.val();
        localStorage.setItem(KEYS.videos, JSON.stringify(fbVideos));
        renderVideos(fbVideos);
      }, (err) => console.error('[CMJ Firebase] videos:', err.message));
    }
  }

  function initLogin() {
    const form = document.getElementById("loginForm");
    const msg = document.getElementById("loginMsg");
    if (!form) return;

    const fallbackCreds = [{ username: "admin", password: "cmj1234" }];

    const normalizeCreds = (raw) => {
      if (Array.isArray(raw)) return raw;
      if (raw && Array.isArray(raw.credentials)) return raw.credentials;
      if (raw && typeof raw === "object" && raw.username && raw.password) return [raw];
      return [];
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "Checking credentials...";
      const username = (form.username.value || "").trim();
      const password = form.password.value || "";

      let creds = fallbackCreds;
      let usingFallback = false;

      try {
        const response = await fetch("credentials.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Cannot read credentials file.");
        const fileCreds = normalizeCreds(await response.json());
        if (fileCreds.length) {
          creds = fileCreds;
        } else {
          usingFallback = true;
        }
      } catch {
        usingFallback = true;
      }

      const isValid = creds.some((c) => username === c.username && password === c.password);
      if (isValid) {
        sessionStorage.setItem(KEYS.auth, "1");
        window.location.href = "admin.html";
        return;
      }

      msg.textContent = usingFallback
        ? "Invalid username or password. Fallback account is admin / cmj1234."
        : "Invalid username or password.";
    });
  }

  function initAdmin() {
    if (sessionStorage.getItem(KEYS.auth) !== "1") {
      window.location.href = "login.html";
      return;
    }

    initProductAdmin();
    initServiceAdmin();
    initProjectEntryAdmin();
    initSlideshowAdmin();
    initVideoAdmin();
  }

  function initProductAdmin() {
    const form = document.getElementById("productForm");
    const list = document.getElementById("productList");
    const msg = document.getElementById("productMsg");
    if (!form || !list) return;

    const render = () => {
      const items = read(KEYS.products, defaults.products);
      list.innerHTML = items
        .map(
          (item) => `
         
              <strong>${escapeHtml(item.name)}</strong>
              <p class='notice'>${escapeHtml(item.specs)}</p>
            </div>
            <div class='action-row'>
              <button type='button' data-edit='${item.id}' class='outline'>Edit</button>
              <button type='button' data-delete='${item.id}' class='danger'>Delete</button>
            </div>
          </div>`
        )
        .join("");

      list.querySelectorAll("[data-delete]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.products, defaults.products).filter((p) => p.id !== btn.dataset.delete);
          write(KEYS.products, current);
          render();
          msg.textContent = "Product deleted.";
        });
      });

      list.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const found = read(KEYS.products, defaults.products).find((p) => p.id === btn.dataset.edit);
          if (!found) return;
          form.productId.value = found.id;
          form.name.value = found.name;
          form.description.value = found.description;
          form.specs.value = found.specs;
          form.imageUrl.value = found.image || "";
          msg.textContent = "Editing product. Update image URL only if you want to replace it.";
        });
      });
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const items = read(KEYS.products, defaults.products);
      const id = form.productId.value.trim();
      const imageUrl = (form.imageUrl.value || "").trim();

      if (!id && !imageUrl) {
        msg.textContent = "Image URL is required for new product.";
        return;
      }

      if (id) {
        const idx = items.findIndex((p) => p.id === id);
        if (idx > -1) {
          items[idx] = {
            ...items[idx],
            name: form.name.value.trim(),
            description: form.description.value.trim(),
            specs: form.specs.value.trim(),
            image: imageUrl || items[idx].image
          };
          msg.textContent = "Product updated.";
        }
      } else {
        items.push({
          id: uid(),
          name: form.name.value.trim(),
          description: form.description.value.trim(),
          specs: form.specs.value.trim(),
          image: imageUrl
        });
        msg.textContent = "Product added.";
      }

      write(KEYS.products, items);
      form.reset();
      form.productId.value = "";
      render();
    });

    render();
  }

  function initServiceAdmin() {
    const form = document.getElementById("serviceForm");
    const list = document.getElementById("serviceList");
    const msg = document.getElementById("serviceMsg");
    if (!form || !list) return;

    const render = () => {
      const items = read(KEYS.services, defaults.services);
      list.innerHTML = items
        .map(
          (item) => `
         
              <strong>${escapeHtml(item.name)}</strong>
              <p class='notice'>${escapeHtml(item.description)}</p>
            </div>
            <div class='action-row'>
              <button type='button' data-edit='${item.id}' class='outline'>Edit</button>
              <button type='button' data-delete='${item.id}' class='danger'>Delete</button>
            </div>
          </div>`
        )
        .join("");

      list.querySelectorAll("[data-delete]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.services, defaults.services).filter((service) => service.id !== btn.dataset.delete);
          write(KEYS.services, current);
          render();
          msg.textContent = "Service deleted.";
        });
      });

      list.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const found = read(KEYS.services, defaults.services).find((service) => service.id === btn.dataset.edit);
          if (!found) return;
          form.serviceId.value = found.id;
          form.name.value = found.name;
          form.description.value = found.description;
          msg.textContent = "Editing service.";
        });
      });
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const items = read(KEYS.services, defaults.services);
      const id = form.serviceId.value.trim();

      if (id) {
        const idx = items.findIndex((service) => service.id === id);
        if (idx > -1) {
          items[idx] = {
            ...items[idx],
            name: form.name.value.trim(),
            description: form.description.value.trim()
          };
          msg.textContent = "Service updated.";
        }
      } else {
        items.push({
          id: uid(),
          name: form.name.value.trim(),
          description: form.description.value.trim()
        });
        msg.textContent = "Service added.";
      }

      write(KEYS.services, items);
      form.reset();
      form.serviceId.value = "";
      render();
    });

    render();
  }

  function initProjectEntryAdmin() {
    const form = document.getElementById("projectEntryForm");
    const list = document.getElementById("projectEntryList");
    const msg = document.getElementById("projectEntryMsg");
    if (!form || !list) return;

    const render = () => {
      const entries = read(KEYS.projectEntries, defaults.projectEntries);
      const finished = entries.finished || [];
      const ongoing = entries.ongoing || [];
      const allItems = [
        ...finished.map((item) => ({ ...item, type: "finished", label: "Finished Project" })),
        ...ongoing.map((item) => ({ ...item, type: "ongoing", label: "Ongoing Project" }))
      ];

      list.innerHTML = allItems
        .map(
          (item) => `
         
              <strong>${escapeHtml(item.name)}</strong>
              <p class='notice'>${escapeHtml(item.label)}</p>
            </div>
            <div class='action-row'>
              <button type='button' data-edit='${item.id}' data-type='${item.type}' class='outline'>Edit</button>
              <button type='button' data-delete='${item.id}' data-type='${item.type}' class='danger'>Delete</button>
            </div>
          </div>`
        )
        .join("");

      if (!allItems.length) {
        list.innerHTML = "<p class='notice'>No project entries configured yet.</p>";
      }

      list.querySelectorAll("[data-delete]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.projectEntries, defaults.projectEntries);
          current[btn.dataset.type] = (current[btn.dataset.type] || []).filter((item) => item.id !== btn.dataset.delete);
          write(KEYS.projectEntries, current);
          render();
          msg.textContent = "Project entry deleted.";
        });
      });

      list.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.projectEntries, defaults.projectEntries);
          const found = (current[btn.dataset.type] || []).find((item) => item.id === btn.dataset.edit);
          if (!found) return;
          form.projectEntryId.value = found.id;
          form.type.value = btn.dataset.type;
          form.name.value = found.name;
          msg.textContent = "Editing project entry.";
        });
      });
    };

form.addEventListener("submit", (e) => {
      e.preventDefault();
      const current = read(KEYS.projectEntries, defaults.projectEntries);
      const id = form.projectEntryId.value.trim();
      const type = form.type.value;
      const name = form.name.value.trim();

      if (id) {
        let updated = false;
        ["finished", "ongoing"].forEach((group) => {
          current[group] = (current[group] || []).map((item) => {
            if (item.id !== id) return item;
            updated = true;
            return group === type ? { ...item, name } : null;
          }).filter(Boolean);
        });

        if (!updated) {
          current[type] = current[type] || [];
          current[type].push({ id, name });
        }
        msg.textContent = "Project entry updated.";
      } else {
        current[type] = current[type] || [];
        current[type].push({ id: uid(), name });
        msg.textContent = "Project entry added.";
      }

      write(KEYS.projectEntries, current);
      form.reset();
      form.projectEntryId.value = "";
      form.type.value = "finished";
      render();
    });

    render();
  }

  function initSlideshowAdmin() {
    const form = document.getElementById("slideForm");
    const list = document.getElementById("slideList");
    const msg = document.getElementById("slideMsg");
    if (!form || !list) return;

    const render = () => {
      const slides = read(KEYS.slides, defaults.slides);
      const type = form.slideType.value;
      const items = slides[type] || [];

      list.innerHTML = items
        .map(
          (s) => `

              <strong>${escapeHtml(s.caption || "No caption")}</strong>
              <p class='notice'>Section: ${escapeHtml(type)}</p>
            </div>
            <div class='action-row'>
              <button type='button' class='outline' data-replace='${s.id}'>Replace URL</button>
              <button type='button' class='danger' data-delete='${s.id}'>Delete</button>
            </div>
          </div>`
        )
        .join("");

      list.querySelectorAll("[data-delete]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.slides, defaults.slides);
          current[type] = (current[type] || []).filter((x) => x.id !== btn.dataset.delete);
          write(KEYS.slides, current);
          render();
          msg.textContent = "Slide deleted.";
        });
      });

      list.querySelectorAll("[data-replace]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.slides, defaults.slides);
          const idx = (current[type] || []).findIndex((x) => x.id === btn.dataset.replace);
          if (idx < 0) return;

          const nextUrl = window.prompt("Enter new image URL:", current[type][idx].src || "");
          if (!nextUrl) return;

          current[type][idx].src = nextUrl.trim();
          write(KEYS.slides, current);
          render();
          msg.textContent = "Slide URL replaced.";
        });
      });
    };

    form.slideType.addEventListener("change", render);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const section = form.slideType.value;
      const caption = form.slideCaption.value.trim() || "New slideshow image";
      const raw = (form.slideImageUrls.value || "").trim();
      const urls = raw
        .split(/\r?\n|,/)
        .map((x) => x.trim())
        .filter(Boolean);

      if (!urls.length) {
        msg.textContent = "Please enter at least one image URL.";
        return;
      }

      const current = read(KEYS.slides, defaults.slides);
      if (!current[section]) current[section] = [];
      urls.forEach((src, i) => {
        current[section].push({
          id: uid(),
          src,
          caption: urls.length === 1 ? caption : `${caption} ${i + 1}`
        });
      });

      write(KEYS.slides, current);
      form.reset();
      form.slideType.value = section;
      render();
      msg.textContent = "Slideshow URL(s) added.";
    });

    render();
  }

  function initVideoAdmin() {
    const form = document.getElementById("videoForm");
    const list = document.getElementById("videoList");
    const msg = document.getElementById("videoMsg");
    if (!form || !list) return;

    const render = () => {
      const videos = read(KEYS.videos, defaults.videos);
      list.innerHTML = videos
        .map(
          (v) => `
         
              <strong>${escapeHtml(v.title)}</strong>
              <p class='notice'>${escapeHtml(v.url)}</p>
            </div>
            <div class='action-row'>
              <button type='button' class='outline' data-edit='${v.id}'>Edit</button>
              <button type='button' class='danger' data-delete='${v.id}'>Delete</button>
            </div>
          </div>`
        )
        .join("");

      list.querySelectorAll("[data-delete]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = read(KEYS.videos, defaults.videos).filter((v) => v.id !== btn.dataset.delete);
          write(KEYS.videos, current);
          render();
          msg.textContent = "Video link deleted.";
        });
      });

      list.querySelectorAll("[data-edit]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const found = read(KEYS.videos, defaults.videos).find((v) => v.id === btn.dataset.edit);
          if (!found) return;
          form.videoId.value = found.id;
          form.title.value = found.title;
          form.url.value = found.url;
          msg.textContent = "Editing YouTube link.";
        });
      });
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = form.videoId.value.trim();
      const videos = read(KEYS.videos, defaults.videos);
      const payload = {
        id: id || uid(),
        title: form.title.value.trim() || "Company Video",
        url: form.url.value.trim()
      };

      if (!payload.url) {
        msg.textContent = "Please enter a valid URL.";
        return;
      }

      if (id) {
        const idx = videos.findIndex((v) => v.id === id);
        if (idx > -1) videos[idx] = payload;
        msg.textContent = "Video link updated.";
      } else {
        videos.push(payload);
        msg.textContent = "Video link added.";
      }

      write(KEYS.videos, videos);
      form.reset();
      form.videoId.value = "";
      render();
    });

    render();
  }

  function toYoutubeEmbed(url) {
    const id = getYoutubeVideoId(url);
    if (!id) return url;

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1"
    });

    if (window.location.protocol !== "file:" && window.location.origin) {
      params.set("origin", window.location.origin);
    }

    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  function toYoutubeWatchUrl(url) {
    const id = getYoutubeVideoId(url);
    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  }

  function getYoutubeVideoId(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.replace("/", "") || "";
      }
      if (parsed.pathname.includes("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
      }
      return parsed.searchParams.get("v") || "";
    } catch {
      return "";
    }
  }

  function normalizeImageUrl(url) {
    const value = String(url || "").trim();
    if (!value) return value;

    try {
      const parsed = new URL(value);
      if (parsed.hostname === "github.com" && parsed.pathname.includes("/blob/")) {
        return value
          .replace("https://github.com/", "https://raw.githubusercontent.com/")
          .replace("/blob/", "/");
      }
      return value;
    } catch {
      return value;
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
