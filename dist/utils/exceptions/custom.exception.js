"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomException = void 0;
const common_1 = require("@nestjs/common");
class CustomException extends common_1.HttpException {
    constructor(errorCode, errorMessage, statusCode = 400, metadata) {
        super({
            success: false,
            errorCode,
            errorMessage,
            statusCode,
            metadata,
        }, statusCode);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}
exports.CustomException = CustomException;
