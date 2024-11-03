// console.log(localStorage.getItem("post"));
import { updateLikesCounter } from "./event-delegation.js";
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
  const labelEle = e.target.closest("[data-checked]");
  const replyCont = e.target.closest("[data-reply-show ]");
  const replyToBtn = e.target.closest("[data-reply-to]");
  //   console.log(e.target);
  //   console.log(e.currentTarget);
  if (goBackBtn) {
    history.back();
  } else if (goEditFeedbackBtn) {
    location.href = "feedback-edit.html";
  } else if (postEle) {
    e.stopImmediatePropagation();
  } else if (labelEle) {
    console.log(labelEle);
    updateLikesCounter(labelEle);
  } else if (replyCont) {
    console.log(replyCont.parentElement);
    replyCont.parentElement.insertAdjacentHTML(
      "beforeend",
      `<div class="add-comment-cont reply-comment-cont">
                    <textarea name="add-comment" id="reply-area"></textarea>
                    <button data-reply-to=${replyCont.parentElement.dataset.username}  class="jost-bold feedback-btn">Post Reply</button>
        </div>`
    );
  } else if (replyToBtn) {
    // console.log(replyToBtn);
    const replyCon = replyToBtn.parentElement;
    const text = replyCon.querySelector("textarea").value;
    const reply = replyToBtn.closest("li");
    if (!reply) {
      const replySection =
        replyCon.parentElement.querySelector(".reply-section");
      // console.log(replyCon.nextElementSibling);
      if (replySection.children.length == 0) {
        const replyBorderDiv = document.createElement("div");
        replyBorderDiv.classList.add("reply-border");
        replyCon.replaceWith(replyBorderDiv);
      } else {
        replyCon.remove();
      }
      replySection.insertAdjacentHTML(
        "beforeend",
        `<li>
                <div class="comment-cont" data-username="annev1990">
                  <img
                    class="profile-img"
                    src="./assets/user-images/image-anne.jpg"
                    alt="james " />
                  <div class="name-cont">
                    <p class="name jost-bold">Anne Valentine</p>
                    <p class="username">@annev1990</p>
                  </div>
                  <button class="reply-btn jost-semibold" data-reply-show>
                    Reply
                  </button>
                  <p class="reply-para">
                    <span class="reply-to jost-bold">@${replyToBtn.dataset.replyTo}</span>
                    ${text}
                  </p>
                 
                </div>
              </li>`
      );
    } else if (reply) {
      const ulReplySection = reply.parentElement;
      ulReplySection.insertAdjacentHTML(
        "beforeend",
        `<li>
                <div class="comment-cont" data-username="annev1990">
                  <img
                    class="profile-img"
                    src="./assets/user-images/image-anne.jpg"
                    alt="james " />
                  <div class="name-cont">
                    <p class="name jost-bold">Anne Valentine</p>
                    <p class="username">@annev1990</p>
                  </div>
                  <button class="reply-btn jost-semibold" data-reply-show>
                    Reply
                  </button>
                  <p class="reply-para">
                    <span class="reply-to jost-bold">@${replyToBtn.dataset.replyTo}</span>
                    ${text}
                  </p>
                 
                </div>
              </li>`
      );
      replyCon.remove();
    }
    // replyToBtn.parentElement.remove();
    // replyToBtn.parentElement.parentElement.replaceChild(
    //   replyBorderDiv,
    //   replyToBtn.parentElement
    // );
    // console.log(text);
  }
});
