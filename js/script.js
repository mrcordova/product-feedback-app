const body = document.querySelector("body");

body.addEventListener("click", (e) => {
  e.preventDefault();
  const postEle = e.target.closest("[data-post]");
  const labelEle = e.target.closest("[data-checked]");
  const token = e.target.closest("[data-token]");

  console.log("ere");

  if (postEle) {
    console.log(postEle);
    location.href = "feedback-detail.html";
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
    // token.children[0].checked = true;
    const tokens = body.querySelectorAll(
      `[data-token='${token.dataset.token}']`
    );
    for (const token of tokens) {
      token.children[0].checked = true;
      //   console.log(token.children);
    }
  }
});
