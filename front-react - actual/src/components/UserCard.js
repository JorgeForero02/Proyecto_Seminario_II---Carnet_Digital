import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/UserCard.css';

const UserCard = ({ user }) => {
  // Si no hay user aún, mostramos un loader
  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  // Aseguramos que roles sea un array
  const getUserType = () => {
    // Check if roles is array or string and handle accordingly
    const roles = user.roles || user.rol || user.roleFromToken || [];
    const roleArray = Array.isArray(roles) ? roles : [roles];
    if (roleArray.includes('ESTUDIANTE')) {
      return 'Estudiante';
    } else if (roleArray.includes('DOCENTE')) {
      return 'Docente';
    } else if (roleArray.includes('ADMINISTRATIVO')) {
      return 'Administrativo';
    }
    return 'Usuario';
  };

  const hasRole = (role) => {
    const roles = user.roles || user.rol || user.roleFromToken || [];
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(role);
  };

  const userType = getUserType();
  
  const cardStyle = {
    width: '220px',
    height: '320px',
    borderRadius: '1rem',
    overflow: 'hidden',
    position: 'relative'
  };

  const topLeftCorner = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50px',
    height: '50px',
    backgroundColor: '#dc3545',
    borderBottomRightRadius: '100%',
    zIndex: 1
  };

  const bottomRightCorner = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50px',
    height: '50px',
    backgroundColor: '#dc3545',
    borderTopLeftRadius: '100%',
    zIndex: 1
  };

  const redDot = {
    position: 'absolute',
    left: '8px',
    width: '6px',
    height: '6px',
    backgroundColor: '#dc3545',
    borderRadius: '50%',
    zIndex: 1
  };

  const initialsStyle = {
    width: '80px',
    height: '80px',
    backgroundColor: '#f8f9fa',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    color: '#6c757d',
    margin: '0 auto 10px'
  };

  const userInfoStyle = {
    fontSize: '0.75rem',
    lineHeight: '1.2',
    overflowY: 'auto',
    maxHeight: '140px'
  };

  return (
    <Card style={cardStyle} className="shadow-sm">
      {/* Red shapes */}
      <div style={topLeftCorner}></div>
      <div style={bottomRightCorner}></div>
      
      {/* Red dots */}
      <div style={{...redDot, top: '30%'}}></div>
      <div style={{...redDot, top: '50%'}}></div>
      <div style={{...redDot, top: '70%'}}></div>
      
      <Card.Header className="bg-white border-0" style={{padding: '0.5rem 1rem', position: 'relative', zIndex: 2}}>
        <h5 className="mb-0">Carné Digital</h5>
      </Card.Header>
      
      <Card.Body className="text-center p-2" style={{position: 'relative', zIndex: 2}}>
        {/* Profile photo/initials */}
        <div style={initialsStyle}>
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Foto del usuario" 
              style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}
            />
          ) : (
            <span style={{fontWeight: 'bold'}}>
              {user.nombres?.charAt(0) ?? ''}{user.apellidos?.charAt(0) ?? ''}
            </span>
          )}
        </div>
        
        {/* User info */}
        <div style={userInfoStyle}>
          <p style={{fontWeight: 'bold', marginBottom: '0.25rem'}}>{user.nombres}</p>
          <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{user.apellidos}</p>
          
          <p style={{marginBottom: '0.1rem'}}><small>C.C.:</small> {user.cedula}</p>
          <p style={{marginBottom: '0.1rem'}}><small>Codigo:</small> {user.id}</p>
          <p style={{marginBottom: '0.1rem'}}><small>tipo de sangre:</small> {user.tipo_sangre}</p>
          
          {hasRole('ESTUDIANTE') && user.estudiante && (
            <p style={{marginBottom: '0.1rem'}}><small>Programa:</small> {user.estudiante.programa?.nombre || 'N/A'}</p>
          )}
          
          {hasRole('DOCENTE') && user.docente && (
            <p style={{marginBottom: '0.1rem'}}><small>Departamento:</small> {user.docente.departamento?.nombre || 'N/A'}</p>
          )}
          
          {hasRole('ADMINISTRATIVO') && user.administrativo && (
            <p style={{marginBottom: '0.1rem'}}><small>Departamento:</small> {user.administrativo.departamento?.nombre || 'N/A'}</p>
          )}
          
          <p style={{marginBottom: '0.1rem'}}><small>Email:</small> {user.email}</p>
        </div>
      </Card.Body>
      
      <Card.Footer className="bg-danger text-white text-center p-1 border-0" style={{position: 'relative', zIndex: 2}}>
        {userType}
      </Card.Footer>
    </Card>
  );
};

export default UserCard;