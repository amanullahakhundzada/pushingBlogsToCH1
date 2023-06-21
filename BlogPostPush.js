const fs = require('fs');
const path = require('path');
const axios = require('axios');

// const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/Migrating Data HTMLToMD';
const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/'; // API endpoint
const tagFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/CH1/nodejs-upload-main/tags.json'; // Path to tag JSON file
const authorFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/CH1/nodejs-upload-main/authors.json'; // Path to author JSON file

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

        const data = createDataObject(tags, postContent);

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
    const postContent = match[1].trim();
    return postContent;
  }

  return '';
}

// Function to create the data object with filled values
function createDataObject(tags, postContent) {
  const title = tags.title || '';
  const date = tags.date || '';
  const description = tags.description || '';
  const postTagsString = tags.tags || '';
  const author = tags.author || '';
  const tagNames = postTagsString.split(',').map((tag) => tag.trim());
  const tagIDs = getTagIDs(tagFilePath, tagNames); // Get the tag ID from tag.json
  const authorID = getAuthorID(authorFilePath, author); // Get the author ID from author.json

  return {
    contentTypeId: 'blogPost',
    name: title,
    fields: {
      postSlug: { value: title.replace(/ /g, '-') },
      postTitle: { value: title },
      postDescription: { value: description },
      postContent: { value: postContent },
        postTags: { value: tagIDs.map((tagID) => ({ type: 'Link', relatedType: 'Content', id: tagID, uri: `${apiUrl}${tagID}` })) },
      postAuthors: { value: [{ type: 'Link', relatedType: 'Content', id: authorID , uri:`${apiUrl}${authorID}`}] },
      createdDate: { value: date },
    },
  };
}


// Helper function to get the tag IDs from tag.json
function getTagIDs(tagFilePath, tagNames) {
    try {
      const tagData = fs.readFileSync(tagFilePath, 'utf-8');
      const tags = JSON.parse(tagData);
  
      return tagNames.map((tagName) => {
        if (tagName in tags) {
          return tags[tagName];
        } else {
          console.error(`Tag '${tagName}' not found in ${tagFilePath}.`);
          return '';
        }
      });
    } catch (error) {
      console.error(`Error reading ${tagFilePath}:`, error);
    }
  
    return [];
  }
// Helper function to get the author ID from author.json
function getAuthorID(authorFilePath, authorName) {
  try {
    const authorData = fs.readFileSync(authorFilePath, 'utf-8');
    const authors = JSON.parse(authorData);

    if (authorName in authors) {
      return authors[authorName];
    } else {
      console.error(`Author '${authorName}' not found in ${authorFilePath}.`);
    }
  } catch (error) {
    console.error(`Error reading ${authorFilePath}:`, error);
  }

  return '';
}

async function uploadToApi(data) {
  const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50L01NU0VtYmVkZGVkVGVuYW50SUQiOiIwM2RhNTk3Yi00MzkyLTRmOGUtOTFjZi0wOGRhYzYzZDBjYmUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX2JQZ0ljb2dVQTc0M04xWnkiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJ4Y2VudGl1bSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9vcmdfZGlzcGxheV9uYW1lIjoiWENlbnRpdW0iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2FjY291bnRfaWQiOiIwMDExTjAwMDAxVXRIc1RRQVYiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX3R5cGUiOiJwYXJ0bmVyIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL2NsaWVudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvdGVuYW50X2lkIjoiMzViODk4ZGQtZmJlNi00MzdhLTkxY2UtMDhkYWM2M2QwY2JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL3RlbmFudF9uYW1lIjoiaGMteGNlbnRpdW0tNGVmNDEiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxb0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImlhdCI6MTY4NzMxNDQ2OCwiZXhwIjoxNjg3MzE1MzY4LCJhenAiOiI1Vm9xUkJOZGRuWVZVS0JOMjFPUVZuNGw1YVRIZ3gxbyIsInNjb3BlIjoiaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQubWVkaWE6bWFuYWdlIGhjLm1nbW50LnN0YXRlczpwdWJsaXNoIGhjLm1nbW50LmFwaWtleXM6bWFuYWdlIGhjLm1nbW50LmNsaWVudHM6cmVhZCBoYy5tZ21udC51c2VyczpyZWFkIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.aAbX5lJsv1D0kBwn6J7pH0zUrfyuI5fwLsftqKu7HP0D_xQl_IylDBkRngKR0XuEekQIm5cf93sgERluZmXumU3rTtNHkWgT5UAVk2iU0-OYKA-p7NCiTTeWq3yEaxyMcW_NgkZWJjHYpKMoNc7IC0wcIz-NJNQThkcu2zKPb6hZE14wHQD9wc8x1icz4rDaZ0bqRiiJtcIOMibyJ6_L56cYrOA9qQuEVA4w0XIik2Kw60zbDOQlVbL-mgl8S3YS40BbSUhJa2YRf4DmbePGQ936pWL5ftkmqOsTK2cLE2A6iARFTrqKJNpe6-FiyWIJJ14t_eSk5MAGtoWJH4T61w';
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
