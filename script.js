// Global variables
let images = [];

// DOM elements
const fileInput = document.getElementById('file-input');
const searchInput = document.getElementById('search-input');
const imageGrid = document.getElementById('image-grid');
const imagePreview = document.getElementById('image-preview');

// Event listeners
fileInput.addEventListener('change', handleFileUpload);
searchInput.addEventListener('input', handleSearch);
imageGrid.addEventListener('click', handleImageClick);
imageGrid.addEventListener('dragstart', handleDragStart);
imageGrid.addEventListener('dragover', handleDragOver);
imageGrid.addEventListener('drop', handleDrop);

// Handle file uploads
function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function () {
      const image = {
        name: file.name,
        src: reader.result
      };
      images.push(image);
      renderImageCard(image);
    };
    reader.readAsDataURL(file);
  });
}

// Render image card in the grid
function renderImageCard(image) {
  const imageCard = document.createElement('div');
  imageCard.className = 'image-card';
  imageCard.draggable = true;
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.name;
  imageCard.appendChild(img);
  imageGrid.appendChild(imageCard);
}

// Handle search
function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  const filteredImages = images.filter(image => image.name.toLowerCase().includes(query));
  clearGrid();
  filteredImages.forEach(renderImageCard);
}

// Clear image grid
function clearGrid() {
  while (imageGrid.firstChild) {
    imageGrid.firstChild.remove();
  }
}

// Handle image click
function handleImageClick(event) {
  if (event.target.tagName === 'IMG') {
    const clickedImage = images.find(image => image.src === event.target.src);
    renderPreview(clickedImage);
  }
}

// Render image preview
function renderPreview(image) {
  imagePreview.innerHTML = '';
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.name;
  imagePreview.appendChild(img);
}

// Handle drag start
function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

// Handle drag over
function handleDragOver(event) {
  event.preventDefault();
}

// Handle drop
function handleDrop(event) {
  event.preventDefault();
  const imageId = event.dataTransfer.getData('text/plain');
  const imageCard = document.getElementById(imageId);
  const targetCard = event.target.closest('.image-card');
  if (imageCard && targetCard && imageCard !== targetCard) {
    const imageIndex = Array.from(imageCard.parentNode.children).indexOf(imageCard);
    const targetIndex = Array.from(targetCard.parentNode.children).indexOf(targetCard);
    imageCard.parentNode.insertBefore(imageCard, targetIndex > imageIndex ? targetCard.nextSibling : targetCard);
    const tempImage = images[imageIndex];
    images.splice(imageIndex, 1);
    images.splice(targetIndex, 0, tempImage);
  }
}
