 

const arrayAll = [
    {
      role: "i",
      age: 20,
      name: "u2",
    },
    {
      role: "i",
      age: 5,
      name: "u1",
    },
    {
      role: "i",
      age: 6,
      name: "u1",
    },
    {
      role: "i",
      age: 4,
      name: "u2",
    },
  ];
  
  const arraySome = [
    {
      role: "i",
      age: 5,
      name: "u1",
    },
    {
      role: "i",
      age: 6,
      name: "u1",
    },
  ];
  const absentPermision = arrayAll
    .filter((arryA) => {
      const p = arraySome.some((arrySome) => arryA.name != arrySome.name);
      return p;
    })
    .map((d) => ({ name: d.name }));
  
  //console.log(absentPermision)
  
  const findIndicesSum = (arry: number[], n: number) => {
    for (let i = 0; i < arry.length - 1; i++) {
      for (let j = i + 1; j < arry.length; j++) {
        if (arry[i] + arry[j] === n) {
          return [i, j];
        }
      }
    }
    return [];
  };
  
  
  const findIndicesSum_hashTable = (arry: number[], n: number) => {
    //storing the index as value and the exact integer as key(neededValue) in this object (hashTable)
    const hashTable: { [key: number]: number } = {};
    let neededValue;
    for (let i = 0; i < arry.length - 1; i++) {
      neededValue = n - arry[i];
      //check if needValue exist as a key in hashTable
      if (neededValue in hashTable) {
        return [i, hashTable[neededValue]];
      }
        hashTable[arry[i]] = i;
  }
  return [];
  }
  import 'dotenv/config'
  
  import axios from 'axios'
  
const getUserLocationInfo = async(ipAddress?:string)=>{
   
    const API_KEY =process.env.LOCATION_API_KEY
    const fields = "geo,time_zone";
  //const security = "security";
  const ipResponse = ipAddress ||(await axios.get('https://api.ipify.org?format=json')).data.ip;
  console.log(ipResponse)
  const URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ipResponse}&fields=${fields}`;

const response = await axios.get(URL)
console.log(response.data.country_name)
console.log(response.data.state_prov)
console.log(response.data.district)
console.log(response.data.city)
console.log(response.data.zipcode)
console.log(response.data.time_zone.name)
console.log(response.data.time_zone.offset)

return response.data
    }
    const value = getUserLocationInfo()
    console.log(value)