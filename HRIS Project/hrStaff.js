// Only a logged-in HR staff member may view this page
if (sessionStorage.getItem('hrisRole') !== 'hr') {
    window.location.replace('HRIS.html');
}

document.addEventListener('DOMContentLoaded', () => {
    // Target output elements and sidebar buttons
    const outputTitle = document.querySelector('.output-container h2');
    const outputText = document.querySelector('.output-container .LoadingClassForInput');
    const btnDashboard = document.getElementById('btnDashboard');
    const btnRecords = document.getElementById('btnRecords');
    const btnForms = document.getElementById('btnForms');
    const btnLogout = document.getElementById('logoutBtn');

    // ===== Custom Message Box (replaces alert() and confirm()) =====
    const modal = document.getElementById('customModal');
    const modalCard = modal.querySelector('.modal-card');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    function openModal(message, title, isConfirm, type) {
        return new Promise(resolve => {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalCard.className = 'modal-card ' + type; // info | success | error | warning
            modalCancelBtn.style.display = isConfirm ? 'inline-block' : 'none';
            modal.style.display = 'flex';
            modalOkBtn.focus();

            function close(result) {
                modal.style.display = 'none';
                modalOkBtn.removeEventListener('click', onOk);
                modalCancelBtn.removeEventListener('click', onCancel);
                document.removeEventListener('keydown', onKey);
                resolve(result);
            }
            function onOk() { close(true); }
            function onCancel() { close(false); }
            function onKey(e) {
                if (e.key === 'Escape') close(!isConfirm);
            }

            modalOkBtn.addEventListener('click', onOk);
            modalCancelBtn.addEventListener('click', onCancel);
            document.addEventListener('keydown', onKey);
        });
    }

    // Usage: await showAlert("text", "Title", "success")
    function showAlert(message, title = 'Notice', type = 'info') {
        return openModal(message, title, false, type);
    }

    // Usage: if (await showConfirm("text", "Title")) { ... }
    function showConfirm(message, title = 'Please Confirm', type = 'warning') {
        return openModal(message, title, true, type);
    }
    // ===============================================================

    //mock database for the ER
    const employeeDatabase = [
        { id: "101", name: "Serena Bonita", position: "HR Specialist", status: "Active" },
        { id: "102", name: "Joselita Gustavo", position: "Recruiter", status: "On Leave" },
        { id: "103", name: "Juan Biringan", position: "HR Specialist", status: "Pending Review" },
        { id: "104", name: "Arlos Arlos", position: "Instructor", status: "Active" },
        { id: "105", name: "Jhon Bernard", position: "Instructor", status: "On Leave" },
        { id: "106", name: "Supremo Suprano", position: "HR Specialist", status: "Active" },
        { id: "107", name: "Jong Borloloy", position: "Custodian", status: "Active" },
        { id: "108", name: "David Pearlito", position: "Secretary", status: "On Leave" },
        { id: "109", name: "Pepito Manaloto", position: "HR Specialist", status: "Pending Review" }
    ];

    function clearFormInputs() {
        if (document.getElementById('mockEmpId')) document.getElementById('mockEmpId').value = "";
        if (document.getElementById('mockEmpName')) document.getElementById('mockEmpName').value = "";
        if (document.getElementById('mockEmpPos')) document.getElementById('mockEmpPos').value = "";
    };

    // Mock data for notifications
    const notifications = [
        "New leave request submitted by Joselita Gustavo.",
        "Resignation request submitted by Serena Bonita.",
        "Performance Evaluation Report has been approved.",
        "Reminder: Onboarding session tomorrow at 9:00 AM."
    ];

    // Helper function to reset back to the default home panel view
    function resetToHomepage() {
        outputTitle.style.display = "block";
        outputTitle.textContent = 'Choose an option on the left';
        outputText.innerHTML = `
            <div class="LoadingClassForInput">
                <p id="waitForUser">Waiting for input...</p>
            </div>
        `;
    };

    // show the mock database of the employees
    function openMockDatabase() {
        outputTitle.style.display = "flex";
        outputTitle.style.justifyContent = "space-between";
        outputTitle.style.alignItems = "center";

        outputTitle.innerHTML = `
            <span>Employees Database</span>
        `;

        outputText.innerHTML = `
            <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center;">
                <button type="button" id="btnBackToMR" style="padding: 6px 12px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background-color: #f0f0f0; color: black;">Back</button>
                <input type="text" id="dbSearch" placeholder="Search For Employees..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
            </div>
            <ul id="mockdbResult" style="list-style: none; padding: 0;">
                 ${employeeDatabase.map(item => `
                    <li style="padding: 8px; border-bottom: 1px solid #e0e0e0; color: #222;">
                        <strong>ID: ${item.id}</strong> - ${item.name} | <em>${item.position}</em> [${item.status}]
                    </li>
                `).join('')}
            </ul>
        `;

        const searchInput = document.getElementById('dbSearch');
        const resultsList = document.getElementById('mockdbResult');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = employeeDatabase.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.id.includes(searchTerm) ||
                item.position.toLowerCase().includes(searchTerm)
            );
            if (filteredItems.length > 0) {
                resultsList.innerHTML = filteredItems.map(item =>
                    `<li style="padding: 8px; border-bottom: 1px solid #e0e0e0; color: #222;">
                        <strong>ID: ${item.id}</strong> - ${item.name} | <em>${item.position}</em> [${item.status}]
                     </li>`
                ).join('');
            } else {
                resultsList.innerHTML = `<li style="padding: 8px; color: #888;">No matching records found.</li>`;
            };
        });

        document.getElementById('btnBackToMR').addEventListener('click', openManageRecords);
    };

    // Notification Panel View Function
    function openNotificationsPanel() {
        outputTitle.style.display = "block";
        outputTitle.textContent = "System Notifications";

        outputText.innerHTML = `
            <div style="margin-bottom: 15px;">
                <button type="button" id="btnBackToDashboard" style="padding: 6px 12px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background-color: #f0f0f0; color: black;">Back to Dashboard</button>
            </div>
            <ul id="notificationList" style="list-style: none; padding: 0;">
                ${notifications.map(notif => `
                    <li style="padding: 12px; margin-bottom: 8px; border-left: 4px solid #007bff; background-color: #f8f9fa; border-radius: 0 4px 4px 0; font-size: 0.95rem; color: black;">
                        ${notif}
                    </li>
                `).join('')}
            </ul>
        `;

        document.getElementById('btnBackToDashboard').addEventListener('click', openDashboardPanel);
    };

    // Main Dashboard Panel View Function
    function openDashboardPanel() {
        outputTitle.style.display = "flex";
        outputTitle.style.justifyContent = "space-between";
        outputTitle.style.alignItems = "center";

        outputTitle.innerHTML = `
            <span>Dashboard Overview</span>
            <button type="button" id="btnViewNotifications" style="padding: 6px 14px; cursor: pointer; border-radius: 20px; border: none; background-color: #007bff; color: white; font-size: 0.9rem; font-weight: normal; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Notifications 
                <span style="background-color: red; color: white; border-radius: 10px; padding: 2px 8px; font-size: 0.75rem; font-weight: bold;">${notifications.length}</span>
            </button>
        `;
        outputText.innerHTML = `
            <div style="margin-bottom: 15px; display: flex; gap: 10px; align-items: center;">
                <button type="button" id="btnBackToHome" style="padding: 6px 12px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background-color: white; color: black;">Back</button>
                <input type="text" id="dashboardSearch" placeholder="Search For Employees..." style="flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
            </div>
            <ul id="dashboardResults" style="list-style: none; padding: 0;">
                ${employeeDatabase.map(item => {
            let backColor = "black";
            let fontColor = "white";
            const statusLower = item.status.toLowerCase();
            if (statusLower === "active") {
                backColor = "green";
            } else if (statusLower === "on leave") {
                backColor = "orange";
                fontColor = "black";
            } else if (statusLower === "pending review") {
                backColor = "yellow";
                fontColor = "black";
            } else if (statusLower === "resigned") {
                backColor = "black";
            }
            return `
                        <li style="padding: 8px; border-bottom: 1px solid #e0e0e0; color: #222;">
                             <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                             <span>${item.name}</span> 
                             <span style="background-color: ${backColor}; color: ${fontColor}; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content;">
                             ${item.status}
                             </span>
                             </div>
                        </li>
                    `;
        }).join('')}
            </ul>
        `;

        const btnBackToHome = document.getElementById('btnBackToHome');
        const btnViewNotifications = document.getElementById('btnViewNotifications');
        const searchInput = document.getElementById('dashboardSearch');
        const resultsList = document.getElementById('dashboardResults');

        btnBackToHome.addEventListener('click', resetToHomepage);
        btnViewNotifications.addEventListener('click', openNotificationsPanel);

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = employeeDatabase.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.id.includes(searchTerm) ||
                item.position.toLowerCase().includes(searchTerm)
            );
            if (filteredItems.length > 0) {
                resultsList.innerHTML = filteredItems.map(item => {
                    let backColor = "black";
                    let fontColor = "white";
                    const statusLower = item.status.toLowerCase();
                    if (statusLower === "active") {
                        backColor = "green";
                    } else if (statusLower === "on leave") {
                        backColor = "orange";
                        fontColor = "black";
                    } else if (statusLower === "pending review") {
                        backColor = "yellow";
                        fontColor = "black";
                    } else if (statusLower === "resigned") {
                        backColor = "red";
                    }
                    return `
                        <li style="padding: 8px; border-bottom: 1px solid #e0e0e0; color: #222;">
                             <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                             <span>${item.name}</span> 
                             <span style="background-color: ${backColor}; color: ${fontColor}; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content;">
                             ${item.status}
                             </span>
                             </div>
                        </li>
                    `;
                }).join('');
            } else {
                resultsList.innerHTML = `<li style="padding: 8px; color: #888;">No matching records found.</li>`;
            };
        });
    };

    btnDashboard.addEventListener('click', openDashboardPanel);

    // For opening the manage records interface
    function openManageRecords() {
        outputTitle.style.display = "block";
        outputTitle.textContent = "Employee Records Management";

        outputText.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div style="display: flex; gap: 10px; width: auto; margin-bottom: -25px;">
                    <button type="button" id="btnBackToHomeFromRecords" style="position: relative; top: -15px; height: fit-content; padding: 6px 12px; cursor: pointer; background-color: white; color: black; border-radius: 4px; border: 1px solid #ccc;">Back</button>
                    <button type="button" id="actionBtnCheck" style="position: relative; top: -15px; margin-left: auto; height: fit-content; padding: 6px 12px; background-color: #f0f0f0; color: black; border: 1px solid #ccc; border-radius: 4px; font-weight: 600; cursor: pointer;">Check Records</button>
                </div>

                <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e8dec8; display: flex; flex-direction: column; gap: 12px;">
                    <strong style="color: #5c3a21; font-size: 1.1rem; border-bottom: 1px solid #e8dec8; padding-bottom: 6px;">ER Fill-Up Form Display</strong>
                    
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-size: 0.85rem; color: #4a3525;">Employee ID:</label>
                        <input type="text" id="mockEmpId" placeholder="e.g., 101" style="padding: 8px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px;">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-size: 0.85rem; color: #4a3525;">Full Name:</label>
                        <input type="text" id="mockEmpName" placeholder="e.g., Juan Dela Cruz" style="padding: 8px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px;">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-size: 0.85rem; color: #4a3525;">Department / Position:</label>
                        <input type="text" id="mockEmpPos" placeholder="e.g., I.T Instructor" style="padding: 8px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px;">
                    </div>

                     <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-size: 0.85rem; color: #4a3525;">Status:</label>
                        <select name="Status" id="stat" style="padding: 8px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px;">
                        <option value="default"> -- Select Status -- </option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Resigned">Resigned</option>
                        <option value="Pending Review">Pending Review</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap;">
                    <button type="button" id="actionBtnAdd" style="flex: 1; padding: 12px; background-color: #10b981; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Add Record</button>
                    <button type="button" id="actionBtnUpdate" style="flex: 1; padding: 12px; background-color: #f59e0b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Update Record</button>
                    <button type="button" id="actionBtnDelete" style="flex: 1; padding: 12px; background-color: #ef4444; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Delete Record</button>
                </div>
            </div>
        `;

        const inputId = document.getElementById('mockEmpId');
        const inputName = document.getElementById('mockEmpName');
        const inputPos = document.getElementById('mockEmpPos');
        const selectedStat = document.getElementById('stat');

        document.getElementById('actionBtnAdd').addEventListener('click', async () => {
            const id = inputId.value.trim();
            const name = inputName.value.trim();
            const nameLower = name.toLowerCase();
            const pos = inputPos.value.trim();
            const posLower = pos.toLowerCase();
            const statusSel = selectedStat.value;

            if (!id || !name || !pos || statusSel === "default") {
                await showAlert("Please fill out all fields before executing.", "Missing Information", "warning");
                return;
            };
            const targetEmployee = employeeDatabase.find(emp => emp.id === id);
            const targetName = employeeDatabase.find(emp => emp.name?.toLowerCase() === nameLower);

            const idExists = employeeDatabase.some(emp => emp.id === id);
            const nameExists = !!targetName;
            const recordExists = employeeDatabase.some(emp => emp.id === id && emp.name?.toLowerCase() === nameLower && emp.position?.toLowerCase() === posLower && emp.status === statusSel);
            if (recordExists) {
                await showAlert("This record already exists!", "Duplicate Record", "error");
                return;
            };
            if (idExists) {
                if (targetEmployee.name.toLowerCase() !== nameLower) {
                    await showAlert(`ID [${id}] belongs to a different employee ("${targetEmployee.name}").`, "ID Conflict", "error");
                    return;
                };
                const positionChanged = targetEmployee.position?.toLowerCase() !== posLower;
                const statusChanged = targetEmployee.status !== statusSel;

                if (positionChanged && statusChanged) {
                    const changeBoth = await showConfirm(`Are you sure you want to update ${targetEmployee.name}'s Position to "${pos}" AND Status to "${statusSel}"?`, "Confirm Update");
                    if (changeBoth) {
                        targetEmployee.position = pos;
                        targetEmployee.status = statusSel;
                        await showAlert(`Successfully updated position and status for ${targetEmployee.name}.`, "Success", "success");
                        clearFormInputs();
                    }
                    return;
                }

                if (positionChanged) {
                    const changePos = await showConfirm(`Are you sure you want to change ${targetEmployee.name}'s Position to "${pos}"?`, "Confirm Update");
                    if (changePos) {
                        targetEmployee.position = pos;
                        await showAlert(`Position of employee ${id} successfully updated to "${pos}".`, "Success", "success");
                        clearFormInputs();
                    }
                    return;
                }

                if (targetEmployee.status !== statusSel) {
                    const changeStat = await showConfirm(`Are you sure you want to change ${targetEmployee.name}'s status to ${statusSel}?`, "Confirm Update");
                    if (changeStat) {
                        targetEmployee.status = statusSel;
                        await showAlert(`Status of ${targetEmployee.name} changed to ${statusSel}.`, "Success", "success");
                    }
                    clearFormInputs();
                    return;
                };
            };

            if (nameExists) {
                await showAlert("An employee with that name already exists!", "Duplicate Name", "error");
                return;
            };

            if (await showConfirm("Confirm to add information?", "Add Record")) {
                const newER = { id: id, name: name, position: pos, status: statusSel };
                employeeDatabase.push(newER);
                await showAlert("Record successfully added!", "Success", "success");
                clearFormInputs();
            };
        });

        document.getElementById('actionBtnUpdate').addEventListener('click', async () => {
            const id = inputId.value.trim();
            const name = inputName.value.trim();
            const pos = inputPos.value.trim();

            if (!id) {
                await showAlert("Please enter an Employee ID to search.", "Missing Information", "warning");
                return;
            };

            const targetRecord = employeeDatabase.find(emp => emp.id === id);

            if (!targetRecord) {
                await showAlert("Employee not found.", "Not Found", "error");
            } else {
                if (name) targetRecord.name = name;
                if (pos) targetRecord.position = pos;
                if (selectedStat.value !== "default") targetRecord.status = selectedStat.value;
                await showAlert(`Record ${id} successfully updated!`, "Success", "success");
                clearFormInputs();
            };
        });

        document.getElementById('actionBtnDelete').addEventListener('click', async () => {
            const id = inputId.value.trim();
            const name = inputName.value.trim();
            const pos = inputPos.value.trim();
            if (!id && !name && !pos) {
                await showAlert("Please enter an Employee ID to look up deletion targets.", "Missing Information", "warning");
                return;
            };

            const indexPosition = employeeDatabase.findIndex(emp => emp.id === id);
            if (indexPosition === -1) {
                await showAlert("Employee not found.", "Not Found", "error");
                return;
            };

            if (await showConfirm("Are you sure you want to delete this record?", "Delete Record", "error")) {
                employeeDatabase.splice(indexPosition, 1);
                await showAlert(`Record for ID ${id} completely removed from system database.`, "Deleted", "success");
                clearFormInputs();
            };
        });

        document.getElementById('btnBackToHomeFromRecords').addEventListener('click', resetToHomepage);
        document.getElementById('actionBtnCheck').addEventListener('click', openMockDatabase);
    };

    btnRecords.addEventListener('click', openManageRecords);

    // Manage Forms Button
    btnForms.addEventListener('click', () => {
        outputTitle.style.display = "block";
        outputTitle.textContent = "Forms Management Interface";

        outputText.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <button type="button" id="btnBackFromForms" style="display: inline-block; padding: 6px 12px; background-color: white; color: black; text-decoration: none; border-radius: 4px; font-size: 0.85rem; cursor: pointer; border: 1px solid #ccc;">Back</button>
                </div>
                <p style="color: #4a3525; margin: 0;">Please Select an Action to take:</p>
                <div style="background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e8dec8;">
                    <strong style="color: #5c3a21;">Create a Form</strong>
                    <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                        <input type="text" id="createFormName" placeholder="Enter Form Name (e.g., Overtime Form, COE, Leave Form)" style="padding: 6px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px;">
                        <button type="button" id="btnFlowCreate" style="align-self: flex-start; padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Execute Save Path</button>
                    </div>
                </div>
                <div style="background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e8dec8;">
                    <strong style="color: #5c3a21;">Update a Form</strong>
                    <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                        <select id="updateFormSelect" style="padding: 6px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px;">
                            <option value="">-- Select Form Type --</option>
                            <option value="Leave Form">Leave Form</option>
                            <option value="Overtime Form">Overtime Form</option>
                            <option value="COE">Certificate of Employment (COE)</option>
                            <option value="Resignation Form">Resignation Form</option>
                        </select>
                        <button type="button" id="btnFlowUpdate" style="align-self: flex-start; padding: 6px 12px; background: #f59e0b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Check Form Structure</button>
                    </div>
                </div>
                <div style="background: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e8dec8;">
                    <strong style="color: #5c3a21;">Delete a Form</strong>
                    <div style="margin-top: 10px; display: flex; gap: 10px; align-items: center;">
                        <select id="deleteFormSelect" style="padding: 6px; background: #ffffff; color: #3b281a; border: 1px solid #d4c5b9; border-radius: 4px; flex-grow: 1;">
                            <option value="">-- Choose Target Form --</option>
                            <option value="Old Evaluation Form">Old Evaluation Form 2024</option>
                            <option value="Temporary Overtime Log">Temporary Overtime Log</option>
                        </select>
                        <button type="button" id="btnFlowDelete" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Delete Form</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btnBackFromForms').addEventListener('click', resetToHomepage);

        document.getElementById('btnFlowCreate').addEventListener('click', async () => {
            const formName = document.getElementById('createFormName').value.trim();
            if (!formName) {
                await showAlert("Please type a form name to evaluate.", "Missing Information", "warning");
                return;
            }
            if (formName.toLowerCase() === "leave form" || formName.toLowerCase() === "overtime form") {
                await showAlert("The form already exists, cannot create a duplicate.", "Duplicate Form", "error");
            } else {
                await showAlert(`Initializing creation sequence for: "${formName}"\nRouting to builder interface canvas...`, "Creating Form", "info");
                document.getElementById('createFormName').value = "";
                window.location.href = `forms/forms.html?mode=create&title=${encodeURIComponent(formName)}`;
            }
        });

        document.getElementById('btnFlowUpdate').addEventListener('click', async () => {
            const selectedForm = document.getElementById('updateFormSelect').value;
            if (!selectedForm) {
                await showAlert("Please select a form type from the workflow tree node.", "Missing Selection", "warning");
                return;
            }
            await showAlert(`Opening layout structure view for: ${selectedForm}\nRouting to document modifications template...`, "Opening Form", "info");
            window.location.href = `forms/forms.html?mode=update&title=${encodeURIComponent(selectedForm)}`;
        });

        document.getElementById('btnFlowDelete').addEventListener('click', async () => {
            const deleteSelectMenu = document.getElementById('deleteFormSelect');
            const deleteTarget = deleteSelectMenu.value;

            if (!deleteTarget) {
                await showAlert("Select a target element block template to delete.", "Missing Selection", "warning");
                return;
            }

            if (await showConfirm(`Are you sure you want to completely delete "${deleteTarget}"?`, "Delete Form", "error")) {
                await showAlert("You successfully deleted the form.", "Deleted", "success");
                deleteSelectMenu.remove(deleteSelectMenu.selectedIndex);
                deleteSelectMenu.selectedIndex = 0;
            } else {
                await showAlert("Deletion sequence dropped. Routing back to interface menu node tree.", "Cancelled", "info");
            }
        });
    });

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            const logConfirm = await showConfirm('Are you sure you want to terminate your current session and log out?', 'Log Out', 'warning');
            if (logConfirm) {
                sessionStorage.removeItem('hrisRole');
                window.location.href = "HRIS.html";
            }
        });
    }
});