const StatsCard = ({ title, icon, value, change }) => {
    return (
        <div className="p-6 border-r border-[#0000001A] last:border-r-0 flex gap-2">
            <div>
                <div className="w-6 h-6">
                    {icon}
                </div>

            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-normal text-black">{title}</span>
                <div className="flex items-center gap-3 mt-2">
                    <p className="text-[32px] font-semibold text-black leading-none">{value}</p>
                    <div>
                        <p className="text-xs text-[#25A83D] rounded-[100px] p-2.5 bg-[#25A83D1A]">{change}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StatsCard;