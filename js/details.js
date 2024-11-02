// console.log(localStorage.getItem("post"));
const dataResponse = await fetch("data.json");
const data = await dataResponse.json();

console.log(data);

const postWrapper = document.querySelector("[data-post-wrapper]");
postWrapper.insertAdjacentHTML("beforeend", localStorage.getItem("post"));
