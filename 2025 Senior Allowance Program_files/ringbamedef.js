function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
}

// Mapping of sub1 to offer_id and affiliate_id
const sub1Mapping = {
    '67451': { offer_id: '4262', affiliate_id: '6' },
    '7330': { offer_id: '4232', affiliate_id: '108' },
    '9344': { offer_id: '4503', affiliate_id: '140' },
    '93443': { offer_id: '4503', affiliate_id: '140' },
    '46316': { offer_id: '4503', affiliate_id: '140' },
    '3401': { offer_id: '5445', affiliate_id: '6' },        
    '7992': { offer_id: '4679', affiliate_id: '140' },        
    '5922': { offer_id: '4679', affiliate_id: '140' },
    '8922': { offer_id: '5248', affiliate_id: '140' },
    '6681': { offer_id: '4240', affiliate_id: '108' },    
    '6682': { offer_id: '4240', affiliate_id: '108' },
    '6683': { offer_id: '4240', affiliate_id: '108' },
    '6684': { offer_id: '4240', affiliate_id: '108' },                
    '8916': { offer_id: '5305', affiliate_id: '140' },        
    '8933': { offer_id: '5248', affiliate_id: '140' },
    '8934': { offer_id: '5258', affiliate_id: '140', fbPixelId: '349687704235785' },
    '72955': { offer_id: '5258', affiliate_id: '140', fbPixelId: '349687704235785' },    
    '5027': { offer_id: '5603', affiliate_id: '140', fbPixelId: '984828833228557' },
    '2435': { offer_id: '5663', affiliate_id: '140', fbPixelId: '1758195351397649' },        
    '8401': { offer_id: '5454', affiliate_id: '140' },
    '8201': { offer_id: '5490', affiliate_id: '140' },    
    '4101': { offer_id: '5454', affiliate_id: '140' },
    '96615': { offer_id: '5454', affiliate_id: '140' },            
    '8634': { offer_id: '5349', affiliate_id: '140' },
    '8834': { offer_id: '5349', affiliate_id: '140' },        
    '8935': { offer_id: '5259', affiliate_id: '140' },            
    '59221': { offer_id: '4503', affiliate_id: '140' },        
    '9987': { offer_id: '4240', affiliate_id: '108' },
    '99871': { offer_id: '4240', affiliate_id: '108' },    
    '99872': { offer_id: '4240', affiliate_id: '108' },
    '99873': { offer_id: '4240', affiliate_id: '108' },
    '99875': { offer_id: '4240', affiliate_id: '108' },
    '99876': { offer_id: '4240', affiliate_id: '108' },
    '99877': { offer_id: '4240', affiliate_id: '108' },        
    '99874': { offer_id: '4240', affiliate_id: '108' },        
    '44303': { offer_id: '4240', affiliate_id: '108' },
    '443031': { offer_id: '4240', affiliate_id: '108' },        
    '9357': { offer_id: '4679', affiliate_id: '140' },
    '93571': { offer_id: '4991', affiliate_id: '6' },
    '93572': { offer_id: '4991', affiliate_id: '140' },
    
    // Add more mappings as needed
};

function getFbcParameter() {
    // Only try to get existing _fbc cookie which already has the correct format
    const fbcCookie = document.cookie.split('; ')
        .find(row => row.startsWith('_fbc='));
        
    if (fbcCookie) {
        return fbcCookie.split('=')[1];
    }
    
    return null;
}

function getFbpParameter() {
    // Get the _fbp cookie (Facebook Browser Pixel)
    const fbpCookie = document.cookie.split('; ')
        .find(row => row.startsWith('_fbp='));
        
    if (fbpCookie) {
        return fbpCookie.split('=')[1];
    }
    
    return null;
}

function runfbqtrack() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sub1 = urlParams.get('sub1');
    
    // Default efParams, can be updated based on sub1
    let efParams = {
        offer_id: '4990', // Default offer_id
        affiliate_id: '6', // Default affiliate_id
        parameters: {} // For custom parameters
    };

    // Update efParams based on sub1 value
    if (sub1 in sub1Mapping) {
        efParams.offer_id = sub1Mapping[sub1].offer_id;
        efParams.affiliate_id = sub1Mapping[sub1].affiliate_id;
    }
    
    // Get fbc parameter first
    const fbc = getFbcParameter();
    
    // Extract timestamp from fbc if available, otherwise use current time
    let timestamp = Date.now().toString();
    if (fbc) {
        // fbc format is fb.subdomainIndex.creationTime.fbclid
        const fbcParts = fbc.split('.');
        if (fbcParts.length >= 3) {
            timestamp = fbcParts[2]; // Get the creationTime portion
        }
    }
    
    // Set sub5 directly (standard Everflow parameter)
    efParams.sub5 = timestamp;
    
    // Get fbp parameter and set as effbp (custom parameter)
    const fbp = getFbpParameter();
    if (fbp) {
        efParams.parameters.effbp = fbp;
    }
    
    // Copy existing sub1-sub4 parameters from URL if present
    for (let i = 1; i <= 4; i++) {
        const subParam = `sub${i}`;
        if (urlParams.has(subParam)) {
            efParams[subParam] = urlParams.get(subParam);
        }
    }
    
    // Add other URL parameters to efParams
    urlParams.forEach((value, key) => {
        // Don't override the main offer_id, affiliate_id, and sub1-sub5
        if (key !== 'offer_id' && key !== 'affiliate_id' && !['sub1', 'sub2', 'sub3', 'sub4', 'sub5'].includes(key)) {
            // Add as custom parameter if it's not a standard parameter
            efParams.parameters[key] = value;
        }
    });
    
    EF.click(efParams).then(function (transactionId) {
        // Store transaction ID in localStorage
        localStorage.setItem('ltid', transactionId);
        
        // Set up Ringba tags
        window._rgba_tags = (window._rgba_tags || []);
        window._rgba_tags.push({ transaction_id: transactionId });
        
        // Send transaction ID to Facebook as external_id
        if (typeof fbq !== 'undefined' && transactionId) {
            fbq('track', 'PageView', {}, {
                external_id: transactionId
            });
        }
        
        removeUrlParamsFromTelLinks();
    });
}

function removeUrlParamsFromTelLinks() {
    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    telLinks.forEach(link => {
        const telNumber = link.href.replace(/^tel:/, '');
        const indexOfParams = telNumber.indexOf('?');
        const newHref = indexOfParams > -1 ? 'tel:' + telNumber.substring(0, indexOfParams) : 'tel:' + telNumber;
        link.href = newHref;
    });
}

function passUrlParamsToLinks() {
    const links = document.querySelectorAll('a');
    const urlSearchParams = new URLSearchParams(window.location.search);
    links.forEach(link => {
        if (link.href.startsWith('http')) { // Only modify absolute URLs
            try {
                const url = new URL(link.href);
                urlSearchParams.forEach((value, key) => {
                    url.searchParams.set(key, value);
                });
                link.href = url.toString();
            } catch (e) {
                // Handle invalid URLs
                console.error('Invalid URL:', link.href);
            }
        }
    });
}

function initializeFacebookPixel(transactionId, sub1) {
    // Determine which Pixel ID to use
    let pixelId = '1229366831646142'; // Default pixel ID
    
    // Change pixel ID based on sub1 if found in mapping
    if (sub1 && sub1 in sub1Mapping && sub1Mapping[sub1].fbPixelId) {
        pixelId = sub1Mapping[sub1].fbPixelId;
    }
    
    // Only initialize if not already done
    if (typeof fbq === 'undefined') {
        // Load the Facebook Pixel base code
        !function(f,b,e,v,n,t,s) {
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
        }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        
        // Initialize with the transaction ID as external_id if available
        if (transactionId) {
            fbq('init', pixelId, {
                external_id: transactionId
            });
        } else {
            fbq('init', pixelId);
        }
        
        // Send initial PageView
        fbq('track', 'PageView');
        
        console.log('Facebook Pixel initialized with ID:', pixelId);
    } else if (transactionId) {
        // If pixel already exists but we want to associate the transactionId
        fbq('track', 'PageView', {}, {
            external_id: transactionId
        });
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Load scripts and run tracking
    loadScript('/everflow.js', function() {
        // Run Everflow tracking which will also initialize Facebook Pixel with transactionId
        runfbqtrack();
        
        // Load Ringba script
        loadScript('https://b-js.ringba.com/CA957c6feec3c44eb7b231e22bc2238510', function() {
            // Additional script loading functionality here
        });
    });

    passUrlParamsToLinks();
    removeUrlParamsFromTelLinks();
});
