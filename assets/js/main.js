/* Nav active state — marks the pill matching the current page.
   Two pills point at dashboard.html and differ only by ?view=, so the view
   is compared as well; matching on the path alone would light up both. */
(function setActiveNavPill() {
  var here = window.location.pathname.split('/').pop() || 'index.html';
  var view = new URLSearchParams(window.location.search).get('view') || '';

  document.querySelectorAll('.nav-pill').forEach(function (pill) {
    var href = pill.getAttribute('href').split('#')[0].split('?');
    var page = href[0];
    var pillView = href[1] ? (new URLSearchParams(href[1]).get('view') || '') : '';

    if (page === here && pillView === view) pill.classList.add('active');
  });
})();
