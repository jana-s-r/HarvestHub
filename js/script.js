window.addEventListener('DOMContentLoaded', event => {

    var navbarShrink = function () {
       const navbarCollapsible = document.body.querySelector('#mainNav');
       if (!navbarCollapsible) {
          return;
       }
       if (window.scrollY < 100) {
          navbarCollapsible.classList.remove('navbar-shrink')
       } else {
          navbarCollapsible.classList.add('navbar-shrink')
       }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
       new bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          rootMargin: '0px 0px -40%',
       });
    };

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
       document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
       responsiveNavItem.addEventListener('click', () => {
          if (window.getComputedStyle(navbarToggler).display !== 'none') {
             navbarToggler.click();
          }
       });
    });

});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('my-form').addEventListener('submit', function (event) {
       event.preventDefault();

       Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Thank you for your message.',
          confirmButtonText: 'OK',
          customClass: {
             confirmButton: 'confirm-button-class'
          }
       }).then((result) => {
          document.getElementById('my-form').reset();
       });
    });
});

function validateQuantity(input) {
    input.value = input.value.replace(/[^\d.\/]/g, '');

    if (!/^(?!0)[1-9][0-9]{0,1}$|100$/.test(input.value)) {
       input.setCustomValidity('Invalid quantity. Please enter a number between 1 and 100.');
    } else {
       input.setCustomValidity('');
    }
}
