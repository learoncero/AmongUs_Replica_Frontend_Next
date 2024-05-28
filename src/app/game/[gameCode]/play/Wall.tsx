// Wall.tsx
import React from 'react';
import Image from "next/image";


const Wall: React.FC = () => {
    return (
        <div className="w-13 h-13 md:w-16 md:h-16 lg:w-19 lg:h-19 absolute">
            <Image
                src={"/Sprites/AmongUS_Thug.png"}
                alt={"Sabotage"}
                width={100}
                height={100}
            />
        </div>
    );
};

export default Wall;




