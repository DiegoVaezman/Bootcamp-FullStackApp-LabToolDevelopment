
import './App.css';
import Person from './components/Person/Person'
import {useState} from 'react'
import { set } from 'mongoose';


function App() {
 let [personInfo, setPersonInfo] = useState([{
   name: 'Diego',
   age: '30',
   hobby: 'papas'
 },
 {
  name: "Zac",
  age: "33",
  hobby: "palas"
},
{
  name: "Javi",
  age: "31",
  hobby: "frot"
},
{
  name: "Aitor",
  age: "29",
  hobby: "mirter"
}])


const [showPeople, setShowPeople] = useState(false)

// const handleChangePerson = () => {
//   setPersonInfo({
//     name: "Zac",
//     age: "33",
//     hobby: "palas"
//   })
// }

const handleTogglePeople = () => {
  if (!showPeople) setShowPeople(true);
  else setShowPeople(false)
}
 console.log(personInfo)
 
const changefunction = () => {
  setPersonInfo([{
    name: 'xxxx',
    age: '30',
    hobby: 'papas'
  },
  {
   name: "xxx",
   age: "33",
   hobby: "palas"
 },
 {
   name: "xxx",
   age: "31",
   hobby: "frot"
 },
 {
   name: "xxx",
   age: "29",
   hobby: "mirter"
 }])
}

  return (
    <div className="App">
      <h1>Hello React!</h1>
      <p>It's working</p>
      <button onClick={handleTogglePeople}>Show/Hide People</button>
      {showPeople && personInfo.map((person, index) => {return <Person 
      // onChangePerson={handleChangePerson} 
      onChangePerson={changefunction}
      key={index}
      name={person.name} 
      age={person.age}>  My hobby is {person.hobby}</Person>})}
    </div>
  );
}

export default App;
