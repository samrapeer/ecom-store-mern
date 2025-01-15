import React, { useEffect, useState } from 'react'
import image1 from '../assest/banner/1.png'
import image2 from '../assest/banner/2.png'
import image3 from '../assest/banner/3.png'

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3
    ]

    const nextImage = () => {
        if (desktopImages.length - 1 > currentImage) {
            setCurrentImage(preve => preve + 1)
        }
    }

    const preveImage = () => {
        if (currentImage !== 0) {
            setCurrentImage(preve => preve - 1)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (desktopImages.length - 1 > currentImage) {
                nextImage()
            } else {
                setCurrentImage(0)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [currentImage])

    return (
        <div className='container mx-auto px-4 rounded '>
            <div className=' w-full bg-slate-200 relative'>

                <div className='absolute z-10 h-full w-full flex items-center'>
                    <div className='flex justify-between w-full text-2xl'>
                        <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft /></button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight /></button>
                    </div>
                </div>

                <div className='flex h-full w-full overflow-hidden'>
                    {
                        desktopImages.map((imageURl, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURl} className='w-full h-full object-cover' />
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default BannerProduct;