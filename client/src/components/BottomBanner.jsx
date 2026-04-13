import React from "react" 
import { assets , features } from "../assets/assets"

const BottomBanner = () => {
    return(
        <div className="relative mt-20 md:mt-24 overflow-hidden rounded-2xl">
            <img src={assets.bottom_banner_image} alt="Bottom Banner"  className="w-full hidden md:block"/>
            <img src={assets.bottom_banner_image_sm} alt="Bottom Banner"  className="w-full md:hidden"/>


        <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-10 sm:pt-16 md:pt-0 px-4 sm:px-6 md:pl-6 md:pr-16 lg:pr-24'>
        <div className="w-full md:w-auto max-w-md md:max-w-lg">
            <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-4 md:mb-6 text-center md:text-left'>
            Why We Are the Best?
            </h1>

            {features.map((feature, index) => (
            <div key={index} className='flex items-start gap-3 sm:gap-4 mt-2'>
                <img
                src={feature.icon}
                alt={feature.title}
                className='w-8 sm:w-9 md:w-11 shrink-0 mt-0.5'
                />

                <div>
                <h3 className='text-base sm:text-lg md:text-xl font-semibold'>
                    {feature.title}
                </h3>

                <p className='text-gray-500/70 text-xs sm:text-sm'>
                    {feature.description}
                </p>
                </div>
            </div>
            ))}
        </div>
        </div>
        </div>
    );
};

export default BottomBanner ;