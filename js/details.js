// console.log(localStorage.getItem("post"));
import { updateLikesCounter } from "./event-delegation.js";
const dataResponse = await fetch("data.json");
const data = await dataResponse.json();
const main = document.querySelector("main");
const addCommentTextArea = document.querySelector("#add-comment");
const chararctLeftEle = document.querySelector("[data-comment-count]");
const totalCommentCount = document.querySelector("[data-total-comment]");
const CHAR_MAX = 250;

console.log(data);

const postWrapper = document.querySelector("[data-post-wrapper]");
postWrapper.insertAdjacentHTML("beforeend", localStorage.getItem("post"));

function checkTextAreaLength(value) {}
addCommentTextArea.addEventListener("input", (e) => {
  // console.log(e.target.value);
  const charLeft = CHAR_MAX - e.target.value.length;
  chararctLeftEle.textContent = `${charLeft} Characters left`;
  if (charLeft < 0) {
    chararctLeftEle.setAttribute("style", "color: red");
  } else {
    chararctLeftEle.removeAttribute("style");
  }
});

main.addEventListener("click", (e) => {
  e.preventDefault();
  //   e.stopImmediatePropagation();
  const goBackBtn = e.target.closest("[data-go-back]");
  const goEditFeedbackBtn = e.target.closest("[data-edit]");
  // const postEle = e.target.closest("[data-post]");
  const labelEle = e.target.closest("[data-checked]");
  const replyCont = e.target.closest("[data-reply-show ]");
  const replyToBtn = e.target.closest("[data-reply-to]");
  const postCommentBtn = e.target.closest("[data-post-comment]");
  //   console.log(e.target);
  //   console.log(e.currentTarget);
  if (goBackBtn) {
    history.back();
  } else if (goEditFeedbackBtn) {
    location.href = "feedback-edit.html";
    // } else if (postEle) {
    // e.stopImmediatePropagation();
  } else if (labelEle) {
    // console.log(labelEle);
    updateLikesCounter(labelEle);
  } else if (replyCont) {
    // console.log(replyCont.parentElement);
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
    if (text.length > CHAR_MAX || text.length < 1) {
      return;
    }
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

    totalCommentCount.setAttribute(
      "data-total-comment",
      parseInt(totalCommentCount.dataset.totalComment) + 1
    );
    totalCommentCount.textContent = `${totalCommentCount.dataset.totalComment} Comments`;
  } else if (postCommentBtn) {
    if (
      addCommentTextArea.value.length > CHAR_MAX ||
      addCommentTextArea.value.length < 1
    ) {
      // console.log("too long");
    } else {
      const commentSection = document.querySelector(".comments-section");
      commentSection.insertAdjacentHTML(
        "beforeend",
        `<div class="comment-cont" data-username="hexagon.bestagon">
            <img
              class="profile-img"
              src="./assets/user-images/image-elijah.jpg"
              alt="elijah " />
            <div class="name-cont">
              <p class="name jost-bold">Elijah Moss</p>
              <p class="username">@hexagon.bestagon</p>
            </div>
            <button data-reply-show class="reply-btn jost-semibold">
              Reply
            </button>
            <p class="reply-para">
             ${addCommentTextArea.value}
            </p>
          
            <ul class="reply-section"></ul>
          </div>`
      );

      addCommentTextArea.value = "";
      chararctLeftEle.textContent = `${CHAR_MAX} Characters left`;
      totalCommentCount.setAttribute(
        "data-total-comment",
        parseInt(totalCommentCount.dataset.totalComment) + 1
      );
      totalCommentCount.textContent = `${totalCommentCount.dataset.totalComment} Comments`;
    }
  }
});
