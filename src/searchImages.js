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

btnLoadMore.addEventListener('click', onSearchImg)
 
form.addEventListener('submit', onSearchImg);

async function onSearchImg(e) {
  e.preventDefault();
  try {
    // Promise.all???
    const name = inputEl.value.trim();
    const images = await getSearchImages(name);
    renderGalleryImages(images); 
    // theEndGalleryImg(images);
    undefinedImg(images);
    page += 1;

  }
  catch (error) { 
    console.log(error.message);
  }
}

function undefinedImg(images) {
  if (images.data.hits.length === 0) {
  return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
}

function renderGalleryImages(images) {
  const a = images.data.hits;
  console.log(a)

  const markup = images.data.hits.map((image) => {
    return `
    <div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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



// Функція для відображення повідомлення про закінчення зображень
  // function theEndGalleryImg(img) {
//     const totalHits = img.data.totalHits / limitImg;
//     if (page > totalHits ) {
//    Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
//   }
// }