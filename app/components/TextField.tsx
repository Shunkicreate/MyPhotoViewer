import React from 'react';

export interface TextFieldProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({ value, onChange }) => {
    return (
        <div className="flex flex-col my-4">
            <div className="flex items-center rounded-full shadow-inner-search p-2">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="flex-grow p-2 rounded-full outline-none bg-transparent bg-bg-color"
                />
                <img
                    src={"/searchIcon.svg"}
                    alt="Search Icon"
                    className="w-8 h-8 ml-2"
                />
            </div>
        </div>
    );
};

export default TextField;
