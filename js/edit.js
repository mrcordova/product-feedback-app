import { getPost, goBack } from "./event-delegation.js";

const main = document.querySelector("main");
const header = document.querySelector("[data-header]");
const feedbackTitle = document.querySelector("#title");
const categoryDisplay = document.querySelector("[data-category]");
const statusDisplay = document.querySelector("[data-status]");
const feedbackDetail = document.querySelector("#detail");

const post = getPost(localStorage.getItem("post_id"));

// console.log(post);

header.textContent = `Editing '${post.title}'`;
feedbackTitle.value = post.title;
categoryDisplay.textContent = `${post.category}`;
statusDisplay.textContent = post.status;
feedbackDetail.value = post.description;

function showDropdown(dropdown) {
  const checkboxEle = dropdown.nextElementSibling;
  checkboxEle.checked = !checkboxEle.checked;
}

main.addEventListener("click", (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const choice = e.target.closest("[data-sort-by-choice]");
  const dropdownCate = e.target.closest("[data-category]");
  const dropdownStat = e.target.closest("[data-status]");

  if (goBackBtn) {
    goBack();
  } else if (choice) {
    // console.log(choice);
    const inputChoice = choice.querySelector('input[type="radio"]');
    const categoryDisplay = choice
      .closest("menu")
      .previousElementSibling.querySelector(".dropdown-cont");

    inputChoice.checked = !inputChoice.checked;
    categoryDisplay.textContent = choice.dataset.sortByChoice;
    showDropdown(categoryDisplay);
  } else if (dropdownCate || dropdownStat) {
    showDropdown(dropdownCate ?? dropdownStat);
  }
});
