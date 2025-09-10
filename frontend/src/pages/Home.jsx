import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const promoteEvent = () => {
        let token = localStorage.getItem("token")
        if (token) {
            navigate("/addRecipe")
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <section className='home'>
                <div className='left'>
                    <h1>CRaftGardening</h1>
                    <h4>Grow Green, Live Clean — Discover, Learn, and Connect with Nature.</h4>
                    <hr />
                    <h5>
                        CraftGardening is a modern gardening companion website designed to help plant lovers discover detailed information about indoor and outdoor plants, including care tips and environmental needs. 
                        Users can explore a wide variety of plant types, participate in or promote gardening events happening across India. 
                        So let's grow together with the plants.
                    </h5>
                    <button onClick={promoteEvent}>Promote an Event</button>
                </div>
                <div className='right'>
                    <img src="plants.png" width={320} height={600} alt="Plants" />
                </div>
            </section>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={setIsOpen} />
                </Modal>
            )}

            <div className='recipe'>
                <RecipeItems />
            </div>
        </>
    )
}
