(() => {
  //hide custom dropdowns when clicked outside
  document.querySelector("body").onclick = (evt) => {
    if (evt.target.closest(".dropdown")) {
      return;
    }

    document.querySelectorAll(".dropdown-menu").forEach((ele) => {
      ele.classList.remove("show");
    });
  };

  tinymce.init({
    selector: '.wyswyg',
    promotion: false,
    branding: false,
    skin: "oxide-dark",
    content_css: "dark"
  });
})();
