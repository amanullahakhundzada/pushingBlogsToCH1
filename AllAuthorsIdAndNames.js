const fs = require('fs');

async function getAuthorsFromAPI() {
  const API_BASE_URL = 'https://content-api.sitecorecloud.io/api/content/v1';
  const BEARER_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzMwNDIwNCwiZXhwIjoxNjg3MzA1MTA0LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.lSvtTY6-IxVvZfPcnSHfPLYP81zxlcdEO3y1lzxuyj-Fkk3PqbFI80PdrOvkrN0oThxLPh91vkzcY9ABcau_-KF83mkMfkBtM79iUYbrKKvc1NRuEZXh5g2JDL5YN-BnKN09gDMtMe-N_W2WO65X_62Ym76TKnmxFmyOeUNf2fPJp3Q6yld1G0D2sXC1RAXf2Aym6oKyJ_MMrJNBSGLH2QAtmTAmnc0g2c5IpktBzrkW5Qu1n-EK800tbSqkN3c2f5DkNun4rKkqztHMjPShFAAnmJG82jmxBLVWNEtDDgqn58uubeZ5DmtWhnkFtL9V7gEgaDL331bOXxa1hs0hZQ'; // Replace with your actual bearer token
  const contentType = 'blogAuthor';
  let pageNumber = 1;
  let allAuthors = [];

  while (true) {
    const url = `${API_BASE_URL}/items/?system.contentType.id=${contentType}&pageNumber=${pageNumber}`;

    try {
      const fetch = await import('node-fetch'); // Use dynamic import

      const response = await fetch.default(url, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      const data = await response.json();

      // Extract the authors from the API response
      const authors = data.data;
      if (authors.length === 0) {
        // Reached the end of authors
        break;
      }

      allAuthors = allAuthors.concat(authors);
      pageNumber++;
    } catch (error) {
      console.error('Error retrieving authors from the API:', error);
      return {};
    }
  }

  // Extract the author IDs and names
  const authorsFromAPI = allAuthors.reduce((acc, author) => {
    const authorFields = author.fields;
    const authorName = `${authorFields.authorFirstName.value} ${authorFields.authorLastName.value}`;
    acc[authorName] = author.id;
    return acc;
  }, {});

  return authorsFromAPI;
}

async function main() {
  const authorsFromAPI = await getAuthorsFromAPI();

  // Store the authors in a JSON file
  const filePath = 'authors.json';
  const jsonData = JSON.stringify(authorsFromAPI, null, 2);

  fs.writeFile(filePath, jsonData, 'utf8', (error) => {
    if (error) {
      console.error('Error writing authors to file:', error);
    } else {
      console.log('Authors have been stored in the file:', filePath);
    }
  });
}

main();








// async function getAuthorsFromAPI() {
//     const url = `${API_BASE_URL}/items/?system.contentType.id=blogAuthor`;
  
//     try {
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${BEARER_TOKEN}`,
//         },
//       });
//       const data = await response.json();
  
//       // Extract the author IDs and names from the API response
//       const authorsFromAPI = data.data.reduce((acc, author) => {
//         const authorFields = author.fields;
//         const authorName = `${authorFields.authorFirstName.value} ${authorFields.authorLastName.value}`;
//         acc[authorName] = author.id;
//         return acc;
//       }, {});
  
//       return authorsFromAPI;
//     } catch (error) {
//       console.error('Error retrieving authors from the API:', error);
//       return {};
//     }
//   }
//   iget this from it 
// {
//     "Martin Knudsen": "Y8J-P7_DQkqgrUNrymUjnA"
//   }
  