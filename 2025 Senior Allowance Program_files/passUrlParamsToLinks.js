function passUrlParamsToLinks() {
  const links = document.querySelectorAll('a');
  const urlSearchParams = new URLSearchParams(window.location.search);

  // Check if the "email" parameter exists and contains "danbalsam.com"
  const emailParam = urlSearchParams.get('email');
  if (emailParam && emailParam.includes('danbalsam.com')) {
    // Hide the page by setting body and visibility to hidden
    document.body.style.visibility = 'hidden';
    document.body.style.display = 'none';
    document.documentElement.style.visibility = 'hidden';
    return; // Stop execution if the email param condition is met
  }

  links.forEach(link => {
    if (link != undefined) {
      // Create a new URL object using the link's href
      const url = new URL(link.href);
      urlSearchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      link.href = url.toString();
    }
  });
}

passUrlParamsToLinks();
