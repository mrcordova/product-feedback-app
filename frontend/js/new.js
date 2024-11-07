import { goBack, URL } from "./event-delegation.js";
var perfEntries = performance.getEntriesByType("navigation");

if (perfEntries[0].type === "back_forward") {
  location.reload();
}
const main = document.querySelector("main");
const title = document.querySelector("#title");
const category = document.querySelector("[data-category]");
const details = document.querySelector("#detail");

function showDropdown(dropdown) {
  const checkboxEle = dropdown.nextElementSibling;
  checkboxEle.checked = !checkboxEle.checked;
}

title.addEventListener("input", (e) => {
  title.nextElementSibling.classList.toggle("hide", title.value.length > 0);
});

details.addEventListener("input", (e) => {
  details.nextElementSibling.classList.toggle("hide", details.value.length > 0);
});

main.addEventListener("click", async (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const choice = e.target.closest("[data-sort-by-choice]");
  const dropdownCate = e.target.closest("[data-category]");
  const addFeedbackbtn = e.target.closest("[data-add-feedback]");
  const cancelBtn = e.target.closest("[data-cancel]");

  if (goBackBtn || cancelBtn) {
    goBack();
    // location.href = localStorage.getItem("back");
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
    title.nextElementSibling.classList.toggle("hide", title.value.length !== 0);
    details.nextElementSibling.classList.toggle(
      "hide",
      details.value.length !== 0
    );

    if (title.value.length == 0 || details.value.length == 0) {
      return;
    }

    const newPost = {
      title: title.value,
      category: category.textContent.toLowerCase(),
      description: details.value,
      status: "suggestion",
      upvotes: 0,
      liked: false,
    };

    const response = await fetch(`${URL}/addPost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    console.log(await response.json());
  }
});
