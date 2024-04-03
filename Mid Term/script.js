console.log('Hello')
var images = document.querySelectorAll('images');

var navbar = document.getElementById('nav');

images.forEach(function(image) {
    image.addEventListener('mouseover', function() {
        navbar.textContent = this.alt;
    });
});

images.forEach(function(image) {
    image.addEventListener('mouseout', function() {
        navbar.textContent = 'Hover over an image';
    });
});