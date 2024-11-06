import { goBack } from "./event-delegation.js";

const main = document.querySelector("main");

function showDropdown(dropdown) {
  const checkboxEle = dropdown.nextElementSibling;
  checkboxEle.checked = !checkboxEle.checked;
}

main.addEventListener("click", (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const choice = e.target.closest("[data-sort-by-choice]");
  const dropdownCate = e.target.closest("[data-category]");
  //   const dropdownStat = e.target.closest("[data-status]");

  if (goBackBtn) {
    goBack();
  } else if (choice) {
    const inputChoice = choice.querySelector('input[type="radio"]');
    const categoryDisplay = choice
      .closest("menu")
      .previousElementSibling.querySelector(".dropdown-cont");

    inputChoice.checked = !inputChoice.checked;
    categoryDisplay.textContent = choice.dataset.sortByChoice;
    showDropdown(categoryDisplay);
  } else if (dropdownCate) {
    showDropdown(dropdownCate);
  }
});
