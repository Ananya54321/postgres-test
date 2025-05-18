import {Client} from 'pg';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app  = express();
app.use(express.json())

// connecting local postgres
const pgClient = new Client({
        host: 'localhost',
        port: 5432,
        database: 'college',
        user: 'postgres',
        password: 'ananya',
    });

// through url
// const pgClient = new Client(process.env.POSTGRES_URL)

async function main(){
    await pgClient.connect();
    const response = await pgClient.query("SELECT * FROM students;");
    console.log(response.rows);
}

main().then(() => {
    console.log("Connected to PostgreSQL database");
}).catch((error) => {
    console.error("Error connecting to PostgreSQL database:", error);
});


app.get('/', async (req, res)=>{
    try{

        const sqlQuery = 'SELECT * FROM students';
        const response = await pgClient.query(sqlQuery);
        res.send(response.rows);
    }
    catch(e){
        res.status(400).json(e);
    }
})

app.post('/', async (req, res)=>{
    try{

        const {name, age, cgpa, subjects} = req.body;
        await pgClient.query("BEGIN");
        // parameterised query to prevent sql injections
        const sqlQuery = 'INSERT INTO students (name, age, cgpa) VALUES($1, $2, $3) RETURNING id;';
        const response = await pgClient.query(sqlQuery, [name, age, cgpa]);
        subjects.forEach((subject : string) => {
            pgClient.query("INSERT into subjects (userid, subjectname) VALUES ($1, $2);", [response.rows[0].id, subject]);
        });
        pgClient.query("COMMIT");
        res.send("user added successfully")
    }
    catch(e){
        await pgClient.query("ROLLBACK")
        res.status(400).json(e);
    }

})






app.listen(3000, ()=>console.log("server listening on port 3000"))

