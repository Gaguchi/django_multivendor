
export default function Hero() {

  return (
    <>
      <section className="intro-section">
        <div
          className="home-slider owl-carousel owl-theme loaded slide-animate mb-4"
          data-owl-options="{
              'nav': false,
              'lazyLoad': false
          }"
        >
          <div
            className="home-slide home-slide-1 banner"
            style={{ backgroundColor: "#d9e2e1" }}
          >
            <figure>
              <img
                src="src/assets/images/demoes/demo35/slider/slide-1.jpg"
                alt="slide"
                width={1903}
                height={520}
              />
            </figure>
            <div className="banner-layer banner-layer-middle banner-layer-left">
              <h4
                className="font-weight-normal text-body m-b-2 appear-animate"
                data-animation-name="fadeInDownShorter"
                data-animation-delay={100}
              >
                Exclusive Product New Arrival
              </h4>
              <h2
                className="appear-animate"
                data-animation-name="fadeInUpShorter"
                data-animation-delay={600}
              >
                Organic Coffee
              </h2>
              <div
                className="position-relative appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1100}
              >
                <h3 className="text-uppercase mb-4">Special Blend</h3>
                <h5 className="rotate-text font-weight-normal text-primary">
                  Fresh!
                </h5>
              </div>
              <p
                className="font2 text-right text-uppercase appear-animate"
                data-animation-name="fadeInUpShorter"
                data-animation-delay={1400}
              >
                Breakfast products on sale
              </p>
              <div
                className="coupon-sale-text m-b-2 appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1800}
              >
                <h6 className="text-uppercase text-right mb-0">
                  <sup>up to</sup>
                  <strong className=" text-white">50%</strong>
                </h6>
              </div>
            </div>
          </div>
          <div
            className="home-slide home-slide-2 banner"
            style={{ backgroundColor: "#f7eeef" }}
          >
            <figure>
              <img
                src="src/assets/images/demoes/demo35/slider/slide-2.jpg"
                alt="slide"
                width={1903}
                height={520}
              />
            </figure>
            <div className="banner-layer banner-layer-middle banner-layer-right">
              <h4
                className="font-weight-normal text-body m-b-2 appear-animate"
                data-animation-name="fadeInDownShorter"
                data-animation-delay={100}
              >
                Exclusive Product New Arrival
              </h4>
              <h2
                className="appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={600}
              >
                Fit Low Carb
              </h2>
              <div
                className="position-relative appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1100}
              >
                <h3 className="text-uppercase">Candy Bar</h3>
                <h5 className="rotate-text font-weight-normal text-secondary">
                  Sugar-Free
                </h5>
              </div>
              <p
                className="font2 text-right text-uppercase appear-animate"
                data-animation-name="fadeInUpShorter"
                data-animation-delay={1400}
              >
                Breakfast products on sale
              </p>
              <div
                className="coupon-sale-text pb-0 appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1800}
              >
                <h6 className="text-uppercase text-right mb-0">
                  <sup>up to</sup>
                  <strong className=" text-white">70%</strong>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}