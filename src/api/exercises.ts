import {isValidTan} from "@/api/tans";
import {BACKEND_API_URL} from "@/config";

const EXERCISES_ENDPOINT = `${BACKEND_API_URL}/exercises/`

export interface Exercise {
    title: string,
    markdown: string,
    skip_delay: number,
    next_exercise_id: number | null,
    id: number,
    skip_unlock_time: number | null,
    next_grading_allowed_at: number | null,
}

let allExercisesSolvedPage = "# 🎉 Congratulations! 🎉\n" +
    "\n" +
    "You did it — you have successfully solved **all exercises** in this competition! 🏆  \n\n" +
    "Thank you for participating!  \n" +
    "Keep learning, keep exploring — and see you in the next competition. 🚀  ";

export const FINAL_EXERCISE: Exercise = {
    title: "🚀 Congratulations, you finished all exercises!",
    markdown: allExercisesSolvedPage,
    skip_delay: 0,
    next_exercise_id: null,
    id: -1,
    skip_unlock_time: null,
    next_grading_allowed_at: null,
}

export const checkCompetitionFinished = async (): Promise<boolean> => {
    const tan = window.localStorage?.getItem("blocksembler-tan-code") || "";
    const CURRENT_EXERCISE_ENDPOINT =
        EXERCISES_ENDPOINT + `current?tan_code=${tan}`;

    if (!(await isValidTan(tan))) {
        throw new Error("Could not load current exercise!");
    }

    const res = await fetch(CURRENT_EXERCISE_ENDPOINT);

    return res.status === 204;
};

export const getCurrentExercise = async (): Promise<Exercise> => {
    const tan = window.localStorage?.getItem("blocksembler-tan-code") || "";
    const CURRENT_EXERCISE_ENDPOINT =
        EXERCISES_ENDPOINT + `current?tan_code=${tan}`;

    if (!(await isValidTan(tan))) {
        throw new Error("Could not load current exercise!");
    }

    const res = await fetch(CURRENT_EXERCISE_ENDPOINT);

    if (res.status === 200) {
        return await res.json();
    }

    if (res.status === 204) {
        return FINAL_EXERCISE;
    }

    throw new Error(`Unexpected response: ${res.status}`);
};

export const skipExercise = async () => {
    const tan_code = window.localStorage?.getItem("blocksembler-tan-code");


    return await fetch(EXERCISES_ENDPOINT + `current/skip?tan_code=${tan_code}`, {method: "POST"})
        .then(async res => {
            return res.status === 204;
        }).catch(err => {
            console.error(err);
            return false;
        });
}
