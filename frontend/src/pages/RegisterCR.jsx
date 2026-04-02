import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; 

const RegisterCR = () => {
    // Purane states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityId, setUniversityId] = useState(''); 
    
    // 🔥 NAYE STATES (Database ke hisaab se)
    const [school, setSchool] = useState('');
    const [course, setCourse] = useState('');
    const [section, setSection] = useState('');
    const [year, setYear] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Backend ko saara data bhej rahe hain
            const response = await api.post('/api/auth/register-cr', {
                name: name,
                email: email,
                password: password,
                universityId: universityId,
                school: school,
                course: course,
                section: section,
                year: year
            });

            alert(response.data);
            navigate('/login');
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Registration Failed! Email might already exist.");
        }
    };

    // Styling ko clean rakhne ke liye ek common object bana liya
    const inputStyle = {
        display: 'block', 
        width: '100%', 
        padding: '10px', 
        margin: '10px 0', 
        boxSizing: 'border-box', 
        borderRadius: '4px', 
        border: '1px solid #ccc'
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '450px', margin: '0 auto', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff' }}>
                <h2>📝 CR Registration</h2>
                <p style={{ color: 'gray', marginBottom: '20px', fontSize: '14px' }}>
                    Register as a Class Representative. Your account will need admin approval before you can log in.
                </p>
                <form onSubmit={handleRegister}>
                    
                    {/* --- Basic Information --- */}
                    <input type="text" placeholder="Full Name (e.g., Rahul Verma)" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                    <input type="text" placeholder="University ID / Roll No (e.g., CR-101)" value={universityId} onChange={(e) => setUniversityId(e.target.value)} required style={inputStyle} />
                    <input type="email" placeholder="College Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                    
                    {/* --- Academic Information (NAYA SECTION) --- */}
                    <input type="text" placeholder="School (e.g., School of Engineering)" value={school} onChange={(e) => setSchool(e.target.value)} required style={inputStyle} />
                    <input type="text" placeholder="Course (e.g., B.Tech)" value={course} onChange={(e) => setCourse(e.target.value)} required style={inputStyle} />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Section (e.g., A)" value={section} onChange={(e) => setSection(e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
                        <input type="text" placeholder="Year (e.g., 3)" value={year} onChange={(e) => setYear(e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
                    </div>

                    <input type="password" placeholder="Create a Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', fontSize: '16px' }}>
                        Register Request
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                    Already registered? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Log in here</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterCR;