import './css/styles.css';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = 'key=28839601-0c610efa4f554b6dcd03095ae';
const API_OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';
const LIMIT_IMG = 40;

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const largeImgSimpleLightBox = new SimpleLightbox('.photo-link');
let page = 1;
let name = '';

form.addEventListener('submit', onSearchImg);
btnLoadMore.addEventListener('click', loadMoreImg);
btnLoadMore.classList.remove('is-visible');

async function loadMoreImg() {
  const images = await getSearchImages(name);
  renderGalleryImages(images); 
  visibleBtn(images);
  smoothScroll();
  largeImgSimpleLightBox.refresh();
}

async function onSearchImg(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  page = 1;
  btnLoadMore.classList.remove('is-visible');
  name = form.searchQuery.value.trim();

  const images = await getSearchImages(name);

  renderGalleryImages(images); 
  visibleBtn(images);
  undefinedImg(images);
  smoothScroll();
  largeImgSimpleLightBox.refresh();
  
  if (images.data.hits.length > 0) {
   Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`)
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
</div>`}).join('');
  galleryEl.insertAdjacentHTML("beforeend", markup);
  btnLoadMore.classList.add('is-visible');
}

function visibleBtn(load) {
  const data = load.data.totalHits;
  const totalPages = data / LIMIT_IMG;
  
  if (data === 0) {
    return;
  } else if (page >= totalPages) {
   btnLoadMore.classList.remove('is-visible')  
   Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
  } else {
    btnLoadMore.classList.add('is-visible');
     page += 1;
  }
}

function smoothScroll() {
const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
 }

async function getSearchImages(name) {
  try {
  const response = await axios.get(`${BASE_URL}?${API_KEY}&q=${name}&${API_OPTIONS}&per_page=40&page=${page}`);
  return response;
  } catch (error) { 
    console.log(error.message);
  }
}