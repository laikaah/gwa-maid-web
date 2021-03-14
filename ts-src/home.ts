import * as api from './api_interface.js'
import * as cache from './cache.js'
import * as helpers from './helpers.js'
import { Subject } from './models.js'

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
api.verifyToken(token).then((is_valid) => {
    if (!is_valid) {
        window.location.replace(window.location.origin);
    }
});

// retrieve subjects from database
// compare local subjects with remote subjects
// if they aren't the same,
// save remote_subjects to local_subjects

if (window.navigator.onLine) {
    api.getSubjects(token).then(remote_subjects => {
        cache.saveSubjects(remote_subjects);
    })
}

let subjects = cache.getSubjects();

document.addEventListener('DOMContentLoaded', () => {
    const table: HTMLTableElement = document.querySelector('table');

    const reload: HTMLButtonElement = <HTMLButtonElement>document.getElementById('reload')

    const form: HTMLFormElement = document.querySelector('form')

    if (subjects != null) {
        helpers.writeSubjectsToTable(table, subjects);
    }

    reload.onclick = () => {
        api.getSubjects(token).
            then(subjects => {
                cache.saveSubjects(subjects);
                helpers.writeSubjectsToTable(table, subjects);
            });
    }

    form.onsubmit = (e) => {
        e.preventDefault();

        // check validity for each input field
        document.querySelectorAll('input').forEach((field) => {
            if (!field.checkValidity()) {
                field.reportValidity();
            }
        });

        let subject_name_field = <HTMLInputElement>form.elements.namedItem('subject_name');
        let subject_name = subject_name_field.value;

        // check that the subject name doesn't already exist
        if (subjects.map(subject => subject.name).includes(subject_name)) {
            subject_name_field.setCustomValidity('That name is taken.')
        } else {
            subject_name_field.setCustomValidity('');
        }

        
        let subject_weight_field = <HTMLInputElement>form.elements.namedItem('subject_weight');
        let subject_weight = parseInt(subject_weight_field.value);

        let sum_of_subject_weights = subjects.map(subject => subject.weight).reduce((sum, weight) => sum + weight, 0)

        // check that the total weight won't go over 100%
        if ((sum_of_subject_weights + subject_weight) / 100 > 1) {
            let total_weight = (sum_of_subject_weights + subject_weight) / 100
            let total_weight_in_percent = total_weight.toPrecision(2) + '%'

            subject_weight_field.setCustomValidity('Adding this weight would result in a cumulative weight of ' + total_weight_in_percent);
        } else {
            subject_weight_field.setCustomValidity('');
        }

        let subject: Subject = {
            name: subject_name,
            weight: subject_weight,
            last_updated: new Date().toLocaleString('en-US'),
            predicted_grade: DEFAULT_GRADE
        };

        // save changes to localStorage
        cache.addSubject(subject);

        // if online, save changes to server
        if (window.navigator.onLine) {
            api.addSubject(token, subject).then((response) => {
                if (response) {
                    window.location.reload();
                } else {
                    alert('Something went wrong.')
                }
            })
        }
    }
});
