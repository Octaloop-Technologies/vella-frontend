import { IconProps } from '@/types/sidebar';

const CardViewIcon: React.FC<IconProps> = ({
    width = 24,
    height = 25,
    className = "",
    color = "currentColor",
    gradient,
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 6.5H23C23.2652 6.5 23.5196 6.39464 23.7071 6.20711C23.8946 6.01957 24 5.76522 24 5.5C24 5.23478 23.8946 4.98043 23.7071 4.79289C23.5196 4.60536 23.2652 4.5 23 4.5H7C6.73478 4.5 6.48043 4.60536 6.29289 4.79289C6.10536 4.98043 6 5.23478 6 5.5C6 5.76522 6.10536 6.01957 6.29289 6.20711C6.48043 6.39464 6.73478 6.5 7 6.5Z" fill="url(#paint0_linear_218_219)" />
            <path d="M23 11.5H7C6.73478 11.5 6.48043 11.6054 6.29289 11.7929C6.10536 11.9804 6 12.2348 6 12.5C6 12.7652 6.10536 13.0196 6.29289 13.2071C6.48043 13.3946 6.73478 13.5 7 13.5H23C23.2652 13.5 23.5196 13.3946 23.7071 13.2071C23.8946 13.0196 24 12.7652 24 12.5C24 12.2348 23.8946 11.9804 23.7071 11.7929C23.5196 11.6054 23.2652 11.5 23 11.5Z" fill="url(#paint1_linear_218_219)" />
            <path d="M23 18.5H7C6.73478 18.5 6.48043 18.6054 6.29289 18.7929C6.10536 18.9804 6 19.2348 6 19.5C6 19.7652 6.10536 20.0196 6.29289 20.2071C6.48043 20.3946 6.73478 20.5 7 20.5H23C23.2652 20.5 23.5196 20.3946 23.7071 20.2071C23.8946 20.0196 24 19.7652 24 19.5C24 19.2348 23.8946 18.9804 23.7071 18.7929C23.5196 18.6054 23.2652 18.5 23 18.5Z" fill="url(#paint2_linear_218_219)" />
            <path d="M2 7.5C3.10457 7.5 4 6.60457 4 5.5C4 4.39543 3.10457 3.5 2 3.5C0.89543 3.5 0 4.39543 0 5.5C0 6.60457 0.89543 7.5 2 7.5Z" fill="url(#paint3_linear_218_219)" />
            <path d="M2 14.5C3.10457 14.5 4 13.6046 4 12.5C4 11.3954 3.10457 10.5 2 10.5C0.89543 10.5 0 11.3954 0 12.5C0 13.6046 0.89543 14.5 2 14.5Z" fill="url(#paint4_linear_218_219)" />
            <path d="M2 21.5C3.10457 21.5 4 20.6046 4 19.5C4 18.3954 3.10457 17.5 2 17.5C0.89543 17.5 0 18.3954 0 19.5C0 20.6046 0.89543 21.5 2 21.5Z" fill="url(#paint5_linear_218_219)" />
            <defs>
                <linearGradient id="paint0_linear_218_219" x1="15" y1="4.5" x2="15" y2="6.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8266D4" />
                    <stop offset="1" stop-color="#41288A" />
                </linearGradient>
                <linearGradient id="paint1_linear_218_219" x1="15" y1="11.5" x2="15" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8266D4" />
                    <stop offset="1" stop-color="#41288A" />
                </linearGradient>
                <linearGradient id="paint2_linear_218_219" x1="15" y1="18.5" x2="15" y2="20.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8266D4" />
                    <stop offset="1" stop-color="#41288A" />
                </linearGradient>
                <linearGradient id="paint3_linear_218_219" x1="2" y1="3.5" x2="2" y2="7.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8266D4" />
                    <stop offset="1" stop-color="#41288A" />
                </linearGradient>
                <linearGradient id="paint4_linear_218_219" x1="2" y1="10.5" x2="2" y2="14.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8266D4" />
                    <stop offset="1" stop-color="#41288A" />
                </linearGradient>
                <linearGradient id="paint5_linear_218_219" x1="2" y1="17.5" x2="2" y2="21.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8266D4" />
                    <stop offset="1" stop-color="#41288A" />
                </linearGradient>
            </defs>
        </svg>
    )
};

export default CardViewIcon;
