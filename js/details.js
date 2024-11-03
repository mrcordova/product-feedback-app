// console.log(localStorage.getItem("post"));
import { updateLikesCounter } from "./script.js";
const dataResponse = await fetch("data.json");
const data = await dataResponse.json();
const main = document.querySelector("main");

console.log(data);

const postWrapper = document.querySelector("[data-post-wrapper]");
postWrapper.insertAdjacentHTML("beforeend", localStorage.getItem("post"));

main.addEventListener("click", (e) => {
  e.preventDefault();
  //   e.stopImmediatePropagation();
  const goBackBtn = e.target.closest("[data-go-back]");
  const goEditFeedbackBtn = e.target.closest("[data-edit]");
  const postEle = e.target.closest("[data-post]");
  //   const labelEle = e.target.closest("[data-checked]");
  //   console.log(e.target);
  //   console.log(e.currentTarget);
  if (goBackBtn) {
    history.back();
  } else if (goEditFeedbackBtn) {
    location.href = "feedback-edit.html";
  } else if (postEle) {
    e.stopImmediatePropagation();
  }
  //   else if (labelEle) {
  // console.log(labelEle);
  // updateLikesCounter(labelEle);
  //   }
});
