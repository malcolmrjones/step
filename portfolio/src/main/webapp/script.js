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

/**
 * Makes request to receive all comments from server
 */
function fetchComments() {
  const commentsPromise = fetch("/data?" + "comment-count=" + document.getElementById("comment-count").value) 

  commentsPromise
    .then(response => response.json())
    .then(displayComments);
}

/**
 * Displays comment by adding each comment to comment list element
 * @param {!Array<string>} comments 
 */
function displayComments(comments) {
  const commentList = document.getElementById("commentlist");

  //Remove all children of comment list to prevent dusplicate display
  while (commentList.firstChild) {
    commentList.removeChild(commentList.firstChild);
  }

  for (comment of comments) {
    const commentListItem = document.createElement('li');
    commentListItem.innerText = comment;
    commentList.appendChild(commentListItem);
  }
}

/**
 * Sends request to remove all comments
 */
function deleteAllComments() {

  window.confirm("Are you sure you want to delete all the comments?");
  
  var passwordConfirmation = "911b0a07a8cacfebc5f1f45596d67017136c950499fa5b4" + 
    "ff6faffa031f3cec7f197853d1660712c154e1f59c60f682e34ea9b5cbd2d8d5" + 
    "adb0c834f963f30de";
  var password = window.prompt("Please enter the pasword to confirm you have the POWWEEER to delete ALL COMMENTS!!!!!!!!!!!");

  if (password !== confirmpss) {
    window.alert("WRONG PASSWORD!");
    return;
  }

  const request = new Request("/delete-data", { method: "POST" });
  const removeCommentsPromise = fetch(request);

  removeCommentsPromise.then(fetchComments);
}

/**
 * Changes source of gallery image view to the next image
 */
function nextImage() {
  if (imageIndex < 24) {
    imageIndex += 1;
  }
  else {
    imageIndex = 1;
  }

  const imageView = document.getElementById("gallery-img");
  imageView.src = "images/gallery/pic-" + imageIndex + ".jpg";
}

/**
 * Changes source of gallery image view to the previous image
 */
function prevImage() {
  if (imageIndex > 1) {
    imageIndex -= 1;
  }
  else {
    imageIndex = 24;
  }

  const imageView = document.getElementById("image-view");
  imageView.src = "images/gallery/pic-" + imageIndex + ".jpg";
}