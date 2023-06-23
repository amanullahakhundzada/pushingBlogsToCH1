const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Path to the file containing image URLs
const imageURLsFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/imageURLs.txt';

// Directory to save the downloaded images
const saveDirectory = 'C:/Users/AmanullahAkhundzada/Desktop/all_xcentium_blogs_media';

// Create the save directory if it doesn't exist
if (!fs.existsSync(saveDirectory)) {
  fs.mkdirSync(saveDirectory);
}

// Read the file containing image URLs synchronously
try {
  const data = fs.readFileSync(imageURLsFilePath, 'utf8');

  // Extract URLs using regular expression
  const regex = /(https?:\/\/[^\s]+)/g;
  const imageURLs = data.match(regex);

  // Download images from each URL
  imageURLs.forEach(async (url, index) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      // Determine the image format based on the response headers
      const contentType = response.headers['content-type'];
      const supportedFormats = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];

      if (supportedFormats.includes(contentType)) {
        // Generate a unique filename for each image
        const extension = contentType.split('/')[1];
        const filename = `image_${index + 1}.${extension}`;

        // Save the downloaded image to disk
        const savePath = path.join(saveDirectory, filename);
        fs.writeFileSync(savePath, Buffer.from(response.data));

        console.log(`Image ${index + 1} downloaded: ${savePath}`);
      } else {
        console.log(`Skipping image ${index + 1} with unsupported format: ${url}`);
      }
    } catch (error) {
      console.error(`Error downloading image ${index + 1}: ${url}`, error);
    }
  });
} catch (err) {
  console.error('Error reading image URLs file:', err);
}


// const fs = require('fs');
// const axios = require('axios');
// const path = require('path');

// // Path to the file containing image URLs
// const imageURLsFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/imageURLs.txt';

// // Directory to save the downloaded images
// const saveDirectory = 'C:/Users/AmanullahAkhundzada/Desktop/all_xcentium_blogs_media';

// // Create the save directory if it doesn't exist
// if (!fs.existsSync(saveDirectory)) {
//   fs.mkdirSync(saveDirectory);
// }

// // Read the file containing image URLs synchronously
// try {
//   const data = fs.readFileSync(imageURLsFilePath, 'utf8');

//   // Extract URLs using regular expression
//   const regex = /(https?:\/\/[^\s]+)/g;
//   const imageURLs = data.match(regex);

//   // Download images from each URL
//   imageURLs.forEach(async (url, index) => {
//     try {
//       const response = await axios.get(url, { responseType: 'arraybuffer' });

//       // Generate a unique filename for each image
//       const extension = path.extname(url);
//       const supportedExtensions = ['.gif', '.jpg', '.jpeg', '.png', '.webp'];

//       if (supportedExtensions.includes(extension.toLowerCase())) {
//         const filename = `image_${index + 1}${extension}`;

//         // Save the downloaded image to disk
//         const savePath = path.join(saveDirectory, filename);
//         fs.writeFileSync(savePath, Buffer.from(response.data));

//         console.log(`Image ${index + 1} downloaded: ${savePath}`);
//       } else {
//         console.log(`Skipping image ${index + 1} with unsupported format: ${url}`);
//       }
//     } catch (error) {
//       console.error(`Error downloading image ${index + 1}: ${url}`, error);
//     }
//   });
// } catch (err) {
//   console.error('Error reading image URLs file:', err);
// }












// const fs = require('fs');
// const axios = require('axios');
// const path = require('path');
// const sanitize = require('sanitize-filename');

// // Path to the file containing image URLs
// const imageURLsFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/imageURLs.txt';

// // Directory to save the downloaded images
// const saveDirectory = 'C:/Users/AmanullahAkhundzada/Desktop/all_xcentium_blogs_media';

// // Create the save directory if it doesn't exist
// if (!fs.existsSync(saveDirectory)) {
//   fs.mkdirSync(saveDirectory);
// }

// // Read the file containing image URLs asynchronously
// fs.readFile(imageURLsFilePath, 'utf8', async (err, data) => {
//   if (err) {
//     console.error('Error reading image URLs file:', err);
//     return;
//   }

//   // Extract URLs using regular expression
//   const regex = /(https?:\/\/[^\s]+)/g;
//   const imageURLs = data.match(regex);

//   // Download images from each URL
//   for (let i = 0; i < imageURLs.length; i++) {
//     const url = imageURLs[i];

//     try {
//       const response = await axios.get(url, { responseType: 'arraybuffer' });

//       // Generate a unique filename for each image
//       const extension = path.extname(url);
//       const filename = sanitize(`image_${i + 1}${extension}`);

//       // Save the downloaded image to disk
//       const savePath = path.join(saveDirectory, filename);
//       fs.writeFileSync(savePath, Buffer.from(response.data));

//       console.log(`Image ${i + 1} downloaded: ${savePath}`);
//     } catch (error) {
//       console.error(`Error downloading image ${i + 1}: ${url}`, error);
//     }
//   }
// });

