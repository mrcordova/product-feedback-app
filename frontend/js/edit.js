import { getPost, goBack, URL } from "./event-delegation.js";
var perfEntries = performance.getEntriesByType("navigation");

if (perfEntries[0].type === "back_forward") {
  location.reload();
}

const main = document.querySelector("main");
const header = document.querySelector("[data-header]");
const feedbackTitle = document.querySelector("#title");
const categoryDisplay = document.querySelector("[data-category]");
const statusDisplay = document.querySelector("[data-status]");
const feedbackDetail = document.querySelector("#detail");

const post = getPost(localStorage.getItem("post_id"));

header.textContent = `Editing '${post.title}'`;
feedbackTitle.value = post.title;
categoryDisplay.textContent = `${post.category}`;
statusDisplay.textContent = post.status;
feedbackDetail.value = post.description;

function showDropdown(dropdown) {
  const checkboxEle = dropdown.nextElementSibling;
  checkboxEle.checked = !checkboxEle.checked;
}

feedbackTitle.addEventListener("change", (e) => {
  feedbackTitle.nextElementSibling.classList.toggle(
    "hide",
    feedbackTitle.value.length > 0
  );
});

feedbackDetail.addEventListener("change", (e) => {
  feedbackDetail.nextElementSibling.classList.toggle(
    "hide",
    feedbackDetail.value.length > 0
  );
});

main.addEventListener("click", async (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const choice = e.target.closest("[data-sort-by-choice]");
  const dropdownCate = e.target.closest("[data-category]");
  const dropdownStat = e.target.closest("[data-status]");
  const saveBtn = e.target.closest("[data-save]");
  const cancelBtn = e.target.closest("[data-cancel]");
  const deleteBtn = e.target.closest("[data-delete]");

  if (goBackBtn || cancelBtn) {
    goBack();
    // location.href = localStorage.getItem("back");
    // location.href = "feedback-detail.html";
  } else if (choice) {
    const inputChoice = choice.querySelector('input[type="radio"]');
    const categoryDisplay = choice
      .closest("menu")
      .previousElementSibling.querySelector(".dropdown-cont");

    inputChoice.checked = !inputChoice.checked;
    categoryDisplay.textContent = choice.dataset.sortByChoice;
    showDropdown(categoryDisplay);
  } else if (dropdownCate || dropdownStat) {
    showDropdown(dropdownCate ?? dropdownStat);
  } else if (saveBtn) {
    // save btn
    feedbackTitle.nextElementSibling.classList.toggle(
      "hide",
      feedbackTitle.value.length !== 0
    );
    feedbackDetail.nextElementSibling.classList.toggle(
      "hide",
      feedbackDetail.value.length !== 0
    );

    if (feedbackDetail.value.length == 0 || feedbackTitle.value.length == 0) {
      return;
    }
    // console.log(post);
    //update post
    const updatePost = {
      title: feedbackTitle.value,
      category: categoryDisplay.textContent.toLowerCase(),
      status: statusDisplay.textContent.toLowerCase(),
      description: feedbackDetail.value,
      comments: post.comments ?? null,
      liked: post.liked,
      upvotes: post.upvotes,
    };
    // console.log(updatePost);
    const response = await fetch(`${URL}/updatePost/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePost),
    });
    // console.log();
    const result = await response.json();
    alert(`Changes saved: ${result.success}`);
  } else if (deleteBtn) {
    // delete btn
    //remove post
  }
});
