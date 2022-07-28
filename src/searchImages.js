import './css/styles.css';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const inputEl = document.querySelector('input');
const btnLoadMore = document.querySelector('.load-more');
let page = 1;
let limitImg = 40;

btnLoadMore.addEventListener('click', async () => {
  try {
    const name = inputEl.value.trim();
    const data = await getSearchImages(name)
    renderGalleryImages(data); 
    visibleBtn(data);
    library.refresh();
  } catch (error) {
    console.log(error.message);
  }
})
 
form.addEventListener('submit', onSearchImg);
 const library = new SimpleLightbox('.photo-link');
async function onSearchImg(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  page = 1;
  try {
    const name = inputEl.value.trim();
    const images = await getSearchImages(name);
    renderGalleryImages(images); 
    visibleBtn(images)
    undefinedImg(images);
    Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`)
    
   
    library.refresh();
  }
    catch (error) { 
    console.log(error.message);
  }
}

function undefinedImg(images) {

  if (images.data.hits.length === 0) {
  btnLoadMore.classList.remove('is-visible');
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    galleryEl.innerHTML = '';
  }
}

function renderGalleryImages(images) {
  const a = images.data.hits;
  console.log(a)

  const markup = images.data.hits.map((image) => {
    return `
    <div class="photo-card"><a class="photo-link" href="${image.largeImageURL}">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>: ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>: ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>: ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>: ${image.downloads}
    </p>
  </div>
</div>`
  }).join('');
  galleryEl.insertAdjacentHTML("beforeend", markup);
}

async function getSearchImages(name) {
  const response = await axios.get(`https://pixabay.com/api/?key=28839601-0c610efa4f554b6dcd03095ae&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
  return response;
  }

function visibleBtn(load) {
  const total = load.data.totalHits / limitImg;

  if (load.data.hits.length === 0) {
    return;
  } 
  
  else if (page >= total) {
   btnLoadMore.classList.remove('is-visible')  
   Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
  }
  
  else {
    btnLoadMore.classList.add('is-visible');
     page += 1;
  }
}


 

