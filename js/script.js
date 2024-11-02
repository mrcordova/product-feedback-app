const body = document.querySelector("body");
const popover = document.getElementById("sidebar");

body.addEventListener("click", (e) => {
  e.preventDefault();
  const postEle = e.target.closest("[data-post]");
  const labelEle = e.target.closest("[data-checked]");
  const token = e.target.closest("[data-token]");
  const popoverMenu = e.target.closest("[data-mobile-menu]");
  const labelSortBy = e.target.closest("[data-sort-by-dropdown]");
  const labelSortByChoice = e.target.closest("[data-sort-by-choice]");

  console.log("ere");

  if (postEle) {
    console.log(postEle);

    location.href = "feedback-detail.html";

    localStorage.setItem("post", postEle.parentElement.outerHTML);
    localStorage.setItem("post_id", 1);

    // console.log(localStorage.getItem("post"));
    // postEle.parentElement.parentElement.insertAdjacentHTML(
    //   "beforeend",
    //   localStorage.getItem("post")
    // );
  } else if (labelEle) {
    const input = labelEle.querySelector("input");
    const likesSpan = labelEle.querySelector("[data-likes]");
    input.checked = !input.checked;
    labelEle.setAttribute("data-checked", input.checked);
    likesSpan.setAttribute(
      "data-likes",
      input.checked
        ? parseInt(likesSpan.dataset.likes) + 1
        : parseInt(likesSpan.dataset.likes) - 1
    );
    likesSpan.textContent = likesSpan.dataset.likes;
  } else if (token) {
    const tokens = body.querySelectorAll(
      `[data-token='${token.dataset.token}']`
    );
    for (const token of tokens) {
      token.children[0].checked = true;
    }
  } else if (popoverMenu) {
    popover.togglePopover();
  } else if (labelSortBy) {
    const sortByInput = labelSortBy.querySelector("input");

    sortByInput.checked = !sortByInput.checked;
  } else if (labelSortByChoice) {
    const sortByChoiceInput = labelSortByChoice.querySelector("input");
    const sortByInput = body.querySelector("#sortByInput");
    const sortByName = sortByInput.parentElement.querySelector(
      "[data-sort-by-name]"
    );
    sortByName.setAttribute(
      "data-sort-by-name",
      labelSortByChoice.dataset.sortByChoice
    );
    sortByName.textContent = labelSortByChoice.dataset.sortByChoice
      .split("-")
      .join(" ");

    sortByChoiceInput.checked = !sortByChoiceInput.checked;
    sortByInput.checked = !sortByInput.checked;
  }
});
