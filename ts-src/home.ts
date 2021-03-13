import * as query from './query.js'
import * as helpers from './helpers.js'

// check for localStorage support
if (!helpers.verify_local_storage()){
    alert('We\'re sorry, but your browser does not support local storage. Our site will not work for you.')
    window.close()
}

// if user has an existing token, verify it
// if it's valid, redirect to home.html

let token: string | null = localStorage.getItem('token')

// if token is not valid, redirect user to log in page
if (!query.verify_token(token)){
    window.location.replace(window.location.origin + '/htdocs/login.html');
}

