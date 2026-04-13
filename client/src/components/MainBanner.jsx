// import React from "react" ;
// import { assets } from "../assets/assets";

// const MainBanner = () => {
//     return(
//         <div className="relative">
//             <img src={assets.main_banner_bg} alt="Main Background" className="w-full hidden md:block"></img>
//             <img src={assets.main_banner_bg_sm} alt="Main Background Banner" className="w-full md:hidden"></img> 
//         </div>
//     );
// };

// export default MainBanner ;


// import React from "react";
// import { assets } from "../assets/assets";
// import { Link } from "react-router-dom";

// const MainBanner = () => {
//   return (
//     <div className="relative">
      
//       {/* Desktop Image */}
//       <img
//         src={assets.main_banner_bg}
//         alt="banner"
//         className="w-full hidden md:block"
//       />

//       {/* Mobile Image */}
//       <img
//         src={assets.main_banner_bg_sm}
//         alt="banner"
//         className="w-full md:hidden"
//       />

//       {/* Text Content */}
//       <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-16 lg:px-24">
//         <h1 className="text-2xl md:text-4xl font-bold text-white max-w-md">
//           Freshness You Can Trust, Savings You Will Love!
//         </h1>

//         {/* Button */}
//         <Link
//           to="/products"
//           className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer mt-4"
//         >
//           Shop now

//           <img
//             className="md:hidden transition group-focus:translate-x-1"
//             src={assets.white_arrow_icon}
//             alt="arrow"
//           />
//         </Link>

//         <Link
//           to="/products"
//           className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer mt-4"
//         >
//           Explore Deals

//           <img
//             className="md:hidden transition group-focus:translate-x-1"
//             src={assets.white_arrow_icon}
//             alt="arrow"
//           />
//         </Link>

//       </div>
//     </div>
//   );
// };

// export default MainBanner;

import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative">

      {/* Desktop Image */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block"
      />

      {/* Mobile Image */}
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 lg:px-24">

        {/* Heading */}
        <h1 className="text-2xl md:text-5xl font-bold text-gray-800 max-w-lg leading-tight">
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        {/* Buttons */}
        <div className="flex items-center mt-6 font-medium">

          {/* Shop Now Button */}
          <Link
            to="/products"
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
          >
            Shop now
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          {/* Explore Deals Button */}
          <Link
            to="/products"
            className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-gray-700"
          >
            Explore deals
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MainBanner;