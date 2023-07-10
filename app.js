const express = require("express");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/compress", (req, res) => {
  const inputDir = req.body.inputDir;
  const outputDir = req.body.outputDir;

  if (!fs.existsSync(inputDir) || !fs.lstatSync(inputDir).isDirectory()) {
    res.send("Input directory does not exist.");
    return;
  }

  if (
    outputDir &&
    (!fs.existsSync(outputDir) || !fs.lstatSync(outputDir).isDirectory())
  ) {
    res.send("Output directory does not exist.");
    return;
  }

  compressImages(inputDir, outputDir);

  res.send("Compression complete.");
});

function compressImages(inputDir, outputDir) {
  if (!outputDir) {
    outputDir = inputDir;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const imageFiles = fs
    .readdirSync(inputDir)
    .filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return (
        extension === ".jpg" || extension === ".jpeg" || extension === ".png"
      );
    })
    .map((file) => path.join(inputDir, file));

  if (imageFiles.length === 0) {
    console.log("No image files found in the input directory.");
    return;
  }

  console.log("Compressing images...");
  imageFiles.forEach((imageFile) => {
    const outputFileName = path.basename(imageFile);
    const outputPath = path.join(outputDir, outputFileName);

    sharp(imageFile).toFile(outputPath, (err) => {
      if (err) {
        console.error(`Error compressing ${imageFile}: ${err}`);
      }
    });
  });

  console.log("Compression complete.");
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
