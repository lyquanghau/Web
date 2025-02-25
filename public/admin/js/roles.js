// Permission
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click", () => {
        let permissions = [];

        const rows = tablePermissions.querySelectorAll("[data-name]");

        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }
    });
}
// End Permission

// Permission Data Default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");

    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            if (!row) {
                console.warn(`Row not found for permission: ${permission}`);
                return;
            }

            const input = row.querySelectorAll("input")[index];
            if (!input) {
                console.warn(`Input not found at index ${index} in row: ${permission}`);
                return;
            }

            input.checked = true; // Đặt trạng thái checkbox
        });
    });
}
// End Permission Data Default

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]")
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-role");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isComfirm = confirm("Are you sure you want to delete");

            if (isComfirm) {
                const id = button.getAttribute("data-id");
                const action = path + `/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
// End Delete Item