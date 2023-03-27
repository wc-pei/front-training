import '../assets/sass/normalize.scss';
import '../assets/sass/style.scss';

const topBtn = document.getElementById("js-top-scroll")!;
topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", () => {
    const scrollPosition = window.pageYOffset;
    scrollPosition > 1550 ? topBtn.classList.add("js-show") : topBtn.classList.remove("js-show");
});