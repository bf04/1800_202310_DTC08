function toggleForm(show) {
  if (show) {
    document.querySelector("#add-event-form").style.display = "";
    document.querySelector("#show-form-button").style.display = "none";
  } else {
    document.querySelector("#add-event-form").style.display = "none";
    document.querySelector("#show-form-button").style.display = "";
  }
}

function populateEventList(currentUser) {
  let template = document.getElementById("event-card-template");

  const formatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  db.collection("events")
    .orderBy("start_time")
    .get()
    .then((events) => {
      document.querySelector("#event-list").innerHTML = "";
      events.forEach((event) => {
        let description = event.data().description;
        let endTime = event.data().end_time;
        let location = event.data().location;
        let startTime = event.data().start_time;
        let title = event.data().title;
        let requiredParticipants = event.data().required_participants;

        let card = template.content.cloneNode(true);

        card.querySelector("#event-name").innerText = title;
        card.querySelector("#event-details").innerText = description;
        card.querySelector("#event-location").innerText =
          "Location: " + location;
        card.querySelector("#event-start-time").innerText =
          "Start: " + startTime.toDate().toLocaleString("en-US", formatOptions);
        card.querySelector("#event-end-time").innerText =
          "End: " + endTime.toDate().toLocaleString("en-US", formatOptions);
        card.querySelector("#event-required-participants").innerText =
          "Required Participants: " + requiredParticipants;
        let attendBtn = card.querySelector("#attend-event-button");
        db.collection("users")
          .doc(currentUser.uid)
          .collection("attending_events")
          .where("event", "==", event.ref)
          .get()
          .then((docs) => {
            if (docs.size !== 0) {
              attendBtn.innerText = "Attending";
              attendBtn.disabled = true;
            }
          });
        card
          .querySelector("#attend-event-button")
          .addEventListener("click", (ev) => {
            attendEvent(event.ref);
            ev.target.innerText = "Attending";
            ev.target.disabled = true;
          });

        document.querySelector("#event-list").appendChild(card);
      });
    });
}

function addEvent() {
  let title = document.querySelector("#form-event-title").value;
  let description = document.querySelector("#form-event-description").value;
  let location = document.querySelector("#form-event-location").value;
  let location_latitude = parseFloat(document.querySelector("#form-event-latitude").value);
  let location_longitude = parseFloat(document.querySelector("#form-event-longitude").value);
  let start_time = new Date(document.querySelector("#form-event-start").value);
  let end_time = new Date(document.querySelector("#form-event-end").value);
  let required_participants = document.querySelector(
    "#form-event-participants"
  ).valueAsNumber;

  const currentUser = firebase.auth().currentUser;
  if (currentUser !== null) {
    db.collection("events")
      .add({
        title,
        description,
        location,
        location_latitude,
        location_longitude,
        start_time,
        end_time,
        required_participants,
        author: currentUser.uid,
      })
      .then(() => {
        populateEventList();
        clearForm();
        toggleForm(false);
      });
  } else {
    alert("No user is signed in");
  }
}

function clearForm() {
  document.querySelector("#form-event-title").value = "";
  document.querySelector("#form-event-description").value = "";
  document.querySelector("#form-event-location").value = "";
  document.querySelector("#form-event-latitude").value = "";
  document.querySelector("#form-event-longitude").value = "";
  document.querySelector("#form-event-start").value = "";
  document.querySelector("#form-event-end").value = "";
  document.querySelector("#form-event-participants").value = "";
}

function attendEvent(event) {
  const currentUser = firebase.auth().currentUser;
  if (currentUser !== null) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("attending_events")
      .add({
        event,
      });
  } else {
    alert("No user is signed in");
  }
}

function setup() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      populateEventList(user);

      document
        .querySelector("#add-event-form")
        .addEventListener("submit", (ev) => {
          ev.preventDefault();
          addEvent();
        });
    }
  });
  document.querySelector("#show-form-button").addEventListener("click", () => {
    toggleForm(true);
  });
  document
    .querySelector("#cancel-form-button")
    .addEventListener("click", () => {
      toggleForm(false);
      clearForm();
    });
}

$(document).ready(setup);
