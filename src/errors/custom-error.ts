// Abstract class can't be instantiated, basically stands as blueprint for other classes
export abstract class CustomError extends Error {
    // Abstract properties must be implemented by offspring
    abstract statusCode: number;
    abstract status: string;

    constructor(message: string) {
        super(message);
        // Set every offspring prototype to CustomError prototype
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    // Abstract method must be implemented by offspring
    abstract serializeErrors(): { status: string; message: string; statusCode: number };
}
