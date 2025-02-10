import HeaderLeft from "./HeaderLeft"
import HeaderRight from "./HeaderRight"

export default function HeaderMiddle() {

    return (
        <>
      <div
        className="header-middle sticky-header"
        data-sticky-options="{'mobile': true}"
      >
        <div className="container">
          <HeaderLeft />
          <HeaderRight />
        </div>
        {/* End .container */}
      </div>
      {/* End .header-middle */}

        </>
    )
}