const fs = require('fs');
const path = require('path');
const axios = require('axios');

// const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/Migrating Data HTMLToMD'; // directory path
const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/'; // API endpoint

const uniqueAuthors = new Set(); // Set to store unique authors

// Function to read files in a directory
async function readFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      const fileStats = await fs.promises.stat(filePath);

      if (fileStats.isDirectory()) {
        await readFiles(filePath); // Recursive call for subdirectories
      } else if (file.endsWith('.md')) {
        const content = await fs.promises.readFile(filePath, 'utf-8');

        const author = extractAuthor(content);
        if (author) {
          if (!uniqueAuthors.has(author.name)) {
            uniqueAuthors.add(author.name);
            const authorData = createAuthorData(author);
            await uploadToApi(authorData);
          } else {
            console.log(`Duplicate author found: ${author.name}`);
          }
        } else {
          console.log(`No author found in file: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

// Function to extract the author from the content
function extractAuthor(content) {
  const authorRegex = /author:\s*(.*)/i;
  const match = content.match(authorRegex);

  if (match && match[1]) {
    const authorName = match[1].trim();
    const [firstName, lastName] = authorName.split(' ');

    return {
      contentTypeId: 'blogAuthor',
      name: authorName,
      fields: {
        authorFirstName: {
          value: firstName || '',
        },
        authorLastName: {
          value: lastName || '',
        },
      },
    };
  }

  return null;
}

// Function to create author data object
function createAuthorData(author) {
  return {
    contentTypeId: author.contentTypeId,
    name: author.name,
    fields: author.fields,
  };
}

async function uploadToApi(data) {
  const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzI0NDY0NSwiZXhwIjoxNjg3MjQ1NTQ1LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.m0jqoW8cgsUu5h4PqqZyeqwGzQlMHzM7aAQ3joGfuXstyhuhOpl4owsmB4_yds1OPztykxL_u84xeJSKf-eyfE_I9DNBcLxi3rr6h-VhJPHYby9UfFOTWirI5tD2eQPBNAQeVmmnJmUw3Go6kiwjJ_oGIghPJpWw_qXamkJKr7S55rP8bfx9FkSDm9q4UjnQ3zjfCYhokFFhxSjqT5GgUJmlZ8ac1YHZae8VfQNDAV2nW5sNfq3yH8uMoonrSQ2XUfnCqpW0eWwbjwX7IEzUQctIZzXPf_pG0IPGx5T9NAlgfrqwgsOLTiN6aXCvwn_7fwrZNdJWjK5B6ceI45hxEg'; // Replace with the actual access token
  const authHeader = `Bearer ${accessToken}`;

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: authHeader,
      },
    });

    console.log('API Response:', response.data); // Add this line to display the API response
  } catch (error) {
    console.error('API Error:', error);
  }
}

// Start reading files in the specified directory
readFiles(directoryPath);







// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

// // const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/Migrating Data HTMLToMD'; // directory path
// const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
// const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/'; // API endpoint

// // Function to read files in a directory
// async function readFiles(dir) {
//   try {
//     const files = await fs.promises.readdir(dir);

//     for (const file of files) {
//       const filePath = path.join(dir, file);

//       const fileStats = await fs.promises.stat(filePath);

//       if (fileStats.isDirectory()) {
//         await readFiles(filePath); // Recursive call for subdirectories
//       } else {
//         const content = await fs.promises.readFile(filePath, 'utf-8');

//         const tags = extractTags(content);
//         const postContent = extractPostContent(content);

//         const data = createDataObject(tags, postContent);

//         await uploadToApi(data);
//       }
//     }
//   } catch (error) {
//     console.error('Error reading files:', error);
//   }
// }

// // Function to extract the tags from the content
// function extractTags(content) {
//   const tagRegex = /---\s*tags:(?:\s|.)*?---/s;
//   const tags = {};
//   const match = content.match(tagRegex);

//   if (match && match[0]) {
//     const tagsStr = match[0];
//     const tagLines = tagsStr.split('\n');

//     tagLines.forEach((line) => {
//       if (line.trim() !== '---') {
//         const [key, value] = line.split(':');
//         if (key && value) {
//           tags[key.trim()] = value.trim();
//         } else if (key) {
//           tags[key.trim()] = '';
//         }
//       }
//     });
//   }

//   return tags;
// }

// // Function to extract the post content from the content
// function extractPostContent(content) {
//   const postContentRegex = /---\s*tags:(?:\s|.)*?---([\s\S]*)/;
//   const match = content.match(postContentRegex);

//   if (match && match[1]) {
//     return match[1].trim();
//   }

//   return '';
// }

// // Function to create the data object with filled value
// function createDataObject(tags, postContent) {
//   const author = tags.author || '';
//   const postTags = tags.tags || '';

//   const authorParts = author.split(' '); // Split author name into parts

//   const authorData = {
//     contentTypeId: 'blogAuthor',
//     name: author,
//     fields: {
//       authorFirstName: {
//         value: authorParts[0] || '',
//       },
//       authorLastName: {
//         value: authorParts[1] || '',
//       },
//     },
//   };

//   const tagData = {
//     contentTypeId: 'blogTag',
//     name: postTags,
//     fields: {
//       tagDescription: {
//         value: postTags,
//       },
//     },
//   };

//   return [authorData, tagData];
// }

  


//       async function uploadToApi(data) {
//         const accessToken = ''; // Replace with the actual access token
//         const authHeader = `Bearer ${accessToken}`;
      
//         try {
//           const response = await axios.post(apiUrl, data, {
//             headers: {
//               Authorization: authHeader,
//             },
//           });
      
//           console.log('API Response:', response.data); // Add this line to display the API response
//         } catch (error) {
//           console.error('API Error:', error);
//         }
//       }
      
      
      
      
//       // Start reading files in the specified directory
//       readFiles(directoryPath);