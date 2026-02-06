import {BACKEND_API_URL} from "@/config";
import {logEvent} from "@/logging";

const TAN_ENDPOINT = `${BACKEND_API_URL}/tans/`

export interface Tan {
    code: string,
    valid_from: string | null,
    valid_to: string | null,
}

export const isValidTan = async (tanCode: string): Promise<boolean> => {
    try {
        let tan = await getTan(tanCode);

        let validFrom: Date | null = null;
        let validTo: Date | null = null;

        const now = new Date();

        if ("valid_from" in tan && tan.valid_from) {
            validFrom = new Date(tan.valid_from);
            if (validFrom > now) return false;
        }

        if ("valid_to" in tan && tan.valid_to) {
            validTo = new Date(tan.valid_to);
            if (validTo < now) return false;
        }
    } catch (error) {
        logEvent("tanCodeValidation", error)
        return false;
    }

    return true
}

export const getTan = async (tanCode: string): Promise<Tan> => {
    const tanEndpoint = TAN_ENDPOINT + tanCode

    return await fetch(tanEndpoint).then(response => {
        if (response.status !== 200) {
            throw Error(response.statusText);
        }

        return response.json()
    })
}
