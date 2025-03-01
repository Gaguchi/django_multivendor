import Hero from "../elements/Hero";
import InfoBoxes from "../elements/InfoBoxes";
import PopularCategories from "../elements/PopularCategories";
import PopularProducts from "../elements/PopularProducts";
import Specials from "../elements/Specials";
import BannersHome from "../elements/BannersHome";
import ForYou from "../elements/ForYou";

export default function Footer() {

  return (
    <>    
    <main className="bg-gray">
    <Hero />
      <section className="popular-section">
        <div className="container">
            <InfoBoxes />
            <PopularCategories />
            <PopularProducts />
        </div>
      </section>
      <section className="special-section">
        <div className="container">
            <Specials />
            <BannersHome />
            <ForYou />
        </div>
      </section>
      <section
        className="newsletter-section appear-animate"
        data-animation-name="fadeInUpShorter"
        data-animation-delay={200}
      >
        <div className="container">
          <div className="row no-gutters m-0 align-items-center">
            <div className="col-lg-6 col-xl-4 mb-2 mb-lg-0">
              <div className="info-box d-block d-sm-flex text-center text-sm-left">
                <i className="icon-envolope text-dark mr-4" />
                <div className="widget-newsletter-info">
                  <h4 className="font-weight-bold line-height-1">
                    Subscribe To Our Newsletter
                  </h4>
                  <p className="font2">
                    Get all the latest information on Events, Sales and Offers.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-8">
              <form action="demo35.html#" className="mb-0">
                <div className="footer-submit-wrapper d-flex">
                  <input
                    type="email"
                    className="form-control rounded mb-0"
                    placeholder="Your E-mail Address"
                    size={40}
                    required=""
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe Now!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    {/* End .main */}
    </>
  )
}