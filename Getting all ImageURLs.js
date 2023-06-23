const fs = require('fs');
const path = require('path');

const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/Migrating Data HTMLToMD';
const outputFilePath = 'C:/Users/AmanullahAkhundzada/Desktop/CH1/nodejs-upload-main/imageURLs.json'; // File path to store the URLs

// Function to extract image URLs from Markdown files
function extractImageURLs(content) {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches = content.match(regex);

  if (!matches) {
    return [];
  }

  return matches.map((match) => {
    const urlRegex = /\((.*?)\)/;
    const urlMatch = match.match(urlRegex);
    return urlMatch ? urlMatch[1] : null;
  });
}

// Read all MD files in the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Filter MD files
  const mdFiles = files.filter((file) => path.extname(file) === '.md');

  // Array to store all extracted image URLs
  const imageURLs = [];

  // Process each MD file
  mdFiles.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', filePath, err);
        return;
      }

      // Extract image URLs from the file content
      const fileImageURLs = extractImageURLs(data);

      // Add the URLs to the array
      imageURLs.push(...fileImageURLs);

      // If this is the last file, write the URLs to the output file
      if (file === mdFiles[mdFiles.length - 1]) {
        writeURLsToFile(imageURLs);
      }
    });
  });
});

// Function to write the URLs to the output file
function writeURLsToFile(imageURLs) {
  const content = imageURLs.join('\n');

  fs.writeFile(outputFilePath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', outputFilePath, err);
      return;
    }

    console.log('Image URLs saved to file:', outputFilePath);
  });
}




// const fs = require('fs');
// const path = require('path');

// const directoryPath = 'C:/Users/AmanullahAkhundzada/Desktop/Migrating Data HTMLToMD';
// const imageURLs = []; // Array to store the extracted URLs

// // Function to extract image URLs from Markdown files
// function extractImageURLs(content) {
//   const regex = /!\[.*?\]\((.*?)\)/g;
//   const matches = content.match(regex);

//   if (!matches) {
//     return [];
//   }

//   return matches.map((match) => {
//     const urlRegex = /\((.*?)\)/;
//     const urlMatch = match.match(urlRegex);
//     return urlMatch ? urlMatch[1] : null;
//   });
// }

// // Read all MD files in the directory
// fs.readdir(directoryPath, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }

//   // Filter MD files
//   const mdFiles = files.filter((file) => path.extname(file) === '.md');

//   // Process each MD file
//   mdFiles.forEach((file) => {
//     const filePath = path.join(directoryPath, file);

//     // Read the file content
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading file:', filePath, err);
//         return;
//       }

//       // Extract image URLs from the file content
//       const fileImageURLs = extractImageURLs(data);

//       // Add the URLs to the array
//       imageURLs.push(...fileImageURLs);
//     });
//   });
// });

// // Log the extracted image URLs after all files are processed
// fs.readdir(directoryPath, (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//     return;
//   }

//   // Filter MD files
//   const mdFiles = files.filter((file) => path.extname(file) === '.md');

//   // Process each MD file
//   mdFiles.forEach((file, index) => {
//     const filePath = path.join(directoryPath, file);

//     // Read the file content
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading file:', filePath, err);
//         return;
//       }

//       // Extract image URLs from the file content
//       const fileImageURLs = extractImageURLs(data);

//       // Add the URLs to the array
//       imageURLs.push(...fileImageURLs);

//       // If this is the last file, log the extracted image URLs
//       if (index === mdFiles.length - 1) {
//         console.log('All image URLs:', imageURLs);
//       }
//     });
//   });
// });
