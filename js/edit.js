import { getPost, goBack } from "./event-delegation.js";

const main = document.querySelector("main");
const header = document.querySelector("[data-header]");
const feedbackTitle = document.querySelector("#title");
const categoryDisplay = document.querySelector("[data-category]");
const statusDisplay = document.querySelector("[data-status]");
const feedbackDetail = document.querySelector("#detail");

const post = getPost(localStorage.getItem("post_id"));

console.log(post);

header.textContent = `Editing '${post.title}'`;
feedbackTitle.value = post.title;
categoryDisplay.textContent = `${post.category}`;
statusDisplay.textContent = post.status;
feedbackDetail.value = post.description;

main.addEventListener("click", (e) => {
  //   e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");

  if (goBackBtn) {
    goBack();
  }
});
