const fs = require('fs');
const path = require('path');
const axios = require('axios');

const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/test reading'; // directory path
const apiUrl = 'https://content-api.sitecorecloud.io/api/content/v1/items/'; // API endpoint

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
    const postContent = match[1].trim().replace(/\\/g, '').replace(/\n/g, '<br>');
    return postContent;
  }

  return '';
}




// Function to create the data object with filled value
function createDataObject(tags, postContent) {
    const title = tags.title || '';
    const date = tags.date || '';
    const description = tags.description || '';
    const postTags = tags.tags || '';
    const author = tags.author || '';
  

  
    // const tagData = tags.tag || ''; // Add this line to assign value to tagData
  
    return {
      contentTypeId: 'blogPost',
      name: title,
      fields: {
        postSlug: { value: title.replace(/ /g, '-') },
        postTitle: { value: title },
        postDescription: { value: description },
        postContent: { value: postContent },
        createdDate: { value: date },
        postTags: { value: postTags },
        postAuthors: { value: author },
      },
    };
  }
  
  


      async function uploadToApi(data) {
        const accessToken = '';
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