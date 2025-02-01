// Delete Category
const buttonsDelete = document.querySelectorAll("[button-delete]")
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-category");
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
// End Delete Category