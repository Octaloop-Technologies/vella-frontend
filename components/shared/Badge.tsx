import { BadgeProps } from '@/types/table';
import { error } from 'console';

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants: Record<string, string> = {
    active: 'bg-[#25A83D1A] text-[#25A83D] border border-[#25A83D]',
    draft: 'bg-[#0000001A] text-black',
    outbound: 'bg-[#007BFF1A] text-[#41288A]',
    inbound: 'bg-[#F624E11A] text-[#F624E1]',
    completed: 'bg-[#D1FAE5] text-[#059669]',
    abandoned: 'bg-[#FEE2E2] text-[#DC2626]',
    published: 'bg-[#25A83D1A] text-[#25A83D]',
    processing: 'bg-[#C79A071A] text-[#C79A07]',
    error: 'bg-[#CF17421A] text-[#CF1742]',
    connected: 'bg-[#25A83D1A] text-[#25A83D]',
    notConnected: 'bg-[#CF17421A] text-[#CF1742]',
    popular: 'bg-[#131DDA1A] text-[#8266D4]',
  };
  return (
    <span className={`inline-flex justify-center items-center px-4.5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;