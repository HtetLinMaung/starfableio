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
  localStorage.setItem("stop_on_scroll_highlight", "true");
  event.preventDefault(); // Prevent the default anchor click behavior

  const section = document.querySelector(id);
  const offset = 55; // Offset to adjust scroll position, change this value as needed

  window.scrollTo({
    top: section.offsetTop - offset, // Adjust scroll position by offset
    behavior: "smooth",
  });
  const nav = document.querySelector("nav.side-nav");

  if (window.innerWidth <= 1330) {
    nav.style.display = "none";
  }

  const prevHeaderId = localStorage.getItem("prev_header_id");
  if (prevHeaderId) {
    document
      .querySelector(`a[href="#${prevHeaderId}"]`)
      .classList.remove("highlight");
  }

  const a = document.querySelector(`a[href="${id}"]`);
  if (a) {
    a.classList.add("highlight");
    localStorage.setItem("prev_header_id", id.replace("#", ""));
  }
  setTimeout(() => {
    localStorage.setItem("stop_on_scroll_highlight", "false");
  }, 1000);
}

function hightlightOnScrollPosition(headers) {
  for (const header of headers) {
    const position = header.getBoundingClientRect().top;
    if (position >= 0 && position <= 60) {
      const prevHeaderId = localStorage.getItem("prev_header_id");
      if (prevHeaderId) {
        document
          .querySelector(`a[href="#${prevHeaderId}"]`)
          .classList.remove("highlight");
      }

      const a = document.querySelector(`a[href="#${header.id}"]`);
      if (a) {
        a.classList.add("highlight");
        localStorage.setItem("prev_header_id", header.id);
      }
    }
    if (position > window.innerHeight) {
      document
        .querySelector(`a[href="#${header.id}"]`)
        .classList.remove("highlight");
    }
  }
}

document.addEventListener("scroll", () => {
  const shouldStop = localStorage.getItem("stop_on_scroll_highlight");
  if (shouldStop != "true") {
    hightlightOnScrollPosition(document.querySelectorAll("h2"));
    hightlightOnScrollPosition(document.querySelectorAll("h3"));
  }
});
