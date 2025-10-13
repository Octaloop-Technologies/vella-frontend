import React from 'react';
import {
  BadgeProps,
  ProgressBarProps,
  IconProps,
  StarIconProps,
  TableType,
  TableProps,
  ColumnConfig
} from '@/types/table';
import Card from '@/components/shared/Card';

// Badge Component
const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants: Record<string, string> = {
    active: 'bg-[#D1FAE5] text-[#059669] border border-[#6EE7B7]',
    draft: 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]',
    outbound: 'bg-[#DBEAFE] text-[#2563EB]',
    inbound: 'bg-[#FCE7F3] text-[#DB2777]',
    completed: 'bg-[#D1FAE5] text-[#059669]',
    abandoned: 'bg-[#FEE2E2] text-[#DC2626]',
    published: 'bg-[#D1FAE5] text-[#059669]',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className = '' }) => {
  return (
    <div className="w-full bg-[#F3F4F6] rounded-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Icon Components
const AgentIcon: React.FC<IconProps> = ({ className = '' }) => (
  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-[#8266D4] to-[#41288A] flex items-center justify-center ${className}`}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="white" />
    </svg>
  </div>
);

const EyeIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="#6B7280" />
  </svg>
);

const DotsIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <path d="M10 6C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5C9 5.55228 9.44772 6 10 6Z" fill="#9CA3AF" />
    <path d="M10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z" fill="#9CA3AF" />
    <path d="M10 16C10.5523 16 11 15.5523 11 15C11 14.4477 10.5523 14 10 14C9.44772 14 9 14.4477 9 15C9 15.5523 9.44772 16 10 16Z" fill="#9CA3AF" />
  </svg>
);

const StarIcon: React.FC<StarIconProps> = ({ filled, className = '' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? "#FCD34D" : "#E5E7EB"} className={className}>
    <path d="M8 0L10.163 5.26604L16 6.11567L12 10.2124L12.944 16L8 13.266L3.056 16L4 10.2124L0 6.11567L5.837 5.26604L8 0Z" />
  </svg>
);

// Column Configuration based on table type
const getColumnConfig = <T extends Record<string, unknown>>(type: TableType): ColumnConfig<T>[] => {
  switch (type) {
    case 'topAgents':
      return [
        {
          key: 'agent',
          header: '',
          width: '40%',
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-3">
              <AgentIcon />
              <div>
                <div className="text-base font-semibold text-[#1F2937]">{String(row.name)}</div>
                <div className="text-sm text-[#6B7280]">{String(row.conversations)}</div>
              </div>
            </div>
          )
        },
        {
          key: 'progress',
          header: '',
          width: '30%',
          render: (row: Record<string, unknown>) => <ProgressBar percentage={Number(row.progress)} />
        },
        {
          key: 'success',
          header: '',
          width: '20%',
          render: (row: Record<string, unknown>) => (
            <div className="text-sm font-medium text-[#1F2937]">{String(row.success)}</div>
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
              <AgentIcon />
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
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.conversations)}</span>
        },
        {
          key: 'successRate',
          header: 'Success Rate',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#1F2937]">{String(row.successRate)}</span>
        },
        {
          key: 'lastActive',
          header: 'Last Active',
          render: (row: Record<string, unknown>) => <span className="text-sm text-[#6B7280]">{String(row.lastActive)}</span>
        },
        {
          key: 'actions',
          header: 'Actions',
          render: () => <button className="hover:bg-[#F3F4F6] p-1 rounded"><DotsIcon /></button>
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
          render: () => <button className="hover:bg-[#F3F4F6] p-2 rounded-lg"><EyeIcon /></button>
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
          render: () => <button className="hover:bg-[#F3F4F6] p-1 rounded"><DotsIcon /></button>
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
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg border ${view === 'list' ? 'border-[#8B5CF6] bg-[#F5F3FF]' : 'border-[#E5E7EB] bg-white'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill={view === 'list' ? '#8B5CF6' : '#9CA3AF'}>
                      <path d="M3 4h14M3 10h14M3 16h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg border ${view === 'grid' ? 'border-[#8B5CF6] bg-[#F5F3FF]' : 'border-[#E5E7EB] bg-white'}`}
                  >
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
          {type !== 'topAgents' && <thead>
            <tr className="border-b border-[#F3F4F6]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-[#6B7280] whitespace-nowrap"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>}

          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
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