/* Home page: typing effect + animated counters */
(function () {
  "use strict";

  var roles = ["MCA Student", "Aspiring Software Developer", "Full-Stack Web Learner", "Problem Solver"];
  var el = document.getElementById("typed");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (el) {
    if (reduce) {
      el.textContent = roles[0];
    } else {
      var r = 0, c = 0, deleting = false;
      (function tick() {
        var word = roles[r];
        el.textContent = word.substring(0, c);
        var delay = deleting ? 45 : 90;
        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
        c += deleting ? -1 : 1;
        setTimeout(tick, delay);
      })();
    }
  }

  document.querySelectorAll("[data-count]").forEach(function (n) {
    var target = parseFloat(n.getAttribute("data-count"));
    var dec = parseInt(n.getAttribute("data-decimals") || "0", 10);
    if (reduce) { n.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      n.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
})();
