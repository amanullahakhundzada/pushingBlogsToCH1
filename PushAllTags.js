const fs = require('fs');
const path = require('path');
const axios = require('axios');

// const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/Migrating Data HTMLToMD'; // directory path
const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/'; // API endpoint

// Set to store unique tags
const uniqueTags = new Set();

// Function to read files in a directory
async function readFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      const fileStats = await fs.promises.stat(filePath);

      if (fileStats.isDirectory()) {
        await readFiles(filePath); // Recursive call for subdirectories
      } else {
        const content = await fs.promises.readFile(filePath, 'utf-8');

        const tags = extractTags(content);
        const postContent = extractPostContent(content);

        for (const tag of tags) {
          if (!uniqueTags.has(tag)) {
            uniqueTags.add(tag);
            const data = createDataObject(tag);

            await uploadToApi(data);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

// Function to extract the tags from the content
function extractTags(content) {
  const tagsRegex = /tags:\s*([^]+?)(?=\n\S+:|\n$)/i;
  const tagsMatch = content.match(tagsRegex);
  let tags = [];

  if (tagsMatch) {
    const tagsText = tagsMatch[1].trim();
    tags = tagsText.split(',');
  }

  return tags.map((tag) => tag.trim());
}

// Function to extract the post content from the content
function extractPostContent(content) {
  const postContentRegex = /---\s*tags:(?:\s|.)*?---([\s\S]*)/;
  const match = content.match(postContentRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return '';
}

// Function to create the data object with filled values
function createDataObject(tag) {
  return {
    contentTypeId: 'blogTag',
    name: tag,
    fields: {
      tagDescription: {
        value: tag,
      },
    },
  };
}

// Function to upload data to the API
async function uploadToApi(data) {
  const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzIzNzM1MywiZXhwIjoxNjg3MjM4MjUzLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Mg1QOe5px9y8z0QiwCGOqPz7BDI-zCgR-307rm5bVCuABVqOa-FgTFk0O5ewF4RDQ9NYEimDdCEyj2EF-eqg8WequTQ_MzQ_KqqdYDo5PdTh_rD8NOl9Sv8skculVMvJTJ9_9OE4_dN6tJuKfK293KH8Z0PX1nQd_USKevdKL77OJgSZ2Jlt3G4UMYw4-MaNTq_Eg2WA8XjnndzNXkO7lyL221spNLj3J_X-GD3j12e4qmDB98_2ad3wBw7MshjKL5F0idyr0ogU5GMezXuSFW4HYBJ7IeLGM8yydQ7dJ7BzJv5C018SxKv1bx0P6oMvnuAL4FNeC6Fh-vT1nBgU-g'; // Replace with the actual access token
  const authHeader = `Bearer ${accessToken}`;

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: authHeader,
      },
    });

    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error);
  }
}

// Invoke the function to read files
readFiles(directoryPath);





// duplication of tags is happening 

// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

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

//         for (const tag of tags) {
//           const data = createDataObject(tag);

//           await uploadToApi(data);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error reading files:', error);
//   }
// }

// // Function to extract the tags from the content
// function extractTags(content) {
//   const tagsRegex = /tags:\s*([^]+?)(?=\n\S+:|\n$)/i;
//   const tagsMatch = content.match(tagsRegex);
//   let tags = [];

//   if (tagsMatch) {
//     const tagsText = tagsMatch[1].trim();
//     tags = tagsText.split(',');
//   }

//   return tags.map((tag) => tag.trim());
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

// // Function to create the data object with filled values
// function createDataObject(tag) {
//   return {
//     contentTypeId: 'blogTag',
//     name: tag,
//     fields: {
//       tagDescription: {
//         value: tag,
//       },
//     },
//   };
// }

// // Function to upload data to the API
// async function uploadToApi(data) {
//   const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzIzNzM1MywiZXhwIjoxNjg3MjM4MjUzLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Mg1QOe5px9y8z0QiwCGOqPz7BDI-zCgR-307rm5bVCuABVqOa-FgTFk0O5ewF4RDQ9NYEimDdCEyj2EF-eqg8WequTQ_MzQ_KqqdYDo5PdTh_rD8NOl9Sv8skculVMvJTJ9_9OE4_dN6tJuKfK293KH8Z0PX1nQd_USKevdKL77OJgSZ2Jlt3G4UMYw4-MaNTq_Eg2WA8XjnndzNXkO7lyL221spNLj3J_X-GD3j12e4qmDB98_2ad3wBw7MshjKL5F0idyr0ogU5GMezXuSFW4HYBJ7IeLGM8yydQ7dJ7BzJv5C018SxKv1bx0P6oMvnuAL4FNeC6Fh-vT1nBgU-g'; // Replace with the actual access token
//   const authHeader = `Bearer ${accessToken}`;

//   try {
//     const response = await axios.post(apiUrl, data, {
//       headers: {
//         Authorization: authHeader,
//       },
//     });

//     console.log('API Response:', response.data);
//   } catch (error) {
//     console.error('API Error:', error);
//   }
// }

// // Invoke the function to read files
// readFiles(directoryPath);
