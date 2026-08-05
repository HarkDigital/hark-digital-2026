import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { RouteStatic } from './components/site/RouteStatic'
import './index.css'

const Home = lazy(() => import('./pages/Home'))
const Lab = lazy(() => import('./pages/Lab'))
const Service = lazy(() => import('./pages/Service'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Reel = lazy(() => import('./pages/Reel'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const Insights = lazy(() => import('./pages/Insights'))
const InsightPost = lazy(() => import('./pages/InsightPost'))

// shared shell: every route renders inside it, so the TV-static
// transition overlay can watch route changes globally
function Shell() {
  return (
    <>
      <Suspense fallback={<div className="h-dvh bg-ink" />}>
        <Outlet />
      </Suspense>
      <RouteStatic />
    </>
  )
}

const router = createBrowserRouter(
  [
    {
      element: <Shell />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/lab', element: <Lab /> },
        { path: '/work', element: <Portfolio /> },
        { path: '/reel', element: <Reel /> },
        { path: '/contact', element: <ContactPage /> },
        { path: '/insights', element: <Insights /> },
        { path: '/insights/:slug', element: <InsightPost /> },
        { path: '/services/:slug', element: <Service /> },
      ],
    },
  ],
  // honor Vite's base so the app also works from a subpath (e.g. GitHub Pages)
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' }
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="h-dvh bg-ink" />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
)
