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
const statusPosts = document.querySelectorAll(".stage-post-cont");
const statuses = {
  planned: getStatusArray("planned"),
  "in-progress": getStatusArray("in-progress"),
  live: getStatusArray("live"),
};
// console.log(status);
const search = {
  category: "all",
  sortBy: "most-upvotes",
};
const sortFuncs = {
  "most-upvotes": sortByMostVotes,
  "least-upvotes": sortByLeastVotes,
  "most-comments": sortByMostComments,
  "least-comments": sortByLeastComments,
};
function sortByMostVotes(a, b) {
  const aLikes = parseInt(a.querySelector("[data-likes]").dataset.likes);
  const bLikes = parseInt(b.querySelector("[data-likes]").dataset.likes);

  return bLikes - aLikes;
}
function sortByLeastVotes(a, b) {
  const aLikes = parseInt(a.querySelector("[data-likes]").dataset.likes);
  const bLikes = parseInt(b.querySelector("[data-likes]").dataset.likes);

  return aLikes - bLikes;
}
function sortByMostComments(a, b) {
  const aComments = parseInt(
    a.querySelector("[data-comments]").dataset.comments
  );
  const bComments = parseInt(
    b.querySelector("[data-comments]").dataset.comments
  );

  return bComments - aComments;
}
function sortByLeastComments(a, b) {
  const aComments = parseInt(
    a.querySelector("[data-comments]").dataset.comments
  );
  const bComments = parseInt(
    b.querySelector("[data-comments]").dataset.comments
  );

  return aComments - bComments;
}

for (const statusPost of statusPosts) {
  const postStatus = statusPost.querySelector("[data-status]");
  // console.log(statuses[postStatus.dataset.status]);
  statusPost.children[1].textContent = `${
    statuses[postStatus.dataset.status].length
  }`;
}

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
            <span data-comments="${suggestion["comments"]?.length ?? 0}">${
      suggestion["comments"]?.length ?? 0
    }</span>
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
    search.category = token.dataset.token;
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
    // console.log(labelSortByChoice);
    search.sortBy = labelSortByChoice.dataset.sortByChoice;
    // console.log(search.sortBy);
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

    [...posts.children]
      .sort(sortFuncs[search.sortBy])
      .forEach((node) => posts.appendChild(node));
  }
});
