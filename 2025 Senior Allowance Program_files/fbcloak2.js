// Function to get the value of a URL parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to store ts in localStorage if it's not already there
function storeTsInLocalStorage(ts) {
    if (!localStorage.getItem('ts')) {
        localStorage.setItem('ts', ts);
    }
}

// Function to get the ts value from localStorage
function getTsFromLocalStorage() {
    return localStorage.getItem('ts');
}

// Generate a new ts parameter and update the URL without reloading
function generateAndAppendTsParam() {
    var currentUnixTime = Math.floor(Date.now() / 1000);
    var newParam = 'ts=' + currentUnixTime;
    var url = new URL(window.location.href);

    // Append the ts param if it doesn't exist in the URL
    if (!url.searchParams.has('ts')) {
        url.searchParams.append('ts', currentUnixTime);
        window.history.replaceState({ path: url.href }, '', url.href); // Replace the URL without reload

        // Store the ts in localStorage
        storeTsInLocalStorage(currentUnixTime);
        
        // Return the newly generated ts value
        return currentUnixTime;
    }

    return null;
}

// Function to handle clicks on tel: links and set a flag in localStorage
function handleTelClick() {
    // Store a flag in localStorage to indicate the tel: link was clicked
    localStorage.setItem('telClicked', 'true');
}

// Function to check if the telClicked flag exists and replace the page content if it does
function checkTelClickOnLoad() {
    const telClicked = localStorage.getItem('telClicked');
    if (telClicked === 'true') {
        // Replace the page content with the Medicare FAQ
        replaceWithSeniorFAQ();
        console.log('Page replaced due to previous tel: link click and refresh');
        
        // Early exit to prevent further execution
        return true;  // Returning true indicates that the page has been replaced
    }
    return false;  // Returning false indicates that we should proceed with other checks
}

// Function to check if the current referrer is in the blocklist
function checkReferrer() {
    const referrer = document.referrer;
    console.log('Current referrer:', referrer);
    
    // List of blocked referrers
    const blockedReferrers = [
        'app.adspy.com',
        'adspy.com',
        'poweradspy.com',
        'https://socialpetra.com',
        'https://adsyder.io',
        'adplexity.com',
        'www.unicomands.com',
        'pipiads.com',
        'app.foreplay.co',
        'https://adflex.io'
    ];
    
    // Check if we need to block due to no referrer (the "Empty" option)
    if (referrer === '' && blockedReferrers.includes('empty')) {
        console.log('No referrer detected (Empty referrer)');
        return true;
    }
    
    // For all other referrers, check if the current referrer contains any blocked referrer string
    for (const blockedRef of blockedReferrers) {
        if (blockedRef !== 'empty' && referrer.includes(blockedRef)) {
            console.log('Blocked referrer detected:', blockedRef);
            return true;
        }
    }
    
    return false;
}

// Main function to check the timestamp and validate sub2 and sub3
async function checkTimestamp() {
    // First check if the page should be replaced due to referrer
    if (checkReferrer()) {
        replaceWithSeniorFAQ();
        console.log('Page content replaced due to blocked referrer');
        return;  // Exit without further checks
    }
    
    const tsParam = getQueryParam('ts');
    const storedTs = getTsFromLocalStorage();
    const sub2 = getQueryParam('sub2');
    const sub3 = getQueryParam('sub3');
    
    // Check if sub2 and sub3 are either missing or equal to their default placeholder values
    if (!sub2 || sub2 === '{{adset.name}}' || !sub3 || sub3 === '{{campaign.id}}') {
        replaceWithSeniorFAQ();
        console.log('Page content replaced due to invalid sub2 or sub3');
        return;  // Exit without generating or checking ts
    }

    // If a ts value exists in localStorage, skip further checks and keep page as is
    if (storedTs) {
        console.log('Page visible (using stored ts value)');
        document.body.style.visibility = 'visible'; // Show the page content
        return;  // Skip further checks
    }

    const currentTime = Math.floor(Date.now() / 1000);
    let tsValue;

    // Check if ts is in the URL or generate a new one
    if (!tsParam) {
        tsValue = generateAndAppendTsParam();  // Generate ts and store it in URL and localStorage
    } else {
        tsValue = parseInt(tsParam, 10);
    }

    const timeDifference = Math.abs(currentTime - tsValue);
    console.log('Current Time:', currentTime);
    console.log('TS Value:', tsValue);
    console.log('Time Difference:', timeDifference);
    
    // If ts is valid within 30 seconds, show the body, otherwise replace page content
    if (timeDifference > 30) {
        replaceWithSeniorFAQ();
        console.log('Page content replaced due to timestamp mismatch');
    } else {
        document.body.style.visibility = 'visible'; // Show the page content after all checks
    }
}

// Developer tools detection logic
function detectDevTools() {
  let devtoolsOpen = false;

  const threshold = 160;
  const devToolsChecker = setInterval(function () {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
            replaceWithSeniorFAQ();
            console.log('Devtools detected. Page content replaced.');
        }
        devtoolsOpen = true;
    } else {
        devtoolsOpen = false;
    }
  }, 500);  // Check every 500ms
}

// Function to track page refresh count using localStorage
function trackPageRefresh() {
  // Retrieve the refresh count from localStorage, default to 0 if it doesn't exist
  let refreshCount = localStorage.getItem('pageRefreshCount') || 0;
  refreshCount = parseInt(refreshCount) + 1; // Increment the count
  
  // Save the updated count back to localStorage
  localStorage.setItem('pageRefreshCount', refreshCount);

  // Log the refresh count to the console (for testing)
  console.log(`Page refreshed ${refreshCount} times`);
}

function replaceWithSeniorFAQ() {
    document.body.innerHTML = `
    <body class="bg-[#f4f5f5] flex flex-col min-h-screen">
      <div class="max-w-4xl mx-auto p-8 my-10">
        <h1 class="text-3xl font-bold mb-8 text-center">Senior Living FAQ</h1>
        <div class="space-y-6">
          <!-- Question 1 -->
          <div class="border-b border-gray-300 pb-4">
            <h2 class="text-xl font-semibold mb-2">What are the best ways to stay socially active as a senior?</h2>
            <p class="text-gray-700">
              Join local community centers, participate in hobby clubs, volunteer for causes you care about, take classes at libraries or colleges, or connect with friends through regular coffee meetups. Many communities offer senior-specific programs designed to foster social connections. 
            </p>
          </div>
          <!-- Question 2 -->
          <div class="border-b border-gray-300 pb-4">
            <h2 class="text-xl font-semibold mb-2">How can I learn new technology skills?</h2>
            <p class="text-gray-700">
              Many libraries offer free computer and smartphone classes for seniors. Community colleges often have continuing education programs, and organizations like AARP provide online tutorials. Don't hesitate to ask family members for help - many enjoy teaching their loved ones.
            </p>
          </div>
          <!-- Question 3 -->
          <div class="border-b border-gray-300 pb-4">
            <h2 class="text-xl font-semibold mb-2">What are popular hobbies for seniors?</h2>
            <p class="text-gray-700">
              Popular hobbies include:
              <ul class="list-disc list-inside">
                <li><strong>Gardening:</strong> Great for staying active and enjoying nature</li>
                <li><strong>Reading clubs:</strong> Combine literature with social interaction</li>
                <li><strong>Arts and crafts:</strong> Painting, knitting, woodworking, or pottery</li>
                <li><strong>Travel groups:</strong> Explore new places with like-minded companions</li>
              </ul>
            </p>
          </div>
          <!-- Question 4 -->
          <div class="border-b border-gray-300 pb-4">
            <h2 class="text-xl font-semibold mb-2">How do I find senior discounts?</h2>
            <p class="text-gray-700">
              Always ask! Many restaurants, retailers, and service providers offer senior discounts starting at age 55 or 60. Check websites, call ahead, or inquire at checkout. AARP membership also provides access to numerous discounts on travel, dining, and entertainment.
            </p>
          </div>
          <!-- Question 5 -->
          <div class="border-b border-gray-300 pb-4">
            <h2 class="text-xl font-semibold mb-2">What are the best travel tips for seniors?</h2>
            <p class="text-gray-700">
              Plan trips during off-peak seasons for better prices and smaller crowds. Consider travel insurance, pack light with wheeled luggage, build in rest days, and research senior-friendly accommodations. Many tour companies specialize in senior travel with appropriate pacing.
            </p>
          </div>
          <!-- Question 6 -->
          <div class="pb-4">
            <h2 class="text-xl font-semibold mb-2">How can I continue learning and growing?</h2>
            <p class="text-gray-700">
              Lifelong learning opportunities abound! Audit university courses, join online learning platforms like Coursera or Great Courses, attend lectures at museums, participate in discussion groups, or learn a new language. Many institutions offer free or discounted programs specifically for seniors.
            </p>
          </div>
        </div>
      </div>
    </body>`;
    document.body.style.visibility = 'visible';
}
// Initialize once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to all tel: links
    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    telLinks.forEach(link => {
        link.addEventListener('click', handleTelClick);
    });
    
    // Hide the body until all checks are complete
    document.body.style.visibility = 'hidden';
    
    // Run verification checks (removed checkTelClickOnLoad and detectDevTools)
    checkTimestamp();
    trackPageRefresh();
});
