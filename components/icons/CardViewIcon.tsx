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
        <g clip-path="url(#clip0_218_227)">
            <path d="M11 11.5H0V3.5C0 2.70435 0.31607 1.94129 0.87868 1.37868C1.44129 0.81607 2.20435 0.5 3 0.5L11 0.5V11.5ZM2 9.5H9V2.5H3C2.73478 2.5 2.48043 2.60536 2.29289 2.79289C2.10536 2.98043 2 3.23478 2 3.5V9.5Z" fill="url(#paint0_linear_218_227)" />
            <path d="M24 11.5H13V0.5H21C21.7956 0.5 22.5587 0.81607 23.1213 1.37868C23.6839 1.94129 24 2.70435 24 3.5V11.5ZM15 9.5H22V3.5C22 3.23478 21.8946 2.98043 21.7071 2.79289C21.5196 2.60536 21.2652 2.5 21 2.5H15V9.5Z" fill="url(#paint1_linear_218_227)" />
            <path d="M11 24.5H3C2.20435 24.5 1.44129 24.1839 0.87868 23.6213C0.31607 23.0587 0 22.2956 0 21.5L0 13.5H11V24.5ZM2 15.5V21.5C2 21.7652 2.10536 22.0196 2.29289 22.2071C2.48043 22.3946 2.73478 22.5 3 22.5H9V15.5H2Z" fill="url(#paint2_linear_218_227)" />
            <path d="M21 24.5H13V13.5H24V21.5C24 22.2956 23.6839 23.0587 23.1213 23.6213C22.5587 24.1839 21.7956 24.5 21 24.5ZM15 22.5H21C21.2652 22.5 21.5196 22.3946 21.7071 22.2071C21.8946 22.0196 22 21.7652 22 21.5V15.5H15V22.5Z" fill="url(#paint3_linear_218_227)" />
        </g>
        <defs>
            <linearGradient id="paint0_linear_218_227" x1="5.5" y1="0.5" x2="5.5" y2="11.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8266D4" />
                <stop offset="1" stop-color="#41288A" />
            </linearGradient>
            <linearGradient id="paint1_linear_218_227" x1="18.5" y1="0.5" x2="18.5" y2="11.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8266D4" />
                <stop offset="1" stop-color="#41288A" />
            </linearGradient>
            <linearGradient id="paint2_linear_218_227" x1="5.5" y1="13.5" x2="5.5" y2="24.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8266D4" />
                <stop offset="1" stop-color="#41288A" />
            </linearGradient>
            <linearGradient id="paint3_linear_218_227" x1="18.5" y1="13.5" x2="18.5" y2="24.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8266D4" />
                <stop offset="1" stop-color="#41288A" />
            </linearGradient>
            <clipPath id="clip0_218_227">
                <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
            </clipPath>
        </defs>
    </svg>
)
};

export default CardViewIcon;