import React from 'react'
import Hero from '../elements/Hero'
import InfoBoxes from '../elements/InfoBoxes'
import PopularCategories from '../elements/PopularCategories'
import PopularProducts from '../elements/PopularProducts'
import Specials from '../elements/Specials'
import BannersHome from '../elements/BannersHome'
import ForYou from '../elements/ForYou'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container">
        <section className="popular-section">
          <InfoBoxes />
          <PopularCategories />
          <PopularProducts />
        </section>

        <section className="special-section">
          <Specials />
          <BannersHome />
          <ForYou />
        </section>
      </div>
    </>
  )
}