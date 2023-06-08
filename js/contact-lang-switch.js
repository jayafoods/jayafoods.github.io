function loadLanguage(language) {
  var elements = document.querySelectorAll('.lang-en, .lang-te');
  elements.forEach(function(element) {
    element.style.display = 'none';
  });
  document.querySelectorAll('.lang-' + language).forEach(function(element) {
    element.style.display = 'inline';
  });

  localStorage.setItem('selectedLanguage', language);
}

window.addEventListener('DOMContentLoaded', function() {
  var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

  var languageDropdown = document.getElementById('language');
  if (languageDropdown) {
    languageDropdown.value = selectedLanguage;
    loadLanguage(selectedLanguage);

    languageDropdown.addEventListener('change', function() {
      loadLanguage(this.value);
    });
  } else {
    console.error('Language dropdown not found!');
  }
});
