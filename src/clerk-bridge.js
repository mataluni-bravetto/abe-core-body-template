/**
 * Bridge script injected into the page to access Clerk SDK.
 * Runs in the MAIN world (page context) to bypass extension isolation.
 */
(function() {
  // Prevent double injection
  if (window.__aiGuardianBridgeLoaded) {
    return;
  }
  window.__aiGuardianBridgeLoaded = true;

  const MAX_ATTEMPTS = 60; // 30 seconds
  let attempts = 0;

  async function checkClerk() {
    attempts++;
    // Look for Clerk in the main window object
    const clerk = window.Clerk || window.clerk || window.__clerk;
    
    if (clerk) {
      // Wait for Clerk to be loaded if load() method exists
      if (typeof clerk.load === 'function' && !clerk.loaded) {
        try {
          await clerk.load();
        } catch (e) {
          // Clerk load failed, continue anyway
        }
      }
      
      if (clerk.user) {
        // User found - extract data
        const sendData = async () => {
          try {
            let token = null;
            // Try to get a fresh token - handle both Promise and property
            try {
              const session = await (typeof clerk.session === 'function' 
                ? clerk.session() 
                : Promise.resolve(clerk.session));
              
              if (session && typeof session.getToken === 'function') {
                token = await session.getToken();
              }
            } catch (e) {
              // Token retrieval failed - log but continue without token
              console.warn('[Bridge] Token retrieval failed:', e);
            }
            
            // Send back to content script with signature for security
            window.postMessage({
              type: 'AI_GUARDIAN_CLERK_DATA',
              payload: {
                user: {
                  id: clerk.user.id,
                  email: clerk.user.primaryEmailAddress?.emailAddress || clerk.user.emailAddresses?.[0]?.emailAddress,
                  firstName: clerk.user.firstName,
                  lastName: clerk.user.lastName,
                  username: clerk.user.username,
                  imageUrl: clerk.user.imageUrl || clerk.user.profileImageUrl
                },
                token: token
              },
              _signature: 'aiGuardianBridge' // Security signature
            }, '*');
          } catch (e) {
            console.error('[Bridge] Bridge extraction error:', e);
          }
        };

        sendData();
      } else if (attempts < MAX_ATTEMPTS) {
        // Keep looking if Clerk hasn't initialized yet
        setTimeout(checkClerk, 500);
      }
    } else if (attempts < MAX_ATTEMPTS) {
      // Keep looking if Clerk hasn't initialized yet
      setTimeout(checkClerk, 500);
    }
  }

  checkClerk();
})();


