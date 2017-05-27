$(document).ready(reloadCards);

$('.input-title, .input-body').on('input', enableSaveButton);
$('.save-button').on('click', clickSave);
$('.card-container').on('keyup', '.idea-title', editAndStoreTitle);
$('.card-container').on('keyup', '.idea-body',  editAndStoreBody);
$('.card-container').on('click', '.arrow-up', upvoteFromPlausible)
                    .on('click', '.arrow-up', upvoteFromSwill);
$('.card-container').on('click', '.arrow-down', downvoteFromPlausible)
                    .on('click', '.arrow-down', downvoteFromGenius);
$('.card-container').on('click', '.delete-button', deleteCard);
$('.search-input').on('input',  searchIdeas);


function reloadCards() {
  for (var i = 0; i < localStorage.length; i++) {
  prependCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
}

function Idea(title, body)  {
  this.title = title;
  this.body = body;
  this.quality = 'Swill';
  this.id = Date.now();
}

function clickSave() {
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var idea = new Idea(title, body);
  prependCard(idea);
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
        <p class='quality'>quality:</p>
        <p class='quality-value'> ${idea.quality}</p>
      </section>
      <hr />
    </article>
    `)
}

function clearInputFields() {
  $('.input-title').val('');
  $('.input-body').val('');
}

function disableSaveButton() {
  $('.save-button').prop('disabled', true)
}

function enableSaveButton()  {
  var ideaTitle = $('.input-title').val();
  var ideaBody = $('.input-body').val();
    if (ideaTitle === "" || ideaBody === "") {
      $('.save-button').prop('disabled', true)
  } else {$('.save-button').prop('disabled', false)
}
}


// $(document).keypress(function(e) {    WHAT IS THIS?????
//   if(e.which == 13) {
//     enableSaveButton13();
// // //   }
// // })

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
//
function upvoteFromSwill() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  if(parsedIdea.quality === 'Swill') {
    parsedIdea.quality = 'Plausible'
    $(this).siblings('.quality-value').text('Plausible');
  }
  localStorage.setItem(id, JSON.stringify(parsedIdea));
}

function upvoteFromPlausible() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  if (parsedIdea.quality === 'Plausible') {
      parsedIdea.quality = 'Genius'
      $(this).siblings('.quality-value').text('Genius');
  }
  localStorage.setItem(id, JSON.stringify(parsedIdea));
}

function downvoteFromGenius() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  if (parsedIdea.quality === 'Genius') {
      parsedIdea.quality = 'Plausible'
      $(this).siblings('.quality-value').text('Plausible');
    }
    localStorage.setItem(id, JSON.stringify(parsedIdea));
}

function downvoteFromPlausible() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  if (parsedIdea.quality === 'Plausible') {
      parsedIdea.quality = 'Swill'
      $(this).siblings('.quality-value').text('Swill');
    }
    localStorage.setItem(id, JSON.stringify(parsedIdea));
}

function deleteCard() {
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
}


function searchIdeas() {
  var searchInput = $(this).val().toLowerCase();
  $(".idea-card").each(function() {
    var ideaText = $(this).text().toLowerCase();
    if(ideaText.indexOf(searchInput) !== -1) {
      $(this).show();
    }
    else {
      $(this).hide();
    }
  })
}
