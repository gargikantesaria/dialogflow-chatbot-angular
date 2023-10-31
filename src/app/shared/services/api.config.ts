import { environment } from "src/environments/environment";

export class DIALOGFLOW{
    public static get GENERATE_ACCESS_TOKEN(): string {
        return environment.url + 'authToken/generateToken';
    }
    
    public static get DETECT_AGENT(): string {
        return environment.DIALOGFLOW_ENDPOINT + 'agent/sessions/{sessionId}:detectIntent';
    }
}