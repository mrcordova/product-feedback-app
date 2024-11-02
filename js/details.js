console.log(localStorage.getItem("post"));

const postWrapper = document.querySelector("[data-post-wrapper]");
postWrapper.insertAdjacentHTML("beforeend", localStorage.getItem("post"));
