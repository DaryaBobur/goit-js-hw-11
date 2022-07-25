import './css/styles.css';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// key 28839601-0c610efa4f554b6dcd03095ae

async function getSearchImages() {
  try {
    const response = await axios.get('');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}