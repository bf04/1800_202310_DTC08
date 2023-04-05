function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      insertNameFromFirestore();
      getAttend(user);
    } else {
      console.log("No user is signed in");
    }
  });
}
doAll();

//----------------------------------------------------------
// Wouldn't it be nice to see User's Name on this page?
// Let's do it!  (Thinking ahead:  This function can be carved out,
// and put into script.js for other pages to use as well).
//----------------------------------------------------------//----------------------------------------------------------
function insertNameFromFirestore() {
  //check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //if user logged in
      console.log(user.uid);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((userDoc) => {
          userName = userDoc.data().name;
          document.getElementById("name-goes-here").innerHTML = userName;
        });
    }
  });
}

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks)
// and dynamically displays them in the gallery
//----------------------------------------------------------
async function getAttend(user) {
  const formatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      // Get the Array of bookmarks
      var attend = userDoc.data().attend;

      // Get pointer the new card template

      let newcardTemplate = document.getElementById("eventCardTemplate");
      // Iterate through the ARRAY of bookmarked hikes (document ID's)
      attend.forEach((thisEventID) => {
        console.log(thisEventID);
        db.collection("events")
          .doc(thisEventID)
          .get()
          .then((doc) => {
            var title = doc.data().title; // get value of the "name" key
            var location = doc.data().location; // get value of the "name" key
            // get value of the "details" key
            var startTime = doc.data().start_time; // get value of the "details" key
            var endTime = doc.data().end_time; // get value of the "details" key
            var details = doc.data().description;
            var participants = doc.data().required_participants; // get value of the "details" key
            //clone the new card
            let newcard = newcardTemplate.content.cloneNode(true);

            //update title and some pertinant information
            newcard.querySelector("#title").innerHTML = title;
            newcard.querySelector("#details").innerHTML = details;
            newcard.querySelector("#location").innerHTML =
              "Location: " + location;
            newcard.querySelector("#startTime").innerHTML =
              "Start Time: " +
              startTime.toDate().toLocaleString("en-US", formatOptions);
            newcard.querySelector("#endTime").innerHTML =
              "End Time: " +
              endTime.toDate().toLocaleString("en-US", formatOptions);
            newcard.querySelector("#participants").innerHTML =
              "Number of Participants: " + participants;
            // newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;

            //NEW LINE: update to display length, duration, last updated
            // newcard.querySelector('.card-update').innerHTML =
            //     "Last Edited: " + doc.data().last_updated.toDate().toLocaleDateString();

            //Finally, attach this new card to the gallery
            eventCardGroup.appendChild(newcard);
          });
      });
    });
}
