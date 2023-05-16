import Queue from 'bull';
const queueKeyWordApi = new Queue('queueKeyWordApiDeloy','redis://127.0.0.1:6379')


queueKeyWordApi.obliterate({ force: true });
queueKeyWordApi.process((job,done)=>{
    console.log(job.data)
    done()
}
)
