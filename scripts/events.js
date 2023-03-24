function toggleForm(show) {
  if (show) {
    document.querySelector("#add-event-form").style.display = "";
    document.querySelector("#show-form-button").style.display = "none";
  } else {
    document.querySelector("#add-event-form").style.display = "none";
    document.querySelector("#show-form-button").style.display = "";
  }
}

function populateEventList() {
  let template = document.getElementById("event-card-template");

  document.querySelector("#event-list").innerHTML = "";

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

        document.querySelector("#event-list").appendChild(card);
      });
    });
}

function addEvent() {
  let title = document.querySelector("#form-event-title").value;
  let description = document.querySelector("#form-event-description").value;
  let location = document.querySelector("#form-event-location").value;
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
  document.querySelector("#form-event-start").value = "";
  document.querySelector("#form-event-end").value = "";
  document.querySelector("#form-event-participants").value = "";
}

function setup() {
  populateEventList();
  document.querySelector("#show-form-button").addEventListener("click", () => {
    toggleForm(true);
  });
  document.querySelector("#add-event-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    addEvent();
  });
  document
    .querySelector("#cancel-form-button")
    .addEventListener("click", () => {
      toggleForm(false);
      clearForm();
    });
}

$(document).ready(setup);
