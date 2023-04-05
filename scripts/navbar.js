firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.querySelector("#signed-in-nav").style.display = "contents";
    window.localStorage.setItem("signedIn", "yes");
  } else {
    document.querySelector("#signed-in-nav").style.display = "none";
    window.localStorage.setItem("signedIn", "no");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  let signedIn = window.localStorage.getItem("signedIn");
  if (signedIn === "yes") {
    document.querySelector("#signed-in-nav").style.display = "contents";
  } else {
    document.querySelector("#signed-in-nav").style.display = "none";
  }
});
