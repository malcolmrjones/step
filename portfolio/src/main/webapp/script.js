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


/**
 * Adds a random greeting to the page.
 */
function addGreeting() {
  const greetingPromise = fetch("/data");
  greetingPromise.then(handleGreeting);
}

/**
 * Functions handles getting the text content of the greeting
 * @param {Response} response
 * @return A Promise when get text callback is complete
 */
function handleGreeting(response) {
  const greetingTextPromise = response.text();
  greetingTextPromise.then(displayGreeting);
}

/**
 * Displays the greeting message to the DOM
 * @param {string} greetingText
 * @return A Promise when get text callback is complete
 */
function displayGreeting(greetingText) {
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greetingText;
}

/**
 * Makes request to receive all comments from server
 */
function fetchComments() {
  const commentsPromise = fetch("/data")
  commentsPromise
    .then(response => response.json())
    .then(displayComments);
}

/**
 * Displays comment by adding each comment to comment list element
 * @param {string[]} comments 
 */
function displayComments(comments) {
  const commentList = document.getElementById("commentlist");

  for(comment of comments) {
    const commentListItem = document.createElement('li');
    commentListItem.innerText = comment;
    commentList.appendChild(commentListItem);
  }
}
