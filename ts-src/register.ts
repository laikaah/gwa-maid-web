import * as api from './api_interface.js';
import * as helpers from './helpers.js';

// check for localStorage support
if (!helpers.verifyLocalStorage()) {
    alert(
        'We\'re sorry, but your browser does not support local storage. Our site will not work for you.'
    );
    window.close();
}

if (!window.navigator.onLine) {
    alert(
        'It seems that you\'re offline. Your changes won\'t be saved to our servers.'
    )
}

const token: string | null = localStorage.getItem('token');

// if user already has a valid token,
// ask if they want to go to home page

api.verifyToken(token).then((is_valid) => {
    if (is_valid) {
        let redirect = confirm(
            'It seems that you\'re already logged in. Do you want to go to the home page?'
        );

        if (redirect) {
            window.location.replace(window.location.origin + '/htdocs/home.html');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form: HTMLFormElement = <HTMLFormElement>(
        document.getElementById('register')
    );

    form.onsubmit = async (e) => {
        e.preventDefault();
        const username: string = (<HTMLInputElement>(
            form.elements.namedItem('username')
        )).value;

        const password: string = (<HTMLInputElement>(
            form.elements.namedItem('password')
        )).value;

        const confirm_password: string = (<HTMLInputElement>(
            form.elements.namedItem('confirm_password')
        )).value;

        if (password != confirm_password) {
            alert('Passwords do not match.');
            window.location.reload();
        } else {
            api.register(username, password).then((response) => {
                if (response == null){
                    alert('Registration failed.');
                } else {
                    localStorage.setItem('token', response);

                    alert('Registration successful.');
                    window.location.replace(window.location.origin + '/htdocs/home.html');
                }
            })
        }
        e.preventDefault();
        // return false;
    };
});
