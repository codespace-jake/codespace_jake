// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const path = require("path");

// const MODE = process.env.WEBPACK_ENV;
// const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "test.js");
// const OUTPUT_DIR = path.join(__dirname, "static");

// console.log(ENTRY_FILE);

// module.exports = {
//   mode: MODE,
//   entry: ENTRY_FILE,
//   output: {
//     filename: "[name].js",
//     path: OUTPUT_DIR,
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: "styles.css",
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: [["@babel/preset-env", { targets: "defaults" }]],
//           },
//         },
//       },
//       {
//         test: /\.scss$/,
//         use: [
//           {
//             loader: MiniCssExtractPlugin.loader,
//             options: {
//               publicPath: "../",
//             },
//           },
//           {
//             loader: "css-loader",
//             options: {
//               url: false,
//             },
//           },
//           {
//             loader: "sass-loader",
//           },
//         ],
//       },
//     ],
//   },
// };

// --------------------------------------------------

// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const path = require("path");
// const fs = require("fs");

// const MODE = process.env.WEBPACK_ENV;
// const ENTRY_DIR = path.resolve(__dirname, "assets", "js");
// const OUTPUT_DIR = path.join(__dirname, "static");

// const entryFiles = {};
// const files = fs.readdirSync(ENTRY_DIR);

// files.forEach((file) => {
//   const filePath = path.join(ENTRY_DIR, file);
//   if (fs.statSync(filePath).isFile() && path.extname(filePath) === ".js") {
//     const fileName = path.basename(filePath, ".js");
//     const entryName = path.join(path.dirname(file), fileName);
//     entryFiles[entryName] = filePath;
//   }
// });

// module.exports = {
//   mode: MODE,
//   entry: entryFiles,
//   output: {
//     filename: "[name].js",
//     path: OUTPUT_DIR,
//     chunkFilename: "[name].[contenthash].js",
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: "styles.css",
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             presets: [["@babel/preset-env", { targets: "defaults" }]],
//           },
//         },
//       },
//     ],
//   },
// };

//-----------------------

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");

const MODE = process.env.WEBPACK_ENV;
const ENTRY_DIR = path.join(__dirname, "assets", "js");
const OUTPUT_DIR = path.join(__dirname, "static");

// const entryFiles = {};
// const files = glob.sync(path.join(ENTRY_DIR, "**/*.js"));

// files.forEach((file) => {
//   const relativePath = path.relative(ENTRY_DIR, file);
//   const fileName = path.basename(file, ".js");
//   const entryName = path.join(path.dirname(relativePath), fileName);

//   console.log(entryName, "???");

//   entryFiles[entryName] = file;
// });

module.exports = {
  mode: MODE,
  entry: glob.sync(path.join(ENTRY_DIR, "**/*.js")).reduce((acc, path) => {
    /**
     * The "[name]" placeholder in the "output" property will be replaced
     * with each key name in our "entry" object. We need to make sure the
     * keys are a path to the "index.js" file but without the actual file
     * name. This is why we replace the file name, "index.js", with a string
     */
    const entry = path.replace("/index.js", "");
    /**
     * Here we start building our object by placing the "entry" variable from
     * the previous line as a key and the entire path including the file name
     * as the value
     */
    acc[entry] = path;
    return acc;
  }, {}),
  output: {
    filename: "[name].js",
    path: OUTPUT_DIR,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
