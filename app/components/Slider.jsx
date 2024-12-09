import React, { useRef, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

// const shoes = [
//     {
//         name: 'Nike Vaporfly 3 Electric',
//         description: "Women's Road Racing Shoes",
//         price: '₹ 21 395.00',
//         imageUrl: 'https://placehold.co/300x300?text=Nike+Vaporfly+3+Electric',
//     },
//     {
//         name: 'Nike Invincible 3 Electric',
//         description: "Men's Road Running Shoes",
//         price: '₹ 17 595.00',
//         imageUrl: 'https://placehold.co/300x300?text=Nike+Invincible+3+Electric',
//     },
//     {
//         name: 'Nike InfinityRN 4 Electric',
//         description: "Men's Road Running Shoes",
//         price: '₹ 15 595.00',
//         imageUrl: 'https://placehold.co/300x300?text=Nike+InfinityRN+4+Electric',
//     },
//     {
//         name: 'Nike InfinityRN 4 Electric',
//         description: "Men's Road Running Shoes",
//         price: '₹ 15 595.00',
//         imageUrl: 'https://placehold.co/300x300?text=Nike+InfinityRN+4+Electric',
//     },
// ];

const text="Popular Right Now"

const PopularShoes = ({data}) => {
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300, // Adjust this value as needed
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300, // Adjust this value as needed
                behavior: 'smooth'
            });
        }
    };
    


    return (
        <div className="p-6">
            <div className='flex justify-between'>
                <div>
                    <h2 className="text-2xl font-bold mb-4">{text}</h2>
                </div>
                <div>
                    <button className='border rounded-full mr-2 h-10 w-10' onClick={scrollLeft}><IoIosArrowBack className='h-10 w-10 '/></button>
                    <button className='border rounded-full mr-2 h-10 w-10' onClick={scrollRight}><IoIosArrowForward className='h-10 w-10 '/></button>
                </div>
            </div>
            <div className="overflow-x-scroll" ref={scrollContainerRef}>
                <div className="flex space-x-4 w-[calc(100vw*3/4)]">
                    {data.map((shoe, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4 w-1/3 cursor-pointer shrink-0"
                        >
                            <img
                                src={shoe.url}
                                alt={shoe.title}
                                className="w-full h-48 object-cover rounded-md mb-2"
                            />
                            {/* <h3 className="text-lg font-semibold">{shoe.name}</h3>
                            <p className="text-zinc-600">{shoe.description}</p>
                            <p className="text-lg font-bold mt-2">MRP: {shoe.price}</p> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularShoes;
