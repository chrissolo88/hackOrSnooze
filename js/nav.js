"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  putStoriesOnPage();
  currentUser ? signedInPageComponents() : signedOutPageComponents()
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  evt.preventDefault()
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $('#signinWarning').hide();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);
$('.alert-link').on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $('#signinWarning').hide();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitLinkClick(evt) {
  evt.preventDefault()
  console.debug("submitLinkClick", evt);
  hidePageComponents();
  $(".main-nav-links").show();
  $storyForm.show();
}

$submitLink.on('click',submitLinkClick);


function favLinkState() {
  if(currentUser.favorites.length > 0) {
    $favLink.removeClass('disabled')
  } else {
    $favLink.addClass('disabled')
  };
}

function myLinkState() {
  if(currentUser.ownStories.length > 0) {
    $myLink.removeClass('disabled')
  } else {
    $myLink.addClass('disabled')
  }
}
function favLinkClick(evt) {
  evt.preventDefault()
  showFavStories();
}

$favLink.on("click", favLinkClick);

function myLinkClick(evt) {
  evt.preventDefault()
  showMyStories();
}

$myLink.on("click", myLinkClick);