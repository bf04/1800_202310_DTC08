var currentUser;

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        var userName = userDoc.data().name;
        var userPhone = userDoc.data().phone;

        //if the data fields are not empty, then write them in to the form.
        if (userName != null) {
          document.getElementById("nameInput").value = userName;
        }
        if (userPhone != null) {
          document.getElementById("phoneInput").value = userPhone;
        }
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}

function saveUserInfo() {
  // console.log("inside saveUserInfo")
  //enter code here

  //a) get user entered values
  var userName = document.getElementById("nameInput").value;
  var userPhone = document.getElementById("phoneInput").value;

  //b) update user's document in Firestore
  currentUser
    .update({
      name: userName,
      phone: userPhone,
    })
    .then(() => {
      console.log("Document successfully updated!");
    });

  //c) disable edit
  document.getElementById("personalInfoFields").disabled = true;
}

async function populateEventList(currentUser) {
  let template = document.getElementById("event-card-template");

  const formatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  let events = await db
    .collection("users")
    .doc(currentUser.uid)
    .collection("attending_events")
    .get();

  document.querySelector("#event-list").innerHTML = "";

  events.forEach(async (attending) => {
    let event = await attending.data().event.get();
    let description = event.data().description;
    let endTime = event.data().end_time;
    let location = event.data().location;
    let startTime = event.data().start_time;
    let title = event.data().title;
    let requiredParticipants = event.data().required_participants;
    let author = event.data().author;
    let authorInfo = await db.collection("users").doc(author).get();
    let authorName;
    if (authorInfo.exists) {
      authorName = authorInfo.data().name;
    } else {
      authorName = "unknown";
    }

    let card = template.content.cloneNode(true);

    card.querySelector("#event-name").innerText = title;
    card.querySelector("#event-details").innerText = description;
    card.querySelector("#event-location").innerText = "Location: " + location;
    card.querySelector("#event-start-time").innerText =
      "Start: " + startTime.toDate().toLocaleString("en-US", formatOptions);
    card.querySelector("#event-end-time").innerText =
      "End: " + endTime.toDate().toLocaleString("en-US", formatOptions);
    card.querySelector("#event-required-participants").innerText =
      "Required Participants: " + requiredParticipants;
    card.querySelector("#event-author").innerText = "Posted by: " + authorName;

    document.querySelector("#event-list").appendChild(card);
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    populateEventList(user);
  }
});
