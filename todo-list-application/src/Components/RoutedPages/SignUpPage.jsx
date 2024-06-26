import '../Styles/singUp.css'
import {Alert, Button, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {singup} from "../BackendSources.js";
import {useNavigate} from "react-router";


export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    const [alert, setAlert] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        if (username === ''){
            setAlert("Username can not be empty");
            return;
        }
        if(email === '') {
            setAlert("email can not be empty");
            return;
        }
        if(!checkStrength(password) && !checkMatch()) {
            setAlert("check on you password please.");
            return;
        }

        singup(username, email, password).then((response) => {
            setEmail('');
            setUsername('');
            setConfirmPassword('');
            setPassword('');

            sessionStorage.setItem("username", response.data.username);
            sessionStorage.setItem('id', response.data.id);
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("token", response.data.jwt);

            //navigate to the next page.
            navigate("/user/main");

            }
        ).catch((error) =>{
            setAlert(error.response.data.message);
        })

    }

    const handlePasswords = () => {

        if (checkMatch()) {
            setAlert('');
            if (checkStrength(confirmPassword)) {
                setAlert('');
            }
        }
    }


    const checkMatch = () => {
        if(password.match(confirmPassword)){
            return true;
        } else {
            setAlert("Passwords does not match");
            return false;
        }
    }

    const checkStrength = (pass) =>{
        if(PASSWORD_REGEX.test(pass)){
            setAlert('');
            return true;
        }else {
            setAlert("A password must contain at least 9 characters :- a least : - 1 Upper case letter" +
                "1 lower case letter, 1 number and a special character");
            return false;
        }
    }

    useEffect(() => {
        handlePasswords();
    }, [password, confirmPassword]);


    return (
        <div className="contain">
            <div className="section">
                <Form onSubmit={handleRegister}>
                    <Form.Label className={"label"}>Sign Up</Form.Label>

                    {alert && <Alert className={"alert"}>{alert}</Alert>}

                   <Form.Group className={"group"}>
                       <Form.Label className={"star label"}>Username</Form.Label>
                       <Form.Control type={"text"} placeholder={"e.g Red-Stevo"} autoComplete={"false"}
                       onChange={(e) => setUsername(e.target.value)}
                       value={username}/>
                   </Form.Group>

                    <Form.Group className={"group"}>
                        <Form.Label className={"star label"}>Email</Form.Label>
                        <Form.Control type={"email"} placeholder={"breecodes@gmail.com"} autoComplete={"false"}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}/>
                    </Form.Group>

                    <Form.Group className={"group"}>
                        <Form.Label className={"star label"} >Password</Form.Label>
                        <Form.Control type={"password"} autoComplete={"false"}
                        onChange={(e) =>
                        {return setPassword(() => {return e.target.value})}}
                        value={password}/>
                    </Form.Group>

                    <Form.Group className={"group"}>
                        <Form.Label className={"star label"} >Confirm Password</Form.Label>
                        <Form.Control type={"password"} autoComplete={"false"}
                          onChange={(e) =>
                          {return setConfirmPassword(() => {return e.target.value})}}
                            value={confirmPassword}/>
                    </Form.Group>
                        <Button type={"submit"} className="button">Signup</Button>
                </Form>
            </div>
        </div>
    );
}
