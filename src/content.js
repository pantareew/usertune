// Apply settings whenever a message is received
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "applySettings") {
    chrome.storage.local.get("settings", function (data) {
      if (data.settings) {
        const settings = data.settings;
        resetStyles(); // Reset any previous styles

        if (settings.dyslexia) {
          isDyslexiaSelected = true; //Flag for dyslexia settings
          applyDyslexiaStyles();
        }
        //apply color blindness setting based on the selected type
        if (settings.colorBlindness && settings.colorBlindness !== "none") {
          appendSVG();
          changeColors(settings.colorBlindness);
        } else {
          changeColors(null);
        }
        if (settings.lowVision && settings.diopterValue !== null) {
          isLVSelected = true; //Flag for lv settings
          applyLowVisionStyles(settings.diopterValue); // Handle low vision based on diopter value
        }
        if (settings.elderly) {
          isElderlySelected = true; //Flag for elderly settings
          applyElderlySettings(); // Apply elderly settings
        }
        if (settings.fontStyle) applyFontStyle(settings.fontStyle);
        if (settings.fontSize) applyFontSize(settings.fontSize);
        if (settings.zoomLevel) applyZoom(settings.zoomLevel);
        if (settings.highContrast) adjustContrast(settings.highContrast);
        if (settings.darkMode) adjustDarkMode(settings.darkMode);
      }
    });
  }
  // Other event listeners for font size, zoom, etc.
  if (request.action === "increaseFontSize") adjustFontSize(1);
  if (request.action === "decreaseFontSize") adjustFontSize(-1);
  if (request.action === "resetFontSize") resetFontSize();
  if (request.action === "zoomInPage") applyZoom((zoomLevel += 0.1));
  if (request.action === "zoomOutPage")
    applyZoom((zoomLevel = Math.max(zoomLevel - 0.1, 0.1)));
  if (request.action === "resetZoom") applyZoom((zoomLevel = 1));
  if (request.action === "toggleHighContrast") adjustContrast(request.enabled);
  if (request.action === "toggleDarkMode") adjustDarkMode(request.enabled);
});

const fontPath = chrome.runtime.getURL("fonts/OpenDyslexic-Regular.woff");
const fontFace = new FontFace("OpenDyslexic", `url(${fontPath})`);
const customCursor =
  "url('https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/mouse-pointer.svg'), auto";

/**
 * MAIN FUNCTIONALITIES CURRENT SETTINGS TAB
 */
function applyElderlySettings() {
  document.body.style.cursor = customCursor;

  // Apply contrast and non-glare background
  document.body.style.backgroundColor = "#e0e0e0"; // Light non-glare background for reduced eye strain
  document.body.style.color = "#000000"; // Black text for high contrast
  document.body.style.fontSize = "22px"; // Slightly larger font size for readability

  // Apply font: Gill Sans or similar, with proper spacing and simple styling
  document.body.style.fontFamily = "Gill Sans, Arial, sans-serif";
  document.body.style.lineHeight = "1.8"; // Increased line height for readability
  document.body.style.letterSpacing = "1.5px"; // Slight letter spacing for readability

  // Ensure all text elements are readable
  const textElements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, a, span, label, input, button"
  );
  textElements.forEach((el) => {
    el.style.fontStretch = "normal"; // Ensure characters have an acceptable width-to-height ratio
    el.style.fontWeight = "normal"; // Ensure text stroke width-to-height ratio is readable
    el.style.color = "#000000"; // Apply high contrast for elderly accessibility
    el.style.cursor = customCursor; // Apply the custom cursor
  });

  // Style checkboxes for better visibility
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.style.width = "20px"; // Increase checkbox size
    checkbox.style.height = "20px"; // Make the checkbox larger for easier interaction
    checkbox.style.border = "2px solid #000"; // High contrast border for visibility
    checkbox.style.cursor = "pointer"; // Make sure it's clear the checkbox is interactive
  });

  // High contrast for icons (e.g., FontAwesome, SVGs)
  const icons = document.querySelectorAll("svg, .fa, .fas, .far, .fab");
  icons.forEach((icon) => {
    icon.style.filter = "contrast(50%)"; // Boost contrast for icons
    icon.style.color = "#000000"; // Ensure icons are black for maximum contrast
  });

  // High contrast and color for anchor (<a>) links
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = "#0055aa"; // Blue link color for contrast against light background
    link.style.textDecoration = "underline"; // Underline links for clear visibility
    link.style.fontWeight = "bold"; // Increase font weight for visibility
    link.addEventListener("mouseover", () => {
      link.style.color = "#002266"; // Darker color on hover for high contrast
    });
    link.addEventListener("mouseout", () => {
      link.style.color = "#0055aa"; // Reset to original color when mouse leaves
    });
  });

  // Improve visibility for images and other media by avoiding over-darkening and focusing on clarity
  const media = document.querySelectorAll("img, svg, .fa, .fas, .far, .fab");
  media.forEach((item) => {
    item.style.filter = "brightness(1) contrast(50%)"; // Brighten and increase contrast for better visibility
  });

  // Form controls (buttons, inputs) are also easy to see and interact with
  const formControls = document.querySelectorAll(
    "input, button, select, textarea"
  );
  formControls.forEach((control) => {
    control.style.border = "2px solid #000000"; // High contrast border
    control.style.color = "#000000"; // High contrast text for form elements
  });
}

function applyLowVisionStyles(diopterValue) {
  /* Features:
    Line spacing, font size according to diopter value, font weight increase, font family changed,
    increased letter spacing, big cursor
    */
  document.body.style.lineHeight = "1.8"; // Adjust line height for readability
  let calculatedFontSize;
  const customCursor =
    "url('https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/mouse-pointer.svg'), auto";
  document.body.style.cursor = customCursor;

  // Determine font size based on diopter value
  if (diopterValue >= 0 && diopterValue <= 1.5) {
    calculatedFontSize = "16px";
  } else if (diopterValue > 1.5 && diopterValue <= 3.0) {
    calculatedFontSize = "14px";
  } else if (diopterValue > 3.0 && diopterValue <= 5.0) {
    calculatedFontSize = "12px";
  } else if (diopterValue > 5.0 && diopterValue <= 7.5) {
    calculatedFontSize = "10px";
  } else if (diopterValue > 7.5) {
    calculatedFontSize = "8px";
  } else if (diopterValue >= -1.0) {
    calculatedFontSize = "16px";
  } else if (diopterValue >= -2.5) {
    calculatedFontSize = "18px";
  } else if (diopterValue >= -5.0) {
    calculatedFontSize = "20px";
  } else if (diopterValue >= -7.5) {
    calculatedFontSize = "24px";
  } else if (diopterValue >= -10.0) {
    calculatedFontSize = "30px";
  } else {
    calculatedFontSize = "8px";
  }

  if (!isDyslexiaSelected) {
    // If dyslexia is not selected the fonts, letter-spacings etc will be according to the low vision settings

    let elements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, li, a, span"
    );
    elements.forEach((el) => {
      el.style.fontFamily = "Arial, Verdana, sans-serif";
      el.style.lineHeight = "1.5";
      el.style.letterSpacing = "1.5px";
      el.style.fontSize = calculatedFontSize;
      el.style.fontWeight = "bold";
      el.style.cursor = customCursor;
    });

    document.body.style.fontFamily = "Arial, Verdana, sans-serif";
    document.body.style.lineHeight = "1.5";
    document.body.style.letterSpacing = "1.5px";
    document.body.style.fontSize = calculatedFontSize;
  }
  // If dyslexia is selected the fonts, letter-spacings etc will be according to the dyslexia settings
  let elements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, a, span"
  );
  elements.forEach((el) => {
    el.style.fontSize = calculatedFontSize;
    el.style.cursor = customCursor;
  });
  document.body.style.fontSize = calculatedFontSize;

  let links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = "#3399ff";
    link.addEventListener("mouseover", () => {
      link.style.color = "#0066cc";
    });
    link.addEventListener("mouseout", () => {
      link.style.color = "#3399ff";
    });
    link.style.cursor = customCursor;
  });
}

function appendSVG() {
  const svg = `
        <svg id="colorBlindSVG" xmlns="http://www.w3.org/2000/svg" style="display:none;">
            <defs>
                <filter id="protanopia">
                    <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0"/>
                </filter>
                <filter id="deuteranopia">
                    <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0"/>
                </filter>
                <filter id="tritanopia">
                    <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0"/>
                </filter>
                <filter id="achromatopsia">
                    <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0"/>
                </filter>
            </defs>
        </svg>`;
  //0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0 [new]
  //0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0 [previous]
  document.body.insertAdjacentHTML("beforeend", svg);
}

function changeColors(type) {
  if (type) {
    document.body.style.filter = `url(#${type})`;
  } else {
    document.body.style.filter = "none";
  }
}

//colorBlidness
function applyColorBlindnessMode(mode) {
  appendSVG(); // Append SVG filters

  switch (mode) {
    case "redgreen":
      changeColors("protanopia");
      break;
    case "blueyellow":
      changeColors("tritanopia");
      break;
    case "mono":
      changeColors("achromatopsia");
      break;
    case "none":
    default:
      changeColors(null);
      break;
  }
}

function resetStyles() {
  // Reset all styles applied to the body
  isDyslexiaSelected = false;
  isLVSelected = false;
  isElderlySelected = false;
  document.body.style.filter = "";
  document.body.style.fontFamily = "";
  document.body.style.lineHeight = "";
  document.body.style.letterSpacing = "";
  document.body.style.fontSize = "";
  document.body.style.color = "";
  document.body.style.backgroundColor = "";
  document.body.style.zoom = "1";
  document.body.style.cursor = "";

  // Reset zoom scaling
  document.body.style.transform = "";
  document.body.style.transformOrigin = "";

  // Remove tunnel vision overlay if it exists
  let overlay = document.getElementById("tunnel-vision-overlay");
  if (overlay) {
    overlay.remove();
  }

  // Remove any additional overlays such as blurry vision or low vision
  let lvisoverlay = document.getElementById("blurry-vision-overlay");
  if (lvisoverlay) {
    lvisoverlay.remove();
  }

  // Remove event listeners for tunnel vision effect
  document.onmousemove = null;
  document.onmouseleave = null;

  // Reset all element styles for text, links, form controls, and checkboxes
  const elements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, a, span, label, input, button"
  );
  elements.forEach((el) => {
    el.style.fontFamily = "";
    el.style.lineHeight = "";
    el.style.letterSpacing = "";
    el.style.fontSize = "";
    el.style.fontWeight = "";
    el.style.color = "";
    el.style.backgroundColor = "";
    el.style.cursor = "";
    el.style.fontStretch = "";
  });

  // Reset the style for input fields, including checkboxes, buttons, etc.
  const formControls = document.querySelectorAll(
    "input, button, select, textarea"
  );
  formControls.forEach((control) => {
    control.style.fontSize = "";
    control.style.padding = "";
    control.style.border = "";
    control.style.backgroundColor = "";
    control.style.color = "";
    control.style.cursor = "";
  });

  // Reset the checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.style.width = "";
    checkbox.style.height = "";
    checkbox.style.border = "";
    checkbox.style.backgroundColor = "";
    checkbox.style.cursor = "";
  });

  // Reset all link elements' styles
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = "";
    link.style.textDecoration = "";
    link.style.fontWeight = "";
    link.style.backgroundColor = "";
    link.style.cursor = "";
  });

  // Reset media elements such as images and icons
  const media = document.querySelectorAll("img, svg, .fa, .fas, .far, .fab");
  media.forEach((item) => {
    item.style.filter = "";
    item.style.color = "";
  });
}

function applyDyslexiaStyles() {
  // Log for debugging
  console.log("Applying Dyslexia styles...");

  /**const fontPath = chrome.runtime.getURL('fonts/OpenDyslexic-Regular.woff');
  const fontFace = new FontFace('OpenDyslexic', `url(${fontPath})`);
  moved this to the beginning
  **/
  //isDyslexiaSelected = true //Flag for dyslexia settings

  fontFace
    .load()
    .then(function (loadedFont) {
      document.fonts.add(loadedFont);
      document.body.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
      document.body.style.lineHeight = "2";
      document.body.style.letterSpacing = "0.1em";
      if (isLVSelected == false && isElderlySelected == false)
        document.body.style.fontSize = "18px";
      /** The above line is here to check if low vision settings are alos in place
       * The diopter value 0 indicates that the low vision settings are not in place
       * So the font size of dyslexia will be applied
       */

      const elements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, li, a, span"
      );
      elements.forEach((el) => {
        el.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
        el.style.lineHeight = "2";
        el.style.letterSpacing = "0.1em";
        if (isLVSelected == false && isElderlySelected == false)
          el.style.fontSize = "18px";
      });
    })
    .catch(function (error) {
      console.error("Error loading the font: ", error);
    });
}

// Add this function to modify settings
// Font style
function applyFontStyle(fontStyle) {
  let fontFamily;
  switch (fontStyle) {
    case "serif":
      fontFamily = "serif";
      break;
    case "sansSerif":
      fontFamily = "Arial, Helvetica, sans-serif";
      break;
    case "monospace":
      fontFamily = "monospace";
      break;
    case "cursive":
      fontFamily = "cursive";
      break;
    case "fantasy":
      fontFamily = "fantasy";
      break;
    default:
      fontFamily = "";
  }

  let elements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, a, span"
  );
  elements.forEach((el) => {
    el.style.fontFamily = fontFamily;
  });

  document.body.style.fontFamily = fontFamily;
}

// Function to increase or decrease font size
function adjustFontSize(change) {
  const elements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, a, span"
  );
  elements.forEach((el) => {
    const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
    el.style.fontSize = currentSize + change + "px"; // Apply new font size
  });
}

function resetFontSize() {
  let elements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, li, a, span"
  );
  elements.forEach((el) => {
    el.style.fontSize = ""; // Reset to original font size
  });
}

let zoomLevel = 1; // Initial zoom level
function applyZoom(level) {
  document.body.style.transform = `scale(${level})`;
  document.body.style.transformOrigin = "0 0"; // Set the origin for scaling
}

//high contrast function
function adjustContrast(enabled) {
  if (enabled) {
    document.querySelectorAll("*").forEach((el) => {
      el.style.color = "#ffff00"; // Set text color
      el.style.backgroundColor = "#0000ff"; // Set background color
      el.style.zIndex = "1"; // Ensure z-index is set properly
    });
  } else {
    document.querySelectorAll("*").forEach((el) => {
      el.style.removeProperty("color");
      el.style.removeProperty("background-color");
    });
  }
}

// Function to apply dark mode
function adjustDarkMode(enabled) {
  if (enabled) {
    document.querySelectorAll("body *").forEach((el) => {
      el.style.backgroundColor = "#1e1e1e";
      const computedColor = window.getComputedStyle(el).color;

      if (computedColor !== "rgb(255, 255, 255)") {
        el.style.color = "#f6f6f6"; // Set text color for dark mode
      }
    });
  } else {
    document.querySelectorAll("body *").forEach((el) => {
      el.style.removeProperty("color");
      el.style.removeProperty("background-color");
    });
  }
}
