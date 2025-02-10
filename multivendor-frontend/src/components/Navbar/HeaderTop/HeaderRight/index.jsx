import CurrencyDropdown from "./CurrencyDropdown"
import LanguageDropdown from "./LanguageDropdown"
import Links from "./Links"
import SocialIcons from "./SocialIcons"

export default function HeaderRight() {

    return (
        <>
          <div className="header-right header-dropdowns">
            <CurrencyDropdown />
            <LanguageDropdown />
            <div className="separator d-none d-lg-inline" />
            <Links />
            <span className="separator d-none d-lg-inline" />
            <SocialIcons />
          </div>
          {/* End .header-right */}

        </>
    )
}