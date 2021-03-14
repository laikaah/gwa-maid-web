import * as query from './api_interface.js'
import * as helpers from './helpers.js'
import * as local from './local'
import { Subject } from './models'

const DEFAULT_GRADE = 80;

// check for localStorage support
if (!helpers.verifyLocalStorage()) {
    alert('We\'re sorry, but your browser does not support local storage. Our site will not work for you.')
    window.close()
}

// if user has an existing token, verify it
// if it's valid, redirect to home.html

let token: string | null = localStorage.getItem('token')

// if token is not valid, redirect user to log in page
query.verifyToken(token).then((is_valid) => {
    if (!is_valid) {
        window.location.replace(window.location.origin);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const table: HTMLTableElement = document.querySelector('table');

    const form: HTMLFormElement = document.querySelector('form')

    form.onsubmit = (e) => {
        e.preventDefault();

        let subject_name = (<HTMLInputElement>form.elements.namedItem('subject_name')).value;

        let subject_weight = (<HTMLInputElement>form.elements.namedItem('subject_weight')).value;

        let subject: Subject = {
            name: subject_name,
            weight: parseInt(subject_weight),
            predicted_grade: DEFAULT_GRADE
        };

        local.addSubject(subject);

        window.location.reload();
    }
});
