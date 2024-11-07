export const URL = "http://127.0.0.1:3000";
export const data = await (await fetch(`${URL}/data`)).json();
export const currentUser = data["currentUser"];

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
  // console.log(results);
  return results;
}
export async function getPost(id) {
  // const productRequests = data["productRequests"];
  const response = await fetch(`${URL}/getPost/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // const post_id = parseInt(id);
  // let post;
  // for (const productRequest of productRequests) {
  //   if (productRequest.id === post_id) {
  //     post = productRequest;
  //   }
  // }
  const postResponse = await response.json();
  const post = postResponse.post;
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
  const response = await fetch(`${URL}/updateLike/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  console.log(await response.json());
  return post;
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
