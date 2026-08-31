# MEDSTAFF Admin — Mobile Interface Design Plan

## Product Direction

MEDSTAFF Admin is a portrait-first internal operations tool for HRD and clinic leadership at Klinik Pratama Unimus. The experience should feel like a calm, first-party iOS utility: clear hierarchy, generous tap targets, restrained motion, and fast access to operational signals. The primary use case is one-handed review and approval while moving through the clinic.

## Screen List

| Screen | Primary content and functionality |
|---|---|
| Dashboard | Welcome context, today's date, workforce summary, today's shifts, today's activity, pending approvals, and recent activity. Summary cards and rows are tappable shortcuts. |
| Employee list | Search by name or employee ID, filter by status, employee cards, and an add-employee action. |
| Employee detail | Profile summary, personal data, employment data, additional data sections, and edit action. |
| Shift list | Active shift cards with time ranges and status, plus add-shift action. |
| Shift form | Create or edit shift name, start/end time, description, and active state. |
| Monthly schedule | Month selector, day strip, daily shift assignments, and a quick assignment action. |
| Attendance monitoring | Date selector, attendance summary, status filters, and employee attendance rows. |
| Activities | Activity cards with date, time, location, participant scope, attendance ratio, and create action. |
| Activity form | Activity name, date, time, location, participant scope, description, and save action. |
| Activity detail | Activity metadata, description, attendance summary, view-attendance action, edit, and cancel action. |
| Activity attendance | Participant totals, attendance status filters, and participant rows. |
| Approvals | Filterable pending approval queue for leave, permission, profile changes, and document changes. |
| Approval detail | Request information, attachment row, admin note field, approve/reject actions, and status feedback. |
| Announcements | Published and draft announcement cards, search/filter, and create action. |
| Announcement form | Title, audience, message, publish timing, and save/publish actions. |
| Notifications | Notification feed with unread state and mark-all-read action. |
| Profile | Admin identity, clinic information, contact details, and profile edit action. |
| Settings | Notification preferences, appearance, security, and about rows. |

## Navigation Model

The app uses a compact bottom tab bar for **Dashboard**, **Operasional**, and **Profil**, with a slide-over operational menu for the full admin navigation. The dashboard remains the default landing screen. Secondary detail and form screens use a native-style back affordance and preserve the originating context.

## Key User Flows

### Review the day

1. Admin opens Dashboard.
2. Admin scans the four workforce summary cards.
3. Admin taps a summary card to open Attendance Monitoring with the matching filter.
4. Admin reviews the attendance rows and returns to Dashboard.

### Inspect an employee

1. Admin opens the operational menu and selects Manajemen Pegawai.
2. Admin searches or filters the employee list.
3. Admin taps an employee card.
4. Employee Detail presents the employee record and additional data sections.
5. Admin taps Edit Pegawai to open the editable form state.

### Manage a shift

1. Admin selects Kelola Shift.
2. Admin reviews the active shift cards.
3. Admin taps a shift to open its form or taps Tambah Shift.
4. Admin edits shift metadata and status.
5. Admin taps Simpan Shift and receives a success confirmation before returning to the list.

### Approve leave

1. Admin taps a pending approval count on Dashboard or opens Persetujuan.
2. Admin filters the queue if needed.
3. Admin opens a request to inspect dates, reason, and attachment.
4. Admin optionally enters a note.
5. Admin taps Setujui or Tolak and receives visible status feedback.

### Create an activity

1. Admin opens Kegiatan and taps Buat Kegiatan.
2. Admin enters activity metadata and chooses Semua Staff or Staff Terpilih.
3. If Staff Terpilih is selected, the participant picker opens with search and select-all behavior.
4. Admin saves the activity and returns to the activity list.
5. Admin can open the detail screen and then inspect attendance.

## Color Choices

The brand palette is designed around clinical trust and operational clarity rather than generic hospital blue. A deep midnight navy anchors navigation and headings; a bright teal carries primary actions; mint and amber communicate positive and attention states.

| Token | Color | Usage |
|---|---|---|
| Midnight | `#102A43` | Header text, navigation rail, high-emphasis labels |
| Teal | `#0F9D9A` | Primary actions, active navigation, key metrics |
| Aqua tint | `#DDF7F4` | Selected surfaces and positive background accents |
| Canvas | `#F4F8FA` | Main app background |
| Surface | `#FFFFFF` | Cards, sheets, and form fields |
| Ink | `#17324D` | Primary body text |
| Slate | `#6B7C8F` | Secondary text and metadata |
| Line | `#D9E5EA` | Borders and separators |
| Success | `#2BAE66` | Present, approved, and completed states |
| Warning | `#E7A83B` | Late, pending, and needs-attention states |
| Error | `#D95757` | Rejected, absent, and destructive states |

## Interaction and Accessibility Notes

All primary actions should use at least a 44pt touch target, visible pressed feedback, and concise confirmation copy. Status should be conveyed by text and icon as well as color. Forms use clear labels above inputs, predictable keyboard return behavior, and inline validation. Long content is scrollable while short operational lists use performant list primitives.
