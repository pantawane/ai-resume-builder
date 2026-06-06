import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../app/features/authSlice';
import { FileText } from "lucide-react";

const Navbar = () => {
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const logoutUser = ()=>{
        navigate('/')// Example user object
        dispatch(logout())

    }
  return (
    <div className='shadow bg-white'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5
        text-slate-800 transition-all'>
            <Link to='/'>
                  <img src="/logo.svg" alt="logo" className='h-11 w-auto' onLoad={()=>{/* #region agent log */fetch('http://127.0.0.1:7658/ingest/cf3fbddf-0711-46df-9693-4bb2801c8461',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0e337a'},body:JSON.stringify({sessionId:'0e337a',location:'Navbar.jsx:logo',message:'navbar logo loaded',data:{src:'/logo.svg'},timestamp:Date.now(),hypothesisId:'F'})}).catch(()=>{});/* #endregion */}} onError={(e)=>{/* #region agent log */fetch('http://127.0.0.1:7658/ingest/cf3fbddf-0711-46df-9693-4bb2801c8461',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0e337a'},body:JSON.stringify({sessionId:'0e337a',location:'Navbar.jsx:logo',message:'navbar logo failed',data:{src:e?.currentTarget?.src},timestamp:Date.now(),hypothesisId:'F'})}).catch(()=>{});/* #endregion */}} />
            </Link>
            <Link to="/app/cover-letter" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                <FileText className="size-4" />
                     Cover Letter
            </Link>
            <Link to="/app/ats-score" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                🎯 ATS Score
            </Link>
            <div className='flex items-center gap-4 text-sm'>
                <p className='max-sm:hidden'>Hi, {user?.name}</p>
                <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5
                rounded-full active:scale-95 transition-all'>Logout</button>

            </div>

        </nav>
      
    </div>
  )
}

export default Navbar
