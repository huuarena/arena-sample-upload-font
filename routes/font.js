var express = require("express");
var router = express.Router();
const fs = require("fs");

const generateFileName = ({ style, weight, display }) => {
  return `${style || "normal"}_${weight || "normal"}_${display || "wrap"}.css`;
};

const generateFontFace = (req) => {
  const { family, style, weight, display } = req.query;

  let content = "";
  content += `@font-face {\n`;
  content += `\t font-family: "${family}";\n`;
  content += `\t src: url("${process.env.BACKEND_URL}/asset/${family}/${family}.otf") format("opentype"),\n`;
  content += `\t\t url("${process.env.BACKEND_URL}/asset/${family}/${family}.ttf") format("truetype"),\n`;
  content += `\t\t url("${process.env.BACKEND_URL}/asset/${family}/${family}.woff") format("woff"),\n`;
  content += `\t\t url("${process.env.BACKEND_URL}/asset/${family}/${family}.svg") format("svg");\n`;
  content += `\t font-style: ${style || "normal"};\n`;
  content += `\t font-weight: ${weight || "normal"};\n`;
  content += `\t display: ${display || "swap"};\n`;
  content += `}`;

  return content;
};

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    const { family, style, weight, display } = req.query;

    if (!family) {
      throw new Error("Font family cannot be blank");
    }

    if (!fs.existsSync(process.cwd() + "/asset/" + family)) {
      throw new Error("Font family not found");
    }

    let filename = generateFileName(req.query);
    let filepath = process.cwd() + "/asset/" + family + "/" + filename;

    // generate new font face file if any
    if (!fs.existsSync(filepath)) {
      let content = generateFontFace(req);

      fs.writeFileSync(filepath, content);
    }

    res.sendFile(filepath);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
