import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'
import "./Navbar.css" // Import custom CSS

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setIsLogin(token ? false : true)
  }, [token])

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLogin(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <header className="navbar">
        <h2 className="logo">🌱 CRaftGardening</h2>
        <ul className="nav-links">
          <li><NavLink to="/" className="nav-link">Home</NavLink></li>
          <li><NavLink to="/plants" className="nav-link">Plants</NavLink></li>
          <li>
            <NavLink
              to={!isLogin ? "/Events" : "/"}
              className="nav-link"
              onClick={() => isLogin && setIsOpen(true)}
            >
              Events
            </NavLink>
          </li>
          <li onClick={checkLogin}>
            <p className="login-btn">
              {isLogin ? "Login" : "Logout"} 
              {user?.email ? ` (${user?.email})` : ""}
            </p>
          </li>
        </ul>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  )
}
