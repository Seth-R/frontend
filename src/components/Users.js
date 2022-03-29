import React, {useState, useEffect} from "react";//useEfect nos permite ejecutar codigo despues del renderizado del componente


const API = process.env.REACT_APP_API

export const Users = () =>{
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [editing, setEditing] = useState(false)
    const [id, setId] = useState('')

    const [users, setUsers] = useState([])

    //agregar usuarios
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!editing){
            const res = await fetch(`${API}/users`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })//<---a donde quieres mandar el formulario y pedir cosas
            //console(API)
            //console.log(name, email, password)
            const data = await res.json();
            await getUser(); 
            console.log(data)
        }else{
            const res = await fetch(`${API}/user/${id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await res.json();
            setEditing(false);
            setId('');
            await getUser();
            console.log(data)
        }

        setName('')
        setEmail('')
        setPassword('')
    }//metodo para agregar usuario(enviar usuario)

    const getUser = async() =>{
      const res = await fetch(`${API}/users`)
      const data = await res.json()
      setUsers(data)//console.log(data)
    }
    useEffect(() => {
        getUser()
    },[])

    //una constante que contiene una funcion 
    const deleteUsers = async(id) =>{
        const userResponse = window.confirm('Are you sure you want to delete it?')//pregunta si el usario esta seguro de eliminar al dar clic al boton eliminar
        if(userResponse){
            const res = await fetch(`${API}/user/${id}`, 
            {
                method:'DELETE',
            });
            const data = await res.json()
            await getUser();//refrescar los usuarios
            console.log(data)
        }

    }

    const editUsers = async(id) =>{
        const res = await fetch(`${API}/user/${id}`,)
        const data = await res.json()

        setEditing(true);
        setId(id);
        //asignamos los datos 

        setName(data.name)
        setEmail(data.email)
        setPassword(data.password)
        console.log(data)
    }
    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form group">
                        <input 
                            type="text" 
                            onChange={e=>setName(e.target.value)}//cuando tipeamos algo, capturamos el evento y se lo enviamos a la fucion "e=>"
                            value={name}
                            className="form-control"
                            placeholder="Name"
                            autoFocus    
                        />
                    </div>
                    <div className="form group">
                        <input 
                            type="email" 
                            onChange={e=>setEmail(e.target.value)}
                            value={email}
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form group">
                        <input 
                            type="password"  
                            onChange={e=>setPassword(e.target.value)}
                            value={password}
                            className="form-control"
                            placeholder="Password"
                        />
                    </div>
                    <button className="btn btn-primary btn-block">
                        {editing ? 'Update' : 'Create'}
                    </button>
                </form>
            </div>
            <div className="col md-8">

                <table className="table table-dark table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>password</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button 
                                        className="btn btn-secondary btn-sm btn-block"   
                                        onClick={(e) => editUsers(user._id)}    
                                        >
                                        Edit
                                    </button>
                                    
                                    <button 
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={(e) => deleteUsers(user._id)} 
                                        >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>

            </div>
        </div>
    )
}