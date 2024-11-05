export const data = await (await fetch("data.json")).json();

// console.log(data);

export function getStatusArray(status = "suggestion") {
  // console.log(data);
  const productRequests = data["productRequests"];
  const results = [];

  for (const productRequest of productRequests) {
    if (productRequest.status === status) {
      results.push(productRequest);
    }
  }
  console.log(results);
  return results;
}

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

export function goBack() {
  history.back();
}
