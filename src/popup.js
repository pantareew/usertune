//low vision toggle
//signup-lv
document.getElementById("lowVisionNeed").addEventListener("click", function () {
  toggleLowVisionSlider(
    "lowVisionNeed",
    "lowVisionNeedSlider",
    "diopterNeedValue",
    "diopterNeedOutput"
  );
});
//setting-lv
document.getElementById("lowVision").addEventListener("click", function () {
  toggleLowVisionSlider(
    "lowVision",
    "lowVisionSlider",
    "diopterValue",
    "diopterOutput"
  );
});
function toggleLowVisionSlider(checkboxId, sliderId, sliderValueId, outputId) {
  const slider = document.getElementById(sliderId);
  const checkbox = document.getElementById(checkboxId);

  if (checkbox && slider) {
    slider.style.display = checkbox.checked ? "block" : "none";
    if (checkbox.checked) {
      updateDiopterOutput(sliderValueId, outputId);
    }
  }
}
//diopter value
function updateDiopterOutput(sliderId, outputId) {
  console.log("updateDiopterOutput called with:", sliderId, outputId);
  const diopterSlider = document.getElementById(sliderId);
  const diopterOutput = document.getElementById(outputId);

  if (diopterSlider && diopterOutput) {
    diopterSlider.addEventListener("input", function () {
      diopterOutput.textContent = diopterSlider.value;
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // For Signup Area
  updateDiopterOutput("diopterNeedValue", "diopterNeedOutput");

  // For Settings Area
  updateDiopterOutput("diopterValue", "diopterOutput");
});

//login - signup
const navLinks = document.getElementById("navLinks");
const signupForm = document.getElementById("signupForm");
const errorSignup = document.getElementById("errorSignup");
//login function
async function loginUser(email, password) {
  const errorMessage = document.getElementById("errorMessage");
  const loginForm = document.getElementById("login-signup");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();
    //login success
    if (data.success) {
      localStorage.setItem("authToken", data.token);
      console.log("Login successful");
      errorMessage.style.display = "none";
      loginForm.style.display = "none";
      navLinks.style.display = "none";
      //display settings
      const settings = document.getElementById("settings");
      if (settings) {
        //add welcome message to user
        const welcomeMessage = document.createElement("h2");
        welcomeMessage.textContent = `Welcome ${data.first_name}!`;
        settings.prepend(welcomeMessage);

        //apply existing setting, retrieving from db
        if (data.needs) {
          console.log("Needs data:", data.needs);
          const needCheckboxes = {
            dyslexia: "dyslexia",
            elderly: "elderly",
            low_vision: "lowVision",
          };
          for (const [need, elementId] of Object.entries(needCheckboxes)) {
            const checkbox = document.getElementById(elementId);
            if (checkbox && data.needs[need]) {
              checkbox.checked = true; // Check the checkbox if the need is true
            }
          }
          // Handle color blindness dropdown
          if (data.needs.color_blindness) {
            const colorBlindnessSelect =
              document.getElementById("colorBlindness");
            if (colorBlindnessSelect) {
              colorBlindnessSelect.value = data.needs.color_blindness; // Set the dropdown value
            }
          }
          //handle low vision
          if (data.needs.low_vision) {
            document.getElementById("lowVision").checked = true;
            document.getElementById("diopterValue").value =
              data.needs.diopter_value;
            toggleLowVisionSlider(
              "lowVision",
              "lowVisionSlider",
              "diopterValue",
              "diopterOutput"
            );
          }
        }

        settings.style.display = "block";
      }
    } else {
      console.error("Login failed:", data.message);
      errorMessage.textContent = data.message; //set error message
      errorMessage.style.display = "block"; //show error message
    }
  } catch (error) {
    console.error("Error during login:", error);
    errorMessage.textContent = "Error occurred. Please try again!";
    errorMessage.style.display = "block";
  }
}
//signup
document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      first_name: document.getElementById("fName").value,
      last_name: document.getElementById("lName").value,
      email: document.getElementById("signupEmail").value,
      password: document.getElementById("signupPassword").value,
      colorBlindness: document.getElementById("colorBlindnessNeed").value,
      elderly: document.getElementById("elderlyNeed").checked,
      dyslexia: document.getElementById("dyslexiaNeed").checked,
      lowVision: document.getElementById("lowVisionNeed").checked,
      diopterValue: document.getElementById("diopterNeedValue").value,
    };

    fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Signup successful:", data);
          errorSignup.style.display = "none";
          signupForm.style.display = "none";
          navLinks.style.display = "none";

          // Login the user automatically after signup
          loginUser(formData.email, formData.password);
        } else {
          console.error("Signup failed:", data.message);
          errorSignup.textContent = data.message; //set error message
          errorSignup.style.display = "block"; //show error message
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        errorSignup.textContent = "Error occurred. Please try again!";
        errorSignup.style.display = "block";
      });
  });
//login event
document.addEventListener("DOMContentLoaded", function () {
  //get login form
  const login = document.getElementById("loginForm");
  //get email & pwd from form, then call loginUser()
  if (login) {
    login.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      loginUser(email, password);
    });
  }
  //login-signup toggle
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const loginForm = document.getElementById("login");
  const signupForm = document.getElementById("signup");
  //show login
  loginLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginLink.classList.add("active");
    signupLink.classList.remove("active");
  });
  //show signup
  signupLink.addEventListener("click", function (e) {
    e.preventDefault();
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    signupLink.classList.add("active");
    loginLink.classList.remove("active");
  });
});
//settings
document.addEventListener("DOMContentLoaded", function () {
  // Form submission logic
  document
    .getElementById("settingsForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const settings = {
        dyslexia: document.getElementById("dyslexia").checked,
        colorBlindness: document.getElementById("colorBlindness").value,
        lowVision: document.getElementById("lowVision").checked,
        elderly: document.getElementById("elderly").checked,
        diopterValue: document.getElementById("diopterValue").value || null,
        fontStyle: document.getElementById("fontFamily").value,
        fontSize: document.querySelector(".fontSize .adjustSize span")
          .textContent,
        pageZoom:
          document.querySelector(".pageZoom .zoomBtn.active")?.dataset.zoom ||
          "1",
        highContrast: document.querySelector('.contrast input[type="checkbox"]')
          .checked,
        darkMode: document.querySelector('.darkMode input[type="checkbox"]')
          .checked,
      };

      chrome.runtime.sendMessage({
        action: "applySettings",
        settings: settings,
      });
    });

  chrome.storage.local.get("settings", function (result) {
    if (result.settings) {
      const settings = result.settings;
      document.getElementById("dyslexia").checked = settings.dyslexia;
      document.getElementById("colorBlindness").value = settings.colorBlindness;

      document.getElementById("lowVision").checked = settings.lowVision;
      document.getElementById("elderly").checked = settings.elderly;

      document.getElementById("diopterValue").value =
        settings.diopterValue || 0;
      document.getElementById("fontFamily").value = settings.fontStyle;

      document.querySelector('.contrast input[type="checkbox"]').checked =
        settings.highContrast;
      document.querySelector('.darkMode input[type="checkbox"]').checked =
        settings.darkMode;

      diopterOutput.textContent = document.getElementById("diopterValue").value;
    }
  });
  function switchTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // Event listeners for tab buttons
  document
    .getElementById("currentSettingsBtn")
    .addEventListener("click", function (event) {
      switchTab(event, "CurrentSettings");
    });

  document
    .getElementById("modifySettingsBtn")
    .addEventListener("click", function (event) {
      switchTab(event, "ModifySettings");
    });

  // Set default active tab on page load
  document.getElementById("currentSettingsBtn").click();
  //low vision toggle
  //signup-lv
  document
    .getElementById("lowVisionNeed")
    .addEventListener("click", function () {
      toggleLowVisionSlider(
        "lowVisionNeed",
        "lowVisionNeedSlider",
        "diopterNeedValue",
        "diopterNeedOutput"
      );
    });
  //setting-lv
  document.getElementById("lowVision").addEventListener("click", function () {
    toggleLowVisionSlider(
      "lowVision",
      "lowVisionSlider",
      "diopterValue",
      "diopterOutput"
    );
  });
  function toggleLowVisionSlider(
    checkboxId,
    sliderId,
    sliderValueId,
    outputId
  ) {
    const slider = document.getElementById(sliderId);
    const checkbox = document.getElementById(checkboxId);

    if (checkbox && slider) {
      slider.style.display = checkbox.checked ? "block" : "none";
      if (checkbox.checked) {
        updateDiopterOutput(sliderValueId, outputId);
      }
    }
  }
  //diopter value
  function updateDiopterOutput(sliderId, outputId) {
    console.log("updateDiopterOutput called with:", sliderId, outputId);
    const diopterSlider = document.getElementById(sliderId);
    const diopterOutput = document.getElementById(outputId);

    if (diopterSlider && diopterOutput) {
      diopterSlider.addEventListener("input", function () {
        diopterOutput.textContent = diopterSlider.value;
      });
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    // For Signup Area
    updateDiopterOutput("diopterNeedValue", "diopterNeedOutput");

    // For Settings Area
    updateDiopterOutput("diopterValue", "diopterOutput");
  });

  // Font size adjustment functions
  function adjustFontSize(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: action });
    });
  }

  document
    .querySelector(".adjustSize .fontBtn:nth-of-type(2)")
    .addEventListener("click", function () {
      adjustFontSize("increaseFontSize");
    });

  document
    .querySelector(".adjustSize .fontBtn:nth-of-type(1)")
    .addEventListener("click", function () {
      adjustFontSize("decreaseFontSize");
    });

  document
    .querySelector(".fontSize .resetBtn")
    .addEventListener("click", function () {
      adjustFontSize("resetFontSize");
    });

  // Zoom functions
  document.getElementById("zoomInBtn").addEventListener("click", function () {
    adjustFontSize("zoomInPage");
  });

  document.getElementById("zoomOutBtn").addEventListener("click", function () {
    adjustFontSize("zoomOutPage");
  });

  document
    .querySelector(".pageZoom .resetBtn")
    .addEventListener("click", function () {
      adjustFontSize("resetZoom");
    });

  document
    .querySelector(".contrast .switch input")
    .addEventListener("change", function () {
      const enabled = this.checked;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleHighContrast",
          enabled,
        });
      });
    });

  document
    .querySelector(".darkMode .switch input")
    .addEventListener("change", function () {
      const enabled = this.checked;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleDarkMode",
          enabled,
        });
      });
    });
});
