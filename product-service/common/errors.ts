export class DefaultError extends Error {
    public code: number;

    constructor(msg, code: 404 | 400 | 500) {
        super(msg);
        this.code = code;
    }
}
