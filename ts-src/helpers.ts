import * as api from './api_interface.js'
import { AssessmentClass, Subject } from './models.js'

export function verifyLocalStorage(): boolean {
    if (Storage !== void (0)) {
        return true;
    }
    return false;
}

export function parseQuery(queryString: string): { [key: string]: any } {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

export function writeSubjectsToTable(table: HTMLTableElement, subjects: Subject[]) {
    // create a new tbody
    let tbody_of_subjects = document.createElement('tbody');

    subjects.forEach((subject, index) => {
        let row = tbody_of_subjects.insertRow(index);

        let anchor = document.createElement('a');
        anchor.setAttribute('href', window.location.origin + '/htdocs/subject.html?' + new URLSearchParams({ subject: subject.name }));
        anchor.innerHTML = subject.name;

        row.insertCell(0).appendChild(anchor);
        row.insertCell(1).innerHTML = subject.last_updated;
        row.insertCell(2).innerHTML = subject.weight.toString() + '%';
        row.insertCell(3).innerHTML = subject.predicted_grade.toString();
    });

    // replace the old tbody with the new tbody
    let old_tbody_of_subjects = table.tBodies[0];

    table.replaceChild(tbody_of_subjects, old_tbody_of_subjects)
}

export function writeAssessmentClassesToTable(table: HTMLTableElement, assessment_classes: AssessmentClass[]) {
    // create a new tbody
    let tbody_of_assessment_classes = document.createElement('tbody');

    assessment_classes.forEach((assessment_class, index) => {
        let row = tbody_of_assessment_classes.insertRow(index);

        let anchor = document.createElement('a');
        anchor.setAttribute('href', window.location.origin +
            '/htdocs/assessment_class.html?' +
            new URLSearchParams({ assessment_class: assessment_class.name }));

        anchor.innerHTML = assessment_class.name;

        row.insertCell(0).appendChild(anchor);
        row.insertCell(1).innerText = assessment_class.last_updated;
        row.insertCell(2).innerText = assessment_class.weight.toString() + '%';
        row.insertCell(3).innerText = assessment_class.predicted_grade.toString();
    });

    let old_tbody_of_assessment_classes = table.tBodies[0];

    table.replaceChild(tbody_of_assessment_classes, old_tbody_of_assessment_classes);
}

export function makeLink(content: string): string {
    return '<a>' + content + '</a>'
}