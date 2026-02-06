import {BACKEND_API_URL} from "@/config";
import {isValidTan} from "@/api/tans";
import {logEvent} from "@/logging";

export interface GradingJob {
    id: string,
    tan_code: string,
    exercise_id: number,
    status: string,
    started: string,
    terminated: string,
    passed: boolean,
    feedback: [string]
}

const GRADING_JOB_ENDPOINT = `${BACKEND_API_URL}/grading-jobs/`

export const getGradingJob = async (jobId: string): Promise<GradingJob> => {
    const gradingJobEndpoint = GRADING_JOB_ENDPOINT + jobId;
    return await fetch(gradingJobEndpoint).then(response => response.json())
}

export const submitGradingJob = async (exerciseId: number, solutionCode: string): Promise<string> => {
    const tan = window.localStorage?.getItem("blocksembler-tan-code") || "";

    if (!await isValidTan(tan)) {
        return "";
    }

    const jobId: string = await fetch(GRADING_JOB_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tan_code: tan,
            exercise_id: exerciseId,
            solution_code: solutionCode,
        })
    }).then(response => response.json());

    logEvent("gradingJobSubmission", `Job ${jobId} was submitted.`);
    return jobId;
}