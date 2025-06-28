import AISearchButton from '../../../Search/AISearchButton'
import SearchBox from '../../../Search/SearchBox'

export default function HeaderLeft() {

    return (
        <>
          <div className="header-left w-lg-max">
            <button
              className="mobile-menu-toggler text-primary mr-2"
              type="button"
            >
              <i className="fas fa-bars" />
            </button>
            <a href="/" className="logo">
              <img
                src="/src/assets/images/Logo.svg"
                className="w-100"
                width={111}
                height={44}
                alt="Porto Logo"
              />
            </a>
            
            {/* AI Search Button */}
            <div className="header-ai-search d-flex align-items-center ml-3">
              <AISearchButton />
            </div>
            
            {/* Enhanced Search Box */}
            <div className="header-search-container d-lg-block d-none">
              <SearchBox 
                className="header-search-box"
                placeholder="Search products..."
                showCategories={true}
              />
            </div>
          </div>
          {/* End .header-left */}
          
          {/* Search Integration Styles */}
          <style jsx>{`
            .header-ai-search {
              margin-left: 15px;
            }
            
            .header-search-container {
              flex: 1;
              margin-left: 20px;
              max-width: 600px;
            }
            
            .header-search-box {
              width: 100%;
            }
            
            @media (max-width: 991px) {
              .header-ai-search {
                margin-left: 10px;
              }
            }
            
            @media (max-width: 576px) {
              .header-ai-search {
                margin-left: 8px;
              }
            }
          `}</style>

        </>
    )
}