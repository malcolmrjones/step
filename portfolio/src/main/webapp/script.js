// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let imageIndex = 1;
let map;

/*
* Initialization function
*/
window.onload = function() {
  handleCommentFormVisibility();
  initializeAuth();
  fetchComments();
  document.getElementById("comment-input").oninput = function() {
    const commentCharactersLabel = document.getElementById(
      "comment-character-count"
    );

    commentCharactersLabel.innerHTML =
      this.value.length + " / " + this.maxLength;

    if (this.maxLength - this.value.length <= 10) {
      commentCharactersLabel.style.color = "red";
    } else {
      commentCharactersLabel.style.color = "inherit";
    }
  };
};

/**
 * Makes request to receive all comments from server
 */
function fetchComments() {
  const commentsPromise = fetch(
    "/data?" + "comment-count=" + document.getElementById("comment-count").value
  );

  commentsPromise.then((response) => response.json()).then(displayComments);
}

/**
 * Displays comment by adding each comment to comment list element
 * @param {!Array<string>} comments
 */
function displayComments(comments) {
  const commentList = document.getElementById("comment-list");

  //Remove all children of comment list to prevent dusplicate display
  while (commentList.firstChild) {
    commentList.removeChild(commentList.firstChild);
  }

  for (comment of comments) {
    let displayName = comment["authorName"];
    if (displayName === "") displayName = comment["authorEmail"];

    const commentListItem = createCommentItem(
      displayName,
      Number(comment["timestamp"]),
      comment["content"]
    );
    commentList.appendChild(commentListItem);
  }
}

/**
 * Creates the DOM element for a comment
 * @param {string} author
 * @param {number} timestamp
 * @param {string} content
 */
function createCommentItem(author, timestamp, content) {
  const commentListItem = document.createElement("li");
  const commentItemDiv = document.createElement("div");
  const commentItemAuthor = document.createElement("h3");
  const commentItemDate = document.createElement("p");
  const commentItemTime = document.createElement("p");
  const commentItemContent = document.createElement("p");

  commentListItem.classList.add("comment-item");

  commentItemAuthor.classList.add("comment-item-author");
  commentItemDate.classList.add("comment-item-date");
  commentItemTime.classList.add("comment-item-time");

  const commentDate = new Date(timestamp);

  commentItemAuthor.innerHTML = author;
  commentItemDate.innerHTML =
    commentDate.getMonth() +
    1 +
    "/" +
    commentDate.getDate() +
    "/" +
    commentDate.getFullYear();
  commentItemTime.innerHTML =
    commentDate.getHours() +
    ":" +
    commentDate.getMinutes() +
    ":" +
    commentDate.getSeconds();
  commentItemContent.innerHTML = content;

  commentItemDiv.appendChild(commentItemAuthor);
  commentItemDiv.appendChild(commentItemDate);
  commentItemDiv.appendChild(commentItemTime);

  commentListItem.appendChild(commentItemDiv);
  commentListItem.appendChild(commentItemContent);

  return commentListItem;
}

/**
 * Changes source of gallery image view to the next image
 */
function nextImage() {
  imageIndex = (imageIndex + 1) % 24;
  const imageView = document.getElementById("gallery-img");
  imageView.src = "images/gallery/pic-" + imageIndex + ".jpg";
}

/**
 * Changes source of gallery image view to the previous image
 */
function prevImage() {
  imageIndex = (((imageIndex - 1) % 24) + 24) % 24;
  const imageView = document.getElementById("gallery-img");
  imageView.src = "images/gallery/pic-" + imageIndex + ".jpg";
}

/**
 * Hides comment form if user is not signed in. Otherwise display user form.
 */
function handleCommentFormVisibility() {
  const loginStatusPromise = fetch("/login/status");

  loginStatusPromise
    .then((response) => response.json())
    .then((loginInfo) => {
      const loginStatus = loginInfo["loginStatus"];
      const commentForm = document.getElementById("comment-form");
      const loginAlert = document.getElementById("comment-login-alert");
      if (loginStatus === "true") {
        commentForm.style.visibility = "visible";
        loginAlert.style.visibility = "collapse";
      } else {
        commentForm.style.visibility = "hidden";
        loginAlert.style.visibility = "visible";
      }
    });
}

/**
 * Retrieves auth info and displays the correct login interface
 */
function initializeAuth() {
  const loginStatusPromise = fetch("/login/status");

  loginStatusPromise
    .then((response) => response.json())
    .then((loginInfo) => {
      const loginStatus = loginInfo["loginStatus"];
      const loginURL = loginInfo["loginURL"];
      const logoutURL = loginInfo["logoutURL"];

      const authButton = document.getElementById("auth-button");
      const authGreeting = document.getElementById("auth-greeting");

      if (loginStatus === "true") {
        authGreeting.innerHTML = "You're logged in:";

        authButton.innerHTML = "Log Out";
        authButton.href = logoutURL;
        authButton.classList.add("logout");
        authButton.classList.remove("login");
      } else {
        authGreeting.innerHTML = "Please log in here: ";

        authButton.innerHTML = "Log In";
        authButton.href = loginURL;
        authButton.classList.add("login");
        authButton.classList.remove("logout");
      }
    });
}

/**
 * Creates the control component that shows information about tropical storms
 * @param {HTMLDivElement} controlDiv
 */
function InfoControl(controlDiv) {
  let controlUI = document.createElement("div");
  controlUI.classList.add("tropicalStormInfoControl");
  controlDiv.appendChild(controlUI);

  let controlText = document.createElement("div");
  controlText.textContent =
    "Hover over a path to get info on the tropical storm.";
  controlUI.appendChild(controlText);
}

/**
 * Generates a map from Google Map API
 */
function initializeMap() {
  fetch("/tropical-storm-data")
    .then((response) => response.json())
    .then((tropicalStormData) => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.5733225, lng: -80.7187387 },
        zoom: 8,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      let infoControlDiv = document.createElement("div");
      let infoControl = new InfoControl(infoControlDiv, map);

      infoControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoControlDiv);

      Object.keys(tropicalStormData).forEach((tropicalStormID) => {
        let tropicalStormPathCoords = [];

        tropicalStormData[tropicalStormID].forEach((dataPoint) => {
          tropicalStormPathCoords.push({
            lat: dataPoint["lat"],
            lng: dataPoint["lon"]
          });
        });

        let randomHue = Math.floor(Math.random() * 360) + 90;
        let randomColor = `hsl(${randomHue}, 100%, 40%)`;

        tropicalStormPath = new google.maps.Polyline({
          path: tropicalStormPathCoords,
          geodesic: true,
          strokeColor: randomColor,
          strokeOpacity: 0.75,
          strokeWeight: 8,
          map: map
        });

        /*
         Event handling to "highlight" a hurricane path and displaying its info
         */
        google.maps.event.addListener(
          tropicalStormPath,
          "mouseover",
          function() {
            infoControlDiv.firstChild.textContent = `${tropicalStormData[tropicalStormID][0]["name"]} ${tropicalStormData[tropicalStormID][0]["season"]} | First Landfall on ${tropicalStormData[tropicalStormID][0]["date"]} | ID:${tropicalStormID}`;
            this.setOptions({
              strokeOpacity: 1,
              strokeWeight: 10
            });
          }
        );
        google.maps.event.addListener(
          tropicalStormPath,
          "mouseout",
          function() {
            infoControlDiv.firstChild.textContent =
              "Hover over a path to get info on the tropical storm.";
            this.setOptions({
              strokeOpacity: 0.75,
              strokeWeight: 8
            });
          }
        );
      });
    });
}
