/* Contact page: validates the form and opens the visitor's email app */
(function () {
  "use strict";
  var TO = "sreyakrishna26@gmail.com";
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = ["name", "email", "message"].map(function (id) { return document.getElementById(id); });
    var ok = true;
    fields.forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value.trim()));
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });

    if (!ok) {
      status.textContent = "Please fill in all fields with valid details.";
      status.className = "status error";
      return;
    }

    var subject = "Portfolio enquiry from " + fields[0].value.trim();
    var body = fields[2].value.trim() + "\n\n— " + fields[0].value.trim() + " (" + fields[1].value.trim() + ")";
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Opening your email app to send the message...";
    status.className = "status";
    form.reset();
  });
})();
