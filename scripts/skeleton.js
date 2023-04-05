//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Do something for the user here.
      $("#navbarPlaceholder").load("./text/nav_after_login.html");
      $("#footerPlaceholder").load("./text/footer.html");
    } else {
      // No user is signed in.
      $("#navbarPlaceholder").load("./text/nav_before_login.html");
      $("#footerPlaceholder").load("./text/footer.html");
    }
  });
}
loadSkeleton(); //invoke the function
