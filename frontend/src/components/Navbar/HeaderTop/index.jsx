import HeaderLeft from "./HeaderLeft"
import HeaderRight from "./HeaderRight"

export default function HeaderTop() {

    return (
        <>
      <div className="header-top">
        <div className="container">
          <HeaderLeft />
          <HeaderRight />
        </div>
        {/* End .container */}
      </div>
        </>
    )
}