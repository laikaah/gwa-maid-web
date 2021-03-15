import * as api from './api_interface.js'
import * as helpers from './helpers.js'
import * as cache from './cache.js'
import { Subject, AssessmentClass } from './models.js'

// check for localStorage support
if (!helpers.verifyLocalStorage()) {
    alert('We\'re sorry, but your browser does not support local storage. Our site will not work for you.')
    window.close()
}

// if user has an existing token, verify it
// if it's valid, redirect to home.html

const token: string | null = localStorage.getItem('token')

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

// load subject

let subjects = cache.getSubjects();

let subject_name = new URL(window.location.href).searchParams.get('subject');

if (subject_name == null){
    alert('No subject specified.');
    window.close();
}

let subject = subjects.find((subject) => {
    if (subject.name == subject_name){
        return subject;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const table: HTMLTableElement = document.querySelector('table');

    const reload: HTMLButtonElement = <HTMLButtonElement>document.getElementById('reload');

    const form: HTMLFormElement = <HTMLFormElement>document.querySelector('form');

    if (subject != null){
        helpers.writeAssessmentClassesToTable(table, subject.assessment_classes);
    }

    reload.onclick = (e) => {
        e.preventDefault();

        api.getSubjects(token).
            then(subjects => {
                cache.saveSubjects(subjects);
                subjects = subjects;

                let subject = subjects.find((subject) => {
                    if (subject.name == subject_name){
                        return subject;
                    }
                })

                helpers.writeSubjectsToTable(table, subject.assessment_classes);
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

        let assessment_class_name_field = <HTMLInputElement>form.elements.namedItem('assessment_class_name');
        let assessment_class_name = assessment_class_name_field.value;

        // check that the name doesn't already exist
        if (subject.assessment_classes.
            map(assessment_class => assessment_class.name).
            includes(assessment_class_name)){
                assessment_class_name_field.setCustomValidity('That name is taken.');
        } else {
            assessment_class_name_field.setCustomValidity('');
        }

        
        let assessment_class_weight_field = <HTMLInputElement>form.elements.namedItem('assessment_class_weight');
        let assessment_class_weight = parseInt(assessment_class_weight_field.value);

        let sum_of_weights = subject.assessment_classes.map(assessment_class => assessment_class.weight).reduce((sum, weight) => sum + weight, 0);

        // check that the total weight won't go over 100%
        if ((sum_of_weights + assessment_class_weight) / 100 > 1) {
            let total_weight = (sum_of_weights + assessment_class_weight) / 100
            let total_weight_in_percent = total_weight.toPrecision(2) + '%'

            assessment_class_weight_field.setCustomValidity('Adding this weight would result in a cumulative weight of ' + total_weight_in_percent);
        } else {
            assessment_class_weight_field.setCustomValidity('');
        }

        let assessment_class: AssessmentClass = {
            name: assessment_class_name,
            subject: subject,
            weight: assessment_class_weight,
            last_updated: new Date().toLocaleString(),
            predicted_grade: api.DEFAULT_GRADE
        };

        // save changes to localStorage
        cache.addAssessmentClass(assessment_class);

        // if online, save changes to server
        if (window.navigator.onLine) {
            api.addAssessmentClass(token, assessment_class).then((response) => {
                if (response) {
                    window.location.reload();
                } else {
                    alert('Something went wrong.')
                }
            })
        }
    }
})