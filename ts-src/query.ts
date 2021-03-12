import { Subject, AssessmentClass, Assessment } from './interfaces'

const HTTP: XMLHttpRequest = new XMLHttpRequest();
const BASE_URL: string = 'https://gwa-maid-backend.herokuapp.com'

function request(url: string, json_parameters: string, method: string): string {
    HTTP.open(method, url);
    HTTP.setRequestHeader('Content-Type', 'application/json');
    HTTP.send(json_parameters);

    let data: any;
    HTTP.onload = (e) => {
        data = JSON.parse(HTTP.responseText);
    };
    return data;
}

export function login(username: string, password: string): string | null {
    const url: string = BASE_URL + '/login';
    
    let json_parameters: string = JSON.stringify({
        username: username,
        password: password
    });
    
    let data = JSON.parse(request(url, json_parameters, 'POST'))

    if (!data.success) return null;

    return data.token;
}

export function register(username: string, password: string): string | null {
    const url: string = BASE_URL + '/register'

    let json_parameters: string = JSON.stringify({
        username: username,
        password: password
    });
    
    let data = JSON.parse(request(url, json_parameters, 'POST'))

    if (!data.success) return null;

    return data.token;
}

export function get_subjects(token: string): Subject[] {
    const url: string = BASE_URL + '/subjects';

    let json_parameters: string = JSON.stringify({
        token: token
    })

    let data: {success: boolean, subjects: Subject[]} = JSON.parse(request(url, json_parameters, 'GET'));

    if (!data.success) return null;

    return data.subjects.map((subject) => {
        return {
            id: subject.id,
            name: subject.name,
            weight: subject.weight,
            assessment_classes_names: subject.assessment_classes_names,
            predicted_grade: subject.predicted_grade
        }
    });
}

export function add_subject(token: string, subject_name: string): boolean {
    const url: string = BASE_URL + '/subject/add';

    let json_parameters: string = JSON.stringify({
        token: token,
        subject_name: subject_name
    });

    let data: {success: boolean} = JSON.parse(request(url, json_parameters, 'POST'))

    return data.success;
}

export function get_assessment_classes(token: string, subject_name: string): AssessmentClass[] {
    const url: string = BASE_URL + '/subjects/assessment_classes';

    let json_parameters: string = JSON.stringify({
        token: token,
        subject_name: subject_name
    });

    let data: {success: boolean, assessment_classes: AssessmentClass[]} = JSON.parse(request(url, json_parameters, 'GET'))

    if (!data.success) return null;

    return data.assessment_classes.map((assessment_class) => {
        return {
            id: assessment_class.id,
            name: assessment_class.name,
            subject_id: assessment_class.subject_id,
            weight: assessment_class.weight,
            assessments_names: assessment_class.assessments_names,
            predicted_grade: assessment_class.predicted_grade
        };
    });
}

export function add_assessment_class(token: string, subject_name: string, assessment_class_name: string): boolean {
    const url: string = BASE_URL + '/subjects/assessment_classes/add';

    let json_parameters: string = JSON.stringify({
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name
    });

    let data: {success: boolean} = JSON.parse(request(url, json_parameters, 'POST'))

    return data.success;
}

export function get_assessments(token: string, subject_name: string, assessment_class_name: string): Assessment[] {
    const url: string = BASE_URL + '/subjects/assessment_classes/assessments';

    let json_parameters: string = JSON.stringify({
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name
    });

    let data: {success: boolean, assessments: Assessment[]} = JSON.parse(request(url, json_parameters, 'GET'));

    if (!data.success) return null;

    return data.assessments.map((assessment) => {
        return {
            id: assessment.id,
            name: assessment.name,
            assessment_class_id: assessment.assessment_class_id,
            grade: assessment.grade
        }
    });
}

export function add_assessment(token: string, subject_name: string, assessment_class_name: string, assessment_name: string): boolean {
    const url: string = BASE_URL + '/subjects/assessment_classes/assessments/add';

    let json_parameters: string = JSON.stringify({
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name,
        assessment_name: assessment_name
    });

    let data: {success: boolean} = JSON.parse(request(url, json_parameters, 'POST'));

    return data.success;
}