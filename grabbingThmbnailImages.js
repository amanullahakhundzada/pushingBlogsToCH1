const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.xcentium.com/blog';

axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);
    const blogs = [];

    $('.blog-list-item').each((index, element) => {
      const title = $(element).find('.blog-title').text();
      const thumbnail = $(element).find('.blog-thumbnail').attr('src');

      blogs.push({ title, thumbnail });
    });

    // Display the results
    blogs.forEach(blog => {
      console.log('Title:', blog.title);
      console.log('Thumbnail:', blog.thumbnail);
      console.log('-------------------------------------');
    });
  })
  .catch(error => {
    console.log('Error:', error);
  });

  