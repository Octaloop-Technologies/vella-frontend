import React from "react";
import {
  BadgeProps,
  ProgressBarProps,
  IconProps,
  TableType,
  TableProps,
  ColumnConfig,
} from "@/types/table";
import { AgentIcon } from "@/components/icons";
import Card from "@/components/shared/Card";
import CopyIcon from "@/components/icons/CopyIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import FileEditIcon from "@/components/icons/FileEditIcon";
import PauseIcon from "@/components/icons/PauseIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import DownloadIcon from "@/components/icons/DownloadIcon";
import Badge from "@/components/shared/Badge";
import { Dropdown, DropdownItem, DotsIcon } from "@/components/shared/Dropdown";
import Image from "next/image";

// Progress Bar Component
const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  className = "",
}) => {
  return (
    <div className="w-full bg-[#F3F4F6] rounded-[10px] h-3 overflow-hidden">
      <div
        className="bg-gradient-to-b from-[#8266D4] to-[#41288A] h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const StarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#25A83D">
    <path d="M8 0L10.163 5.26604L16 6.11567L12 10.2124L12.944 16L8 13.266L3.056 16L4 10.2124L0 6.11567L5.837 5.26604L8 0Z" />
  </svg>
);

// Column Configuration based on table type
const getColumnConfig = <T extends Record<string, unknown>>(
  type: TableType
): ColumnConfig<T>[] => {
  switch (type) {
    case "workflows":
      return [
        {
          key: "name",
          header: "Workflow Name",
          render: (row: Record<string, unknown>) => (
            <span className="text-sm font-medium text-black">{String(row.name)}</span>
          )
        },
        {
          key: 'linkedAgent',
          header: 'Linked Agent',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.linkedAgent)}</span>
        },
        {
          key: "status",
          header: "Status",
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.statusVariant) as BadgeProps["variant"]}>
              {String(row.status)}
            </Badge>
          ),
        },
        {
          key: 'nodes',
          header: 'Nodes',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.nodes)}</span>
        },
        {
          key: 'lastEdited',
          header: 'Last Edited',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.lastEdited)}</span>
        },
        {
          key: "actions",
          header: "Actions",
          render: (row: Record<string, unknown>) => (
            <Dropdown trigger={<DotsIcon />}>
              <DropdownItem
                icon={<FileEditIcon />}
                label="Edit Workflow"
                onClick={row.onEdit as () => void}
              />
              <DropdownItem
                icon={<EyeIcon />}
                label="View Details"
                onClick={row.onViewDetails as () => void}
              />
              <DropdownItem
                icon={<TrashIcon />}
                label="Delete Workflow"
                className="text-[#DC2626]"
                onClick={row.onDelete as () => void}
              />
            </Dropdown>
          ),
        },
      ];
    case "topAgents":
      return [
        {
          key: "agent",
          header: "",
          width: "60%",
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-3">
              <AgentIcon gradient={{ from: "#8266D4", to: "#41288A" }} />
              <div>
                <div className="text-sm font-semibold text-black mb-1.5">
                  {String(row.name)}
                </div>
                <div className="text-xs text-black">
                  {String(row.conversations)}
                </div>
              </div>
            </div>
          ),
        },
        {
          key: "progress",
          header: "",
          width: "20%",
          render: (row: Record<string, unknown>) => (
            <ProgressBar percentage={Number(row.progress)} />
          ),
        },
        {
          key: "success",
          header: "",
          width: "10%",
          render: (row: Record<string, unknown>) => (
            <div className="text-xs font-medium text-black">
              {String(row.success)}
            </div>
          ),
        },
        {
          key: "status",
          header: "",
          width: "10%",
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.statusVariant) as BadgeProps["variant"]}>
              {String(row.status)}
            </Badge>
          ),
        },
      ];
    case "agents":
      return [
        {
          key: "name",
          header: "Agent Name",
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-3">
              <div className="h-[18px] w-[18px] bg-gradient-to-b from-[#41288A] to-[#301971] rounded flex items-center justify-center">
                <AgentIcon className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-[#1F2937]">
                {String(row.name)}
              </span>
            </div>
          ),
        },
        {
          key: "agent_type",
          header: "Type",
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.typeVariant) as BadgeProps["variant"]}>
              {String(row.type)}
            </Badge>
          ),
        },
        {
          key: "status",
          header: "Status",
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.statusVariant) as BadgeProps["variant"]}>
              {String(row.status)}
            </Badge>
          ),
        },
        {
          key: "conversations",
          header: "Conversations",
          render: (row: Record<string, unknown>) => (
            <span className="text-xs text-black">
              {String(row.conversations)}
            </span>
          ),
        },
        {
          key: "successRate",
          header: "Success Rate",
          render: (row: Record<string, unknown>) => (
            <span className="text-xs text-black">
              {String(row.successRate)}
            </span>
          ),
        },
        {
          key: "lastActive",
          header: "Last Active",
          render: (row: Record<string, unknown>) => (
            <span className="text-xs text-black">{String(row.lastActive)}</span>
          ),
        },
        {
          key: "actions",
          header: "Actions",
          render: (row: Record<string, unknown>) => (
            <Dropdown trigger={<DotsIcon />}>
              {/* <DropdownItem icon={<FileEditIcon />} label="Edit Agent" /> */}
              {/* <DropdownItem icon={<CopyIcon />} label="Duplicate Agent" /> */}
              <DropdownItem
                icon={<EyeIcon />}
                label="View Details"
                onClick={row.onViewDetails as () => void}
              />
              {(row.type === 'Inbound' || row.type === 'inbound') && (row.status === 'Draft' || row.status === 'Inactive') && (
                <DropdownItem 
                  icon={<PlayIcon />} 
                  label="Activate Agent"
                  onClick={row.onActivate as () => void}
                />
              )}
              {(row.type === 'Inbound' || row.type === 'inbound') && row.status === 'Active' && (
                <DropdownItem 
                  icon={<PauseIcon />} 
                  label="Deactivate Agent"
                  onClick={row.onDeactivate as () => void}
                />
              )}
              {
                (row.type === 'Inbound' || row.type === 'Outbound') && 
                   <DropdownItem
                icon={<AgentIcon className="w-4 h-4 text-[#1F2937]" />}
                label="Test Agent"
                onClick={row.onTestAgent as () => void}
              />
              }
           
              {row.type === 'Widget' && (
                <DropdownItem
                  icon={
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  }
                  label="Preview Widget"
                  onClick={row.onPreviewWidget as () => void}
                />
              )}
              {(row.type === 'Outbound') && (
                <DropdownItem 
                  icon={
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  }
                  label="Make a Call"
                  onClick={row.onMakeCall as () => void}
                />
              )}

              <DropdownItem
                icon={<TrashIcon />}
                label="Delete Agent"
                className="text-[#DC2626]"
                onClick={row.onDelete as () => void}
              />
            </Dropdown>
          ),
        },
      ];
    case "conversations":
      return [
        {
          key: "customer",
          header: "Customer",
          render: (row: Record<string, unknown>) => (
            <div>
              <div className="text-sm font-medium mb-0.5 text-black">{String(row.customerName)}</div>
              <div className="text-xs text-black">{String(row.customerEmail)}</div>
            </div>
          ),
        },
        {
          key: 'agent',
          header: 'Agent',
          render: (row: Record<string, unknown>) => <span className="text-sm font-medium text-black">{String(row.agent)}</span>
        },
        {
          key: 'channel',
          header: 'Channel',
          render: (row: Record<string, unknown>) => <span className="text-sm font-medium text-black">{String(row.channel)}</span>
        },
        {
          key: 'duration',
          header: 'Duration',
          render: (row: Record<string, unknown>) => <span className="text-sm font-medium text-black">{String(row.duration)}</span>
        },
        {
          key: "status",
          header: "Status",
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.statusVariant) as BadgeProps["variant"]}>
              {String(row.status)}
            </Badge>
          ),
        },
        {
          key: "satisfaction",
          header: "Satisfaction",
          render: (row: Record<string, unknown>) => (
            <div className="flex items-center gap-1">
                <StarIcon />
              <span className="text-sm font-medium text-black">{String(row.rating)}</span>
            </div>
          ),
        },
        {
          key: "date",
          header: "Date",
          render: (row: Record<string, unknown>) => (
            <div>
              <div className="text-sm font-medium mb-0.5 text-black">{String(row.date)}</div>
              <div className="text-xs text-black">{String(row.time)}</div>
            </div>
          ),
        },
        {
          key: "actions",
          header: "Actions",
          render: (row: Record<string, unknown>) => (
            <button
              onClick={row.onViewDetails as () => void}
              className="bg-[#007BFF1A] p-3 rounded-[10px] cursor-pointer"
            >
              <Image
                src="/svgs/eye.svg"
                alt="View Details"
                width={24}
                height={24}
              />
            </button>
          ),
        },
      ];
    case "documents":
      return [
        {
          key: 'name',
          header: 'Document Name',
          render: (row: Record<string, unknown>) => <span className="text-sm font-medium text-black">{String(row.name)}</span>
        },
        {
          key: 'type',
          header: 'Type',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.type)}</span>
        },
        {
          key: "status",
          header: "Status",
          render: (row: Record<string, unknown>) => (
            <Badge variant={String(row.statusVariant) as BadgeProps["variant"]}>
              {String(row.status)}
            </Badge>
          ),
        },
        {
          key: 'size',
          header: 'Size',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.size)}</span>
        },
        {
          key: 'lastUpdated',
          header: 'Last Updated',
          render: (row: Record<string, unknown>) => <span className="text-xs text-black">{String(row.lastUpdated)}</span>
        },
        {
          key: "actions",
          header: "Actions",
          render: () => (
            <Dropdown trigger={<DotsIcon />}>
              <DropdownItem icon={<EyeIcon />} label="View Details" />
              <DropdownItem icon={<DownloadIcon />} label="Download" />
              <DropdownItem
                icon={<TrashIcon />}
                label="Delete Document"
                className="text-[#DC2626]"
              />
            </Dropdown>
          ),
        },
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
  className = "",
}: TableProps<T>): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [view, setView] = React.useState<"list" | "grid">("list");
  const columns = getColumnConfig(type);
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);
  console.log("data", data);
  console.log("filteredData", filteredData);
  console.log("searchTerm", searchTerm);
  return (
    <Card className={`${className}`}>
      {(title || showSearch || viewToggle) && (
        <div className="p-6">
          <div className="flex items-center justify-between">
            {title && (
              <h2 className="text-lg font-medium text-black">{title}</h2>
            )}
            <div className="flex items-center gap-4">
              {showSearch && (
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"
                    />
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
                    onClick={() => setView("list")}
                    className={`p-2 rounded-lg border ${
                      view === "list"
                        ? "border-[#8B5CF6] bg-[#F5F3FF]"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill={view === "list" ? "#8B5CF6" : "#9CA3AF"}
                    >
                      <path
                        d="M3 4h14M3 10h14M3 16h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-lg border ${
                      view === "grid"
                        ? "border-[#8B5CF6] bg-[#F5F3FF]"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill={view === "grid" ? "#8B5CF6" : "#9CA3AF"}
                    >
                      <rect
                        x="3"
                        y="3"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="11"
                        y="3"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="3"
                        y="11"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="11"
                        y="11"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
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
          {type !== "topAgents" && (
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-sm font-medium text-[#6B7280] whitespace-nowrap ${
                      type === "conversations"
                        ? "border-b border-[#0000001A]"
                        : ""
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[#0000001A] last:border-b-0 hover:bg-[#F9FAFB] transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4"
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key])}
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
