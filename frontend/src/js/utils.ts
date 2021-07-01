import axios from 'axios'


/*
 * Taken from Django documentation https://docs.djangoproject.com/en/3.2/ref/csrf/
 * Takes the name of a cookie and returns its value
 */
export const getCookie = (name: string): string | null => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



export const api = axios.create({
    headers: { 'X-CSRFToken': getCookie("csrftoken") }
})
