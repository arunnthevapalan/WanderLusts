/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Get ?user=XYZ parameter value
const urlParams = new URLSearchParams(window.location.search);
const parameterUsername = urlParams.get('user');

// URL must include ?user=XYZ parameter. If not, redirect to homepage.
if (!parameterUsername) {
  window.location.replace('/');
}

/** Sets the page title based on the URL parameter username. */
function setPageTitle() {
  document.getElementById('page-title').innerText = parameterUsername;
  document.title = parameterUsername + ' - User Page';
}

/**
 * Shows the message form if the user is logged in and viewing their own page.
 */
function showMessageFormIfViewingSelf() {

  fetch('/login-status')
      .then((response) => {
        return response.json();
      })
      .then((loginStatus) => {
        if (loginStatus.isLoggedIn &&
            loginStatus.username == parameterUsername) {
          const messageForm = document.getElementById('message-form');
          messageForm.classList.remove('hidden');
          document.getElementById('about-me-form').classList.remove('hidden');
        }
      });
}

/** Fetches messages and add them to the page. */
function fetchMessages() {
  const url = '/messages?user=' + parameterUsername;
  fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((messages) => {
        const messagesContainer = document.getElementById('message-container');
        if (messages.length == 0) {
          messagesContainer.innerHTML += '<p>This user has no posts yet.</p>';
        } else {
          messagesContainer.innerHTML += '';
        }
        messages.forEach((message) => {
          const messageDiv = buildMessageDiv(message);
          messagesContainer.appendChild(messageDiv);
        });
      });
}

/**
 * Builds an element that displays the message.
 * @param {Message} message
 * @return {Element}
 */

function buildMessageDiv(message) {
  var messageDiv = document.createElement('div');
  messageDiv.className += "card gedf-card";

  const htmlString = ` <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="mr-2">
                                <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                            </div>
                            <div class="ml-2">
                                <div class="h5 m-0" id="message-username">@LeeCross</div>
                                <div class="h7 text-muted" id="message-nickname">Miracles Lee Cross</div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>

                </div>
                <div class="card-body">
                    <div class="text-muted h7 mb-2" id="message-time"><i class="fa fa-clock-o"></i> 10 min ago</div>
                    <p class="card-text" id="message-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam omnis nihil, aliquam est,
                        voluptates officiis iure soluta
                        alias vel odit, placeat reiciendis ut libero! Quas aliquid natus cumque quae repellendus. Lorem
                        ipsum dolor sit amet consectetur adipisicing elit. Ipsa, excepturi. Doloremque, reprehenderit!
                        Quos in maiores, soluta doloremque molestiae reiciendis libero expedita assumenda fuga quae.
                        Consectetur id molestias itaque facere? Hic!
                    </p>
                    
                    <div>
                    <img src="" id="message-imageUrl" class="hidden">
                    </div>
                    
                    <div id="message-hashtags">
                        <span class="badge badge-primary">JavaScript</span>
                        <span class="badge badge-primary">Android</span>
                        <span class="badge badge-primary">PHP</span>
                        <span class="badge badge-primary">Node.js</span>
                        <span class="badge badge-primary">Ruby</span>
                        <span class="badge badge-primary">Paython</span>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-link"><i class="fa fa-gittip"></i> Like</a>
                </div>`;


  messageDiv.innerHTML+= htmlString.trim();

  message_text= messageDiv.querySelector("#message-text");
  message_text.innerHTML= message.text;

  message_username=messageDiv.querySelector("#message-username");
  message_username.innerHTML=message.user;

  message_nickname=messageDiv.querySelector("#message-nickname");
  message_nickname.innerHTML=message.user;

  message_time=messageDiv.querySelector("#message-time");
  message_time.innerHTML=new Date(message.timestamp);

  if(message.imageUrl!=null){
    message_imageUrl=messageDiv.querySelector("#message-imageUrl");
    message_imageUrl.src=message.imageUrl;
    message_imageUrl.classList.remove('hidden');

  }

  return messageDiv;
}

/** Fetches About me details from /about endpoint */
function fetchAboutMe(){
  const url = '/about?user=' + parameterUsername;
  fetch(url).then((response) => {
    return response.text();
  }).then((aboutMe) => {
    const aboutMeContainer = document.getElementById('about-me-container');
    if(aboutMe == ''){
      aboutMe = 'This user has not entered any information yet.';
    }

    aboutMeContainer.innerHTML = aboutMe;

  });
}


/** Fetches BlobstoreUrl for the Message Form. */
function fetchBlobstoreUrlAndShowMessageForm() {
  fetch('/blobstore-upload-url?type=message')
      .then((response) => {
        return response.text();
      })
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('msg-form');
        messageForm.action = imageUploadUrl;
        messageForm.classList.remove('hidden');
      });
}

/** Fetches BlobstoreUrl for the About Me Form. */
function fetchBlobstoreUrlAndShowAboutmeForm() {
  fetch('/blobstore-upload-url?type=aboutme')
      .then((response) => {
        return response.text();
      })
      .then((imageUploadUrl) => {
        const messageForm = document.getElementById('about-me-form');
        messageForm.action = imageUploadUrl;
      });
}


/** Fetches data and populates the UI of the page. */
function buildUI() {
  loadNavigation();
  setPageTitle();
  fetchBlobstoreUrlAndShowMessageForm();
  showMessageFormIfViewingSelf();
  fetchMessages();
  fetchAboutMe();
}