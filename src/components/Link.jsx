import { NavLink } from 'react-router-dom'

const Link = (props) => {
    const getClass = ({ isActive }) => {
        return 'nav-link ' + (isActive ? 'text-decoration-underline' : '')
    }

    return (
        <NavLink to={props.to} className={getClass}>
            {props.label}
        </NavLink>
    )
}

export default Link
