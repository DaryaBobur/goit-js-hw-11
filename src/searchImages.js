import './css/styles.css';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const inputEl = document.querySelector('input');

form.addEventListener('submit', bla);

async function bla(e) {
  e.preventDefault();
  try {
    const name = inputEl.value.trim();
    const images = await getSearchImages(name);
    renderGalleryImages(images); 

  }
  catch (error) { 
    console.log(error.message);
  }
}


function renderGalleryImages(images) {
  const a = images.data.hits;
  console.log(a)

    if(a === []) {
 Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

  const markup = images.data.hits.map((image) => {
    return `
    <div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>: ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b> : ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b> : ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> : ${image.downloads}
    </p>
  </div>
</div>`
  }).join('');
  galleryEl.innerHTML = markup;

}

async function getSearchImages(name) {
  
  const response = await axios.get(`https://pixabay.com/api/?key=28839601-0c610efa4f554b6dcd03095ae&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`);
  return response;
  
  }
