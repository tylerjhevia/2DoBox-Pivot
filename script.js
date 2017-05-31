$(document).ready(reloadCards);

$('.input-title, .input-task').on('input', enableSaveButton);
$('.save-button').on('click', clickSave);
$('.show-completed-button').on('click', reloadCompletedTasks);
$('.card-container').on('keyup', '.idea-title', editAndStoreTitle);
$('.card-container').on('keyup', '.idea-body',  editAndStoreBody);
$('.card-container').on('click', '.arrow-up', upvote);
$('.card-container').on('click', '.arrow-down', downvote);
$('.card-container').on('click', '.delete-button', deleteCard);
$('.search-input').on('input',  searchIdeas);
$(".card-container").on("click", ".completed-task-button", grayOutCompleted);
$('.card-container').on('keypress', '.idea-input', saveEditsOnEnter);
$('.critical-filter').on('click', filterCardsByImportance);
$('.high-filter').on('click', filterCardsByImportance);
$('.normal-filter').on('click', filterCardsByImportance);
$('.low-filter').on('click', filterCardsByImportance);
$('.none-filter').on('click', filterCardsByImportance);
$('.show-more-button').on('click', reloadAllCards);

function Idea(title, body)  {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.completed = false;
  this.importance = ["None", "Low", "Normal", "High", "Critical"];
  this.index = 2;
  this.currentImportance = this.importance[this.index];
}

function reloadCards() {
  for (var i = 0; i < localStorage.length; i++) {
    var ideaObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (ideaObject.completed === false) {
      limitNumberOfCards(ideaObject);
    }
  }
}

function reloadAllCards() {
  $('.idea-card').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var ideaObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependCard(ideaObject);
  }
}

// we want to check how many cards are on page when we press save
// if there are < 10, we want to run prependCard as usual
// if there are >= 10, we want to remove the oldest (bottom) card from the page and then run prependCard
function limitNumberOfCards(idea) {
  var cardCount = $('.idea-card').length;
  console.log(cardCount[2]);
  var cardsOnScreenArray = $('.idea-card');
  if (cardCount < 10) {
    prependCard(idea);
  } else {
     cardsOnScreenArray[9].remove();
     prependCard(idea);
    }
}

function filterCardsByImportance() {
  $('.idea-card').remove();
  var filterBy = (this).innerHTML;
  for (var i = 0; i < localStorage.length; i++) {
    var ideaObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (ideaObject.currentImportance === filterBy) {
      prependCard(ideaObject);
    }
  }
}

function clickSave() {
  var title = $('.input-title').val();
  var body = $('.input-task').val();
  var idea = new Idea(title, body);
  limitNumberOfCards(idea);
  // prependCard(idea);
  sendToStorage(idea);
  clearInputFields();
  disableSaveButton();
}

function sendToStorage(idea)  {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function prependCard(idea)  {
  $('.card-container').prepend(`
    <article class='idea-card'id=${idea.id}>
      <input class='idea-title idea-input' type='text' value='${idea.title}'>
      <button class='delete-button'></button>
      <textarea cols='30' rows='10' class='idea-body idea-input' type='text' value=''>${idea.body}</textarea>
      <section class='button-container'>
        <button class='arrow-up'></button>
        <button class='arrow-down'></button>
        <p class='importance'>Importance:</p>
        <p class='current-importance'> ${idea.currentImportance}</p>
        <button class="completed-task-button">Completed Task</button>
      </section>
      <hr />
    </article>
    `)
}

function clearInputFields() {
  $('.input-title').val('');
  $('.input-task').val('');
}

function disableSaveButton() {
  $('.save-button').prop('disabled', true)
}

function enableSaveButton()  {
  var ideaTitle = $('.input-title').val();
  var ideaBody = $('.input-task').val();
    if (ideaTitle === "" || ideaBody === "") {
      $('.save-button').prop('disabled', true)
    } else {$('.save-button').prop('disabled', false)
      }
}

function editAndStoreTitle() {
  var id = $(this).parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  parsedIdea.title = $(this).val();
  localStorage.setItem(id, JSON.stringify(parsedIdea));
}

function editAndStoreBody() {
  var id = $(this).parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  parsedIdea.body = $(this).val();
  localStorage.setItem(id, JSON.stringify(parsedIdea));
}

function downvote() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  if (parsedIdea.index === 0 ) {
    return
  }
  parsedIdea.index--;
  parsedIdea.currentImportance = parsedIdea.importance[parsedIdea.index];
  sendToStorage(parsedIdea);
  $(this).siblings('.current-importance').text(parsedIdea.importance[parsedIdea.index]);
}

function upvote() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  if (parsedIdea.index === parsedIdea.importance.length - 1) {
    return
  }
  parsedIdea.index++;
  parsedIdea.currentImportance = parsedIdea.importance[parsedIdea.index];
  sendToStorage(parsedIdea);
  $(this).siblings('.current-importance').text(parsedIdea.importance[parsedIdea.index]);
}

function deleteCard() {
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
}

function searchIdeas() {
  var searchInput = $(this).val().toLowerCase();
  $(".idea-card").each(function() {
    var ideaText = $(this).children('.idea-input').text().toLowerCase();
    console.log((this).children);
    if(ideaText.indexOf(searchInput) !== -1) {
      $(this).show();
    }
    else {
      $(this).hide();
    }
  })
}

function saveEditsOnEnter(event) {
  var ideaID = ($(this).closest('.idea-card').prop('id'));
  var parsedIdea = JSON.parse(localStorage.getItem(ideaID));
  if(event.keyCode === 13) {
    event.preventDefault();
    sendToStorage(parsedIdea);
    $('.idea-input').blur();
  }
}

function grayOutCompleted() {
  var ideaID = ($(this).closest('.idea-card').prop('id'));
  var parsedIdea = JSON.parse(localStorage.getItem(ideaID));
  parsedIdea.completed = true;
  sendToStorage(parsedIdea);
  $(this).parent().parent().addClass('grayout');
}

function reloadCompletedTasks() {
  for (var i = 0; i < localStorage.length; i++) {
    var ideaObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (ideaObject.completed === true) {
      prependCard(ideaObject);
    }
  }
}
