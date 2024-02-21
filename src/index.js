import axios from 'axios';
import { CatsApiService } from './js/cat-api';
import SlimSelect from 'slim-select';
import '../node_modules/slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_Mrkk6zzlzxAiUGp0152jAvgC3f8Rf5USaAPk9iLC0KHj3WN1EFCxz5UCavrYDnfl';

const catsApiService = new CatsApiService();
const refs = {
  select: document.querySelector('.breed-select'),
  infoCat: document.querySelector('.cat-info'),
  spinner: document.querySelector('.loader'),
};
// console.log('refs.head:', refs.head);
refs.select.addEventListener('change', changeOption);

showOptionsLoading();

function showOptionsLoading() {
  refs.spinner.classList.remove('hide-element');
}
function optionsLoaded() {
  refs.select.classList.remove('hide-element');
  refs.spinner.classList.add('hide-element');
}
function showDataLoading() {
  refs.infoCat.classList.add('hide-element');
  refs.spinner.classList.remove('hide-element');
}
function dataLoaded() {
  refs.infoCat.classList.remove('hide-element');
  refs.spinner.classList.add('hide-element');
}

let allBreeds = [];
catsApiService
  .fetchBreeds()
  .then(storeBreedsInfo)
  .then(fillSelectOptions)
  .catch(error => {
    Notiflix.Notify.failure(
      'Oops! Something went wrong ! Try reloading the page!'
    );
    console.error(error);
    document.querySelector('.loader').classList.add('hide-element');
  });

function storeBreedsInfo(breedsArray) {
  allBreeds = breedsArray;
}

function fillSelectOptions() {
  allBreeds.forEach(breed => {
    const option = `<option value="${breed.id}">${breed.name}</option>`;
    refs.select.insertAdjacentHTML('beforeend', option);
  });
  optionsLoaded();
  new SlimSelect({
    select: '#select',
    settings: {
      placeholderText: '--Select Option--',
      allowDeselect: true,
    },
  });
}

function changeOption(event) {
  showDataLoading();
  const breedId = event.target.value;
  if (!breedId) {
    optionsLoaded();
    return;
  }
  // console.log('breedId: ', breedId);
  refs.infoCat.innerHTML = '';

  // **** Если в опциях выбрать id Malayan, то тут выпадет ошибка, потому что не может достучаться по такому url ** //

  catsApiService
    .fetchCatByBreed(breedId)
    .then(getCatImageLink)
    .then(imageLink => {
      changeCatInfoMarkup(imageLink, breedId);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong ! Try reloading the page or choose next option!'
      );
      console.error(error);
      optionsLoaded();
    });
}

function getCatImageLink(catImage) {
  // console.log('catImage: ', catImage);
  return catImage.url;
}

function changeCatInfoMarkup(imageLink, breedId) {
  let breedInfo = allBreeds.filter(item => item.id === breedId)[0];
  // console.log('breedInfo: ', breedInfo);
  const imageMarkup = `<img src="${imageLink}" width="300px" height="300px"/>`;
  let descriptionMarkup = ` <div class="description"><div class="block"><h1>${breedInfo.name}</h1>
      <h2>${breedInfo.temperament}</h2>
      <p>${breedInfo.description}</p></div></div>`;

  refs.infoCat.insertAdjacentHTML(
    'afterbegin',
    imageMarkup + descriptionMarkup
  );
  dataLoaded();
}
