import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found center">
            <Link to="/">Home</Link>
            <h3>Page Not Found!</h3>
        </div>
    )
}

export default NotFound;