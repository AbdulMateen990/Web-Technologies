$(document).ready(function () {
    $(document).scroll(function () {
        var $nav = $("#mainNav");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
      });
      
    fetchStories();

    $('#addStoryForm').submit(function (event) {
        event.preventDefault();
        addStory($(this).serialize());
    });

    function fetchStories() {
        $.ajax({
            url: 'https://usmanlive.com/wp-json/api/stories',
            dataType: 'json',
            success: function (stories) {
                displayStories(stories);
            },
            error: function (error) {
                console.error('Error fetching stories:', error);
            }
        });
    }

    function displayStories(stories) {
        const listingContainer = $('#listingContainer');
        listingContainer.empty();

        $.each(stories, function (index, story) {
            const card = $('<div class="card mb-3"></div>');
            const cardBody = $('<div class="card-body"></div>');

            cardBody.append('<h5 class="card-title">' + story.title + '</h5>');
            cardBody.append('<p class="card-text">Content: ' + story.content + '</p>');

            const updateBtn = $('<button class="btn btn-primary mr-2">Update</button>');
            updateBtn.click(function () {
                const newContent = prompt("Enter new content for the story:", story.content);
                if (newContent !== null) {
                    updateStory(story.id, story.title, newContent);
                }
            });

            const deleteBtn = $('<button class="btn btn-danger">Delete</button>');
            deleteBtn.click(function () {
                deleteStory(story.id);
            });

            cardBody.append(updateBtn);
            cardBody.append(deleteBtn);
            card.append(cardBody);
            listingContainer.append(card);
        });
    }

    function addStory(data) {
        $.ajax({
            url: 'https://usmanlive.com/wp-json/api/stories',
            type: 'POST',
            data: data,
            success: function () {
                fetchStories();
                $('#addStoryForm')[0].reset();
            },
            error: function (error) {
                console.error('Error adding story:', error);
            }
        });
    }

    function deleteStory(id) {
        $.ajax({
            url: 'https://usmanlive.com/wp-json/api/stories/' + id,
            type: 'DELETE',
            success: function () {
                fetchStories();
            },
            error: function (error) {
                console.error('Error deleting story:', error);
            }
        });
    }

    function updateStory(id, title, newContent) {
        $.ajax({
            url: 'https://usmanlive.com/wp-json/api/stories/' + id,
            type: 'PUT',
            data: { title: title, content: newContent },
            success: function () {
                fetchStories();
            },
            error: function (error) {
                console.error('Error updating story:', error);
            }
        });
    }
});
