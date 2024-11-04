const main = document.querySelector("main");

main.addEventListener("click", (e) => {
  //   e.preventDefault();
  const goBackBtn = e.target.closest("[data-go-back]");

  if (goBackBtn) {
    history.back();
  }
});
