import React from 'react'

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            name: '',
            email: '',
            password: ''
        }
    }

    onNameChange = (event) =>{
        this.setState({ name: event.target.value })
    }

    onEmailChange = (event) => {
        this.setState({email : event.target.value})
    }

    onPasswordChange =(event) =>{
        this.setState({password : event.target.value})
    }

    onSubmitSignUp = (event)=> {
        event.preventDefault() // to remove the form not submitted warning in chrome
        //fetch always does GET method. Todo POST method we have to mention it.
        fetch('http://localhost:3002/signup',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.name,
                email : this.state.email,
                password : this.state.password
            })
        } )
        .then(response => response.json())
        .then( user => {
            if (user.id){
                this.props.addUserProfile(user)
                this.props.onRouteChange('home')
            }else{
                alert('Please enter all details')
            }
        })
    }

    render(){
        return (
            <div>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <form className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign Up</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-white hover-black w-100" 
                                type="text" name="name"  id="name"
                                onChange = {this.onNameChange}
                                />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-white hover-black w-100" 
                                type="email" name="email-address"  id="email-address"
                                onChange = {this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-white hover-black w-100" 
                                type="password" name="password" id="password1"
                                onChange = {this.onPasswordChange}
                                />
                            </div>
                            </fieldset>
                            <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" value="Sign Up" 
                            onClick= {this.onSubmitSignUp} />
                            </div>
                        </form> 
                    </main>
                </article>
            </div>
        )
    }
    
}
export default Register
