"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-regular fa-star" style="cursor:pointer;"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author text-muted">by ${story.author}</small>
        <footer class="story-user blockquote-footer  m-1">posted by ${story.username}</footer>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  if(currentUser) currentUser.starFav();
}

async function newStory(evt) {
  console.debug("submit", evt);
  evt.preventDefault();

  const title = $('#story-title').val();
  const author = $('#story-author').val();
  const url = $('#story-url').val();

  currentUser.ownStories.push(await storyList.addStory(
    currentUser,{
      title: title, 
      author: author, 
      url: url
    }));
  getAndShowStoriesOnStart();
  myLinkState()
  signedInPageComponents();
  $storyForm.hide();
  $storyForm.trigger("reset");
}
$storyForm.on("submit", newStory);


async function favoriteToggle(evt) {
  const $trgt = $(evt.target).closest('i');
  const storyId = $trgt.closest("li").attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  const method = $trgt.hasClass('fa-regular')? 'POST' : 'DELETE'
  starToggle($trgt);
  await currentUser.toggleFavoriteStory(story, method)
  favLinkState();
}

$allStoriesList.on('click','.fa-star',favoriteToggle)

const starToggle = ($trgt) => {
  if ($trgt.hasClass('fa-regular')){
    $trgt.addClass('fa-solid')
    $trgt.removeClass('fa-regular')
  } else {
    $trgt.addClass('fa-regular')
    $trgt.removeClass('fa-solid')
  }
}

function showFavStories() {
  $allStoriesList.empty()
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  currentUser.starFav()
}
function showMyStories() {
  $allStoriesList.empty()
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $story.prepend('<i class="fas fa-trash-alt" style="cursor:pointer;"></i>')
    $allStoriesList.append($story);
  }
  currentUser.starFav()
}

async function deleteMyStory(evt) {
  const $trgt = $(evt.target).closest('li');
  storyList.deleteStory(currentUser,$trgt.attr('id'))
  $trgt.remove();
}

$allStoriesList.on('click','.fa-trash-alt',deleteMyStory)