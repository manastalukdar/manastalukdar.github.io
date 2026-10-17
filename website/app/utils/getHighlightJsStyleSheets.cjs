const fs = require("fs");
const path = require("path");

// Get the website root directory (parent of app directory)
const websiteRoot = path.resolve(__dirname, "../..");
const stylesDir = path.join(websiteRoot, "public/styles");

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir);
}

const styles = ["atom-one-light.css", "atom-one-dark.css"];

styles.forEach((element) => {
  fs.copyFile(
    path.join(websiteRoot, "node_modules/highlight.js/styles/", element),
    path.join(stylesDir, element),
    (err) => {
      if (err) throw err;
      console.log(element + ": source was copied to destination");
    }
  );
});
