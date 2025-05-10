"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// connecting local postgres
const pgClient = new pg_1.Client({
    host: 'localhost',
    port: 5432,
    database: 'college',
    user: 'postgres',
    password: 'ananya',
});
// through url
// const pgClient = new Client(process.env.POSTGRES_URL)
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pgClient.connect();
        const response = yield pgClient.query("SELECT * FROM students;");
        console.log(response.rows);
    });
}
main().then(() => {
    console.log("Connected to PostgreSQL database");
}).catch((error) => {
    console.error("Error connecting to PostgreSQL database:", error);
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sqlQuery = 'SELECT * FROM students';
        const response = yield pgClient.query(sqlQuery);
        res.send(response.rows);
    }
    catch (e) {
        res.status(400).json(e);
    }
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age, cgpa, subjects } = req.body;
        yield pgClient.query("BEGIN");
        // parameterised query to prevent sql injections
        const sqlQuery = 'INSERT INTO students (name, age, cgpa) VALUES($1, $2, $3) RETURNING id;';
        const response = yield pgClient.query(sqlQuery, [name, age, cgpa]);
        subjects.forEach((subject) => {
            pgClient.query("INSERT into subjects (userid, subjectname) VALUES ($1, $2);", [response.rows[0].id, subject]);
        });
        pgClient.query("COMMIT");
        res.send("user added successfully");
    }
    catch (e) {
        res.status(400).json(e);
    }
}));
app.listen(3000, () => console.log("server listening on port 3000"));
