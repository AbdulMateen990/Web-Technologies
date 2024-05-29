const contact = document.querySelector('.contact');
const contactForm = document.querySelector('#contactForm');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const subjectInput = document.querySelector('#subject');
const messageInput = document.querySelector('#message');
const submitBtn = document.querySelector('.submitBtn');

contact.addEventListener('click', () => {
    contactForm.style.display = 'block';
    contactForm.scrollIntoView({ behavior: 'smooth' });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
        alert('Please fill out all fields.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        alert('Please enter a valid email address.');
        return;
    }
    alert('Form submitted successfully.');
    contactForm.style.display = 'none';
});