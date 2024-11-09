// export const BACKEND_URL = "http://127.0.0.1:3000";

if (!("history" in sessionStorage)) {
  sessionStorage.setItem("history", JSON.stringify([]));
}
export const BACKEND_URL =
  "https://522f-2603-8001-8107-b1d9-00-1926.ngrok-free.app";
export const data = await (
  await fetch(`${BACKEND_URL}/data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  })
).json();
export const currentUser = data["currentUser"];

export function getStatusArray(status = "suggestion") {
  // console.log(data);

  // const postsResponse = await fetch(`${URL}/getPosts/${status}`, {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });
  const productRequests = data["productRequests"];
  // const results = await postsResponse.json();
  const results = [];

  for (const productRequest of productRequests) {
    if (productRequest.status === status) {
      results.push(productRequest);
    }
  }
  // console.log(results);

  return results;
}
export function getPost(id) {
  const productRequests = data["productRequests"];
  // const response = await fetch(`${URL}/getPost/${id}`, {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });

  const post_id = parseInt(id);
  let post;
  for (const productRequest of productRequests) {
    if (productRequest.id === post_id) {
      post = productRequest;
    }
  }
  // const postResponse = await response.json();
  // const post = postResponse.post;
  return post;
}
export async function updateLikesCounter(labelEle) {
  const post = await getPost(labelEle.parentElement.dataset.id);
  const input = labelEle.querySelector("input");
  const likesSpan = labelEle.querySelector("[data-likes]");

  post["liked"] = !input.checked;
  input.checked = !input.checked;
  labelEle.setAttribute("data-checked", input.checked);
  likesSpan.setAttribute(
    "data-likes",
    input.checked
      ? parseInt(likesSpan.dataset.likes) + 1
      : parseInt(likesSpan.dataset.likes) - 1
  );
  likesSpan.textContent = likesSpan.dataset.likes;
  post["upvotes"] = likesSpan.dataset.likes;
  const response = await fetch(`${BACKEND_URL}/updateLike/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
}

export function pushHistory(url) {
  let historyArray = JSON.parse(sessionStorage.getItem("history"));
  historyArray.push(url);
  sessionStorage.setItem("history", JSON.stringify(historyArray));
  return url;
}

export function popHistory() {
  let historyArray = JSON.parse(sessionStorage.getItem("history"));
  const url = historyArray.pop() ?? "index.html";
  sessionStorage.setItem("history", JSON.stringify(historyArray));
  return url;
}

export function resetHistory() {
  sessionStorage.setItem("history", JSON.stringify([]));
}

export function getNewCommentId() {
  let latestId = -1;
  for (const productRequest of data["productRequests"]) {
    if (productRequest.comments) {
      for (const comment of productRequest.comments) {
        latestId = Math.max(latestId, comment.id);
      }
    }
  }
  return parseInt(latestId) + 1;
}
export function getCommentAmount(comments) {
  const tempComments = comments ?? [];
  let amount = tempComments.length ?? 0;
  for (const comment of tempComments) {
    amount += comment.replies?.length ?? 0;
  }
  return amount;
}

export function getNewPostId() {
  let latestId = -1;
  for (const productRequest of data["productRequests"]) {
    latestId = Math.max(latestId, productRequest.id);
  }
  return parseInt(latestId) + 1;
}

export function showDropdown(dropdown) {
  const checkboxEle = dropdown.nextElementSibling;
  checkboxEle.checked = !checkboxEle.checked;
}

export function sortByMostVotes(a, b) {
  const aLikes = parseInt(a.querySelector("[data-likes]").dataset.likes);
  const bLikes = parseInt(b.querySelector("[data-likes]").dataset.likes);

  return bLikes - aLikes;
}
export function sortByLeastVotes(a, b) {
  const aLikes = parseInt(a.querySelector("[data-likes]").dataset.likes);
  const bLikes = parseInt(b.querySelector("[data-likes]").dataset.likes);

  return aLikes - bLikes;
}
export function sortByMostComments(a, b) {
  const aComments = parseInt(
    a.querySelector("[data-comments]").dataset.comments
  );
  const bComments = parseInt(
    b.querySelector("[data-comments]").dataset.comments
  );

  return bComments - aComments;
}
export function sortByLeastComments(a, b) {
  const aComments = parseInt(
    a.querySelector("[data-comments]").dataset.comments
  );
  const bComments = parseInt(
    b.querySelector("[data-comments]").dataset.comments
  );

  return aComments - bComments;
}

export function goBack() {
  history.back();
}
