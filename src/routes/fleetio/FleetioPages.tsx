'use client';

import React from 'react';
import { FleetioTablePage } from '../../features/inspection/FleetioTablePage';
import {
  vehicleColumns,
  assignmentColumns,
  serviceEntryColumns,
  workOrderColumns,
  serviceReminderColumns,
  serviceTaskColumns,
  fuelEntryColumns,
  meterEntryColumns,
  expenseEntryColumns,
  issueColumns,
  priorityColumns,
  partColumns,
  purchaseOrderColumns,
  scheduleColumns,
  submittedFormColumns,
  vendorColumns,
  contactColumns,
} from '../../features/inspection/fleetioColumns';
import {
  useFleetioVehiclesQuery,
  useFleetioAssignmentsQuery,
  useFleetioServiceEntriesQuery,
  useFleetioWorkOrdersQuery,
  useFleetioServiceRemindersQuery,
  useFleetioServiceTasksQuery,
  useFleetioFuelEntriesQuery,
  useFleetioMeterEntriesQuery,
  useFleetioExpenseEntriesQuery,
  useFleetioIssuesQuery,
  useFleetioPrioritiesQuery,
  useFleetioPartsQuery,
  useFleetioPurchaseOrdersQuery,
  useFleetioSchedulesQuery,
  useFleetioSubmittedFormsQuery,
  useFleetioVendorsQuery,
  useFleetioContactsQuery,
} from '../../api/inspectionApi';

export const FleetioVehiclesPage: React.FC = () => (
  <FleetioTablePage title="Vehicles" columns={vehicleColumns} useQueryHook={useFleetioVehiclesQuery} searchPlaceholder="Search vehicles by name, VIN, plate..." />
);

export const FleetioVehicleAssignmentsPage: React.FC = () => (
  <FleetioTablePage title="Vehicle Assignments" columns={assignmentColumns} useQueryHook={useFleetioAssignmentsQuery} searchPlaceholder="Search assignments..." />
);

export const FleetioServiceEntriesPage: React.FC = () => (
  <FleetioTablePage title="Service Entries" columns={serviceEntryColumns} useQueryHook={useFleetioServiceEntriesQuery} searchPlaceholder="Search service entries..." />
);

export const FleetioWorkOrdersPage: React.FC = () => (
  <FleetioTablePage title="Work Orders" columns={workOrderColumns} useQueryHook={useFleetioWorkOrdersQuery} searchPlaceholder="Search work orders..." />
);

export const FleetioServiceRemindersPage: React.FC = () => (
  <FleetioTablePage title="Service Reminders" columns={serviceReminderColumns} useQueryHook={useFleetioServiceRemindersQuery} searchPlaceholder="Search reminders..." />
);

export const FleetioServiceTasksPage: React.FC = () => (
  <FleetioTablePage title="Service Tasks" columns={serviceTaskColumns} useQueryHook={useFleetioServiceTasksQuery} searchPlaceholder="Search tasks..." />
);

export const FleetioFuelEntriesPage: React.FC = () => (
  <FleetioTablePage title="Fuel Entries" columns={fuelEntryColumns} useQueryHook={useFleetioFuelEntriesQuery} searchPlaceholder="Search fuel entries..." />
);

export const FleetioMeterEntriesPage: React.FC = () => (
  <FleetioTablePage title="Meter Entries" columns={meterEntryColumns} useQueryHook={useFleetioMeterEntriesQuery} searchPlaceholder="Search meter logs..." />
);

export const FleetioExpenseEntriesPage: React.FC = () => (
  <FleetioTablePage title="Expense Entries" columns={expenseEntryColumns} useQueryHook={useFleetioExpenseEntriesQuery} searchPlaceholder="Search expenses..." />
);

export const FleetioIssuesPage: React.FC = () => (
  <FleetioTablePage title="Issues" columns={issueColumns} useQueryHook={useFleetioIssuesQuery} searchPlaceholder="Search issues by summary..." />
);

export const FleetioIssuePrioritiesPage: React.FC = () => (
  <FleetioTablePage title="Issue Priorities" columns={priorityColumns} useQueryHook={useFleetioPrioritiesQuery} searchPlaceholder="Search priority levels..." />
);

export const FleetioPartsPage: React.FC = () => (
  <FleetioTablePage title="Parts" columns={partColumns} useQueryHook={useFleetioPartsQuery} searchPlaceholder="Search parts by number or name..." />
);

export const FleetioPurchaseOrdersPage: React.FC = () => (
  <FleetioTablePage title="Purchase Orders" columns={purchaseOrderColumns} useQueryHook={useFleetioPurchaseOrdersQuery} searchPlaceholder="Search POs..." />
);

export const FleetioInspectionSchedulesPage: React.FC = () => (
  <FleetioTablePage title="Inspection Schedules" columns={scheduleColumns} useQueryHook={useFleetioSchedulesQuery} searchPlaceholder="Search schedules..." />
);

export const FleetioSubmittedFormsPage: React.FC = () => (
  <FleetioTablePage title="Submitted Forms" columns={submittedFormColumns} useQueryHook={useFleetioSubmittedFormsQuery} searchPlaceholder="Search submitted forms..." />
);

export const FleetioVendorsPage: React.FC = () => (
  <FleetioTablePage title="Vendors" columns={vendorColumns} useQueryHook={useFleetioVendorsQuery} searchPlaceholder="Search vendors..." />
);

export const FleetioContactsPage: React.FC = () => (
  <FleetioTablePage title="Contacts" columns={contactColumns} useQueryHook={useFleetioContactsQuery} searchPlaceholder="Search contacts..." />
);
