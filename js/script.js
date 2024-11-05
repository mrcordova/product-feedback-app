import {
  updateLikesCounter,
  data,
  getStatusArray,
  getPost,
} from "./event-delegation.js";
console.log(data);
const body = document.querySelector("body");
const popover = document.getElementById("sidebar");
const posts = document.querySelector(".posts");
const suggestions = getStatusArray("suggestion");
const search = {
  category: "all",
  sortBy: "most-upvotes",
};
for (const suggestion of suggestions) {
  posts.insertAdjacentHTML(
    "beforeend",
    `<div class="post" data-id="${suggestion.id}">
           <label class="likes-cont jost-bold" data-checked="${
             suggestion.liked ?? false
           }"  >
            <input type="checkbox" name="likes" id="${suggestion.title}-${
      suggestion.id
    }"  ${suggestion.liked ? "checked" : ""}/>
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 6l4-4 4 4"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                fill-rule="evenodd" />
            </svg>
            <span data-likes="${suggestion.upvotes}">${
      suggestion.upvotes
    }</span>
          </label>
          <div class="info-cont" data-post="">
            <h2 class="jost-bold">${suggestion.title}</h2>
            <p>${suggestion.description}</p>
            <div class="token jost-semibold">${
              suggestion.category.length == 2
                ? suggestion.category.toUpperCase()
                : suggestion.category
            }</div>
          </div>
          <div class="comments-cont jost-bold" data-post="">
            <img src="./assets/shared/icon-comments.svg" alt="comment icon" />
            <span>${suggestion["comments"]?.length ?? 0}</span>
          </div>
        </div>`
  );
}

body.addEventListener("click", (e) => {
  e.preventDefault();
  const postEle = e.target.closest("[data-post]");
  const labelEle = e.target.closest("[data-checked]");
  const token = e.target.closest("[data-token]");
  const popoverMenu = e.target.closest("[data-mobile-menu]");
  const labelSortBy = e.target.closest("[data-sort-by-dropdown]");
  const labelSortByChoice = e.target.closest("[data-sort-by-choice]");
  const newFeedbackBtn = e.target.closest("[data-go-new]");
  const goRoadmap = e.target.closest("[data-go-roadmap]");

  if (postEle) {
    const post = getPost(postEle.parentElement.dataset.id);

    localStorage.setItem(
      "post",
      `<div class="post" data-id="${post.id}">
          <label class="likes-cont jost-bold" data-checked="${
            post.liked ?? false
          }"  >
            <input type="checkbox" name="likes" id="add-tags-for-solutions-${
              post.id
            }"  ${post.liked ? "checked" : ""}/>
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 6l4-4 4 4"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                fill-rule="evenodd" />
            </svg>
            <span data-likes="${post.upvotes}">${post.upvotes}</span>
          </label>
          <div class="info-cont" data-post="">
            <h2 class="jost-bold">${post.title}</h2>
            <p>${post.description}</p>
            <div class="token jost-semibold">${
              post.category.length == 2
                ? post.category.toUpperCase()
                : post.category
            }</div>
          </div>
          <div class="comments-cont jost-bold" data-post="">
            <img src="./assets/shared/icon-comments.svg" alt="comment icon" />
            <span>${post["comments"]?.length ?? 0}</span>
          </div>
        </div>`
    );
    localStorage.setItem("post_id", postEle.parentElement.dataset.id);
    location.href = "feedback-detail.html";
  } else if (labelEle) {
    updateLikesCounter(labelEle);
  } else if (newFeedbackBtn) {
    location.href = "feedback-new.html";
  } else if (goRoadmap) {
    location.href = "roadmap.html";
  } else if (token) {
    const tokens = body.querySelectorAll(
      `[data-token='${token.dataset.token}']`
    );
    for (const token of tokens) {
      token.children[0].checked = true;
    }
    // console.log(token.dataset.token);
    search.category = token.dataset.token;
    // console.log(token.dataset.token);
    for (const post of posts.children) {
      const postCategory = post.querySelector(".token");

      post.classList.toggle(
        "hide",
        postCategory.textContent.trim().toLowerCase() !==
          search.category.toLowerCase() && !(search.category === "all")
      );
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
