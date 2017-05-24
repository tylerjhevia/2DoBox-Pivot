
//  objects

// the new idea card object
function Idea(title, body)  {
  this.title = title;
  this.body = body;
  this.quality = 'Swill';
  this.id = Date.now();
  console.log(title);
}


//  event listensers

// on page load loops over local storage and appends each item to page
$(document).ready(function() {
	for (var i = 0; i < localStorage.length; i++) {
		prepend(JSON.parse(localStorage.getItem(localStorage.key(i))));
	}
});

// save button capture input values and send to append function
$('.save-button').on('click', function()  {
  console.log("save");
  var title = $('.input-title').val();
  var body = $('.input-body').val();
  var idea = new Idea(title, body);
  prepend(idea);
  clearInputFields();
  sendToStorage(idea);
})

//  new input in exsisting title area save to storage
$('.card-container').on('keyup', '.idea-title',  function() {
	var id = $(this).parent().prop('id');
	var parsedIdea = JSON.parse(localStorage.getItem(id))
	parsedIdea.title = $(this).val()
	localStorage.setItem(id, JSON.stringify(parsedIdea))
})

//  new input in exsisting body area save to storage
$('.card-container').on('keyup', '.idea-body',  function() {
	var id = $(this).parent().prop('id');
	var parsedIdea = JSON.parse(localStorage.getItem(id))
	parsedIdea.body = $(this).val()
	localStorage.setItem(id, JSON.stringify(parsedIdea))
})

// $('.card-container').on('click', '.arrow-up',  function() {
//   console.log($(this).parent().parent());
//   var id = $(this).parent().parent().prop('id');
//   var parsedIdea = JSON.parse(localStorage.getItem(id));
//   console.log(id);
//   var currentQuality = parsedIdea.quality;
//   console.log(currentQuality);
//   if(currentQuality === 'Swill') {
//     parsedIdea.quality = 'great'
//     $(this).siblings('.quality-value').text('great');
//   }
//   localStorage.setItem(id, JSON.stringify(parsedIdea));
//
// })



//   functions

//  prepend idea crad to card container
function prepend(idea)  {
  $('.card-container').prepend(`
    <article class='idea-card'id=${idea.id}>
      <input class='idea-title' type='text' value='${idea.title}'>
      <button class='delete-button'></button>
      <textarea cols='30' rows='10' class='idea-body' type='text' value=''>${idea.body}</textarea>
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

// clear input fields
function clearInputFields() {
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
