#!/bin/bash

echo "🚀 Building for GitHub Pages..."
npm run build

echo "📦 Creating .nojekyll file..."
touch out/.nojekyll

echo "✅ Build complete! The 'out' folder is ready to deploy."
echo "📂 You can now push the 'out' folder to your gh-pages branch."
