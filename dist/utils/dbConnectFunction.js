"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Promise denotes  promise is being performed
// void denotes the return type of the function
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const mongoURL = (_a = process.env.MONGODB) !== null && _a !== void 0 ? _a : "";
            if (mongoURL == "") {
                console.error(`SERVER_CONFIGURATION_ERROR : no mongodn connect url provided`);
                throw new Error("No MONGODB_URL");
            }
            const dbConnectObject = yield mongoose_1.default.connect(mongoURL);
            console.log(`Successfully made MONGODB connection`);
        }
        catch (error) {
            console.error(`Failed to Make DB Connection`, error instanceof Error ? error.message : "Unknown error occurred");
        }
    });
}
exports.default = dbConnect;
