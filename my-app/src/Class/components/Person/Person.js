import './Person.css'

const Person = (props) => {
    
    console.log(props)

    const { name, age} = props

    return (
        <div className="Person">
            <h3>Hello my name is {name}, Im {age} years old!</h3>
            <p>{props.children}</p>
            <button onClick={props.onChangePerson}>Change person</button>
        </div>
    )

}

export default Person;