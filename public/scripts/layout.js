const mmSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1_11)">
<mask id="mask0_1_11" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
<path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"/>
</mask>
<g mask="url(#mask0_1_11)">
<path d="M0 10.4375L15.8625 9.23126L32 10.4375V21.5625L16.0688 23.5813L0 21.5625V10.4375Z" fill="#6DA544"/>
<path d="M0 0H32V10.4375H0V0Z" fill="#FFDA44"/>
<path d="M0 21.5625H32V32H0V21.5625Z" fill="#D80027"/>
<path d="M26.9688 13.5312H18.5938L16 5.5625L13.4125 13.5375H5.03751L11.8063 18.4625L9.21876 26.4375L16 21.5625L22.7813 26.4375L20.1938 18.4625L26.9688 13.5312Z" fill="#EEEEEE"/>
</g>
</g>
<defs>
<clipPath id="clip0_1_11">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const ukSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1_3)">
                <mask id="mask0_1_3" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_1_3)">
                <path d="M0 0L0.5 1.375L0 2.8125V4.25L2 7.625L0 11V13L2 16L0 19V21L2 24.375L0 27.75V32L1.375 31.5L2.8125 32H4.25L7.625 30L11 32H13L16 30L19 32H21L24.375 30L27.75 32H32L31.5 30.625L32 29.1875V27.75L30 24.375L32 21V19L30 16L32 13V11L30 7.625L32 4.25V0L30.625 0.5L29.1875 0H27.75L24.375 2L21 0H19L16 2L13 0H11L7.625 2L4.25 0H0Z" fill="#EEEEEE"/>
                <path d="M21 0V6.75L27.75 0H21ZM32 4.25L25.25 11H32V4.25ZM0 11H6.75L0 4.25V11ZM4.25 0L11 6.75V0H4.25ZM11 32V25.25L4.25 32H11ZM0 27.75L6.75 21H0V27.75ZM32 21H25.25L32 27.75V21ZM27.75 32L21 25.25V32H27.75Z" fill="#0052B4"/>
                <path d="M0 0V2.8125L8.1875 11H11L0 0ZM13 0V13H0V19H13V32H19V19H32V13H19V0H13ZM29.1875 0L21 8.1875V11L32 0H29.1875ZM11 21L0 32H2.8125L11 23.8125V21ZM21 21L32 32V29.1875L23.8125 21H21Z" fill="#D80027"/>
                </g>
                </g>
                <defs>
                <clipPath id="clip0_1_3">
                <rect width="32" height="32" fill="white"/>
                </clipPath>
                </defs>
                </svg>`;

function changeMMPage() {
  const href = window.location.href;
  if (href.includes("/blogs")) {
    window.location.href = href.replace("/blogs", "/blogs/mm");
  } else if (href.includes("/tutorials")) {
    window.location.href = href.replace("/tutorials", "/tutorials/mm");
  }
}

function changeENGPage() {
  window.location.href = window.location.href.replace("/mm", "");
}

function changeLanguage(lang) {
  if (lang == "mm") {
    localStorage.setItem("starfable_language", lang);
    svgSpan.innerHTML = mmSvg;
    changeMMPage();
  } else {
    localStorage.setItem("starfable_language", lang);
    svgSpan.innerHTML = ukSvg;
    changeENGPage();
  }
}

function determineLanguageByTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = timezone === "Asia/Yangon" ? "mm" : "uk";

  console.log(`default language: ${language}`);
  return language;
  // document.getElementById('greeting').innerText = language === 'mm' ? 'မင်္ဂလာပါ' : 'Welcome';
}

// Call the function on load

const svgSpan = document.querySelector("#svg-span");
svgSpan.addEventListener("click", () => {
  const language = localStorage.getItem("starfable_language");
  console.log(`current language: ${language}`);
  localStorage.setItem("starfable_language_changed", "yes");
  if (language == "uk") {
    changeLanguage("mm");
  } else {
    changeLanguage("uk");
  }
});
if (localStorage.getItem("starfable_language_changed") != "yes") {
  const language = determineLanguageByTimezone();
  localStorage.setItem("starfable_language", language);
  if (language == "uk") {
    svgSpan.innerHTML = ukSvg;
  } else {
    svgSpan.innerHTML = mmSvg;
  }
  const currentHref = window.location.href;
  if (currentHref.includes("/mm") && language == "uk") {
    changeENGPage();
  } else if (!currentHref.includes("/mm") && language == "mm") {
    changeMMPage();
  }
} else {
  const language = localStorage.getItem("starfable_language");
  if (language == "mm") {
    svgSpan.innerHTML = mmSvg;
  } else {
    svgSpan.innerHTML = ukSvg;
  }
}

const currentHref = window.location.href;
if (currentHref.includes("/mm")) {
  svgSpan.innerHTML = mmSvg;
  localStorage.setItem("starfable_language", "mm");
} else {
  svgSpan.innerHTML = ukSvg;
  localStorage.setItem("starfable_language", "uk");
}
//  localStorage.setItem("starfable_language_changed", 'no');
