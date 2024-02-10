import express, {Request, Response} from 'express';
const supa = require('@supabase/supabase-js');
const app = express();
const port:number = 3000;
const supaURL:string = 'https://nfkqglfqiwxkxbxinyom.supabase.co';
const supaAnonKey:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ma3FnbGZxaXd4a3hieGlueW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NjA0NTIsImV4cCI6MjAyMjEzNjQ1Mn0.xMPY2ZSGL7318ueDg1IBOQvUhqUR0Sydj_Eh3EYKuqI';

const supabase = supa.createClient(supaURL, supaAnonKey);

app.get('/', (req:Request, resp:Response) =>{
        resp.send('TypeScript express is enabled');
})
app.get('/f1/status', async (req:Request, res:Response) => { 
    const {data, error} = await supabase 
        .from('status') 
        .select(); 
    res.send(data); 
 });

app.listen(port, () => {
    console.log("http://localhost:3000/");
    console.log("http://localhost:3000/f1/status");
});
 