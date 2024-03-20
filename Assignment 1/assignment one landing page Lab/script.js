const contact = document.querySelector('.contact');
const contactForm = document.querySelector('#contactForm');

contact.addEventListener('click', () => {
    contactForm.style.display = 'block';
    contactForm.scrollIntoView({ behavior: 'smooth' });
});
