const fs = require('fs');

async function getTagsFromAPI() {
  const url = 'https://content-api.sitecorecloud.io/api/content/v1/items/?system.contentType.id=blogTag';
  const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzMwMzMzMCwiZXhwIjoxNjg3MzA0MjMwLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.l98Xh_QqUH-bo7poiscnX2fEK73xo9J5mIMCWCyr9ML_uD5S8bjdKGqCNeW3qT5iY8q0jBHPaYinl3uBRJPqgGqyKRmTAxIKPt7AbrjCzkZO5w5JTpOR0BxeHqJ84Pc9bN4TaLB6wSHtDkg1s_N4a6KciCLQtqkwNOcRD6VGRo6QEEWqXs9tnKI0Aa5-JPo2SO1cxkH3_xy4OjHoa16mrL6wUTajHXl5Cuyi15veW_EKD-XlxOZH0EHtDSIfnYkCvlugIdagqr_aQHKjnKeRpgF4d0dnWJaaV5pg3FqbrauhIFnSPqIgon6FuKX7FC6pWvQ6zzvmQgK4B4SkgahR5A'; // Replace with your actual bearer token

  let pageNumber = 1;
  let allTags = [];

  while (true) {
    const fetch = await import('node-fetch'); // Use dynamic import

    const response = await fetch.default(`${url}&pageNumber=${pageNumber}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      console.error(`Error retrieving tags from the API. Status: ${response.status}`);
      return allTags;
    }

    const data = await response.json();
    const tags = data.data;

    if (tags.length === 0) {
      // Reached the end of tags
      break;
    }

    allTags = allTags.concat(tags);
    pageNumber++;
  }

  const tagsFromAPI = allTags.reduce((acc, tag) => {
    acc[tag.name] = tag.id;
    return acc;
  }, {});

  return tagsFromAPI;
}

async function main() {
  const tagsFromAPI = await getTagsFromAPI();

  // Store the tags in a JSON file
  const filePath = 'tags.json';
  const jsonData = JSON.stringify(tagsFromAPI, null, 2);

  fs.writeFile(filePath, jsonData, 'utf8', (error) => {
    if (error) {
      console.error('Error writing tags to file:', error);
    } else {
      console.log('Tags have been stored in the file:', filePath);
    }
  });
}

main();





// async function getTagsFromAPI() {
//     try {
//       const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//       const url = 'https://content-api.sitecorecloud.io/api/content/v1/items/?system.contentType.id=blogTag';
//       const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzMwMTgxMCwiZXhwIjoxNjg3MzAyNzEwLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.auSgbx68VwUm_yv7l5Dd2-UTI-gIl9V39tfA6LoOOvunm-cCxtllkOCvAoauh-WFrwM1lWG2lpI7lUJihqZouY0yXsF7EOhS8LrVSYyIVvcyrzSfcekwma8HpluOd4myGqi2gMy7tf36LGBt3Q-hXoaxvkfYyx_PO0O8XLI4gS6FiABJBiEcycTd7EcHL3bGZslWxqnOZfUI0Rp-TvVsGlL_KelaLWfmqUv1dV55Cn11HhWz-lZNUqpf2GVpOZp15w_ZFRwFTss-GPhvOlKh9ZqT648RzO8m-h8simmQXYvn5HvCrw0ExowsPYgUUIcpIVi02b5gppZXED6LElCL4Q'; // Replace with your actual bearer token
  
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${bearerToken}`,
//         },
//       });
//       const data = await response.json();
  
//       const tagsFromAPI = data.data.reduce((acc, tag) => {
//         acc[tag.name] = tag.id;
//         return acc;
//       }, {});
  
//       return tagsFromAPI;
//     } catch (error) {
//       console.error('Error retrieving tags from the API:', error);
//       return {};
//     }
//   }
  
//   // Usage example
//   async function main() {
//     const tagsFromAPI = await getTagsFromAPI();
  
//     // Store the tags in a JSON file
//     const fs = require('fs');
//     const filePath = 'tags.json';
//     const jsonData = JSON.stringify(tagsFromAPI, null, 2);
  
//     fs.writeFile(filePath, jsonData, 'utf8', (error) => {
//       if (error) {
//         console.error('Error writing tags to file:', error);
//       } else {
//         console.log('Tags have been stored in the file:', filePath);
//       }
//     });
//   }
  
//   main();
  
  


