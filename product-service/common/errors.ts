export class DefaultError extends Error {
    public code: number;

    constructor(msg, code: 404 | 400) {
        super(msg);
        this.code = code;
    }
}
