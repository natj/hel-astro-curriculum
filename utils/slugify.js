const slugify = require("slugify");

// We export the exact configuration used in your gatsby-config
module.exports = (text) => {
  return slugify(text, { 
    lower: true, 
    strict: true 
  });
};
