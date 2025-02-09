export default function InfoBoxes() {

  return (
    <>
          <div
            className="info-boxes-slider owl-carousel"
            data-owl-options="{
                  'items': 1,
                  'margin': 0,
                  'dots': false,
                  'loop': false,
                  'autoHeight': true,
                  'responsive': {
                      '576': {
                          'items': 2
                      },
                      '768': {
                          'items': 3
                      },
                      '1200': {
                          'items': 4
                      }
                  }
              }"
          >
            <div className="info-box info-box-icon-left">
              <i className="icon-shipping text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Free Shipping &amp; Return</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  Free shipping on all orders over $99.
                </p>
              </div>
            </div>
            <div className="info-box info-box-icon-left">
              <i className="icon-money text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Money Back Guarantee</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  100% money back guarantee
                </p>
              </div>
            </div>
            <div className="info-box info-box-icon-left">
              <i className="icon-support text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Online Support 24/7</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
            <div className="info-box info-box-icon-left">
              <i className="icon-secure-payment text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Secure Payment</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
    </>
  )
}