function toggleForm(show) {
  if (show) {
    document.querySelector("#add-event-form").style.display = "";
  } else {
    document.querySelector("#add-event-form").style.display = "none";
  }
}

function populateEventList() {
  let template = document.getElementById("event-card-template");
  const formatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  db.collection("events")
    .orderBy("start_time") //NEW LINE; what do you want to sort by?
    .get() //the collection called "events"
    .then((events) => {
      events.forEach((event) => {
        //iterate thru each doc
        let details = event.data().details;
        let endTime = event.data().end_time;
        let location = event.data().location;
        let startTime = event.data().start_time;
        let title = event.data().title;
        let requiredParticipants = event.data().required_participants;

        let card = template.content.cloneNode(true);

        //update title and text and image
        card.querySelector("#event-name").innerText = title;
        card.querySelector("#event-details").innerText = details;
        card.querySelector("#event-location").innerText =
          "Location: " + location;
        card.querySelector("#event-start-time").innerText =
          "Start: " + startTime.toDate().toLocaleString("en-US", formatOptions);
        card.querySelector("#event-end-time").innerText =
          "End: " + endTime.toDate().toLocaleString("en-US", formatOptions);
        card.querySelector("#event-required-participants").innerText =
          "Required Participants: " + requiredParticipants;

        // card.querySelector("i").onclick = () => saveBookmark(docID);
        //attach to gallery, Example: "events-go-here"
        document.querySelector("#event-list").appendChild(card);

        // currentUser.get().then((userDoc) => {
        //   //get the user name
        //   let bookmarks = userDoc.data().bookmarks;
        //   if (bookmarks.includes(docID)) {
        //     document.getElementById("save-" + docID).innerText = "bookmark";
        //   }
        // });
      });
    });
}

function setup() {
  populateEventList();
  document.querySelector("#show-form-button").addEventListener("click", () => {
    toggleForm(true);
  });
}

$(document).ready(setup);
