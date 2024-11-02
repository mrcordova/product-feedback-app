const main = document.querySelector("main");

main.addEventListener("click", (e) => {
  e.preventDefault();
  const postEle = e.target.closest("[data-post]");
  const labelEle = e.target.closest("[data-checked]");

  if (postEle) {
    console.log(postEle);
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
  }
});
