declare module 'java-random' {
    export default class Random {
        constructor(seed: number);

        nextInt(max: number): number;
    }
}

declare module '@mit-app-inventor/blockly-plugin-workspace-multiselect' {
    export class Multiselect {
        constructor(workspace: any);

        init(options: any);
    }
}