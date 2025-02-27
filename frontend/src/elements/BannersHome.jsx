export default function BannersHome() {

  return (
    <><div className="row">
            <div className="col-md-8">
              <div
                className="banner banner1 rounded m-b-4"
                style={{ backgroundColor: "#d9e1e1" }}
              >
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/banners/banner-1.png"
                    alt="banner"
                    width={939}
                    height={235}
                  />
                </figure>
                <div className="banner-layer banner-layer-middle banner-layer-right">
                  <h4
                    className="font-weight-normal text-body appear-animate"
                    data-animation-name="fadeInDownShorter"
                    data-animation-delay={100}
                  >
                    Exclusive Product New Arrival
                  </h4>
                  <h2
                    className="m-l-n-1 p-r-5 m-r-2 appear-animate"
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
                    <h3 className="text-uppercase">Special Blend</h3>
                    <h5 className="rotate-text font-weight-normal text-primary">
                      Fresh!
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="banner banner2 rounded mb-3"
                style={{ backgroundColor: "#b28475" }}
              >
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/banners/banner-2.png"
                    alt="banner"
                    width={460}
                    height={235}
                  />
                </figure>
                <div className="banner-layer banner-layer-middle banner-layer-right">
                  <h4
                    className="font-weight-normal appear-animiate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={200}
                  >
                    Stay Healthy
                  </h4>
                  <h2
                    className="text-white appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={400}
                  >
                    Low Carb
                  </h2>
                  <h3
                    className="text-white text-uppercase mb-2 appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={600}
                  >
                    Strawberry
                  </h3>
                  <h5
                    className="font-weight-normal text-white mb-0 appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={800}
                  >
                    Sugar-Free
                  </h5>
                </div>
              </div>
            </div>
          </div>
    </>
  )
}