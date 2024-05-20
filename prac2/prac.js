function displayStories(){
    $.ajax({
        url: 'https://usmanlive.com/wp-json/api/stories',
        method: 'GET',
        datatype: 'json',
        success: function(data){
            var storiesList = $('#storiesList');
            storiesList.empty();
            
            $.each(data, function(index, story){
                storiesList.append(
                    `<div class='mb-3'>
                    <h3>${story.title}</h3>
                    <p>${story.content}</p>
                    <button data-id='${story.id}'>Edit</button>
                    <button data-id='${story.id}'>Delete</button>
                    </div>
                    <hr />`
                )
            });
            // error: function(err){
            //     console.error("Error on fetching",err)
            // }
        }
    })
}
function deleteStories(){
    let id = $(this).attr('data-id');
    $.ajax({
        url: 'https://usmanlive.com/wp-json/api/stories/'+id,
        method: DELETE,
        success: function(){
            displayStories();
        }
        
    })
}