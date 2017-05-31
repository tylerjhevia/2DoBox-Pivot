// fix filter function to search through task titles as well as task bodies
$(document).ready(reloadCards);

$('.input-title, .input-task').on('input', enableSaveButton);
$('.save-button').on('click', clickSave);
$('.show-completed-button').on('click', reloadCompletedTasks);
$('.card-container').on('keyup', '.task-title', editAndStoreTitle);
$('.card-container').on('keyup', '.task-body',  editAndStoreBody);
$('.card-container').on('click', '.arrow-up', upvote);
$('.card-container').on('click', '.arrow-down', downvote);
$('.card-container').on('click', '.delete-button', deleteCard);
$('.search-input').on('input',  searchTaskBodies)
                  .on('input',  searchTaskTitles);
$(".card-container").on("click", ".completed-task-button", grayOutCompleted);
$('.card-container').on('keypress', '.task-input', saveEditsOnEnter);
$('.critical-filter').on('click', filterCardsByImportance);
$('.high-filter').on('click', filterCardsByImportance);
$('.normal-filter').on('click', filterCardsByImportance);
$('.low-filter').on('click', filterCardsByImportance);
$('.none-filter').on('click', filterCardsByImportance);
$('.show-more-button').on('click', reloadAllIncomplete);

function Task(title, body)  {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.completed = false;
  this.importance = ["None", "Low", "Normal", "High", "Critical"];
  this.index = 2;
  this.currentImportance = this.importance[this.index];
}

function reloadCards() {
  $('.task-card').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var taskObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (taskObject.completed === false) {
      limitNumberOfCards(taskObject);
    }
  }
}

function limitNumberOfCards(task) {
  var cardCount = $('.task-card').length;
  var cardsOnScreenArray = $('.task-card');
  if (cardCount < 10) {
    prependCard(task);
  } else {
    cardsOnScreenArray[9].remove();
    prependCard(task);
  }
}

// function reloadAllCards() {
//   $('.task-card').remove();
//   for (var i = 0; i < localStorage.length; i++) {
//     var taskObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
//     prependCard(taskObject);
//   }
// }

function reloadAllIncomplete() {
  $('.task-card').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var taskObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependIfIncomplete(taskObject);
  }
}

function prependIfIncomplete(taskObject) {
  if (taskObject.completed === false) {
    prependCard(taskObject);
  }
}

function filterCardsByImportance() {
  $('.task-card').remove();
  var qualityToFilterBy = (this).innerHTML;
  for (var i = 0; i < localStorage.length; i++) {
    var taskObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (taskObject.currentImportance === qualityToFilterBy) {
      prependIfIncomplete(taskObject);
    }
  }
}

function clickSave() {
  var title = $('.input-title').val();
  var body = $('.input-task').val();
  var task = new Task(title, body);
  limitNumberOfCards(task);
  sendToStorage(task);
  clearInputFields();
  disableSaveButton();
}

function sendToStorage(task)  {
  localStorage.setItem(task.id, JSON.stringify(task));
}

function prependCard(task)  {
  $('.card-container').prepend(`
    <article class='task-card'id=${task.id}>
      <input class='task-title task-input' type='text' value='${task.title}'/>
      <button class='delete-button'></button>
      <textarea cols='30' rows='10' class='task-body task-input' type='text' value=''>${task.body}</textarea>
      <section class='button-container'>
        <button class='arrow-up'></button>
        <button class='arrow-down'></button>
        <p class='importance'>Importance:</p>
        <p class='current-importance'> ${task.currentImportance}</p>
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
  var taskTitle = $('.input-title').val();
  var taskBody = $('.input-task').val();
    if (taskTitle === "" || taskBody === "") {
      $('.save-button').prop('disabled', true)
    } else {$('.save-button').prop('disabled', false)
      }
}

function editAndStoreTitle() {
  var id = $(this).parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  parsedTask.title = $(this).val();
  localStorage.setItem(id, JSON.stringify(parsedTask));
}

function editAndStoreBody() {
  var id = $(this).parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  parsedTask.body = $(this).val();
  localStorage.setItem(id, JSON.stringify(parsedTask));
}

function saveEditsOnEnter(event) {
  var taskID = ($(this).closest('.task-card').prop('id'));
  var parsedTask = JSON.parse(localStorage.getItem(taskID));
  if(event.keyCode === 13) {
    event.preventDefault();
    sendToStorage(parsedTask);
    $('.task-input').blur();
  }
}

function downvote() {
  var id = $(this).parent().parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  if (parsedTask.index === 0 ) {
    return
  }
  parsedTask.index--;
  parsedTask.currentImportance = parsedTask.importance[parsedTask.index];
  sendToStorage(parsedTask);
  $(this).siblings('.current-importance').text(parsedTask.importance[parsedTask.index]);
}

function upvote() {
  var id = $(this).parent().parent().prop('id');
  var parsedTask = JSON.parse(localStorage.getItem(id));
  if (parsedTask.index === parsedTask.importance.length - 1) {
    return
  }
  parsedTask.index++;
  parsedTask.currentImportance = parsedTask.importance[parsedTask.index];
  sendToStorage(parsedTask);
  $(this).siblings('.current-importance').text(parsedTask.importance[parsedTask.index]);
}

function deleteCard() {
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
}

function searchTaskTitles() {
  var searchInput = $(this).val().toLowerCase();
  $('.task-card').each(function() {
    var taskText = $(this).find('.task-input').val().toLowerCase();
    if(taskText.indexOf(searchInput) !== -1) {
      $(this).show();
    }  else {
      $(this).hide();
    }
  })
}

function searchTaskBodies() {
  var searchInput = $(this).val().toLowerCase();
  $('.task-card').each(function() {
    var taskText = $(this).find('.task-input').text().toLowerCase();
    if(taskText.indexOf(searchInput) !== -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  })
}

function grayOutCompleted() {
  var taskID = ($(this).closest('.task-card').prop('id'));
  var parsedTask = JSON.parse(localStorage.getItem(taskID));
  parsedTask.completed = true;
  sendToStorage(parsedTask);
  $(this).parent().parent().addClass('grayout');
}

function reloadCompletedTasks() {
  reloadCards();
  for (var i = 0; i < localStorage.length; i++) {
    var taskObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (taskObject.completed === true) {
      prependCard(taskObject);
    }
  }
}
