const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

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

function main() {
  const inputDir = process.argv[2];
  const outputDir = process.argv[3];

  if (!fs.existsSync(inputDir) || !fs.lstatSync(inputDir).isDirectory()) {
    console.log("Input directory does not exist.");
    process.exit(1);
  }

  if (
    outputDir &&
    (!fs.existsSync(outputDir) || !fs.lstatSync(outputDir).isDirectory())
  ) {
    console.log("Output directory does not exist.");
    process.exit(1);
  }

  compressImages(inputDir, outputDir);
}

main();
