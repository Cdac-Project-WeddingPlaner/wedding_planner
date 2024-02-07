import { useState } from "react";
import axios from "axios";
import {useHistory} from 'react-router-dom'
function Login()
{
    
    return <>
            <center>
                UserName : <input type="text"/>
                <br/>
                Password : <input type="password"/>
                <br/>
                <button >Login</button>

            </center>
           </>
}

export default Login;