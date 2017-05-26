
function Idea(title, body)  {
  this.title = title;
  this.body = body;
  this.quality = 'Swill';
  this.id = Date.now();
}

//************************************************************
//  event listensers
//************************************************************
$(document).ready(reloadCards);

function reloadCards() {
  for (var i = 0; i < localStorage.length; i++) {
  prependCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
}
}

$('.input-container').on('input', enableSaveButton);
$('.save-button').on('.click', clickSave);

function clickSave() {
  var title = $('.input-title').val();// capture input value
  var body = $('.input-body').val();// capture body value
  var idea = new Idea(title, body);// create a new Idea object and pass thru the captured input and body values
  prependCard(idea); // add the new idea card to the card area
  clearInputFields();  // clear the user input and body values
  sendToStorage(idea); // set the item and strigify to local storage
  disableSaveButton();
}

// // save button capture input values and send to append function
// $('.save-button').on('click', function()  {
//   var title = $('.input-title').val();// capture input value
//   var body = $('.input-body').val();// capture body value
//   var idea = new Idea(title, body);// create a new Idea object and pass thru the captured input and body values
//   prependCard(idea); // add the new idea card to the card area
//   clearInputFields();  // clear the user input and body values
//   sendToStorage(idea); // set the item and strigify to local storage
//   disableSaveButton();
// })

// $(document).keypress(function(e) {
//   if(e.which == 13) {
//     enableSaveButton13();
//   }
// })

//  new input in exsisting title area save to storage
$('.card-container').on('keyup', '.idea-title',  function() {// identify typing in title field
	var id = $(this).parent().prop('id');//get the unique id of this idea card
	var parsedIdea = JSON.parse(localStorage.getItem(id))//get the current quality of this idea card
	parsedIdea.title = $(this).val()// update the value of the title field
	localStorage.setItem(id, JSON.stringify(parsedIdea))// return the updated object idea card to local storage
})

//  new input in exsisting body area save to storage
$('.card-container').on('keyup', '.idea-body',  function() {// identify typing in body field
	var id = $(this).parent().prop('id');//get the unique id of this idea card
	var parsedIdea = JSON.parse(localStorage.getItem(id))//get the current quality of this idea card
	parsedIdea.body = $(this).val() // update the value of the body field
	localStorage.setItem(id, JSON.stringify(parsedIdea))// return the updated object idea card to local storage
})

// up arrow button change quality
$('.card-container').on('click', '.arrow-up',  function() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this idea card
  var parsedIdea = JSON.parse(localStorage.getItem(id));//get this idea card from storage and parse it
  var currentQuality = parsedIdea.quality;//get the current quality of this idea card
  // adjust the quality based on the current quality
  if(currentQuality === 'Swill') {
    parsedIdea.quality = 'Plausible'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Plausible');// change the quality of the idea card on the DOM
  }
  else if(currentQuality === 'Plausible') {
    parsedIdea.quality = 'Genius'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Genius');// change the quality of the idea card on the DOM
  }
  localStorage.setItem(id, JSON.stringify(parsedIdea));// return the updated object idea card to local storage
})

// down arrow button change quality
$('.card-container').on('click', '.arrow-down',  function() {
  var id = $(this).parent().parent().prop('id');//get the unique id of this idea card
  var parsedIdea = JSON.parse(localStorage.getItem(id));//get this idea card from storage and parse it
  var currentQuality = parsedIdea.quality;//get the current quality of this idea card
  // adjust the quality based on the current quality
  if(currentQuality === 'Genius') {
    parsedIdea.quality = 'Plausible'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Plausible');// change the quality of the idea card on the DOM
  }
  else if(currentQuality === 'Plausible') {
    parsedIdea.quality = 'Swill'// change the object idea cards quality
    $(this).siblings('.quality-value').text('Swill');// change the quality of the idea card on the DOM
  }
  localStorage.setItem(id, JSON.stringify(parsedIdea));// return the updated object idea card to local storage
})

//********************************************************************************
//   functions
//*********************************************************************************

//  prepend idea crad to card container
function prependCard(idea)  { // add the new idea card created on the save button event listener to the card section
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

$('.input-title, .input-body').on('input', enableSaveButton);


// enable save button on return
function enableSaveButton13()  {
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var idea = new Idea(title, body);// create a new Idea object and pass thru the captured input and body values
  //   if (title === "" || body === "") {
  //     $('.save-button').prop('disabled', true)
  // } else {$('.save-button').prop('disabled', false)
  prependCard(idea); // add the new idea card to the card area
  clearInputFields();  // clear the user input and body values
  sendToStorage(idea); // set the item and strigify to local storage
  disableSaveButton();
}


// enable save button
function enableSaveButton()  {
  var ideaTitle = $('.input-title').val();
  var ideaBody = $('.input-body').val();
    if (ideaTitle === "" || ideaBody === "") {
      $('.save-button').prop('disabled', true)
  } else {$('.save-button').prop('disabled', false)
}
}

// disable save button
function disableSaveButton() {
  $('.save-button').prop('disabled', true)
}

// clear input fields
function clearInputFields() { //clear the title and body input fields
  $('.input-title').val('');
  $('.input-body').val('');
}

// send idea to local storage
function sendToStorage(idea)  {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

// get an idea card from storage by id
function getFromStorage(id) {
	var parsedIdea = JSON.parse(localStorage.getItem(id))
	return parsedIdea;
}

// delete
$('.card-container').on('click', '.delete-button', function (){
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();

});
// live search
$(".search-input").on("keyup", function() {
  var searchText = this.value
  //jquery .each, gives two arguments, first index of selected array, second is value at that index
  $(".idea-input").each( function(index, ideaCard){
    if(!ideaCard.value.includes(searchText)) {
      console.log($(this).closest("article"))
      $(this).closest(".idea-card").hide()
    } else {
      $(this).closest(".idea-card").show()
    }
  })
});
