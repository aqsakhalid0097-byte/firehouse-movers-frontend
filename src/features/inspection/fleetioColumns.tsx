import type { ColumnDef } from './FleetioTablePage';
import type {
  FleetioVehicleItem,
  FleetioAssignmentItem,
  FleetioServiceEntryItem,
  FleetioWorkOrderItem,
  FleetioServiceReminderItem,
  FleetioServiceTaskItem,
  FleetioFuelEntryItem,
  FleetioMeterEntryItem,
  FleetioExpenseEntryItem,
  FleetioIssueItem,
  FleetioPriorityItem,
  FleetioPartItem,
  FleetioPurchaseOrderItem,
  FleetioInspectionScheduleItem,
  FleetioSubmittedFormItem,
  FleetioVendorItem,
  FleetioContactItem,
} from './fleetioData';

export const vehicleColumns: ColumnDef<FleetioVehicleItem>[] = [
  { header: 'Name', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Operator', accessorKey: 'operator_name' },
  { header: 'Year', accessorKey: 'year' },
  { header: 'Make', accessorKey: 'make' },
  { header: 'Model', accessorKey: 'model' },
  {
    header: 'Status',
    cell: (row) => {
      const s = row.vehicle_status_name || 'Active';
      const bg =
        s === 'Active' || s === 'In Service Truck'
          ? 'bg-green-600 text-white'
          : s === 'Assigned Trailer'
          ? 'bg-blue-600 text-white'
          : s === 'Inactive'
          ? 'bg-gray-600 text-white'
          : 'bg-yellow-600 text-white';
      return <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${bg}`}>{s}</span>;
    },
  },
  { header: 'Type', accessorKey: 'vehicle_type_name' },
  { header: 'Group', accessorKey: 'group_name' },
  {
    header: 'Current Meter',
    cell: (row) => (row.primary_meter_value && row.primary_meter_value !== '-' ? `${row.primary_meter_value} ${row.primary_meter_unit || 'mi'}` : '-'),
  },
  { header: 'License Plate', accessorKey: 'license_plate' },
  { header: 'VIN', accessorKey: 'vin', className: 'font-mono text-xs text-gray-300' },
  { header: 'Issues', accessorKey: 'issues_count' },
  { header: 'Service Entries', accessorKey: 'service_entries_count' },
];

export const assignmentColumns: ColumnDef<FleetioAssignmentItem>[] = [
  {
    header: 'Vehicle',
    cell: (row) => (
      <div>
        <div className="font-medium text-white">{row.vehicle_name || 'Vehicle'}</div>
        <div className="text-xs text-gray-400 mt-0.5">{row.vehicle_type || ''}</div>
      </div>
    ),
  },
  { header: 'Contact', accessorKey: 'contact_name' },
  {
    header: 'Status',
    cell: (row) => <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-600 text-white">{row.status || 'Active'}</span>,
  },
  { header: 'Started', accessorKey: 'started_at' },
  { header: 'Ended', accessorKey: 'ended_at' },
  { header: 'Start Meter', accessorKey: 'start_meter' },
  { header: 'End Meter', accessorKey: 'end_meter' },
  { header: 'License Plate', accessorKey: 'license_plate' },
  { header: 'Group', accessorKey: 'group_name' },
  { header: 'Comments', accessorKey: 'comments', className: 'text-xs text-gray-400' },
];

export const serviceEntryColumns: ColumnDef<FleetioServiceEntryItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Reference', accessorKey: 'display_reference', className: 'font-mono text-xs text-red-400' },
  { header: 'Date', accessorKey: 'display_date' },
  { header: 'Vehicle', accessorKey: 'display_vehicle_name', className: 'font-medium text-white' },
  { header: 'Vendor', accessorKey: 'display_vendor_name' },
  {
    header: 'Status',
    cell: (row) => {
      const s = (row.display_status || '').toLowerCase();
      const bg =
        s === 'completed'
          ? 'bg-green-600 text-white'
          : s === 'in progress'
          ? 'bg-blue-600 text-white'
          : s === 'pending'
          ? 'bg-yellow-600 text-white'
          : 'bg-red-600 text-white';
      return <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${bg}`}>{row.display_status || 'Completed'}</span>;
    },
  },
  { header: 'Total Cost', cell: (row) => `$${row.display_total_cost || '0.00'}` },
  { header: 'Meter Value', accessorKey: 'display_meter_value' },
];

export const workOrderColumns: ColumnDef<FleetioWorkOrderItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Number', accessorKey: 'number', className: 'font-mono text-xs text-red-400' },
  {
    header: 'Status',
    cell: (row) => {
      const s = (row.status || '').toLowerCase();
      const bg = s === 'completed' ? 'bg-green-600 text-white' : s === 'in progress' ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white';
      return <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${bg}`}>{row.status || 'Pending'}</span>;
    },
  },
  {
    header: 'Priority',
    cell: (row) => {
      const p = (row.priority || '').toLowerCase();
      const bg =
        p === 'urgent'
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : p === 'high'
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      return <span className={`px-2 py-0.5 text-xs rounded font-medium ${bg}`}>{row.priority || 'Normal'}</span>;
    },
  },
  { header: 'Vehicle', accessorKey: 'vehicle_name', className: 'font-medium text-white' },
  { header: 'Scheduled Start', accessorKey: 'scheduled_start' },
  { header: 'Total Cost', cell: (row) => `$${row.total_cost || '0.00'}` },
];

export const serviceReminderColumns: ColumnDef<FleetioServiceReminderItem>[] = [
  { header: 'Vehicle', accessorKey: 'vehicle_name', className: 'font-medium text-white' },
  { header: 'Service Task', accessorKey: 'service_task' },
  {
    header: 'Status',
    cell: (row) => {
      const s = (row.status || '').toLowerCase();
      const bg = s === 'overdue' ? 'bg-red-600 text-white' : s === 'due soon' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white';
      return <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${bg}`}>{row.status || 'OK'}</span>;
    },
  },
  { header: 'Due Date', accessorKey: 'due_date' },
  { header: 'Due Meter', accessorKey: 'due_meter' },
  {
    header: 'Overdue',
    cell: (row) => <span className={row.overdue && row.overdue !== 'No' ? 'text-red-400 font-medium' : 'text-gray-400'}>{row.overdue || 'No'}</span>,
  },
];

export const serviceTaskColumns: ColumnDef<FleetioServiceTaskItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Task Name', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Description', accessorKey: 'description', className: 'text-xs text-gray-300' },
  { header: 'Category', accessorKey: 'category' },
  { header: 'Subcategory', accessorKey: 'subcategory' },
];

export const fuelEntryColumns: ColumnDef<FleetioFuelEntryItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Date', accessorKey: 'date' },
  { header: 'Vehicle', accessorKey: 'vehicle_name', className: 'font-medium text-white' },
  { header: 'Fuel Type', accessorKey: 'fuel_type' },
  { header: 'Gallons', accessorKey: 'gallons' },
  { header: 'Price / Gal', accessorKey: 'price_per_gallon' },
  { header: 'Total Cost', accessorKey: 'total_cost', className: 'font-medium text-emerald-400' },
  { header: 'Meter Value', accessorKey: 'meter_value' },
  { header: 'Fuel Card', accessorKey: 'fuel_card', className: 'text-xs text-gray-400' },
];

export const meterEntryColumns: ColumnDef<FleetioMeterEntryItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Date', accessorKey: 'date' },
  { header: 'Vehicle', accessorKey: 'vehicle_name', className: 'font-medium text-white' },
  { header: 'Meter Value', accessorKey: 'meter_value', className: 'font-mono text-sm font-semibold text-white' },
  { header: 'Meter Type', accessorKey: 'meter_type' },
  { header: 'Void', accessorKey: 'void' },
];

export const expenseEntryColumns: ColumnDef<FleetioExpenseEntryItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Date', accessorKey: 'date' },
  { header: 'Vehicle', accessorKey: 'vehicle_name', className: 'font-medium text-white' },
  { header: 'Expense Type', accessorKey: 'expense_type' },
  { header: 'Vendor', accessorKey: 'vendor' },
  { header: 'Amount', accessorKey: 'amount', className: 'font-medium text-white' },
  { header: 'Notes', accessorKey: 'notes', className: 'text-xs text-gray-400' },
];

export const issueColumns: ColumnDef<FleetioIssueItem>[] = [
  {
    header: 'Priority',
    cell: (row) => {
      const p = (row.priority || '').toLowerCase();
      const bg =
        p === 'critical'
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : p === 'high'
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : p === 'medium'
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${bg}`}>{row.priority || 'Normal'}</span>;
    },
  },
  { header: 'Name', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Type', accessorKey: 'type' },
  { header: 'Summary', accessorKey: 'summary', className: 'text-xs text-gray-300' },
  {
    header: 'Issue Status',
    cell: (row) => {
      const s = (row.issue_status || '').toLowerCase();
      const bg = s === 'resolved' ? 'bg-green-600 text-white' : s === 'in progress' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white';
      return <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${bg}`}>{row.issue_status || 'Open'}</span>;
    },
  },
  { header: 'Source', accessorKey: 'source' },
  { header: 'Reported', accessorKey: 'reported' },
  { header: 'Assigned To', accessorKey: 'assigned_to' },
];

export const priorityColumns: ColumnDef<FleetioPriorityItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Level', accessorKey: 'level' },
  { header: 'Color Indicator', accessorKey: 'color' },
  { header: 'Description', accessorKey: 'description', className: 'text-xs text-gray-300' },
];

export const partColumns: ColumnDef<FleetioPartItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Part Number', accessorKey: 'part_number', className: 'font-mono text-xs text-red-400' },
  { header: 'Description', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Category', accessorKey: 'category' },
  {
    header: 'Quantity On Hand',
    cell: (row) => <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#262626] border border-gray-700">{row.quantity_on_hand ?? 0} in stock</span>,
  },
  { header: 'Unit Cost', accessorKey: 'unit_cost' },
  { header: 'Location', accessorKey: 'location', className: 'text-xs text-gray-400' },
];

export const purchaseOrderColumns: ColumnDef<FleetioPurchaseOrderItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'PO Number', accessorKey: 'po_number', className: 'font-mono text-xs text-red-400' },
  {
    header: 'Status',
    cell: (row) => <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
      row.status === 'Received' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
    }`}>{row.status || 'Pending'}</span>,
  },
  { header: 'Vendor', accessorKey: 'vendor_name', className: 'font-medium text-white' },
  { header: 'Order Date', accessorKey: 'order_date' },
  { header: 'Total Cost', accessorKey: 'total_cost', className: 'font-medium text-emerald-400' },
  { header: 'Items Count', accessorKey: 'items_count' },
];

export const scheduleColumns: ColumnDef<FleetioInspectionScheduleItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Title', accessorKey: 'title', className: 'font-medium text-white' },
  { header: 'Frequency', accessorKey: 'frequency' },
  { header: 'Vehicle Group', accessorKey: 'vehicle_group' },
  { header: 'Next Due', accessorKey: 'next_due' },
  {
    header: 'Status',
    cell: (row) => <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-600 text-white">{row.status || 'Active'}</span>,
  },
];

export const submittedFormColumns: ColumnDef<FleetioSubmittedFormItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Form Name', accessorKey: 'form_name', className: 'font-medium text-white' },
  { header: 'Vehicle', accessorKey: 'vehicle_name' },
  { header: 'Submitted At', accessorKey: 'submitted_at' },
  { header: 'Inspector', accessorKey: 'inspector_name' },
  {
    header: 'Result / Status',
    cell: (row) => <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
      row.result_status === 'Passed' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>{row.result_status || 'Pending'}</span>,
  },
  {
    header: 'Defects Found',
    cell: (row) => <span className={(row.defects_found || 0) > 0 ? 'text-red-400 font-semibold' : 'text-gray-400'}>{row.defects_found ?? 0}</span>,
  },
];

export const vendorColumns: ColumnDef<FleetioVendorItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Category', accessorKey: 'category' },
  { header: 'Phone', accessorKey: 'phone' },
  { header: 'Email', accessorKey: 'email', className: 'text-xs text-blue-400' },
  { header: 'Address', accessorKey: 'address', className: 'text-xs text-gray-400' },
  {
    header: 'Status',
    cell: (row) => <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-600 text-white">{row.status || 'Active'}</span>,
  },
];

export const contactColumns: ColumnDef<FleetioContactItem>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'name', className: 'font-medium text-white' },
  { header: 'Job Title', accessorKey: 'job_title' },
  { header: 'Group', accessorKey: 'group_name' },
  { header: 'Phone', accessorKey: 'phone' },
  { header: 'Email', accessorKey: 'email', className: 'text-xs text-blue-400' },
  {
    header: 'Status',
    cell: (row) => <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-600 text-white">{row.status || 'Active'}</span>,
  },
];
