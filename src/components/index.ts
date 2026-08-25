// Export all components here
// This file will be automatically updated as components are added

// Foundation
export { ScarletIcon } from './foundation/scarlet-icon/scarlet-icon';
export type { ScarletIconName } from './foundation/scarlet-icon/icons';
export { scarletIcons, scarletIconNames } from './foundation/scarlet-icon/icons';
export { ScarletHeading } from './foundation/scarlet-heading/scarlet-heading';
export type {
  ScarletHeadingLevel,
  ScarletHeadingVariant
} from './foundation/scarlet-heading/scarlet-heading';
export { ScarletText } from './foundation/scarlet-text/scarlet-text';
export type {
  ScarletTextAs,
  ScarletTextVariant,
  ScarletTextWeight
} from './foundation/scarlet-text/scarlet-text';
export { ScarletLink } from './foundation/scarlet-link/scarlet-link';
export type { ScarletLinkUnderline } from './foundation/scarlet-link/scarlet-link';

// Layout
export { ScarletStack } from './layout/scarlet-stack/scarlet-stack';
export { ScarletGrid } from './layout/scarlet-grid/scarlet-grid';
export { ScarletGridItem } from './layout/scarlet-grid-item/scarlet-grid-item';
export { ScarletContainer } from './layout/scarlet-container/scarlet-container';
export type { ScarletContainerMaxWidth } from './layout/scarlet-container/scarlet-container';
export { ScarletToolbar } from './layout/scarlet-toolbar/scarlet-toolbar';

// Actions
export { ScarletButton } from './actions/scarlet-button/scarlet-button';

// Form essentials
export { ScarletInput } from './form/scarlet-input/scarlet-input';
export type { ScarletInputType } from './form/scarlet-input/scarlet-input';
export { ScarletTextarea } from './form/scarlet-textarea/scarlet-textarea';
export type { ScarletTextareaResize } from './form/scarlet-textarea/scarlet-textarea';
export { ScarletSelect } from './form/scarlet-select/scarlet-select';
export type { ScarletSelectOption } from './form/scarlet-select/scarlet-select';
export { ScarletCombobox } from './form/scarlet-combobox/scarlet-combobox';
export type { ScarletComboboxOption } from './form/scarlet-combobox/scarlet-combobox';
export { ScarletCheckbox } from './form/scarlet-checkbox/scarlet-checkbox';
export { ScarletCheckboxGroup } from './form/scarlet-checkbox-group/scarlet-checkbox-group';
export { ScarletSwitch } from './form/scarlet-switch/scarlet-switch';
export { ScarletRadio } from './form/scarlet-radio/scarlet-radio';
export { ScarletRadioGroup } from './form/scarlet-radio-group/scarlet-radio-group';
export { ScarletFileUpload } from './form/scarlet-file-upload/scarlet-file-upload';
export { ScarletNumberInput } from './form/scarlet-number-input/scarlet-number-input';

// Masked/specialized inputs (pt-BR)
export { ScarletInputPhone } from './form-masked/scarlet-input-phone/scarlet-input-phone';
export { ScarletInputCep } from './form-masked/scarlet-input-cep/scarlet-input-cep';
export { ScarletInputDocument } from './form-masked/scarlet-input-document/scarlet-input-document';
export type { ScarletDocumentType } from './form-masked/scarlet-input-document/scarlet-input-document';
export { ScarletInputCurrency } from './form-masked/scarlet-input-currency/scarlet-input-currency';
export { ScarletInputPercentage } from './form-masked/scarlet-input-percentage/scarlet-input-percentage';
export { ScarletInputDate } from './form-masked/scarlet-input-date/scarlet-input-date';
export { ScarletDatePicker } from './form-masked/scarlet-date-picker/scarlet-date-picker';
export { ScarletDateRangePicker } from './form-masked/scarlet-date-range-picker/scarlet-date-range-picker';
export type { ScarletDateRangeChange } from './form-masked/scarlet-date-range-picker/scarlet-date-range-picker';
export { ScarletInputCreditCard } from './form-masked/scarlet-input-credit-card/scarlet-input-credit-card';
export type { CreditCardBrand } from '@/utils/validators';
export { ScarletInputLicensePlate } from './form-masked/scarlet-input-license-plate/scarlet-input-license-plate';
export type { ScarletLicensePlateFormat } from './form-masked/scarlet-input-license-plate/scarlet-input-license-plate';

// Feedback / overlays
export { ScarletAlert } from './feedback/scarlet-alert/scarlet-alert';
export type {
  ScarletAlertStatus,
  ScarletAlertVariant
} from './feedback/scarlet-alert/scarlet-alert';
export { ScarletBadge } from './feedback/scarlet-badge/scarlet-badge';
export type { ScarletBadgeVariant, ScarletBadgeSize } from './feedback/scarlet-badge/scarlet-badge';
export { ScarletToast } from './feedback/scarlet-toast/scarlet-toast';
export type { ScarletToastPosition } from './feedback/scarlet-toast/scarlet-toast';
export { ScarletTooltip } from './feedback/scarlet-tooltip/scarlet-tooltip';
export type { ScarletTooltipPlacement } from './feedback/scarlet-tooltip/scarlet-tooltip';
export { ScarletModal } from './feedback/scarlet-modal/scarlet-modal';
export type { ScarletModalSize } from './feedback/scarlet-modal/scarlet-modal';
export { ScarletDrawer } from './feedback/scarlet-drawer/scarlet-drawer';
export type {
  ScarletDrawerPlacement,
  ScarletDrawerSize
} from './feedback/scarlet-drawer/scarlet-drawer';
export { ScarletSkeleton } from './feedback/scarlet-skeleton/scarlet-skeleton';
export type { ScarletSkeletonVariant } from './feedback/scarlet-skeleton/scarlet-skeleton';
export { ScarletSpinner } from './feedback/scarlet-spinner/scarlet-spinner';
export type {
  ScarletSpinnerVariant,
  ScarletSpinnerSize
} from './feedback/scarlet-spinner/scarlet-spinner';
export { ScarletProgress } from './feedback/scarlet-progress/scarlet-progress';
export type { ScarletProgressSize } from './feedback/scarlet-progress/scarlet-progress';
export { ScarletPopover } from './feedback/scarlet-popover/scarlet-popover';
export type {
  ScarletPopoverPlacement,
  ScarletPopoverTriggerMode
} from './feedback/scarlet-popover/scarlet-popover';

// Navigation
export { ScarletTabs } from './navigation/scarlet-tabs/scarlet-tabs';
export type { ScarletTabItem } from './navigation/scarlet-tabs/scarlet-tabs';
export { ScarletBreadcrumb } from './navigation/scarlet-breadcrumb/scarlet-breadcrumb';
export type { ScarletBreadcrumbItem } from './navigation/scarlet-breadcrumb/scarlet-breadcrumb';
export { ScarletMenu } from './navigation/scarlet-menu/scarlet-menu';
export type { ScarletMenuItem } from './navigation/scarlet-menu/scarlet-menu';
export { ScarletPagination } from './navigation/scarlet-pagination/scarlet-pagination';
export { ScarletAccordion } from './navigation/scarlet-accordion/scarlet-accordion';
export type { ScarletAccordionItem } from './navigation/scarlet-accordion/scarlet-accordion';

// Data display
export { ScarletCard } from './data-display/scarlet-card/scarlet-card';
export type { ScarletCardVariant } from './data-display/scarlet-card/scarlet-card';
export { ScarletTable } from './data-display/scarlet-table/scarlet-table';
export type {
  ScarletTableColumn,
  ScarletTableRow,
  ScarletTableSortDirection,
  ScarletTableSortChange
} from './data-display/scarlet-table/scarlet-table';
export { ScarletAvatar } from './data-display/scarlet-avatar/scarlet-avatar';
export type { ScarletAvatarShape } from './data-display/scarlet-avatar/scarlet-avatar';
export { ScarletAvatarGroup } from './data-display/scarlet-avatar-group/scarlet-avatar-group';
export { ScarletChip } from './data-display/scarlet-chip/scarlet-chip';
export type { ScarletChipVariant } from './data-display/scarlet-chip/scarlet-chip';
export { ScarletDivider } from './data-display/scarlet-divider/scarlet-divider';
export type { ScarletDividerOrientation } from './data-display/scarlet-divider/scarlet-divider';
export { ScarletEmptyState } from './data-display/scarlet-empty-state/scarlet-empty-state';
export { ScarletStat } from './data-display/scarlet-stat/scarlet-stat';
export type { ScarletStatTrend } from './data-display/scarlet-stat/scarlet-stat';
export { ScarletTimeline } from './data-display/scarlet-timeline/scarlet-timeline';
export type {
  ScarletTimelineItem,
  ScarletTimelineStatus
} from './data-display/scarlet-timeline/scarlet-timeline';
