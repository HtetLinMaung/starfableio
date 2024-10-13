// When the window loads, apply highlighting
document.addEventListener("DOMContentLoaded", (event) => {
  hljs.highlightAll();
});

const aTags = document.querySelectorAll("nav.side-nav a");
for (const aTag of aTags) {
  aTag.addEventListener("click", () => {
    const svgUp = document.querySelector(".menu-toggle-svg");
    svgUp.style.transform = "rotate(180deg)";
  });
}

function toggleMenu() {
  const svgUp = document.querySelector(".menu-toggle-svg");
  const nav = document.querySelector("nav.side-nav");
  if (nav.style.display === "block") {
    nav.style.display = "none";
    svgUp.style.transform = "rotate(180deg)";
  } else {
    nav.style.display = "block";
    svgUp.style.transform = "rotate(0deg)";
  }
}

function scrollToSection(event, id) {
  event.preventDefault(); // Prevent the default anchor click behavior

  const section = document.querySelector(id);
  const offset = 55; // Offset to adjust scroll position, change this value as needed

  window.scrollTo({
    top: section.offsetTop - offset, // Adjust scroll position by offset
    behavior: "smooth",
  });
  const nav = document.querySelector("nav.side-nav");
  // console.log(window.innerWidth);
  if (window.innerWidth <= 1330) {
    const svgUp = document.querySelector(".up-svg");
    nav.style.display = "none";
    svgUp.style.transform = "rotate(180deg)";
  }
}
