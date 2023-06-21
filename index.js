const fs = require('fs');
const path = require('path');
const axios = require('axios');

const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items'; // API endpoint

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

        // console.log('File Content:', content); // Add this line to display the file content

        const tags = extractTags(content);
        const postContent = extractPostContent(content);

        // console.log('Tags:', tags); // Add this line to display the extracted tags
        // console.log('Post Content:', postContent); // Add this line to display the extracted post content

        const data = createDataObject(tags, postContent);

        // console.log('Data Object:', data); // Add this line to display the created data object

        // Upload the data to the REST API service
        await uploadToApi(data);
      }
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

// Function to extract the tags from the content
function extractTags(content) {
  const tagRegex = /---\s*tags:(?:\s|.)*?---/s;
  const tags = {};
  const match = content.match(tagRegex);

  if (match && match[0]) {
    const tagsStr = match[0];
    const tagLines = tagsStr.split('\n');

    tagLines.forEach((line) => {
      if (line.trim() !== '---') {
        const [key, value] = line.split(':');
        if (key && value) {
          tags[key.trim()] = value.trim();
        } else if (key) {
          tags[key.trim()] = '';
        }
      }
    });
  }

  return tags;
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



//   Function to create the data object with filled values
function createDataObject(tags, postContent) {
  const title = tags.title || '';
  const author = tags.author || '';
  const date = tags.date || '';
  const description = tags.description || '';
  const postTags = tags.tags || '';

  return {
    name: { value: title },
    system: {
      status: { value: 'Draft' },
      contentType: {
        relatedType: 'ContentType',
        id: 'blogPost',
      },
    },
    fields: {
      postSlug: { value: title.replace(/ /g, '-') },
      postTitle: { value: title },
      postDescription: { value: description },
      postContent: { value: postContent },
      thumbnailImages: { value: [] },
      heroImages: { value: [] },
      postImages: { value: [] },
      postTags: { value: postTags },
      postAuthors: { value: author },
      createdDate: { value: date },
    },
  };
}
  


  
// Function to upload data to the API
async function uploadToApi(data) {
  const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4Njk2MjMxMywiZXhwIjoxNjg2OTYzMjEzLCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.Wmq35xcCEU36WSCB5u9RfWL285Y_pAtdbQ1BNFy5ZOHcThx6hrCxzZg6kpWvlqZaugTsmn_n6SZ9HVn89yxeShTRPWj54gbB3-G6lOU0hQ8rhx9sno6_sRM3JEhWP9Z2SDBJZY-kakbJbNBpBu-FaS86sph3e0hlPvfKnlYW-JHZ1_yvoVLPr0Dej_xIm9D_ir7z23pMetWtJX6NZbUJZeKK733Jr0oniJHYT33c-k_yYH4I1945tjLMbH_DsVnx0V6uE8TUk5HFtV1QDqQ76muqcgZbtIX-Tof2CyZ6oxj4oxb9liU9MLlTFXLFyuST6_k4pDGNxM9HsTNFDdQL4Q'; // Replace with the actual access token
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

// const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
// const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items'; // API endpoint

// // Function to read files in a directory
// function readFiles(dir) {
//   const files = fs.readdirSync(dir);

//   files.forEach(file => {
//     const filePath = path.join(dir, file);

//     // Check if the current path is a directory or a file
//     if (fs.statSync(filePath).isDirectory()) {
//       readFiles(filePath); // Recursive call for subdirectories
//     } else {
//       // Read the content of the file
//       const content = fs.readFileSync(filePath, 'utf-8');

//       // Extract tags from the content
//       const tags = extractTags(content);

//       // Extract post content from the content
//       const postContent = extractPostContent(content);

//       // Create the data object to be sent in the request
//       const data = createDataObject(tags, postContent);

//       // Upload the data to the REST API service
//       uploadToApi(data);
//     }
//   });
// }

// function extractTags(content) {
//   const tagRegex = /---\ntags:.*?\n---/s;
//   const tags = {};
//   let match;

//   while ((match = tagRegex.exec(content))) {
//     const [_, key, value] = match;

//     if (key && value) {
//       tags[key.trim()] = value.trim();
//     } else if (key) {
//       tags[key.trim()] = '';
//     }
//   }

//   return tags;
// }

// // Function to extract the post content from the content
// function extractPostContent(content) {
//   const tagsRegex = /---\ntags:.*?\n---/s;
//   const postContent = content.replace(tagsRegex, '').trim();

//   return postContent;
// }

// // Function to create the data object with filled values
// function createDataObject(tags, postContent) {
//   return {
//     name: { value: tags.title, type: 'ShortText' },
//     system: {
//       status: { value: 'Draft' },
//       contentType: {
//         relatedType: 'ContentType',
//         id: 'blogPost'
//       }
//     },
//     fields: {
//       postSlug: { value: tags.title.replace(/ /g, '-'), type: 'ShortText' },
//       postTitle: { value: tags.title, type: 'ShortText' },
//       postDescription: { value: tags.description, type: 'ShortText' },
//       postContent: { value: postContent, type: 'LongText' },
//       thumbnailImages: { value: [], type: 'Media' },
//       heroImages: { value: [], type: 'Media' },
//       postImages: { value: [], type: 'Media' },
//       postTags: { value: tags.tags ? tags.tags.split(', ') : [], type: 'Reference' },
//       postAuthors: { value: tags.author, type: 'Reference' },
//       createdDate: { value: tags.date, type: 'DateTime' }
//     }
//   };
// }

// // Function to upload data to the REST API service
// async function uploadToApi(data) {
//   try {
//     // Set the request headers with the bearer token
//     const headers = {
//       'Authorization': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NjkzMzQ1OSwiZXhwIjoxNjg2OTM0MzU5LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.bEkDyZ_1mXywYMKe6xcdoYDYrnARfQDwI6tXaEiuCvy2w3AdVDXZcPtt616yEWFRYbklfG_uWUoGhXQ7gFfd4YyKjfKcwzBdIXAnlqhTe84FBBnp9ANtkk-aIYvLWe206Hju70Wxq40L8W8nK2wGVzDa7bqEKkJrHfV32wnr_-LEDBj6ipo7eJrkiOLv6dcx0kxu7wmFI46CNgoLGpX2V3eyOfvLpVWEZZDgaTsPimZ6sDiRnepxXO-A5nimV7Id-XtNOWnSlutLxNJ3K1_3j2Bb_8Kg2ocr73vPpiamepk2dc_r-ET7qV74K6gPwceEEH6yp7WCokcmm79xpXaIEQ',
//       'Content-Type': 'application/json'
//     };

//     // Make a POST request to the API endpoint with the headers
//     const response = await axios.post(apiUrl, data, { headers });

//     console.log('Data uploaded successfully:', response.data);
//   } catch (error) {
//     console.error('Error uploading data:', error.response.data);
//   }
// }
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

//         // console.log('File Content:', content); // Add this line to display the file content

//         const tags = extractTags(content);
//         const postContent = extractPostContent(content);

//         // console.log('Tags:', tags); // Add this line to display the extracted tags
//         // console.log('Post Content:', postContent); // Add this line to display the extracted post content

//         const data = createDataObject(tags, postContent);

//         // Rest of the code...
//       }
//     }
//   } catch (error) {
//     console.error('Error reading files:', error);
//   }
// }

// readFiles(directoryPath);



