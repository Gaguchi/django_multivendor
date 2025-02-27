import HeaderTop from "./HeaderTop"
import HeaderMiddle from "./HeaderMiddle"
import HeaderBottom from "./HeaderBottom"

export default function Navbar() {

  return (
      <>
    <header className="header">
        <HeaderTop />
        <HeaderMiddle />
        <HeaderBottom />
    </header>
    {/* End .header */}
</>

  )
}