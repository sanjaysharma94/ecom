import { useState } from 'react'
import '../App.css'
import Category from './Category'
import { PrimarySearchAppBar } from './Navbar'

function Home() {

  return (
    <div className="App">
      <PrimarySearchAppBar/>
      <h1>Select a Category</h1>
      <Category/>

    </div>
  )
}

export default Home
