import {
  getPost,
  goBack,
  showDropdown,
  BACKEND_URL,
} from "./event-delegation.js";
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

const parsedUrl = new URL(window.location.href);
const post = getPost(parsedUrl.searchParams.get("id"));

header.textContent = `Editing '${post.title}'`;
feedbackTitle.value = post.title;
categoryDisplay.textContent = `${
  post.category.length == 2 ? post.category.toUpperCase() : post.category
}`;
statusDisplay.textContent = post.status;
feedbackDetail.value = post.description;

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
  } else if (choice) {
    const inputChoice = choice.querySelector('input[type="radio"]');
    const display = choice
      .closest("menu")
      .previousElementSibling.querySelector(".dropdown-cont");

    inputChoice.checked = !inputChoice.checked;
    display.textContent = choice.dataset.sortByChoice;
    showDropdown(display);
  } else if (dropdownCate || dropdownStat) {
    showDropdown(dropdownCate ?? dropdownStat);
  } else if (saveBtn) {
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
    const response = await fetch(`${BACKEND_URL}/updatePost/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePost),
    });
    const result = await response.json();
    alert(`Changes saved: ${result.success}`);
  } else if (deleteBtn) {
    // delete btn
    //remove post
    const response = await fetch(`${BACKEND_URL}/deletePost/${post.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    feedbackTitle.value = "";
    feedbackDetail.value = "";

    categoryDisplay.textContent = "feature";
    const dropdownCateMem =
      categoryDisplay.parentElement.nextElementSibling.querySelector(
        "#feature"
      );
    dropdownCateMem.checked = true;

    statusDisplay.textContent = "Suggestion";
    const dropdownStatMem =
      statusDisplay.parentElement.nextElementSibling.querySelector(
        "#Suggestion"
      );
    dropdownStatMem.checked = true;

    location.href = "index.html";

    alert(`Post deleted: ${result.success}`);
  }
});
