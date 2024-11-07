export const BACKEND_URL = "http://127.0.0.1:3000";
export const data = await (await fetch(`${BACKEND_URL}/data`)).json();
export const currentUser = data["currentUser"];

// console.log(data);

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
  // console.log(post);
  return post;
}
export async function updateLikesCounter(labelEle) {
  // console.log(labelEle.parentElement);
  const post = await getPost(labelEle.parentElement.dataset.id);
  const input = labelEle.querySelector("input");
  const likesSpan = labelEle.querySelector("[data-likes]");

  post["liked"] = !input.checked;
  // console.log(post);
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

export function getNewCommentId() {
  // const productRequest =
  //   data["productRequests"][data["productRequests"].length - 1];
  // let lastComment = [{ id: -1 }];
  let latestId = -1;
  for (const productRequest of data["productRequests"]) {
    if (productRequest.comments) {
      for (const comment of productRequest.comments) {
        latestId = Math.max(latestId, comment.id);
      }
    }
  }
  // console.log(latestId);
  return parseInt(latestId) + 1;
  // console.log(productRequest);
  // if (productRequest.comments !== undefined) {
  //   return productRequest.comments[productRequest.comments.length - 1].id + 1;
  // }

  // return productRequest.id + 1;
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
  // location.reload();
  // location.href = document.referrer;
  history.back();
}
