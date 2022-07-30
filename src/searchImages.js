import './css/styles.css';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import InfiniteScroll from 'infinite-scroll';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const inputEl = document.querySelector('input');
const btnLoadMore = document.querySelector('.load-more');
const largeImg = new SimpleLightbox('.photo-link');
let page = 1;
const limitImg = 40;

form.addEventListener('submit', onSearchImg);
btnLoadMore.addEventListener('click', loadMoreImg)
 
async function loadMoreImg() {
  try {
    const name = inputEl.value.trim();
    const data = await getSearchImages(name)
    renderGalleryImages(data); 
    visibleBtn(data);
    smoothScroll()
    largeImg.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

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
    smoothScroll();
    largeImg.refresh();

      if (images.data.hits.length > 0) {
    Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`)
  }
  } catch (error) { 
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
  const markup = images.data.hits.map((image) => {
    return `
    <div class="photo-card" item><a class="photo-link" href="${image.largeImageURL}">
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

function smoothScroll() {
const { height: cardHeight } = galleryEl
  .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight,
    behavior: "smooth",
  });
 }

  async function getSearchImages(name) {
  const response = await axios.get(`https://pixabay.com/api/?key=28839601-0c610efa4f554b6dcd03095ae&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
  return response;
}
  
//  const infScroll = new InfiniteScroll('.container', {
//   // responseType: 'image',
//   history: false,
//   path() {
//     return `https://pixabay.com/api/?key=28839601-0c610efa4f554b6dcd03095ae&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
//   },
// })

// infScroll.loadNextPage();

// infScroll.on('load', (response, path) => {
//   console.log(response);
// })