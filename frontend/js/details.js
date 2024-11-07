import {
  goBack,
  updateLikesCounter,
  getPost,
  currentUser,
  URL,
  getNewCommentId,
} from "./event-delegation.js";
const perfEntries = performance.getEntriesByType("navigation");

if (perfEntries[0].type === "back_forward") {
  location.reload();
}

const main = document.querySelector("main");
const addCommentTextArea = document.querySelector("#add-comment");
const chararctLeftEle = document.querySelector("[data-comment-count]");
const totalCommentCount = document.querySelector("[data-total-comment]");
const commentsSection = document.querySelector(".comments-section");
const totalComments = document.querySelector("[data-total-comment]");
const CHAR_MAX = 250;

const postWrapper = document.querySelector("[data-post-wrapper]");
const post = getPost(localStorage.getItem("post_id"));
postWrapper.insertAdjacentHTML(
  "beforeend",
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

let totalCommentsCount = 0;
post["comments"]?.forEach((comment) => {
  totalCommentsCount += 1;
  const replies = comment["replies"] ?? [];
  totalCommentsCount += replies.length;
  commentsSection.insertAdjacentHTML(
    "beforeend",
    `<div class="comment-cont" data-username="${
      comment.user.username
    }" data-user-id="${comment.id}">
            <img
              class="profile-img"
              src="${comment.user.image}"
              alt="${comment.user.name} " />
            <div class="name-cont">
              <p class="name jost-bold">${comment.user.name}</p>
              <p class="username">@${comment.user.username}</p>
            </div>
            <button data-reply-show class="reply-btn jost-semibold">
              Reply
            </button>
            <p class="reply-para">
              ${comment.content}
            </p>
            ${replies.length > 0 ? '<div class="reply-border"></div>' : ""}
            <ul class="reply-section"></ul>
          </div>`
  );
  const replySection =
    commentsSection.lastChild.querySelector(".reply-section");
  for (const reply of replies) {
    const { user } = reply;
    replySection.insertAdjacentHTML(
      "beforeend",
      `<li>
                <div class="comment-cont" data-username="${user.username}">
                  <img
                    class="profile-img"
                    src="${user.image}"
                    alt="${user.name} " />
                  <div class="name-cont">
                    <p class="name jost-bold">${user.name}</p>
                    <p class="username">@${user.username}</p>
                  </div>
                  <button class="reply-btn jost-semibold" data-reply-show>
                    Reply
                  </button>
                  <p class="reply-para">
                    <span class="reply-to jost-bold">@${reply.replyingTo}</span>
                    ${reply.content}
                  </p>
                 
                </div>
              </li>`
    );
  }
});

totalComments.setAttribute("data-total-comment", totalCommentsCount);
totalComments.textContent = `${totalComments.dataset.totalComment} Comments`;

addCommentTextArea.addEventListener("input", (e) => {
  const charLeft = CHAR_MAX - e.target.value.length;
  chararctLeftEle.textContent = `${charLeft} Characters left`;
  if (charLeft < 0) {
    chararctLeftEle.setAttribute("style", "color: red");
  } else {
    chararctLeftEle.removeAttribute("style");
  }
});

main.addEventListener("click", async (e) => {
  e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");
  const goEditFeedbackBtn = e.target.closest("[data-edit]");
  const labelEle = e.target.closest("[data-checked]");
  const replyCont = e.target.closest("[data-reply-show ]");
  const replyToBtn = e.target.closest("[data-reply-to]");
  const postCommentBtn = e.target.closest("[data-post-comment]");

  if (goBackBtn) {
    goBack();
  } else if (goEditFeedbackBtn) {
    localStorage.setItem("post_id", post.id);
    location.href = "feedback-edit.html";
  } else if (labelEle) {
    await updateLikesCounter(labelEle);
  } else if (replyCont) {
    replyCont.parentElement.insertAdjacentHTML(
      "beforeend",
      `<div class="add-comment-cont reply-comment-cont">
                    <textarea name="add-comment" id="reply-area"></textarea>
                    <button data-reply-to=${replyCont.parentElement.dataset.username}  class="jost-bold feedback-btn">Post Reply</button>
        </div>`
    );
  } else if (replyToBtn) {
    const replyCon = replyToBtn.parentElement;
    const text = replyCon.querySelector("textarea").value;
    const commentId = parseInt(replyCon.parentElement.dataset.userId);
    const reply = replyToBtn.closest("li");
    if (text.length > CHAR_MAX || text.length < 1) {
      alert(`${CHAR_MAX} Characters left`);
      return;
    }
    if (!reply) {
      const replySection =
        replyCon.parentElement.querySelector(".reply-section");
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
                <div class="comment-cont" data-username="${currentUser.username}">
                  <img
                    class="profile-img"
                    src="${currentUser.image}"
                    alt="${currentUser.name}" />
                  <div class="name-cont">
                    <p class="name jost-bold">${currentUser.name}</p>
                    <p class="username">@${currentUser.username}</p>
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
                <div class="comment-cont" data-username="${currentUser.username}">
                  <img
                    class="profile-img"
                    src="${currentUser.image}"
                    alt="${currentUser.name}" />
                  <div class="name-cont">
                    <p class="name jost-bold">${currentUser.name}/p>
                    <p class="username">@${currentUser.username}</p>
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

    const newReply = {
      content: text,
      replyingTo: replyToBtn.dataset.replyTo,
      user: currentUser,
    };

    post.comments.forEach((comment) => {
      if (comment.id === commentId) {
        if (comment.replies) {
          comment.replies.push(newReply);
        } else {
          comment.replies = [newReply];
        }
      }
    });

    const response = await fetch(`${URL}/updatePost/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

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
    } else {
      const commentSection = document.querySelector(".comments-section");
      commentSection.insertAdjacentHTML(
        "beforeend",
        `<div class="comment-cont" data-username="${
          currentUser.username
        }" data-user-id="${getNewCommentId()}">
            <img
              class="profile-img"
              src="${currentUser.image}"
              alt="${currentUser.name}" />
            <div class="name-cont">
              <p class="name jost-bold">${currentUser.name}</p>
              <p class="username">@${currentUser.username}</p>
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

      const newComment = {
        id: getNewCommentId(),
        user: currentUser,
        content: addCommentTextArea.value,
      };

      if (post.comments) {
        post.comments.push(newComment);
      } else {
        post.comments = [newComment];
      }

      const response = await fetch(`${URL}/updatePost/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

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
