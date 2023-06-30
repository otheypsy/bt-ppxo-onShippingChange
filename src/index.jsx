import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import MainLayout from './layouts/MainLayout'
import Error from './components/Error'
import Loading from './components/Loading'
import { title, routes } from './config'
import './style.scss'

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout routes={routes} title={title} />,
        errorElement: <Error />,
        children: routes.map((route) => {
            const Component = lazy(route.element)
            return {
                path: route.path,
                errorElement: <Error />,
                element: (
                    <Suspense fallback={<Loading />}>
                        <Component />
                    </Suspense>
                ),
            }
        }),
    },
])

const Mount = () => {
    return (
        <StrictMode>
            <RecoilRoot>
                <RouterProvider router={router} />
            </RecoilRoot>
        </StrictMode>
    )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Mount tab="home" />)
