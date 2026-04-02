import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Login ya Register page par navbar mat dikhao
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        return null;
    }

    const handleLogout = () => {
        // Token aur Role delete karo
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        
        // Login par bhejo aur HISTORY REPLACE kar do taaki 'Back' dabane par wapas na aa sake
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ background: '#343a40', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0 }}>🎓 College Help Desk</h3>
            <button 
                onClick={handleLogout} 
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;