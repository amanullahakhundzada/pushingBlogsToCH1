const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzUwNDI5NSwiZXhwIjoxNjg3NTA1MTk1LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.KRbhCI6CHg9rKeWihzEE0TFv9_cVTw4zDXsDtEyVslutgZ2bfrSAKutdDgq7HhBcZQmHQgUktKCjPcw4ZZfQyqWDBR_Go2aYbceIopyzNWUtpfZK8el3yHlKP6M_a0twplbeYxYeB0rJ4lIlDU35YHmCubObIG1tAc-RrTDqYBw1YLC4U9l2T9AMnmk0exshqVIeKLHln5vSi23vQEBU-EUQo0X0ZemEUu4902cRefCA24g539zBN9icH3IkAN92V0Hb1e0us_wT9OuvyPXgrNG9ObJBUbu7AbSlKOvfcbWXJZTxx_RlyJXs5rAOtuOV-bReRLgsxr7Ujlq-M11WLw';
const pageSize = 20;

// Step 1: Retrieve Content IDs with status not equal to "Published"
const fetchContentIds = async () => {
  let pageNumber = 1;
  let contentIds = [];

  while (true) {
    const url = `https://content-api.sitecorecloud.io/api/content/v1/items/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve content IDs. Status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      // All content IDs have been retrieved
      break;
    }

    const filteredContentIds = data.data
      .filter(item => item.system.status !== "Published")
      .map(item => item.id);

    contentIds = contentIds.concat(filteredContentIds);

    pageNumber++;
  }

  return contentIds;
};

// Step 2: Publish each Content ID
const publishContentIds = async () => {
  const contentIds = await fetchContentIds();

  contentIds.forEach(contentId => {
    const publishUrl = `https://content-api.sitecorecloud.io/api/content/v1/items/${contentId}/publish`;

    fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          console.log(`Successfully published content with ID: ${contentId}`);
        } else {
          console.error(`Failed to publish content with ID: ${contentId} => Status: ${response.status} ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error(`Error publishing content with ID: ${contentId}:`, error);
      });
  });
};

// Start the process
publishContentIds()
  .catch(error => {
    console.error('Error retrieving and publishing content IDs:', error);
  });




// const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzUwMDQzNSwiZXhwIjoxNjg3NTAxMzM1LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.nvD1vM8NhgAzVxVpKpCECho7Y5LcTaYu1mzVdYvj_rbTYR3d2Rk0XSj3JYn-h6DlfB1C4ogAbjs8pidbO4_8AUz26r0q6zq4gd9cjXpO26gOkSfAyyNRUE1906ZsUCqy68vaFyDu9BjePIiDJ0qSvonrhUA_vGT_Qm0Ewa3Vm2PLBkyMK39WyK5xgl099cSDjODfK3Abq8Oxd9S1jZKu8zc7z516G8Qa6CLrfS08jLE1r_eB4UrKkq6EmUgyzpUAOCPjNfqZE1XZ1FLErJMAps5j_Z6XfVjsJ58OteK6w6CkcQVsoL_w0yOww52uBdGN1yYID0Met5LnTo4JVzU-Ig';
// const pageSize = 20;

// // Step 1: Retrieve Content IDs
// const fetchContentIds = async () => {
//   let pageNumber = 1;
//   let contentIds = [];

//   while (true) {
//     const url = `https://content-api.sitecorecloud.io/api/content/v1/items/?pageNumber=${pageNumber}&pageSize=${pageSize}`;
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${bearerToken}`
//       }
//     });
//     const data = await response.json();

//     if (!data.data || data.data.length === 0) {
//       // All content IDs have been retrieved
//       break;
//     }

//     const pageContentIds = data.data.map(item => item.id);
//     contentIds = contentIds.concat(pageContentIds);

//     pageNumber++;
//   }

//   return contentIds;
// };

// // Step 2: Publish each Content ID
// const publishContentIds = async () => {
//   const contentIds = await fetchContentIds();

//   contentIds.forEach(contentId => {
//     const publishUrl = `https://content-api.sitecorecloud.io/api/content/v1/items/${contentId}/publish`;

//     fetch(publishUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${bearerToken}`
//       }
//     })
//       .then(response => {
//         if (response.ok) {
//           console.log(`Successfully published content with ID: ${contentId}`);
//         } else {
//           console.error(`Failed to publish content with ID: ${contentId}`);
//         }
//       })
//       .catch(error => {
//         console.error(`Error publishing content with ID: ${contentId}:`, error);
//       });
//   });
// };

// // Start the process
// publishContentIds()
//   .catch(error => {
//     console.error('Error retrieving and publishing content IDs:', error);
//   });




//   only 20 pages 
// const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzQ2MjUyNSwiZXhwIjoxNjg3NDYzNDI1LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.h7g_Teh4WyNHlMMxZ_3YpAVn4REbB1y9XbNvjZb0ire-4O8WkCqJeGBUOWhQjOzXyj3a1fQzLMwaFoe51jMlfQ6hxYWAlN4axLciM5qVctLoZ4WCpPYjKVaiQ9IvKaqTJh3Niq2GZ1yed1briPzM6W5k-OqNnYGi8VGveuaqvXEkghuJhGJvcTf-cymPNKFkyG55Q-_BtE8Js3NZqS5-FuO9KeB5Atiq6w4Cbv8KYnFV1gJUbUbaOX40Q88avXsh_sWW-P5ObSYMm-a0uKputW3cv_klF0kDa5HI7KGmLL2eARoJ4z6ikqQcZISisd7KI0Y8A5pkxsbiLlLpPlUvzA';

// // Step 1: Retrieve Content IDs
// fetch('https://content-api.sitecorecloud.io/api/content/v1/items/', {
//   method: 'GET',
//   headers: {
//     'Authorization': `Bearer ${bearerToken}`
//   }
// })
//   .then(response => response.json())
//   .then(data => {
//     if (data && data.data) {
//       // Extract content IDs for all entities
//       const contentIds = data.data.map(item => item.id);
//        console.log(contentIds);
//       // Step 2: Publish each Content ID
//       contentIds.forEach(contentId => {
//         const publishUrl = `https://content-api.sitecorecloud.io/api/content/v1/items/${contentId}/publish`;

//         fetch(publishUrl, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${bearerToken}`
//           }
//         })
//           .then(response => {
//             if (response.ok) {
//               console.log(`Successfully published content with ID: ${contentId}`);
//             } else {
//               console.error(`Failed to publish content with ID: ${contentId}`);
//             }
//           })
//           .catch(error => {
//             console.error(`Error publishing content with ID: ${contentId}:`, error);
//           });
//       });
//     } else {
//       console.error('Error: Unexpected response format.');
//     }
//   })
//   .catch(error => {
//     console.error('Error retrieving content IDs:', error);
//   });


