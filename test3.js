const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_BASE_URL = 'https://content-api.sitecorecloud.io/api/content/v1';
const BEARER_TOKEN = 'your_bearer_token';
const DIRECTORY_PATH = 'path/to/your/directory';

async function getTagsFromAPI() {
  const url = `${API_BASE_URL}/items/?system.contentType.id=blogTag`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    const data = await response.json();

    // Extract the tag IDs and names from the API response
    const tagsFromAPI = data.data.reduce((acc, tag) => {
      acc[tag.name] = tag.id;
      return acc;
    }, {});

    return tagsFromAPI;
  } catch (error) {
    console.error('Error retrieving tags from the API:', error);
    return {};
  }
}

async function getAuthorsFromAPI() {
  const url = `${API_BASE_URL}/items/?system.contentType.id=blogAuthor`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    const data = await response.json();

    // Extract the author IDs and names from the API response
    const authorsFromAPI = data.data.reduce((acc, author) => {
      const authorFields = author.fields;
      const authorName = `${authorFields.authorFirstName.value} ${authorFields.authorLastName.value}`;
      acc[authorName] = author.id;
      return acc;
    }, {});

    return authorsFromAPI;
  } catch (error) {
    console.error('Error retrieving authors from the API:', error);
    return {};
  }
}

async function createDataObject(tags, postContent, postTags, postAuthors, tagsData, authorsData) {
  const title = tags.title || '';
  const date = tags.date || '';
  const description = tags.description || '';

  // Create an array of tag objects
  const tagObjects = await Promise.all(postTags.map(tag => createTagObject(tag, tagsData)));

  // Create an array of author objects
  const authorObjects = await Promise.all(postAuthors.map(author => createAuthorObject(author, authorsData)));

  // Filter out any null values in the tagObjects and authorObjects arrays
  const filteredTagObjects = tagObjects.filter(tagObject => tagObject !== null);
  const filteredAuthorObjects = authorObjects.filter(authorObject => authorObject !== null);

  return {
    contentTypeId: 'blogPost',
    name: title,
    fields: {
      postSlug: { value: title.replace(/ /g, '-'), type: 'ShortText' },
      postTitle: { value: title, type: 'ShortText' },
      postDescription: { value: description, type: 'ShortText' },
      postContent: { value: postContent, type: 'LongText' },
      createdDate: { value: date, type: 'DateTime' },
      postTags: { value: filteredTagObjects, type: 'Reference' },
      postAuthors: { value: filteredAuthorObjects, type: 'Reference' },
      // thumbnailImages: { value: [], type: 'Media' },
      // heroImages: { value: [], type: 'Media' },
      // postImages: { value: [], type: 'Media' }
    }
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

async function readFiles(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Process the file content and upload to the API
      const tagsFromMarkdown = ['tag1', 'tag2', 'tag3']; // Replace with your actual tags
      const authorsFromMarkdown = ['author1', 'author2', 'author3']; // Replace with your actual authors

      const tagsFromAPI = await getTagsFromAPI();
      const authorsFromAPI = await getAuthorsFromAPI();

      // Match tags and authors from Markdown with their respective IDs from the API
      const matchedTags = matchTagsWithIDs(tagsFromMarkdown, tagsFromAPI);
      const matchedAuthors = matchAuthorsWithIDs(authorsFromMarkdown, authorsFromAPI);

      const tagsData = Object.values(tagsFromAPI);
      const authorsData = Object.values(authorsFromAPI);

      const tags = {
        title: 'Content Item Report with Sitecore API',
        date: '2022-08-31T00:00:00-07:00',
        description: 'Learn how to create a tabular report tool with a Sitecore API. Whether it’s for checking content item inventory, a clean-up analysis, or identifying when it was last updated and by'
      };

      const postContent = fileContent; // Use the content read from the Markdown file

      const postTags = Object.keys(matchedTags);
      const postAuthors = Object.keys(matchedAuthors);

      const postData = await createDataObject(tags, postContent, postTags, postAuthors, tagsData, authorsData);
      if (!postData) {
        console.error('Failed to create the data object.');
        return;
      }

      // Upload the data to the API
      await uploadToApi(postData);
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

readFiles(DIRECTORY_PATH);
