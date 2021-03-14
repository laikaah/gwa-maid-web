import { Response, Subject, AssessmentClass, Assessment, json } from './models'

export function saveSubjects(subjects: Subject[]): void {
    let serialized_subjects = JSON.stringify(subjects);

    localStorage.setItem('subjects', serialized_subjects);
}

export function getSubjects(): Subject[] | null {
    let subjects_from_local_storage = localStorage.getItem('subjects');

    if (subjects_from_local_storage == null) {
        return null;
    }

    let subjects: Subject[] = JSON.parse(subjects_from_local_storage);

    return subjects;
}

export function addSubject(subject: Subject): void {
    let subjects = getSubjects();

    subjects.unshift(subject);

    let stringified_subjects = JSON.stringify(subjects);

    localStorage.setItem('subjects', stringified_subjects);
}

export function addAssessmentClass(assessment_class: AssessmentClass): void {
    let subjects = getSubjects();

    subjects = subjects.map(subject => {
        if (subject.name != assessment_class.subject.name) return subject;

        subject.assessment_classes.unshift(assessment_class);
        return subject;
    })

    let stringified_subjects = JSON.stringify(subjects);

    localStorage.setItem('subjects', stringified_subjects)
}

export function addAssessment(assessment: Assessment): void {
    let subjects = getSubjects();

    subjects = subjects.map(subject => {
        if (subject.name != assessment.assessment_class.subject.name) return subject;

        subject.assessment_classes = subject.assessment_classes.map(assessment_class => {
            if (assessment_class.name != assessment.assessment_class.name) return assessment_class;

            assessment_class.assessments.unshift(assessment);

            return assessment_class
        });
        return subject;
    });

    let stringified_subjects = JSON.stringify(subjects);

    localStorage.setItem('subjects', stringified_subjects);
}