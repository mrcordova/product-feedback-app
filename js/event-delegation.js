export function updateLikesCounter(labelEle) {
  // console.log("here");
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
}
