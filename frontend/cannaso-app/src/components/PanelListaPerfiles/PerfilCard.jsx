import React, { useEffect } from 'react'

import './styles/PerfilCard.css'

import iconAvatarTest from "../../assets/avatars/man.png"

export default function PerfilCard({perfil, setPerfilSeleccionado}) {

  //const avatarPerfil = `../../assets/avatars/${perfil.foto}.png`

  const handleClickPerfil = ()=>{
    setPerfilSeleccionado(perfil)
  }

  useEffect(()=>{
  }, [])

  return (
    <div className="socio-card" onClick={handleClickPerfil}>
      <div className="container-avatar">
        <img className="socio-avatar" src={iconAvatarTest} alt="Avatar" />
        <div className="socio-id">{perfil.numeroSocio}</div>
      </div>
      <div className="container-name">
        <b>
          <p>{perfil.nombre}</p>
        </b>
      </div>
      <div className="container-led">
        <div className={`socio-led ${perfil.activo ? "socio-led-actived" : ""}`}></div>
      </div>
    </div>
  )
}
