import Identities from 'orbit-db-identity-provider';
import OrbitDB from 'orbit-db';

class StudentDataStore{
    constructor(){
        this.Ipfs = null;
        this.OrbitDB = null;
        
    }


    async connect(ipfs, options = {}) {
        //set up orbitdb
        this.ipfs = ipfs
        const identity = options.identity || await Identities.createIdentity({ id: 'user' })
        this.OrbitDB = await OrbitDB.createInstance(ipfs, { identity, directory: './odb'});
        this.students = await this.OrbitDB.keyvalue('students');
        await this.students.load();
        
      }
    
}

 
const SDS = window.SDS = new StudentDataStore();
export default SDS;

