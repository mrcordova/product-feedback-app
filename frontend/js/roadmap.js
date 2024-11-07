import {
  goBack,
  getStatusArray,
  sortByMostVotes,
  updateLikesCounter,
  getCommentAmount,
} from "./event-delegation.js";
var perfEntries = performance.getEntriesByType("navigation");

if (perfEntries[0].type === "back_forward") {
  location.reload();
}
const main = document.querySelector("main");

const statuses = {
  planned: getStatusArray("planned"),
  "in-progress": getStatusArray("in-progress"),
  live: getStatusArray("live"),
  suggestion: getStatusArray("suggestion"),
};
const cols = document.querySelectorAll(
  ".planned-col, .in-progress-col, .live-col"
);

for (const col of cols) {
  const posts = col.querySelector(".posts");
  const postHeader = col.querySelector(".post-header");
  const postsArr = statuses[col.dataset.statusCol];
  postHeader.textContent = `${col.dataset.statusCol} (${postsArr.length})`;
  for (const post of postsArr) {
    posts.insertAdjacentHTML(
      "beforeend",
      ` <div class="post" data-id="${post.id}">
              <div class="status-cont">
                <div data-status="${
                  post.status
                }" class="status-post-color"></div>
                <p class="jost-regular">${post.status}</p>
              </div>
              <label class="likes-cont jost-bold" data-checked="${
                post.liked ?? false
              }">
                <input
                  type="checkbox"
                  name="likes"
                  ${post.liked ? "checked" : ""}
                  id="${post.title}" />
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
                <img
                  src="./assets/shared/icon-comments.svg"
                  alt="comment icon" />
                <span>${getCommentAmount(post.comments)}</span>
              </div>
            </div>`
    );
  }

  [...posts.children]
    .sort(sortByMostVotes)
    .forEach((node) => posts.appendChild(node));
}

main.addEventListener("click", async (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const addNewFeedbackBtn = e.target.closest("[data-go-new]");
  const postEle = e.target.closest("[data-post]");
  const labelEle = e.target.closest("[data-checked]");

  if (goBackBtn) {
    goBack();
  } else if (addNewFeedbackBtn) {
    location.href = "feedback-new.html";
  } else if (postEle) {
    // localStorage.setItem("post_id", postEle.parentElement.dataset.id);
    location.href = `feedback-detail.html?id=${postEle.parentElement.dataset.id}`;
  } else if (labelEle) {
    await updateLikesCounter(labelEle);
  }
});
