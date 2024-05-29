$(document).ready(function () {
    $(document).scroll(function () {
        var $nav = $("#mainNav");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
}); 

var formValid = {
    firstName: false,
    lastName: false,
    email: false,
    query: false
}

function checkValidations() {
    if (formValid.firstName && formValid.lastName && formValid.email && formValid.query) {
        $('#submit-button').removeAttr('disabled');
    } else {
        $('#submit-button').attr('disabled', true);
    }
}

function errorMsg (element, message) {
    $(element).text(message).addClass('d-block').removeClass('d-none');
}

function hideMsg (element) {
    $(element).addClass('d-none').removeClass('d-block');
}

$('#first-name').on('input', function() {
    var email = $(this).val();
    if(email.length < 1){
        errorMsg('#fn-validator', 'This field is required.');
        formValid.firstName = false;
        checkValidations();
    }
    else{
        hideMsg('#fn-validator');
        formValid.firstName = true;
        checkValidations();
    }
});

$('#last-name').on('input', function() {
    var email = $(this).val();
    if(email.length < 1){
        errorMsg('#ln-validator', 'This field is required.');
        formValid.lastName = false;
        checkValidations();
    }
    else{
        hideMsg('#ln-validator');
        formValid.lastName = true;
        checkValidations();
    }
});

$('#email').on('input', function() {
    var email = $(this).val();
    if(email.length < 1){
        errorMsg('#email-validator', 'This field is required.');
        formValid.email = false;
        checkValidations();
    }
    else{
        hideMsg('#email-validator');
        var testExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        testExp.test(email) ? hideMsg('#email-validator') : errorMsg('#email-validator', 'Email is not valid.');
        formValid.email = testExp.test(email);
        checkValidations();
    }
});

$('#query').on('input', function() {
    var email = $(this).val();
    if(email.length < 1){
        errorMsg('#q-validator', 'This field is required.');
        formValid.query = false;
        checkValidations();
    }
    else{
        hideMsg('#q-validator');
        formValid.query = true;
        checkValidations();
    }
});

$(function () {
    $(document).scroll(function () {
      var $nav = $("#mainNav");
      $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
  });