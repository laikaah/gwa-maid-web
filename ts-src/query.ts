import { Response, Subject, AssessmentClass, Assessment } from './interfaces'

const BASE_URL: string = 'http://127.0.0.1:5000'

async function request(url: string, json_parameters: {[key: string]: any}, method: string): Promise<Response|null> {

    let init: RequestInit;

    if (method === 'POST'){
        init = <RequestInit> {
            url: url,
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            mode: 'no-cors',
            cors: 'default',
            cache: <RequestCache> 'default',
            body: JSON.stringify(json_parameters)
        };
    } else if (method === 'GET') {
        init = <RequestInit> {
            url: url,
            method: method,
            mode: 'no-cors',
            cors: 'default',
            cache: <RequestCache> 'default'
        };
        // if method is GET append the json parameters to 
        // the url as arguments
        url += new URLSearchParams(json_parameters).toString();
    } else {
        return null
    }

    let request = new Request(url, init);

    console.log(request)

    return fetch(request).then((response) => {
        return response.json();
    });
}

export async function verify_token(token: string | null): Promise<any> {
    if (token == null) return false;

    const url: string = BASE_URL + '/verify_token';

    let json_parameters = {
        token: token
    };

    let response = await request(url, json_parameters, 'POST');
    console.log(response)

    return response;
}

export async function login(username: string, password: string): Promise<string | null> {
    const url: string = BASE_URL + '/login';
    
    let json_parameters = {
        username: username,
        password: password
    };

    let response = await request(url, json_parameters, 'POST');

    if (!response.success) return null;

    return response.token;
}

export async function register(username: string, password: string): Promise<string | null> {
    const url: string = BASE_URL + '/register'

    let json_parameters = {
        username: username,
        password: password
    };

    let response = await request(url, json_parameters, 'POST')

    if (!response.success) return null;

    return response.token;
}

export async function get_subjects(token: string): Promise<Subject[]|null> {
    const url: string = BASE_URL + '/subjects';

    let json_parameters = {
        token: token
    };

    let response = await request(url, json_parameters, 'GET')

    if (!response.success) return null;

    return response.subjects.map((subject: Subject) => {
        return {
            id: subject.id,
            name: subject.name,
            weight: subject.weight,
            assessment_classes_names: subject.assessment_classes_names,
            predicted_grade: subject.predicted_grade
        }
    });
}

export async function add_subject(token: string, subject_name: string): Promise<boolean> {
    const url: string = BASE_URL + '/subject/add';

    let json_parameters = {
        token: token,
        subject_name: subject_name
    };

    let response = await request(url, json_parameters, 'POST');

    return response.success;
}

export async function get_assessment_classes(token: string, subject_name: string): Promise<AssessmentClass[]> {
    const url: string = BASE_URL + '/subjects/assessment_classes';

    let json_parameters = {
        token: token,
        subject_name: subject_name
    };

    let response = await request(url, json_parameters, 'GET')

    if (!response.success) return null;

    return response.assessment_classes.map((assessment_class: AssessmentClass) => {
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

export async function add_assessment_class(token: string, subject_name: string, assessment_class_name: string): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/assessment_classes/add';

    let json_parameters = {
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name
    };

    let response = await request(url, json_parameters, 'POST')

    return response.success;
}

export async function get_assessments(token: string, subject_name: string, assessment_class_name: string): Promise<Assessment[]> {
    const url: string = BASE_URL + '/subjects/assessment_classes/assessments';

    let json_parameters = {
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name
    };

    let response = await request(url, json_parameters, 'GET')

    if (!response.success) return null;

    return response.assessments.map((assessment: Assessment) => {
        return {
            id: assessment.id,
            name: assessment.name,
            assessment_class_id: assessment.assessment_class_id,
            grade: assessment.grade
        }
    });
}

export async function add_assessment(token: string, subject_name: string, assessment_class_name: string, assessment_name: string): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/assessment_classes/assessments/add';

    let json_parameters = {
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name,
        assessment_name: assessment_name
    };

    let response = await request(url, json_parameters, 'POST')

    return response.success;
}