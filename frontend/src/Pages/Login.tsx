const Login = () => {
    return (
        <form>
            <div>
                <label htmlFor="username">Password</label>
                <input name="username" type="text" />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input name="password" type="password" />
            </div>

            <div>
                <button type="submit">
                    Login
                </button>
            </div>
        </form>
    );
}
export default Login;