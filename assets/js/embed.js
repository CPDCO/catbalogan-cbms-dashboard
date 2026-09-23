/* Shared Tableau embed builder.
   One copy for all embed pages: the detection and sizing rules used to be
   duplicated in six files and had already drifted apart once. */
(function () {
  "use strict";

  // Narrowest width the desktop dashboards lay out at without clipping.
  // Below this the viz keeps its full width and the container scrolls.
  var DESIGN_WIDTH = 1200;

  function isPhone() {
    // Phones only. Android tablets carry "Android" but not "Mobile", and
    // iPads report as Macintosh, so both fall through to the desktop layout.
    var ua = navigator.userAgent;
    return /iPhone|iPod|IEMobile|Windows Phone/i.test(ua) ||
           (/Android/i.test(ua) && /Mobile/i.test(ua)) ||
           window.innerWidth < 600;
  }

  /* A viz wider than the screen can only be panned from Tableau's own
     scrollbar strip along its bottom edge — the iframe swallows every other
     touch. These portal-owned controls sit outside the iframe, so they work
     from anywhere on the page. */
  function addPanControls(container) {
    var bar = document.createElement("div");
    bar.className = "pan-bar";
    bar.hidden = true;
    bar.innerHTML =
      '<button type="button" class="pan-btn" data-dir="-1" aria-label="Scroll dashboard left">&larr;</button>' +
      '<span class="pan-hint">Dashboard is wider than the screen &mdash; scroll sideways to see the rest</span>' +
      '<button type="button" class="pan-btn" data-dir="1" aria-label="Scroll dashboard right">&rarr;</button>';
    container.parentNode.insertBefore(bar, container);

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".pan-btn");
      if (!btn) return;
      var step = container.clientWidth * 0.8 * Number(btn.getAttribute("data-dir"));
      container.scrollBy({ left: step, behavior: "smooth" });
    });

    function sync() {
      var overflows = container.scrollWidth - container.clientWidth > 4;
      bar.hidden = !overflows;
      if (overflows) {
        var max = container.scrollWidth - container.clientWidth;
        bar.querySelector('[data-dir="-1"]').disabled = container.scrollLeft <= 1;
        bar.querySelector('[data-dir="1"]').disabled = container.scrollLeft >= max - 1;
      }
    }

    container.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    // The iframe settles its size a moment after load.
    setTimeout(sync, 400);
    return sync;
  }

  /* opts: { url, title } */
  window.buildViz = function (opts) {
    var container = document.getElementById("vizContainer");
    if (!container) return;

    var phone = isPhone();
    if (phone) container.classList.add("viz-phone");

    var iframe = document.createElement("iframe");
    iframe.className = "viz-frame";
    iframe.setAttribute("title", opts.title);
    iframe.setAttribute("src",
      opts.url + "?:embed=y&:showVizHome=no&:device=" + (phone ? "phone" : "desktop"));
    container.appendChild(iframe);

    // The phone layout is built to fit, so it never needs panning.
    if (!phone) {
      container.style.setProperty("--viz-min-width", DESIGN_WIDTH + "px");
      var sync = addPanControls(container);
      iframe.addEventListener("load", sync);
    }
  };
})();
