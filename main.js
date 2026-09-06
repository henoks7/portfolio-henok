// ===== Mobile menu toggle =====
// Opens/closes the nav menu on small screens when the menu icon is clicked
const menuIcon = document.getElementById("menu-icon");
const navLinksContainer = document.querySelector(".links");

if (menuIcon && navLinksContainer) {
  menuIcon.addEventListener("click", function () {
    navLinksContainer.classList.toggle("open")});
  };


// ===== Highlight the active nav link automatically =====
// Looks at the current page's filename and adds the "active" class
// to the matching link, so you don't have to edit it by hand on every page
const navLinks = document.querySelectorAll(".links a");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

navLinks.forEach(function (link) {
  const linkPage = link.getAttribute("href").replace("./", "");

  if (linkPage === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});
