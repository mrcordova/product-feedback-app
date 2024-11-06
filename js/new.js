import { goBack } from "./event-delegation.js";

const main = document.querySelector("main");
const title = document.querySelector("#title");
const category = document.querySelector("[data-category]");
const details = document.querySelector("#detail");

function showDropdown(dropdown) {
  const checkboxEle = dropdown.nextElementSibling;
  checkboxEle.checked = !checkboxEle.checked;
}

main.addEventListener("click", (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const choice = e.target.closest("[data-sort-by-choice]");
  const dropdownCate = e.target.closest("[data-category]");
  const addFeedbackbtn = e.target.closest("[data-add-feedback]");

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
  } else if (addFeedbackbtn) {
    // console.log(addFeedbackbtn);
    console.log(title.value);
    console.log(category.textContent);
    console.log(details.value);

    const newPost = {
      title: title.value,
      category: category.textContent,
      description: details.value,
      status: "suggestion",
      upvotes: 0,
    };
  }
});
