document.addEventListener('DOMContentLoaded', function () {
    var dropdownToggles = document.querySelectorAll('.dropdown-submenu .dropdown-toggle');

    dropdownToggles.forEach(function (dropdownToggle) {
      dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Close other open submenus
        var openSubmenus = document.querySelectorAll('.dropdown-submenu .dropdown-menu.show');
        openSubmenus.forEach(function (submenu) {
          if (submenu !== this.nextElementSibling) {
            submenu.classList.remove('show');
          }
        }, this);

        // Toggle the clicked submenu
        var submenu = this.nextElementSibling;
        if (submenu) {
          submenu.classList.toggle('show');
        }
      });
    });

    // Close submenus when clicking outside
    document.addEventListener('click', function (e) {
      var openSubmenus = document.querySelectorAll('.dropdown-submenu .dropdown-menu.show');
      openSubmenus.forEach(function (submenu) {
        submenu.classList.remove('show');
      });
    });
  });



  document.addEventListener('DOMContentLoaded', function () {
    var dropdownItems = document.querySelectorAll('.dropdown-item.dropdown-toggle');

    dropdownItems.forEach(function (item) {
      item.addEventListener('click', function (event) {
        // Close all other nested dropdowns
        dropdownItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            var otherDropdown = otherItem.nextElementSibling;
            if (otherDropdown && otherDropdown.classList.contains('dropdown-menu')) {
              otherDropdown.style.display = 'none';
              otherDropdown.style.opacity = 0;
              otherDropdown.style.transform = 'translateX(-20px)';
            }
          }
        });

        // Toggle current dropdown
        var dropdown = item.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-menu')) {
          if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            dropdown.style.opacity = 0;
            dropdown.style.transform = 'translateX(-20px)';
          } else {
            dropdown.style.display = 'block';
            dropdown.style.opacity = 1;
            dropdown.style.transform = 'translateX(0)';
          }
        }
      });
    });

    // Close all dropdowns if clicked outside
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.dropdown-item.dropdown-toggle')) {
        dropdownItems.forEach(function (item) {
          var dropdown = item.nextElementSibling;
          if (dropdown && dropdown.classList.contains('dropdown-menu')) {
            dropdown.style.display = 'none';
            dropdown.style.opacity = 0;
            dropdown.style.transform = 'translateX(-20px)';
          }
        });
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function (event) {
        // Prevent the event from propagating to the document
        event.stopPropagation();
  
        // Remove 'active' class from all links
        navLinks.forEach(nav => nav.classList.remove('active'));
  
        // Add 'active' class to the clicked link
        this.classList.add('active');
      });
    });
  
    document.addEventListener('click', function () {
      // Remove 'active' class from all links if clicking outside
      navLinks.forEach(nav => nav.classList.remove('active'));
    });
  
    // Prevent clicks inside the navbar from triggering the document click
    document.querySelector('.navbar-nav').addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });


  

  // for slider
  let currentIndex = 0; // Initialize currentIndex
  const intervalTime = 3000; // Time in milliseconds (e.g., 3000ms = 3 seconds)
  
  function moveSlide(direction = 1) { // Default direction to 1 (forward)
      const track = document.querySelector('.logo-track');
      const items = document.querySelectorAll('.logo-item');
      const itemWidth = items[0].offsetWidth;
      const totalItems = items.length;
  
      currentIndex += direction;
  
      if (currentIndex < 0) {
          currentIndex = totalItems - 1; // Loop back to the last item
      } else if (currentIndex >= totalItems) {
          currentIndex = 0; // Loop back to the first item
      }
  
      const offset = -currentIndex * itemWidth;
      track.style.transform = `translateX(${offset}px)`;
  }
  
  // Automatically move the slides at the specified interval
  const autoSlide = setInterval(() => moveSlide(1), intervalTime);
  




// Initialize Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}

// Load the Google Translate script
(function() {
  var gtScript = document.createElement('script');
  gtScript.type = 'text/javascript';
  gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.getElementsByTagName('head')[0].appendChild(gtScript);
})();

// Function to handle language selection
function translatePage() {
  var language = document.getElementById("custom_translate_dropdown").value;
  var googleTranslateElement = document.querySelector("#google_translate_element select");

  if (googleTranslateElement) {
    for (var i = 0; i < googleTranslateElement.children.length; i++) {
      var option = googleTranslateElement.children[i];
      if (option.value.indexOf(language) !== -1) {
        googleTranslateElement.selectedIndex = i;
        googleTranslateElement.dispatchEvent(new Event('change'));
        break;
      }
    }
  }
}

// Set default language to English on page load
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('custom_translate_dropdown').value = 'en';
});
