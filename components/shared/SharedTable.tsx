import React from 'react';
import { BadgeProps, ProgressBarProps, IconProps, StarIconProps, TableType, TableProps, ColumnConfig } from '@/types/table';
import { AgentIcon } from '@/components/icons';
import Card from '@/components/shared/Card';
import CopyIcon from '@/components/icons/CopyIcon';
import EyeIcon from '@/components/icons/EyeIcon';
import FileEditIcon from '@/components/icons/FileEditIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import DownloadIcon from '@/components/icons/DownloadIcon';
import { createPortal } from 'react-dom';

// Badge Component
const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants: Record<string, string> = {
    active: 'bg-[#25A83D1A] text-[#25A83D] border border-[#25A83D]',
    draft: 'bg-[#0000001A] text-black',
    outbound: 'bg-[#007BFF1A] text-[#41288A]',
    inbound: 'bg-[#F624E11A] text-[#F624E1]',
    completed: 'bg-[#D1FAE5] text-[#059669]',
    abandoned: 'bg-[#FEE2E2] text-[#DC2626]',
    published: 'bg-[#D1FAE5] text-[#059669]',
  };
  return (
    <span className={`inline-flex w-21 justify-center items-center px-4.5 py-2.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className = '' }) => {
  return (
    <div className="w-full bg-[#F3F4F6] rounded-[10px] h-3 overflow-hidden">
      <div className="bg-gradient-to-b from-[#8266D4] to-[#41288A] h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
    </div>
  );
};

const DotsIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <circle cx="2" cy="2" r="2" fill="black" />
      <circle cx="9" cy="2" r="2" fill="black" />
      <circle cx="16" cy="2" r="2" fill="black" />
    </g>
  </svg>
);

const StarIcon: React.FC<StarIconProps> = ({ filled, className = '' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? "#FCD34D" : "#E5E7EB"} className={className}>
    <path d="M8 0L10.163 5.26604L16 6.11567L12 10.2124L12.944 16L8 13.266L3.056 16L4 10.2124L0 6.11567L5.837 5.26604L8 0Z" />
  </svg>
);

// Separate Reusable Dropdown Component
interface DropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 12rem = 192px
      let left = rect.right - dropdownWidth;

      if (left < 0) {
        left = rect.left;
      }

      const top = rect.bottom + 4; // mt-1 ≈ 4px

      setPosition({ top, left });
    }
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div>
      <button ref={triggerRef} onClick={handleToggle} className="p-1 rounded cursor-pointer">
        {trigger}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="w-48 bg-white rounded-lg shadow-lg border border-[#41288A80] z-[9999] origin-top-right transition-all duration-200 ease-out"
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: 'scale(1)',
              opacity: 1,
            }}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<{ closeDropdown?: () => void }>, {
                  closeDropdown: () => setIsOpen(false),
                });
              }
              return child;
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

const DropdownItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  closeDropdown?: () => void;
}> = ({ icon, label, onClick, className = '', closeDropdown }) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (closeDropdown) closeDropdown();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] w-full text-left first:rounded-t-lg last:rounded-b-lg cursor-pointer hover:bg-[#F3F4F6] ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};

// Column Configuration based on table type
const getColumnConfig = <T extends Record<string, unknown>>(type: TableType): ColumnConfig<T>[] => {
  switch (type) {
    case 'workflows':
      return [
        {
          key: 'name',
          header: 'Workflow Name',
          render: (row: Record<string, unknown>) => (
            <span className="text-sm font-medium text-[#1F2937]">{String(row.name)}</span>
          )
        },
        {
          key: 'linkedAgent',
          header: 'Linked Agent',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.linkedAgent)}</span>
        },
        {
          key: 'status',
          header: 'Status',
          render: (row: Record<string, unknown>) => <Badge variant={String(row.statusVariant) as BadgeProps['variant']}>{String(row.status)}</Badge>
        },
        {
          key: 'nodes',
          header: 'Nodes',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.nodes)}</span>
        },
        {
          key: 'lastEdited',
          header: 'Last Edited',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.lastEdited)}</span>
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (row: Record<string, unknown>) => (
            <Dropdown trigger={<DotsIcon />}>
              <DropdownItem icon={<FileEditIcon />} label="Edit Workflow" onClick={row.onEdit as () => void} />
              <DropdownItem icon={<EyeIcon />} label="View Details" onClick={row.onViewDetails as () => void} />
              <DropdownItem
                icon={<TrashIcon />}
                label="Delete Workflow"
                className="text-[#DC2626]"
                onClick={row.onDelete as () => void}
              />
            </Dropdown>
          )
        }
      ];
    case 'topAgents':
      return [
        {
          key: 'agent',
          header: '',
          width: '60%',
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-3">
              <AgentIcon gradient={{ from: "#8266D4", to: "#41288A" }} />
              <div>
                <div className="text-sm font-semibold text-black mb-1.5">{String(row.name)}</div>
                <div className="text-xs text-black">{String(row.conversations)}</div>
              </div>
            </div>
          )
        },
        {
          key: 'progress',
          header: '',
          width: '20%',
          render: (row: Record<string, unknown>) => <ProgressBar percentage={Number(row.progress)} />
        },
        {
          key: 'success',
          header: '',
          width: '10%',
          render: (row: Record<string, unknown>) => (
            <div className="text-xs font-medium text-black">{String(row.success)}</div>
          )
        },
        {
          key: 'status',
          header: '',
          width: '10%',
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.statusVariant) as BadgeProps['variant']}>{String(row.status)}</Badge>
          )
        }
      ];
    case 'agents':
      return [
        {
          key: 'name',
          header: 'Agent Name',
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-3">
              <div className='h-[18px] w-[18px] bg-gradient-to-b from-[#41288A] to-[#301971] rounded flex items-center justify-center'>
                <AgentIcon className='h-3 w-3 text-white' />
              </div>
              <span className="text-sm font-medium text-[#1F2937]">{String(row.name)}</span>
            </div>
          )
        },
        {
          key: 'type',
          header: 'Type',
          render: (row: Record<string, unknown>) => <Badge variant={String(row.typeVariant) as BadgeProps['variant']}>{String(row.type)}</Badge>
        },
        {
          key: 'status',
          header: 'Status',
          render: (row: Record<string, unknown>) => <Badge variant={String(row.statusVariant) as BadgeProps['variant']}>{String(row.status)}</Badge>
        },
        {
          key: 'conversations',
          header: 'Conversations',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.conversations)}</span>
        },
        {
          key: 'successRate',
          header: 'Success Rate',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.successRate)}</span>
        },
        {
          key: 'lastActive',
          header: 'Last Active',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.lastActive)}</span>
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (row: Record<string, unknown>) => (
            <Dropdown trigger={<DotsIcon />}>
              <DropdownItem icon={<FileEditIcon />} label="Edit Agent" />
              <DropdownItem icon={<CopyIcon />} label="Duplicate Agent" />
              <DropdownItem
                icon={<EyeIcon />}
                label="View Details"
                onClick={row.onViewDetails as () => void}
              />
              <DropdownItem icon={<PauseIcon />} label="Deactivate Agent" />
              <DropdownItem
                icon={<TrashIcon />}
                label="Delete Agent"
                className="text-[#DC2626]"
                onClick={row.onDelete as () => void}
              />
            </Dropdown>
          )
        }
      ];
    case 'conversations':
      return [
        {
          key: 'customer',
          header: 'Customer',
          render: (row: Record<string, unknown>) => (
            <div>
              <div className="text-sm font-medium text-[#1F2937]">{String(row.customerName)}</div>
              <div className="text-sm text-[#6B7280]">{String(row.customerEmail)}</div>
            </div>
          )
        },
        {
          key: 'agent',
          header: 'Agent',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.agent)}</span>
        },
        {
          key: 'channel',
          header: 'Channel',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.channel)}</span>
        },
        {
          key: 'duration',
          header: 'Duration',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.duration)}</span>
        },
        {
          key: 'status',
          header: 'Status',
          render: (row: Record<string, unknown>) => <Badge variant={String(row.statusVariant) as BadgeProps['variant']}>{String(row.status)}</Badge>
        },
        {
          key: 'satisfaction',
          header: 'Satisfaction',
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < Number(row.stars)} />
              ))}
              <span className="text-sm text-[#1F2937] ml-1">{String(row.rating)}</span>
            </div>
          )
        },
        {
          key: 'date',
          header: 'Date',
          render: (row: Record<string, unknown>) => (
            <div>
              <div className="text-sm text-[#1F2937]">{String(row.date)}</div>
              <div className="text-sm text-[#6B7280]">{String(row.time)}</div>
            </div>
          )
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => (
            <button className="hover:bg-[#F3F4F6] p-2 rounded-lg"><EyeIcon /></button>
          )
        }
      ];
    case 'documents':
      return [
        {
          key: 'name',
          header: 'Document Name',
          render: (row: Record<string, unknown>) => <span className="text-sm font-medium text-[#1F2937]">{String(row.name)}</span>
        },
        {
          key: 'type',
          header: 'Type',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#6B7280]">{String(row.type)}</span>
        },
        {
          key: 'status',
          header: 'Status',
          render: (row: Record<string, unknown>) => <Badge variant={String(row.statusVariant) as BadgeProps['variant']}>{String(row.status)}</Badge>
        },
        {
          key: 'size',
          header: 'Size',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.size)}</span>
        },
        {
          key: 'lastUpdated',
          header: 'Last Updated',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.lastUpdated)}</span>
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => (
            <Dropdown trigger={<DotsIcon />}>
              <DropdownItem icon={<EyeIcon />} label="View Details" />
              <DropdownItem icon={<DownloadIcon />} label="Download" />
              <DropdownItem icon={<TrashIcon />} label="Delete Document" className="text-[#DC2626]" />
            </Dropdown>
          )
        }
      ];
    default:
      return [];
  }
};

// Table Component
export default function SharedTable<T extends Record<string, unknown>>({
  type,
  data,
  showSearch = false,
  searchPlaceholder = "Search...",
  title,
  viewToggle = false,
  className = ''
}: TableProps<T>): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [view, setView] = React.useState<'list' | 'grid'>('list');
  const columns = getColumnConfig(type);
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  return (
    <Card className={`${className}`}>
      {(title || showSearch || viewToggle) && (
        <div className="p-6">
          <div className="flex items-center justify-between">
            {title && <h2 className="text-lg font-medium text-black">{title}</h2>}
            <div className="flex items-center gap-4">
              {showSearch && (
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent w-64"
                  />
                </div>
              )}
              {viewToggle && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setView('list')} className={`p-2 rounded-lg border ${view === 'list' ? 'border-[#8B5CF6] bg-[#F5F3FF]' : 'border-[#E5E7EB] bg-white'}`} >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill={view === 'list' ? '#8B5CF6' : '#9CA3AF'}>
                      <path d="M3 4h14M3 10h14M3 16h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button onClick={() => setView('grid')} className={`p-2 rounded-lg border ${view === 'grid' ? 'border-[#8B5CF6] bg-[#F5F3FF]' : 'border-[#E5E7EB] bg-white'}`} >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill={view === 'grid' ? '#8B5CF6' : '#9CA3AF'}>
                      <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" />
                      <rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" />
                      <rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" />
                      <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          {type !== 'topAgents' && (
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-4 text-left text-sm font-medium text-[#6B7280] whitespace-nowrap" style={{ width: column.width }} >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#0000001A] last:border-b-0 hover:bg-[#F9FAFB] transition-colors" >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4" style={column.width ? { width: column.width } : undefined} >
                    {column.render ? column.render(row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}