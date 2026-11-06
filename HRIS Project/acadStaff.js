// ==========================================
// ACADEMIC / ADMIN STAFF PORTAL
// ==========================================

// Only a logged-in academic staff member may view this page
if (sessionStorage.getItem("hrisRole") !== "acad") {
    window.location.replace("HRIS.html");
}

// Sidebar buttons
const btnRequestCOE = document.getElementById("btnRequestCOE");
const btnRequestPayslip = document.getElementById("btnRequestPayslip");
const btnManageAcademic = document.getElementById("btnManageAcademic");
const btnHomeLogOut = document.getElementById("btnHomeLogOut");

// Screens
const nodeStaffHome = document.getElementById("nodeStaffHome");
const nodeCOEForm = document.getElementById("nodeCOEForm");
const nodePayslipForm = document.getElementById("nodePayslipForm");
const nodeAcademicManagement = document.getElementById("nodeAcademicManagement");
const nodeWaitAdmin = document.getElementById("nodeWaitAdmin");

// Form fields and action buttons
const coePurpose = document.getElementById("coePurpose");
const payslipPeriod = document.getElementById("payslipPeriod");
const btnSubmitCOE = document.getElementById("btnSubmitCOE");
const btnSubmitPayslip = document.getElementById("btnSubmitPayslip");
const btnShowManagementView = document.getElementById("btnShowManagementView");

// ==========================================
// CUSTOM MESSAGE BOX (replaces alert/confirm)
// ==========================================

const modal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalOkBtn = document.getElementById("modalOkBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");

function openModal(message, title, isConfirm) {
    return new Promise(resolve => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalCancelBtn.style.display = isConfirm ? "inline-block" : "none";
        modal.style.display = "flex";
        modalOkBtn.focus();

        function close(result) {
            modal.style.display = "none";
            modalOkBtn.removeEventListener("click", onOk);
            modalCancelBtn.removeEventListener("click", onCancel);
            document.removeEventListener("keydown", onKey);
            resolve(result);
        }
        function onOk() { close(true); }
        function onCancel() { close(false); }
        function onKey(e) {
            if (e.key === "Escape") close(!isConfirm);
        }

        modalOkBtn.addEventListener("click", onOk);
        modalCancelBtn.addEventListener("click", onCancel);
        document.addEventListener("keydown", onKey);
    });
}

// Usage: await showAlert("text", "Title")
function showAlert(message, title = "Notice") {
    return openModal(message, title, false);
}

// Usage: if (await showConfirm("text", "Title")) { ... }
function showConfirm(message, title = "Please Confirm") {
    return openModal(message, title, true);
}

// ==========================================
// SCREEN NAVIGATION FUNCTION
// ==========================================

function showScreen(screen) {
    // Hide all screens
    document.querySelectorAll(".interface-screen").forEach(item => {
        item.classList.add("hidden-screen");
        item.classList.remove("active-screen");
    });

    // Display selected screen
    screen.classList.remove("hidden-screen");
    screen.classList.add("active-screen");
}

// ==========================================
// SIDEBAR BUTTON EVENTS
// ==========================================

btnRequestCOE.addEventListener("click", () => showScreen(nodeCOEForm));
btnRequestPayslip.addEventListener("click", () => showScreen(nodePayslipForm));
btnManageAcademic.addEventListener("click", () => showScreen(nodeAcademicManagement));

// ==========================================
// BACK BUTTON EVENTS
// ==========================================

document.querySelectorAll(".btn-back-home").forEach(button => {
    button.addEventListener("click", () => showScreen(nodeStaffHome));
});

// ==========================================
// COE REQUEST
// ==========================================

btnSubmitCOE.addEventListener("click", async () => {
    const purpose = coePurpose.value.trim();

    if (purpose === "") {
        await showAlert("Please enter the purpose of your COE request.", "Missing Information");
        return;
    }

    if (await showConfirm("Are you sure you want to submit your COE request?", "Submit Request")) {
        await showAlert("Your COE request has been successfully submitted to HR.", "Request Sent");
        coePurpose.value = "";
        showScreen(nodeStaffHome);
    }
});

// ==========================================
// PAYSLIP REQUEST
// ==========================================

btnSubmitPayslip.addEventListener("click", async () => {
    if (payslipPeriod.value === "") {
        await showAlert("Please select a cutoff period.", "Missing Information");
        return;
    }

    if (await showConfirm("Are you sure you want to submit your payslip request?", "Submit Request")) {
        await showAlert("Your payslip request has been successfully submitted to HR.", "Request Sent");
        payslipPeriod.selectedIndex = 0;
        showScreen(nodeStaffHome);
    }
});

// ==========================================
// ACADEMIC MANAGEMENT
// ==========================================

btnShowManagementView.addEventListener("click", async () => {
    await showAlert("Academic Management Data will be displayed here.", "Coming Soon");
    // You can add your management records interface here.
});

// ==========================================
// LOGOUT
// ==========================================

btnHomeLogOut.addEventListener("click", async () => {
    if (await showConfirm("Are you sure you want to log out?", "Log Out")) {
        sessionStorage.removeItem("hrisRole");
        window.location.href = "HRIS.html";
    }
});