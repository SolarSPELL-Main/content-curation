import axios from 'axios';
import Cookies from 'js-cookie';

import APP_URLS from '../urls';

/*
 * Custom axios object with headers set to the csrftoken
 */
export const api = axios.create({
  headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
});

//If axios sees a 403 it will redirect the browser to the login page
api.interceptors.response.use(r => r, err => {
  const code = err?.response?.status;
  if (code === 403) {
    window.location.href = APP_URLS.LOGIN_GOOGLE;
  }
  throw err;
});

/**
 * Triggers a download of a blob object with a given filename. Creates a
 * temporary hidden <a> tag that downloads the file and triggers a click event
 *
 * Credit to David Walsh at https://davidwalsh.name/javascript-download
 */
export const downloadFile = (file: Blob, fileName: string): void => {
  // Create an invisible A element
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = window.URL.createObjectURL(
    file
  );

  // Use download attribute to set set desired file name
  a.setAttribute('download', fileName);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
};
