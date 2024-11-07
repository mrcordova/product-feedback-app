import {
  updateLikesCounter,
  data,
  getStatusArray,
  getPost,
  sortByMostVotes,
  sortByLeastVotes,
  sortByMostComments,
  sortByLeastComments,
} from "./event-delegation.js";
console.log(data);
var perfEntries = performance.getEntriesByType("navigation");

if (perfEntries[0].type === "back_forward") {
  location.reload();
}
const body = document.querySelector("body");
const popover = document.getElementById("sidebar");
const posts = document.querySelector(".posts");
const suggestions = await getStatusArray("suggestion");
const statusPosts = document.querySelectorAll(".stage-post-cont");
const suggestionHeader = document.querySelector(".suggestions-cont");
const statuses = {
  planned: await getStatusArray("planned"),
  "in-progress": await getStatusArray("in-progress"),
  live: await getStatusArray("live"),
  suggestion: await getStatusArray("suggestion"),
};
// console.log(status);
console.log(await getPost(localStorage.getItem("post_id")));
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

suggestionHeader.children[1].textContent = `${statuses["suggestion"].length} Suggestions`;

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

body.addEventListener("click", async (e) => {
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
    // const post = await getPost(postEle.parentElement.dataset.id);

    // localStorage.setItem(
    //   "post",
    //   `<div class="post" data-id="${post.id}">
    //       <label class="likes-cont jost-bold" data-checked="${
    //         post.liked ?? false
    //       }"  >
    //         <input type="checkbox" name="likes" id="add-tags-for-solutions-${
    //           post.id
    //         }"  ${post.liked ? "checked" : ""}/>
    //         <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
    //           <path
    //             d="M1 6l4-4 4 4"
    //             stroke="currentColor"
    //             stroke-width="2"
    //             fill="none"
    //             fill-rule="evenodd" />
    //         </svg>
    //         <span data-likes="${post.upvotes}">${post.upvotes}</span>
    //       </label>
    //       <div class="info-cont" data-post="">
    //         <h2 class="jost-bold">${post.title}</h2>
    //         <p>${post.description}</p>
    //         <div class="token jost-semibold">${
    //           post.category.length == 2
    //             ? post.category.toUpperCase()
    //             : post.category
    //         }</div>
    //       </div>
    //       <div class="comments-cont jost-bold" data-post="">
    //         <img src="./assets/shared/icon-comments.svg" alt="comment icon" />
    //         <span>${post["comments"]?.length ?? 0}</span>
    //       </div>
    //     </div>`
    // );
    localStorage.setItem("post_id", postEle.parentElement.dataset.id);
    // localStorage.setItem("back", "index.html");
    // console.log(localStorage);
    location.href = "feedback-detail.html";
    // console.log("here");
  } else if (labelEle) {
    await updateLikesCounter(labelEle);
  } else if (newFeedbackBtn) {
    localStorage.setItem("back", "index.html");
    location.href = "feedback-new.html";
  } else if (goRoadmap) {
    // console.log("here");
    localStorage.setItem("back", "index.html");
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
