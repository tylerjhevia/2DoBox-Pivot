
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


//   functions

//  prepend idea crad to card container
function prepend(idea)  {
  $('.card-container').prepend(`
    <article class='idea-card'
      id=${idea.id}>
        <h2 class='idea-title'>${idea.title}</h2>
        <button class='delete-button'></button>
        <p class='idea-body'>${idea.body}</p>
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
