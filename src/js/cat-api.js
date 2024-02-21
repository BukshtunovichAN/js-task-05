import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notiflix.Notify.init({
  position: 'center-top',
  clickToClose: true,
  timeout: 4000,
  cssAnimationStyle: 'zoom',
});
const BASE_URL = 'https://api.thecatapi.com/v1';

class CatsApiService {
  constructor() {}

  fetchBreeds() {
    return fetch(`${BASE_URL}/breeds`)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Oops! Something went wrong ! Try reloading the page!'
        );
        document.querySelector('.loader').classList.add('hide-element');
        console.error(error);
      });
  }

  fetchCatByBreed(breedId) {
    const url = `${BASE_URL}/images/search?breed_ids=${breedId}`;

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(parsedCats => {
        console.log('fetchCatByBreed  parsedCats:', parsedCats);
        return parsedCats[0];
      })

      .catch(error => {
        Notiflix.Notify.failure(
          'Oops! Something went wrong ! Try reloading the page!'
        );
        console.error(error);
      });
  }
}

export { CatsApiService };
