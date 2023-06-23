const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Read the author.json file
const authorData = JSON.parse(fs.readFileSync('C:/Users/AmanullahAkhundzada/Desktop/CH1/nodejs-upload-main/authors.json'));
// Function to generate the author URL
function generateAuthorURL(authorFullName) {
  const baseUrl = 'https://www.xcentium.com/blog/author-page';
  const [firstName, lastName] = authorFullName.split(' ');
  return `${baseUrl}?author_full_name=${firstName}%20${lastName}`;
}


// Function to fetch the author image URL (implementation based on webpage structure)
// Function to fetch the author image URL (updated implementation based on webpage structure)
// async function fetchAuthorImageURL(authorURL) {
//     console.log(authorURL);
//     try {
//       const response = await axios.get(authorURL);
//       const $ = cheerio.load(response.data);
//       const imageWrapper = $('[data-image-wrapper]');
//       const imageUrl = imageWrapper.find('img[data-src]').attr('data-src');
//       const fullImageUrl = `https://www.xcentium.com${imageUrl}`;
//       return fullImageUrl;
//     } catch (error) {
//       console.error('Error fetching author image URL:', error);
//       return null;
//     }
//   }
  
// Function to fetch the author image URL (updated implementation based on webpage structure)

async function fetchAuthorImageURL(authorURL) {
    console.log(authorURL);
    try {
      const response = await axios.get(authorURL);
      const html = response.data;
     console.log(html)
      // Regular expression to match the image URL
      const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
      const match = html.match(regex);
  
      if (match && match[1]) {
        const imageUrl = match[1];
        console.log('Matched Image URL:', imageUrl);
        return imageUrl;
      } else {
        console.log('No Match Found');
        return 'does not exist';
      }
    } catch (error) {
      console.error('Error fetching author image URL:', error);
      return null;
    }
  }

// async function fetchAuthorImageURL(authorURL) {
//     console.log(authorURL);
//     try {
//       const response = await axios.get(authorURL);
//       const html = response.data;
//       console.log('HTML:', html); // Log the HTML content
      
//       const $ = cheerio.load(html);
  
//       // Find the image element using a CSS selector
//       const imageElement = $('img[data-src]');
      
//       // Check if the image element exists
//       if (imageElement.length) {
//         const imageUrl = imageElement.attr('src');
//         console.log('Matched Image URL:', imageUrl);
//         return imageUrl;
//       } else {
//         console.log('No Match Found');
//         return 'does not exist';
//       }
//     } catch (error) {
//       console.error('Error fetching author image URL:', error);
//       return null;
//     }
//   }
  

  
// Iterate over each author
(async () => {
  for (const fullName in authorData) {
    const authorFullName = fullName;
    const authorURL = generateAuthorURL(authorFullName);
    const authorImageURL = await fetchAuthorImageURL(authorURL);

    // Create a new object with author details
    const authorDetails = {
      FullName: authorFullName,
      ImageURL: authorImageURL,
      AuthorURL: authorURL,
    };

    // Save the author details to a new file
    fs.appendFileSync('author_details.json', JSON.stringify(authorDetails) + '\n');
  }
})();




// const fs = require('fs');

// const axios = require('axios');

// // Read the author.json file
// const authorData = JSON.parse(fs.readFileSync('C:/Users/AmanullahAkhundzada/Desktop/CH1/nodejs-upload-main/authors.json'));

// // Function to generate the author URL
// function generateAuthorURL(authorFullName) {
//   const baseUrl = 'https://www.xcentium.com/blog/';
//   const [firstName, lastName] = authorFullName.split(' ');
//   return `${baseUrl}?author_full_name=${firstName}%20${lastName}`;
// }

// // Function to fetch the author image URL
// async function fetchAuthorImageURL(authorURL) {
//   try {
//     const response = await axios.get(authorURL);
//     // Extract the author image URL from the response (you'll need to adjust this based on the actual structure of the page)
//     const authorImageURL = response.data.authorImageURL;
//     return authorImageURL;
//   } catch (error) {
//     console.error('Error fetching author image URL:', error);
//     return null;
//   }
// }

// // Iterate over each author
// (async () => {
//   for (const fullName in authorData) {
//     const authorFullName = fullName;
//     const authorURL = generateAuthorURL(authorFullName);
//     const authorImageURL = await fetchAuthorImageURL(authorURL);

//     // Create a new object with author details
//     const authorDetails = {
//       fullName: authorFullName,
//       imageURL: authorImageURL,
//     };

//     // Save the author details to a new file
//     fs.appendFileSync('author_details.json', JSON.stringify(authorDetails) + '\n');
//   }
// })();







// const fs = require('fs');
// const axios = require('axios');

// // Read the author.json file
// const authorData = JSON.parse(fs.readFileSync('author.json'));

// // Function to generate the author URL
// function generateAuthorURL(authorFullName) {
//   const baseUrl = 'https://www.xcentium.com/blog/';
//   const [firstName, lastName] = authorFullName.split(' ');
//   return `${baseUrl}?author_full_name=${firstName}%20${lastName}`;
// }

// // Function to fetch the author image URL
// async function fetchAuthorImageURL(authorURL) {
//   try {
//     const response = await axios.get(authorURL);
//     // Extract the author image URL from the response (you'll need to adjust this based on the actual structure of the page)
//     const authorImageURL = response.data.authorImageURL;
//     return authorImageURL;
//   } catch (error) {
//     console.error('Error fetching author image URL:', error);
//     return null;
//   }
// }

// // Iterate over each author
// for (const fullName in authorData) {
//   const authorFullName = fullName;
//   const authorURL = generateAuthorURL(authorFullName);
//   const authorImageURL = await fetchAuthorImageURL(authorURL);

//   // Create a new object with author details
//   const authorDetails = {
//     fullName: authorFullName,
//     imageURL: authorImageURL,
//   };

//   // Save the author details to a new file
//   fs.appendFileSync('author_details.json', JSON.stringify(authorDetails) + '\n');
// }


