const Login = ({ ...props }) => {
    const { loginClick, user, handleUserInputChange } = props;

    return (
        <div className="login-form">
            <input className='inputs username' type="email" value={user.email} placeholder="Please enter email" name="email" onChange={(e) => handleUserInputChange(e)} />
            <input className='inputs password' type="password" value={user.password} placeholder="Please enter password" name="password" onChange={(e) => handleUserInputChange(e)} />
            <button type='submit' className='submit login-submit' onClick={loginClick}>Login</button>
        </div>
    );
}
export default Login;