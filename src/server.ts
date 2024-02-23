import express, {Request, Response} from 'express';
const supa = require('@supabase/supabase-js');
const app = express();
const port:number = 3000;
const supaURL:string = 'https://nfkqglfqiwxkxbxinyom.supabase.co';
const supaAnonKey:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ma3FnbGZxaXd4a3hieGlueW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NjA0NTIsImV4cCI6MjAyMjEzNjQ1Mn0.xMPY2ZSGL7318ueDg1IBOQvUhqUR0Sydj_Eh3EYKuqI';

const supabase = supa.createClient(supaURL, supaAnonKey);

app.get('/', (req:Request, resp:Response) =>{
        resp.send('api is enabled');
});
app.get('/api/seasons', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('seasons')
        .select();
    resp.send(data);
});

/**
 * Circuits
 */
app.get('/api/circuits', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('circuits')
        .select();
    resp.send(data);
});


app.get('/api/circuits/:ref', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('circuits')
        .select()
        .ilike("circuitRef", req.params.ref);
    if(!data || data.length == 0){resp.send({Error: `Could not find circuit named ${req.params.ref}`})}
    else{resp.send(data);}
});


app.get('/api/circuits/season/:year', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('races')
        .select(`round, circuits!inner(*)`)
        .eq('year', req.params.year)
        .order('round', { ascending: true });
    if(!data || data.length == 0){resp.send({Error: `Could not find any information under the year: ${req.params.year}`})}
    else{resp.send(data);}
});

/**
 * Constructors
 */
app.get('/api/constructors', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('constructors')
        .select();
    resp.send(data);
});


app.get('/api/constructors/:ref', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('constructors')
        .select()
        .eq('constructorRef', req.params.ref);
    if(!data || data.length == 0){resp.send({Error: `Could not find contructor named ${req.params.ref}`})}
    else{resp.send(data);}
});

/**
 * Drivers
 */

app.get('/api/drivers', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('drivers')
        .select();
    resp.send(data);
});


app.get('/api/drivers/:ref', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('drivers')
        .select()
        .ilike('driverRef', req.params.ref);
    if(!data || data.length == 0){resp.send({Error: `Could not find driver named ${req.params.ref}`})}
    else{resp.send(data);}
});


app.get('/api/drivers/search/:substring', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('drivers')
        .select()
        .ilike('surname', `${req.params.substring}%`);
    if(!data || data.length == 0){resp.send({Error: `Could not find any drivers containing: ${req.params.substring}`})}
    else{resp.send(data);}
});


app.get('/api/drivers/race/:raceId', async (req:Request, resp: Response) =>{
    const {data, error} = await supabase 
        .from('results')
        .select(`drivers(*)`)
        .eq("raceId", req.params.raceId);
    if(!data || data.length == 0){resp.send({Error: `Could not find any races with ID of: ${req.params.raceId}`})}
    else{resp.send(data);}
});

/**
 * Races
 */
app.get('/api/races/:raceId', async(req:Request, resp:Response) =>{
    const{data, error} = await supabase
            .from('races')
            .select(`year, round, circuits(name, location, country),
            name, date, time, url`)
            .eq('raceId', req.params.raceId);
    if(!data || data.length == 0){resp.send({Error: `Could not find any races with ID of: ${req.params.raceId}`})}
    else{resp.send(data);}
});


app.get('/api/races/season/:year', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from('races')
            .select()
            .eq('year', req.params.year)
            .order('round', {ascending: true});
    if(!data || data.length == 0){resp.send({Error: `Could not find any races in the year: ${req.params.year}`})}
    else{resp.send(data);}
});


app.get('/api/races/season/:year/:round', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase 
            .from('races')
            .select()
            .eq('year', req.params.year)
            .eq('round', req.params.round);
    if(!data || data.length == 0){resp.send({Error: `Could not find any races in the year: ${req.params.year} with round: ${req.params.round}`})}
    else{resp.send(data);}
});

/**
 * Circuits
 */
app.get('/api/races/circuits/:ref', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase 
            .from('circuits')
            .select(`races(year, round, name, date, time, url), name, location, country`)
            .eq('circuitRef', req.params.ref)
            .order('year', {
                foreignTable: 'races', 
                ascending: true
            });
    if(!data || data.length == 0){resp.send({Error: `Could not find any races at the circuit ${req.params.ref}`})}
    else{resp.send(data);}
});


app.get('/api/races/circuits/:ref/season/:start/:end', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from('circuits')
            .select(`races(year, round, name, date, time, url), name, location, country`)
            .lte('races.year', req.params.end)
            .gte('races.year', req.params.start);
    if(Number(req.params.start) > Number(req.params.end)){
        resp.send({Error: 'The starting year cannot be larger than the ending year'})
    }else if(!data || data.length == 0){
        resp.send({Error: `Could not find any races at circuit: ${req.params.ref} Between the years: ${req.params.start} and ${req.params.end}`})
    }else{
        resp.send(data);
    }
});

/**
 * Results
 */
app.get('/api/results/:raceId', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from('results')
            .select(`number, grid, position, positionText, positionOrder, points,
            laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId, 
            races(year), drivers(driverRef, code, forename, surname), 
            constructors(name, constructorRef, nationality)`)
            .eq('raceId', req.params.raceId)
            .order('grid', {ascending: true});
    if(!data || data.length == 0){resp.send({Error: `Could not find any races for the ID: ${req.params.raceId}`})}
    else{resp.send(data);}
});


app.get('/api/results/driver/:ref', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from('results')
            .select(`*, drivers!inner(driverRef)`)
            .eq('drivers.driverRef', req.params.ref);
    if(!data || data.length == 0){resp.send({Error: `Could not find any driver results for: ${req.params.ref}`})}
    else{resp.send(data);}
});


app.get('/api/results/driver/:ref/seasons/:start/:end', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from('results')
            .select(`*, drivers!inner(driverRef), races!inner(year)`)
            .eq('drivers.driverRef', req.params.ref)
            .lte('races.year', req.params.end)
            .gte('races.year', req.params.start);
    if(Number(req.params.start) > Number(req.params.end)){
        resp.send({Error: 'The starting year cannot be larger than the ending year'})
    }else if(!data || data.length == 0){
        resp.send({Error: `Could not find any driver results named:  ${req.params.ref} Between the years: ${req.params.start} and ${req.params.end}`})
    }else{
        resp.send(data);
    }
});


/**
 * Qualifying/Standings
 */
app.get('/api/qualifying/:raceId', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from("qualifying")
            .select(`number, position, q1, q2, q3, races(year), drivers(driverRef, code, forename, surname), 
            constructors(name, constructorRef, nationality)`)
            .eq('raceId', req.params.raceId)
            .order('position', {ascending: true});
    if(!data || data.length == 0){resp.send({Error: `Could not find any qualifying results for race ID: ${req.params.raceId}`})}
    else{resp.send(data);}
});


app.get('/api/standings/:raceId/drivers', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from('driverStandings')
            .select(`*, drivers(driverRef, code, forename, surname)`)
            .eq('raceId', req.params.raceId)
            .order('position', {ascending: true});
    if(!data || data.length == 0){resp.send({Error: `Could not find the driver standings for race ID: ${req.params.raceId}`})}
    else{resp.send(data);}
});


app.get('/api/standings/:raceId/constructors', async(req:Request, resp:Response) =>{
    const {data, error} = await supabase
            .from("constructorStandings")
            .select(`*, constructors(name, constructorRef, nationality)`)
            .eq('raceId', req.params.raceId)
            .order('position', {ascending: true});
    if(!data || data.length == 0){resp.send({Error: `Could not find the constructor standings for race ID: ${req.params.raceId}`})}
    else{resp.send(data);}
});


app.listen(port, () => {
    console.log('Server is now running on port: ' + port)
    console.log("http://localhost:3000/");
});
 