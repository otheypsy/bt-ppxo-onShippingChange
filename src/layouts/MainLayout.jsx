import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useGetAppState } from '../states/App/AppHooks'
import { useGetAlert, useSetAlert } from '../states/Alert/AlertHooks'
import Link from '../components/Link'

const MainLayout = (props) => {
    const appState = useGetAppState()
    const location = useLocation()
    const alert = useGetAlert()
    const { success } = useSetAlert()

    const finalRoutes = props.routes.filter((route) => {
        if (route.isDep && !appState?.clientInstance) return false
        return true
    })

    useEffect(() => {
        success()
    }, [location, success])

    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <span className="navbar-brand">
                    <img
                        className="m-2"
                        src="https://www.paypalobjects.com/webstatic/icon/favicon.ico"
                        width="30"
                        height="30"
                        alt=""
                    />
                    {props.title || 'Heading Here'}
                </span>
                <nav className="nav">
                    {finalRoutes.map((route) => (
                        <Link key={route.path} to={route.path} label={route.label} />
                    ))}
                </nav>
            </nav>

            <div className={'bg-opacity-25 text-center p-2 bg-' + alert.type}>{alert.message}</div>
            <br />
            <div className="container-fluid">
                <Outlet />
            </div>
        </>
    )
}

export default MainLayout
