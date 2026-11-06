// Get the values from the HTML elements
const loginBtn = document.getElementById("loginButton");
const uName = document.getElementById("Username");
const passwd = document.getElementById("password");

// Mock accounts
const hrStaff = "John";
const hrStaffPass = "12345";

const acadStaff = "Daisy";
const acadStaffPass = "678910";

// Get the login form
const loginFrm = document.getElementById("loginFrm");

// Custom Message Box Helper Function
function showCustomAlert(title, message, callback) {
    const modal = document.getElementById("customModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const okBtn = document.getElementById("modalOkBtn");
    const cancelBtn = document.getElementById("modalCancelBtn");

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    cancelBtn.style.display = "none";
    modal.style.display = "flex";

    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    newOkBtn.addEventListener("click", function () {
        modal.style.display = "none";
        if (callback) callback();
    });
}

// Check login credentials
loginFrm.addEventListener("submit", function (e) {
    e.preventDefault();

    // HR Staff Login
    if (uName.value === hrStaff && passwd.value === hrStaffPass) {
        sessionStorage.setItem("hrisRole", "hr");
        showCustomAlert("Success", "Correct! Loading HR staff homepage", function () {
            window.location.href = "HomePageHRStaff.html";
        });
    }

    // Academic Staff Login
    else if (uName.value === acadStaff && passwd.value === acadStaffPass) {
        sessionStorage.setItem("hrisRole", "acad");
        showCustomAlert("Success", "Correct! Initializing academic staff homepage...", function () {
            window.location.href = "AcadStaff.html";
        });
    }

    // Incorrect credentials
    else {
        showCustomAlert("Login Failed", "Wrong Password or Username!");
    }
});

// Forgot Password link
document.getElementById("forgotLink").addEventListener("click", function (e) {
    e.preventDefault();
    showCustomAlert("Forgot Password", "Please contact the HR administrator to reset your password.");
});