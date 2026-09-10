import {
  getAdminLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getAdminDocumentRequests,
  reviewDocumentRequest,
} from "../src/api/api";
import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import {
  createAdminSchedule,
  createShift,
  createActivity,
  getActivities,
  getAdminActivityDetail,
  getAdminActivityAttendance,
  getAdminMonthSchedule,
  getAdminDashboard,
  getAdminScheduleEmployees,
  getShifts,
} from "../src/api/api";
import type { ComponentProps } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  navy: "#102A43",
  teal: "#0F9D9A",
  aqua: "#DDF7F4",
  canvas: "#F4F8FA",
  surface: "#FFFFFF",
  ink: "#17324D",
  slate: "#6B7C8F",
  line: "#D9E5EA",
  success: "#2BAE66",
  warning: "#E7A83B",
  error: "#D95757",
};

type IconName = ComponentProps<typeof MaterialIcons>["name"];
type Screen =
  | "login" | "dashboard" | "employees" | "employee-detail" | "employee-form" | "shifts" | "shift-form"
  | "schedule" | "schedule-form" | "attendance" | "attendance-detail" | "activities" | "activity-form"
  | "participants" | "activity-detail" | "activity-attendance" | "activity-attendance-detail" | "approvals"
  | "approval-detail" | "announcements" | "announcement-form" | "notifications" | "profile" | "profile-form"
  | "settings";

type Employee = { name: string; id: string; role: string; unit: string; status: "Aktif" | "Nonaktif"; email: string; phone: string };
type Shift = { id: string; name: string; start: string; end: string; description: string; active: boolean };
type ScheduleAssignment = { id: string; date: string; shiftId: string; employeeIds: string[] };
const normalizeScheduleDate = (value: string) => { const trimmed = value.trim(); const slash = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); if (slash) return `${slash[3]}-${slash[2].padStart(2, "0")}-${slash[1].padStart(2, "0")}`; return trimmed; };
type Activity = { id: string; title: string; date: string; time: string; place: string; people: string; description: string; ratio: string };
type Approval = { id: string; type: string; name: string; date: string; detail: string; reason: string; status: "Menunggu" | "Disetujui" | "Ditolak"; source: "leave" | "document"; requestId: string; attachment?: string | null; adminNote?: string | null; };
type Announcement = { id: string; title: string; audience: string; date: string; body: string; status: "Terbit" | "Draft" };

const initialEmployees: Employee[] = [];
const initialShifts: Shift[] = [];
const initialActivities: Activity[] = [];
const initialApprovals: Approval[] = [];
const initialAnnouncements: Announcement[] = [];

function Icon({ name, size = 20, color = C.slate }: { name: IconName; size?: number; color?: string }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}
async function pickProfilePhoto(onSelected: (uri: string) => void) {
  const selectFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (!result.canceled && result.assets[0]?.uri) onSelected(result.assets[0].uri);
  };
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert("Izin kamera diperlukan", "Izinkan akses kamera untuk mengambil foto profil.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (!result.canceled && result.assets[0]?.uri) onSelected(result.assets[0].uri);
  };
  Alert.alert("Ubah Foto Profil", "Pilih sumber foto", [
    { text: "Galeri", onPress: () => { void selectFromLibrary(); } },
    { text: "Kamera", onPress: () => { void takePhoto(); } },
    { text: "Batal", style: "cancel" },
  ]);
}
function Header({ title, back, onMenu, onNotify, onProfile }: { title: string; back?: () => void; onMenu?: () => void; onNotify?: () => void; onProfile?: () => void }) {
  return <View style={styles.header}><Pressable onPress={back ?? onMenu} style={styles.iconButton}><Icon name={back ? "arrow-back-ios" : "menu"} color={C.navy} /></Pressable><Text style={styles.headerTitle}>{title}</Text><View style={styles.headerActions}><Pressable onPress={onNotify ?? (() => Alert.alert("MEDSTAFF", "Semua data sudah diperbarui."))} style={styles.iconButton}><Icon name="notifications-none" color={C.navy} /></Pressable>{!back && <Pressable onPress={onProfile} style={styles.headerAvatar}><Text style={styles.headerAvatarText}>AD</Text></Pressable>}</View></View>;
}
function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) { return <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>{title}</Text>{action && <Pressable onPress={onAction}><Text style={styles.link}>{action}</Text></Pressable>}</View>; }
function Metric({ label, value, tone, icon, onPress }: { label: string; value: string; tone: string; icon: IconName; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.metricCard}><View style={[styles.metricIcon, { backgroundColor: tone + "18" }]}><Icon name={icon} size={18} color={tone} /></View><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricCaption}>Pegawai</Text></Pressable>; }
function Button({ label, icon = "arrow-forward", onPress, secondary = false }: { label: string; icon?: IconName; onPress: () => void; secondary?: boolean }) { return <Pressable onPress={onPress} style={[styles.primaryButton, secondary && styles.secondaryButton]}><Text style={[styles.primaryButtonText, secondary && styles.secondaryButtonText]}>{label}</Text><Icon name={icon} color={secondary ? C.teal : "#fff"} size={18} /></Pressable>; }
function Field({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (text: string) => void; placeholder?: string; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.slate} multiline={multiline} style={[styles.input, multiline && styles.textArea]} /></View>; }
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) { return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>; }

function Dashboard({ go, openMenu, employees }: { go: (s: Screen) => void; openMenu: () => void; employees: Employee[] }) {
  const quickAccess: [IconName, string, Screen][] = [["groups", "Staff", "employees"], ["calendar-month", "Jadwal", "schedule"], ["schedule", "Shift", "shifts"], ["event", "Kegiatan", "activities"], ["edit-calendar", "Leave", "approvals"], ["timer", "Overtime", "approvals"], ["campaign", "Announcement", "announcements"], ["assessment", "Report", "attendance"]];
  return <><Header title="MEDSTAFF" onMenu={openMenu} onNotify={() => go("notifications")} onProfile={() => go("profile")} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.hero}><View style={{ flex: 1 }}><Text style={styles.eyebrow}>HARI INI</Text><Text style={styles.greeting}>Selamat Datang, Admin</Text><Text style={styles.clinic}>Klinik Pratama Unimus</Text></View></View>
    <SectionTitle title="Ringkasan Kehadiran" /><View style={styles.summaryCard}><Metric label="Staff" value={String(employees.length)} tone={C.teal} icon="groups" onPress={() => go("employees")} /><Metric label="Hadir" value="0" tone={C.success} icon="check-circle-outline" onPress={() => go("attendance")} /><Metric label="Terlambat" value="0" tone={C.warning} icon="schedule" onPress={() => go("attendance")} /><Metric label="Tidak Hadir" value="0" tone={C.error} icon="person-off" onPress={() => go("attendance")} /></View>
    <SectionTitle title="Attendance Overview" action="View All" onAction={() => go("attendance")} /><View style={styles.overviewCard}><Text style={styles.overviewTitle}>Kehadiran Staff Hari Ini</Text><Text style={styles.overviewPercent}>Belum ada data</Text><View style={styles.overviewProgress}><View style={[styles.overviewProgressFill, { width: "0%" }]} /></View><View style={styles.overviewRows}><View><Text style={styles.overviewLabel}>Hadir</Text><Text style={styles.overviewValue}>0</Text></View><View><Text style={styles.overviewLabel}>Terlambat</Text><Text style={styles.overviewValue}>0</Text></View><View><Text style={styles.overviewLabel}>Tidak Hadir</Text><Text style={styles.overviewValue}>0</Text></View></View></View>
    <SectionTitle title="Quick Access" /><View style={styles.quickAccessGrid}>{quickAccess.map(([icon, label, target]) => <Pressable key={label} style={styles.quickAccessItem} onPress={() => go(target)}><View style={styles.quickAccessIcon}><Icon name={icon} size={22} color={C.teal} /></View><Text style={styles.quickAccessLabel}>{label}</Text></Pressable>)}</View>
    <SectionTitle title="Upcoming Activities" action="View All" onAction={() => go("activities")} /><View style={styles.upcomingCard}><View style={styles.emptyState}><Icon name="event-busy" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada kegiatan.</Text></View></View>
    <SectionTitle title="Recent Requests" action="View All" onAction={() => go("approvals")} /><View style={styles.requestsCard}><View style={styles.emptyState}><Icon name="inbox" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada pengajuan.</Text></View></View>
  </ScrollView></>;
}

function EmployeeList({ go, openEmployee, employees }: { go: (s: Screen) => void; openEmployee: (e: Employee) => void; employees: Employee[] }) {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("Semua");
  const filtered = useMemo(() => employees.filter(e => `${e.name} ${e.id}`.toLowerCase().includes(query.toLowerCase()) && (filter === "Semua" || e.status === filter)), [employees, query, filter]);
  return <ScreenList title="Manajemen Pegawai" back={() => go("dashboard")}><Text style={styles.pageIntro}>Kelola data pribadi, pekerjaan, dan status pegawai.</Text><View style={styles.searchBox}><Icon name="search" size={20} color={C.slate} /><TextInput placeholder="Cari nama / ID pegawai" placeholderTextColor={C.slate} value={query} onChangeText={setQuery} style={styles.searchInput} /></View><View style={styles.filterRow}><Chip label="Semua" active={filter === "Semua"} onPress={() => setFilter("Semua")} /><Chip label="Aktif" active={filter === "Aktif"} onPress={() => setFilter("Aktif")} /><Chip label="Nonaktif" active={filter === "Nonaktif"} onPress={() => setFilter("Nonaktif")} /></View>{filtered.length === 0 && <View style={styles.emptyState}><Icon name="groups" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada data pegawai.</Text></View>}{filtered.map(e => <Pressable key={e.id} style={styles.listCard} onPress={() => openEmployee(e)}><View style={styles.employeeAvatar}><Text style={styles.employeeAvatarText}>{e.name.split(" ").map(x => x[0]).join("").slice(0, 2)}</Text></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{e.name}</Text><Text style={styles.rowMeta}>{e.id}  ·  {e.role}</Text><View style={styles.statusLine}><View style={[styles.statusDot, { backgroundColor: e.status === "Aktif" ? C.success : C.slate }]} /><Text style={[styles.statusText, { color: e.status === "Aktif" ? C.success : C.slate }]}>{e.status}</Text></View></View><Icon name="chevron-right" size={20} color={C.slate} /></Pressable>)}</ScreenList>;
}

function EmployeeDetail({ employee, go }: { employee: Employee; go: (s: Screen) => void }) { return <ScreenList title="Detail Pegawai" back={() => go("employees")}><View style={styles.detailHero}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{employee.name.split(" ").map(x => x[0]).join("").slice(0, 2)}</Text></View><Text style={styles.profileName}>{employee.name}</Text><Text style={styles.rowMeta}>{employee.id}  ·  {employee.role}</Text><View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>Aktif</Text></View></View><DetailBlock title="Data Pribadi" rows={[["Nama", employee.name], ["Email", employee.email], ["Telepon", employee.phone], ["Tempat Lahir", "Semarang"], ["Tanggal Lahir", "12/04/1990"], ["Jenis Kelamin", "Laki-laki"], ["Alamat", "Semarang"]]} /><DetailBlock title="Data Pekerjaan" rows={[["Nomor Pegawai", employee.id], ["Jabatan", employee.role], ["Unit", employee.unit]]} /><View style={styles.card}><SectionTitle title="Data tambahan" />{[["school", "Pendidikan"], ["work-history", "Pengalaman"], ["contact-emergency", "Kontak Darurat"], ["description", "Dokumen"]].map(([icon, label]) => <Pressable key={label} style={styles.settingsRow} onPress={() => Alert.alert(label, `${label} ${employee.name} tersedia untuk ditinjau.`)}><Icon name={icon as IconName} color={C.teal} /><Text style={[styles.rowTitle, { flex: 1 }]}>{label}</Text><Icon name="chevron-right" color={C.slate} /></Pressable>)}</View></ScreenList>; }
function DetailBlock({ title, rows }: { title: string; rows: string[][] }) { return <View style={styles.card}><SectionTitle title={title} />{rows.map(([label, value]) => <View style={styles.detailRow} key={label}><Text style={styles.rowMeta}>{label}</Text><Text style={[styles.rowTitle, { flex: 1, textAlign: "right" }]}>{value}</Text></View>)}</View>; }

function ShiftList({ go, openShift, shifts }: { go: (s: Screen) => void; openShift: (shift?: Shift) => void; shifts: Shift[] }) {
  return (
    <ScreenList title="Kelola Shift" back={() => go("dashboard")}>
      <Text style={styles.pageIntro}>
        Atur pola kerja, jam layanan, dan status shift.
      </Text>

      {shifts.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="schedule" color={C.slate} size={28} />
          <Text style={styles.rowMeta}>
            Belum ada shift. Buat shift pertama untuk mulai menyusun jadwal.
          </Text>
        </View>
      ) : (
        shifts.map((s) => (
          <Pressable
            style={styles.listCard}
            key={s.id}
            onPress={() => openShift(s)}
          >
            <View style={styles.shiftBadge}>
              <Icon name="schedule" color={C.teal} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{s.name}</Text>
              <Text style={styles.rowMeta}>
                {s.start} - {s.end}
              </Text>
              <Text style={styles.statusText}>
                {s.active ? "Aktif" : "Nonaktif"}
              </Text>
            </View>

            <Icon name="chevron-right" size={20} color={C.slate} />
          </Pressable>
        ))
      )}

      <Button
        label="Tambah Shift"
        icon="add"
        onPress={() => openShift()}
      />
    </ScreenList>
  );
}
function ShiftForm({
  shift,
  go,
  onSave,
}: {
  shift?: Shift;
  go: (s: Screen) => void;
  onSave: (shift: Shift) => void;
}) {
  const [name, setName] = useState(shift?.name ?? "");
  const [start, setStart] = useState(shift?.start ?? "");
  const [end, setEnd] = useState(shift?.end ?? "");
  const [description, setDescription] = useState(shift?.description ?? "");
  const [active, setActive] = useState(shift?.active ?? true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || !start.trim() || !end.trim()) {
      Alert.alert(
        "Data belum lengkap",
        "Nama shift dan jam mulai/selesai wajib diisi.",
      );
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start.trim())) {
      Alert.alert("Jam tidak valid", "Jam mulai harus menggunakan format HH:mm.");
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(end.trim())) {
      Alert.alert("Jam tidak valid", "Jam selesai harus menggunakan format HH:mm.");
      return;
    }

    if (shift) {
      Alert.alert(
        "Edit shift belum tersedia",
        "Backend saat ini menyediakan pembuatan dan pengambilan shift. Edit shift belum memiliki endpoint.",
      );
      return;
    }

    try {
      setSaving(true);

      const response = await createShift({
        name: name.trim(),
        category: description.trim() || "Umum",
        startTime: start.trim(),
        endTime: end.trim(),
        crossesMidnight: false,
      });

      const data = response?.data;

      const createdShift: Shift = {
        id: data?.id ?? `S${Date.now()}`,
        name: data?.name ?? name.trim(),
        start: data?.startTime ?? start.trim(),
        end: data?.endTime ?? end.trim(),
        description: description.trim(),
        active: data?.isActive ?? active,
      };

      onSave(createdShift);

      Alert.alert("Berhasil", "Shift telah disimpan ke database.");
      go("shifts");
    } catch (error: any) {
      Alert.alert(
        "Gagal menyimpan shift",
        error?.message ?? "Terjadi kesalahan saat menyimpan shift.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenList
      title={shift ? "Edit Shift" : "Tambah Shift"}
      back={() => go("shifts")}
    >
      <Field
        label="Nama Shift"
        value={name}
        onChangeText={setName}
        placeholder="Contoh: Klinik Pagi"
      />

      <Field
        label="Jam Mulai"
        value={start}
        onChangeText={setStart}
        placeholder="07:00"
      />

      <Field
        label="Jam Selesai"
        value={end}
        onChangeText={setEnd}
        placeholder="14:00"
      />

      <Field
        label="Deskripsi"
        value={description}
        onChangeText={setDescription}
        placeholder="Jelaskan shift"
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={styles.rowTitle}>Status aktif</Text>
        <Switch
          value={active}
          onValueChange={setActive}
          trackColor={{ false: C.line, true: C.aqua }}
          thumbColor={active ? C.teal : C.slate}
        />
      </View>

      <Button
        label={saving ? "Menyimpan..." : "Simpan Shift"}
        icon="check"
        onPress={save}
      />
    </ScreenList>
  );
}
function Schedule({
  go,
  employees,
  shifts,
  assignments,
}: {
  go: (s: Screen) => void;
  employees: Employee[];
  shifts: Shift[];
  assignments: ScheduleAssignment[];
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const monthLabel = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const days = Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, index) => String(index + 1).padStart(2, "0"),
  );

  const [day, setDay] = useState(
    String(now.getDate()).padStart(2, "0"),
  );

  const dateKey = `${year}-${String(month).padStart(2, "0")}-${day}`;

  const dayAssignments = assignments.filter(
    (a) => a.date === dateKey,
  );

  const activeShifts = shifts.filter((s) => s.active);

  return (
    <ScreenList title="Jadwal Kerja" back={() => go("dashboard")}>
      <View style={styles.monthHeader}>
        <View>
          <Text style={styles.pageTitle}>{monthLabel}</Text>
          <Text style={styles.rowMeta}>
            Pilih tanggal kerja untuk melihat jadwal absensi.
          </Text>
        </View>

        <Pressable
          style={styles.monthButton}
          onPress={() =>
            Alert.alert(
              "Pilih Bulan",
              "Saat ini jadwal ditampilkan untuk bulan berjalan.",
            )
          }
        >
          <Icon name="calendar-month" color={C.teal} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayStrip}
      >
        {days.map((d) => (
          <Pressable
            key={d}
            onPress={() => setDay(d)}
            style={[
              styles.dayCell,
              day === d && styles.dayCellActive,
            ]}
          >
            <Text
              style={[
                styles.dayNumber,
                day === d && styles.dayNumberActive,
              ]}
            >
              {d}
            </Text>

            <Text
              style={[
                styles.dayName,
                day === d && styles.dayNumberActive,
              ]}
            >
              Hari
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.card}>
        <SectionTitle
          title={`Jadwal tanggal ${day} ${monthLabel.split(" ")[0]}`}
          action="Atur jadwal"
          onAction={() => go("schedule-form")}
        />

        {dayAssignments.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="event-busy" color={C.slate} size={28} />
            <Text style={styles.rowMeta}>
              Belum ada jadwal pada tanggal ini.
            </Text>
          </View>
        ) : (
          dayAssignments.map((a) => {
            const shift = shifts.find((s) => s.id === a.shiftId);

            return (
              <View style={styles.scheduleRow} key={a.id}>
                <View style={styles.scheduleTime}>
                  <Text style={styles.scheduleTimeText}>
                    {shift?.start ?? "-"}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {shift?.name ?? "Shift"}
                  </Text>

                  <Text style={styles.rowMeta}>
                    {shift?.start ?? "-"} - {shift?.end ?? "-"} �{" "}
                    {a.employeeIds.length} karyawan
                  </Text>
                </View>

                <Text style={styles.statusText}>Terisi</Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.card}>
        <SectionTitle title="Ringkasan" />
        <Text style={styles.rowMeta}>
          {employees.length} karyawan terdaftar �{" "}
          {activeShifts.length} shift aktif tersedia.
        </Text>
      </View>
    </ScreenList>
  );
}
function ScheduleForm({
  go,
  employees,
  shifts,
  onSave,
}: {
  go: (s: Screen) => void;
  employees: Employee[];
  shifts: Shift[];
  onSave: (assignment: ScheduleAssignment) => void;
}) {
  const activeShifts = shifts.filter((s) => s.active);

  const [shiftId, setShiftId] = useState(
    activeShifts[0]?.id ?? "",
  );

  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [selectedEmployeeIds, setSelectedEmployeeIds] =
    useState<string[]>(employees.map((e) => e.id));

  const [saving, setSaving] = useState(false);

  const selectAll = () =>
    setSelectedEmployeeIds(
      selectedEmployeeIds.length === employees.length &&
        employees.length > 0
        ? []
        : employees.map((e) => e.id),
    );

  const save = async () => {
    const normalizedDate = normalizeScheduleDate(date);

    if (
      !normalizedDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)
    ) {
      Alert.alert(
        "Tanggal belum valid",
        "Gunakan format YYYY-MM-DD atau DD-MM-YYYY.",
      );
      return;
    }

    if (!shiftId || activeShifts.length === 0) {
      Alert.alert(
        "Shift belum tersedia",
        "Buat dan simpan minimal satu shift terlebih dahulu.",
      );
      return;
    }

    if (
      employees.length === 0 ||
      selectedEmployeeIds.length === 0
    ) {
      Alert.alert(
        "Karyawan belum dipilih",
        "Tambahkan karyawan terlebih dahulu, lalu pilih karyawan yang akan dijadwalkan.",
      );
      return;
    }

    try {
      setSaving(true);

      let successCount = 0;
      const failedEmployees: string[] = [];

      for (const employeeId of selectedEmployeeIds) {
        const employee = employees.find(
          (e) => e.id === employeeId,
        );

        try {
          await createAdminSchedule({
            employeeId,
            scheduleDate: normalizedDate,
            shiftId,
            dayType: "KERJA",
          });

          successCount++;
        } catch {
          failedEmployees.push(
            employee?.name ?? employeeId,
          );
        }
      }

      if (successCount > 0) {
        onSave({
          id: `J${Date.now()}`,
          date: normalizedDate,
          shiftId,
          employeeIds: selectedEmployeeIds.filter(
            (id) =>
              !failedEmployees.includes(
                employees.find((e) => e.id === id)?.name ?? id,
              ),
          ),
        });
      }

      if (failedEmployees.length === 0) {
        Alert.alert(
          "Berhasil",
          `${successCount} karyawan berhasil dijadwalkan pada ${normalizedDate}.`,
        );
        go("schedule");
      } else if (successCount > 0) {
        Alert.alert(
          "Sebagian berhasil",
          `${successCount} karyawan berhasil dijadwalkan. ${failedEmployees.length} karyawan gagal disimpan.`,
        );
        go("schedule");
      } else {
        Alert.alert(
          "Gagal",
          "Tidak ada jadwal yang berhasil disimpan.",
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Gagal menyimpan jadwal",
        error?.message ?? "Terjadi kesalahan saat menyimpan jadwal.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenList
      title="Atur Jadwal Harian"
      back={() => go("schedule")}
    >
      <Field
        label="Tanggal"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.fieldHint}>
        Contoh: 2026-09-01 atau 01-09-2026
      </Text>

      <Text style={styles.fieldLabel}>Shift</Text>

      <View style={styles.filterRow}>
        {activeShifts.length === 0 ? (
          <Text style={styles.rowMeta}>
            Belum ada shift aktif.
          </Text>
        ) : (
          activeShifts.map((s) => (
            <Chip
              key={s.id}
              label={`${s.name} � ${s.start}`}
              active={shiftId === s.id}
              onPress={() => setShiftId(s.id)}
            />
          ))
        )}
      </View>

      <Pressable
        style={styles.selectAll}
        onPress={selectAll}
      >
        <Icon name="select-all" color={C.teal} />

        <Text style={styles.tealText}>
          {selectedEmployeeIds.length === employees.length &&
          employees.length > 0
            ? "Batalkan pilih semua"
            : "Pilih semua karyawan"}
        </Text>
      </Pressable>

      {employees.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="groups" color={C.slate} size={28} />
          <Text style={styles.rowMeta}>
            Belum ada karyawan. Tambahkan pegawai terlebih dahulu.
          </Text>
        </View>
      ) : (
        employees.map((e) => (
          <Pressable
            key={e.id}
            style={styles.participantRow}
            onPress={() =>
              setSelectedEmployeeIds((current) =>
                current.includes(e.id)
                  ? current.filter((id) => id !== e.id)
                  : [...current, e.id],
              )
            }
          >
            <Icon
              name={
                selectedEmployeeIds.includes(e.id)
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              color={
                selectedEmployeeIds.includes(e.id)
                  ? C.teal
                  : C.slate
              }
              size={23}
            />

            <View>
              <Text style={styles.rowTitle}>{e.name}</Text>
              <Text style={styles.rowMeta}>{e.id}</Text>
            </View>
          </Pressable>
        ))
      )}

      <Button
        label={saving ? "Menyimpan..." : "Simpan Jadwal Harian"}
        icon="check"
        onPress={save}
      />
    </ScreenList>
  );
}
function Attendance({ go }: { go: (s: Screen) => void }) {
  const [filter, setFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    hadir: 0,
    terlambat: 0,
    belumAbsen: 0,
    tidakHadir: 0,
  });

  useEffect(() => {
    let mounted = true;

    const loadAttendance = async () => {
      try {
        setLoading(true);

        const response = await getAdminDashboard();
        const data = response?.data;

        if (!mounted) return;

        const attendance = Array.isArray(data?.attendance)
          ? data.attendance
          : [];

        const schedules = Array.isArray(data?.schedules)
          ? data.schedules
          : [];

        const apiSummary = data?.summary ?? {};

        const attendanceEmployeeIds = new Set(
          attendance.map((item: any) => item.employeeId),
        );

        const loadedRows = attendance.map((item: any) => ({
          id: item.id ?? item.employeeId,
          employeeId: item.employeeId ?? "-",
          name: item.employee?.fullName ?? "-",
          position: item.employee?.position ?? "-",
          clockIn: item.clockIn,
          clockOut: item.clockOut,
          status:
            item.status === "TERLAMBAT"
              ? "Terlambat"
              : item.status === "IZIN"
                ? "Izin"
                : "Hadir",
          latitude:
            item.clockInLatitude ??
            item.clockOutLatitude ??
            null,
          longitude:
            item.clockInLongitude ??
            item.clockOutLongitude ??
            null,
        }));

        schedules.forEach((schedule: any) => {
          const employeeId =
            schedule.employee?.employeeId ??
            schedule.employeeId;

          if (
            employeeId &&
            !attendanceEmployeeIds.has(employeeId)
          ) {
            loadedRows.push({
              id: `belum-${schedule.id}`,
              employeeId,
              name: schedule.employee?.fullName ?? "-",
              position: schedule.employee?.position ?? "-",
              clockIn: null,
              clockOut: null,
              status: "Belum Absen",
              latitude: null,
              longitude: null,
            });
          }
        });

        setRows(loadedRows);

        setSummary({
          hadir: Number(apiSummary.hadir ?? 0),
          terlambat: Number(apiSummary.terlambat ?? 0),
          belumAbsen: Number(apiSummary.belumAbsen ?? 0),
          tidakHadir: 0,
        });
      } catch (error: any) {
        console.error(
          "Gagal memuat monitoring absensi:",
          error,
        );

        if (mounted) {
          setRows([]);
          setSummary({
            hadir: 0,
            terlambat: 0,
            belumAbsen: 0,
            tidakHadir: 0,
          });

          Alert.alert(
            "Gagal Memuat Absensi",
            error?.message ??
              "Data absensi tidak dapat diambil dari server.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadAttendance();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = rows.filter((row) => {
    if (filter === "Semua") return true;
    return row.status === filter;
  });

  const formatTime = (value: unknown) => {
    if (!value) return "--:--";

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    });
  };

  return (
    <ScreenList
      title="Monitoring Absensi"
      back={() => go("dashboard")}
    >
      <View style={styles.dateCard}>
        <View>
          <Text style={styles.rowMeta}>
            Tanggal absensi
          </Text>

          <Text style={styles.pageTitle}>
            Hari ini
          </Text>
        </View>

        <Icon
          name="calendar-today"
          color={C.teal}
          size={24}
        />
      </View>

      <View style={styles.metricGrid}>
        <Metric
          label="Hadir"
          value={String(summary.hadir)}
          tone={C.success}
          icon="check-circle-outline"
          onPress={() => setFilter("Hadir")}
        />

        <Metric
          label="Terlambat"
          value={String(summary.terlambat)}
          tone={C.warning}
          icon="schedule"
          onPress={() => setFilter("Terlambat")}
        />

        <Metric
          label="Belum Absen"
          value={String(summary.belumAbsen)}
          tone={C.slate}
          icon="help-outline"
          onPress={() => setFilter("Belum Absen")}
        />

        <Metric
          label="Tidak Hadir"
          value={String(summary.tidakHadir)}
          tone={C.error}
          icon="person-off"
          onPress={() => setFilter("Tidak Hadir")}
        />
      </View>

      <View style={styles.filterRow}>
        {[
          "Semua",
          "Hadir",
          "Terlambat",
          "Belum Absen",
          "Tidak Hadir",
        ].map((x) => (
          <Chip
            key={x}
            label={x}
            active={filter === x}
            onPress={() => setFilter(x)}
          />
        ))}
      </View>

      <View style={styles.card}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.rowMeta}>
              Memuat data absensi...
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name="fact-check"
              color={C.slate}
              size={28}
            />

            <Text style={styles.rowMeta}>
              Belum ada data absensi.
            </Text>
          </View>
        ) : (
          filtered.map((row) => (
            <Pressable
              key={row.id}
              style={styles.attendanceRow}
              onPress={() => go("attendance-detail")}
            >
              <View style={styles.attendanceStatus}>
                <Icon
                  name={
                    row.status === "Belum Absen"
                      ? "help-outline"
                      : row.status === "Terlambat"
                        ? "schedule"
                        : "check"
                  }
                  size={17}
                  color={
                    row.status === "Belum Absen"
                      ? C.slate
                      : row.status === "Terlambat"
                        ? C.warning
                        : C.success
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                  {row.name}
                </Text>

                <Text style={styles.rowMeta}>
                  {row.employeeId} � {row.status}
                </Text>
              </View>

              <Text style={styles.rowTitle}>
                {formatTime(row.clockIn)}
              </Text>

              <Icon
                name="chevron-right"
                size={18}
                color={C.slate}
              />
            </Pressable>
          ))
        )}
      </View>
    </ScreenList>
  );
}
function AttendanceDetail({ go }: { go: (s: Screen) => void }) { return <ScreenList title="Detail Absensi" back={() => go("attendance")}><View style={styles.emptyState}><Icon name="fact-check" color={C.slate} size={30} /><Text style={styles.rowMeta}>Belum ada detail absensi.</Text></View></ScreenList>; }

function ActivityList({ go, openActivity, activities, createActivity }: { go: (s: Screen) => void; openActivity: (a: Activity) => void; activities: Activity[]; createActivity: () => void }) { return <ScreenList title="Kegiatan" back={() => go("dashboard")}><Text style={styles.pageIntro}>Buat kegiatan untuk semua staff dan pantau kehadirannya.</Text>{activities.length === 0 && <View style={styles.emptyState}><Icon name="event" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada kegiatan.</Text></View>}{activities.map(a => <Pressable style={styles.activityCard} key={a.id} onPress={() => openActivity(a)}><View style={styles.activityCardTop}><Text style={styles.cardTitle}>{a.title}</Text><Icon name="chevron-right" size={20} color={C.slate} /></View><Text style={styles.rowMeta}>{a.date}  ·  {a.time}</Text><Text style={styles.rowMeta}>{a.place}  ·  {a.people}</Text><View style={styles.activityFooter}><Text style={styles.rowTitle}>Kehadiran</Text><Text style={styles.tealText}>{a.ratio}</Text></View></Pressable>)}<Button label="Buat Kegiatan" icon="add" onPress={createActivity} /></ScreenList>; }
function ActivityForm({ activity, go, onSave, onDraft }: { activity: Activity; go: (s: Screen) => void; onSave: (a: Activity) => void; onDraft: (activity: Activity) => void }) { const [title, setTitle] = useState(activity.title); const [date, setDate] = useState(activity.date); const [time, setTime] = useState(activity.time); const [place, setPlace] = useState(activity.place); const [description, setDescription] = useState(activity.description); const update = (patch: Partial<Activity>) => onDraft({ ...activity, ...patch, people: "Semua Staff" }); const save = () => { if (!title.trim() || !date.trim() || !time.trim() || !place.trim() || !description.trim()) { Alert.alert("Data belum lengkap", "Semua kolom kegiatan wajib diisi."); return; } onSave({ id: activity.id || `A${Date.now()}`, title, date, time, place, people: "Semua Staff", description, ratio: activity.ratio || "0 / 0" }); Alert.alert("Berhasil", "Kegiatan telah dibuat."); go("activities"); }; return <ScreenList title={activity.id ? "Edit Kegiatan" : "Buat Kegiatan"} back={() => go("activities")}><Field label="Nama Kegiatan" value={title} onChangeText={value => { setTitle(value); update({ title: value }); }} placeholder="Masukkan nama kegiatan" /><Field label="Tanggal" value={date} onChangeText={value => { setDate(value); update({ date: value }); }} placeholder="Masukkan tanggal" /><Field label="Jam" value={time} onChangeText={value => { setTime(value); update({ time: value }); }} placeholder="09:00 - 11:00" /><Field label="Lokasi" value={place} onChangeText={value => { setPlace(value); update({ place: value }); }} placeholder="Masukkan lokasi" /><View style={styles.selectionRow}><Icon name="groups" color={C.teal} /><Text style={[styles.rowTitle, { flex: 1 }]}>Peserta kegiatan</Text><Text style={styles.tealText}>Semua Staff</Text></View><Field label="Deskripsi" value={description} onChangeText={value => { setDescription(value); update({ description: value }); }} placeholder="Deskripsi kegiatan" multiline /><Button label="Simpan Kegiatan" icon="check" onPress={save} /></ScreenList>; }
function Participants({ go, employees, selected, onChange }: { go: (s: Screen) => void; employees: Employee[]; selected: string[]; onChange: (ids: string[]) => void }) { const [query, setQuery] = useState(""); const rows = employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase())); const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]); return <ScreenList title="Pilih Peserta" back={() => go("activity-form")}><View style={styles.searchBox}><Icon name="search" size={20} color={C.slate} /><TextInput placeholder="Cari pegawai" placeholderTextColor={C.slate} value={query} onChangeText={setQuery} style={styles.searchInput} /></View><Pressable style={styles.selectAll} onPress={() => onChange(selected.length === employees.length ? [] : employees.map(e => e.id))}><Icon name="select-all" color={C.teal} /><Text style={styles.tealText}>{selected.length === employees.length ? "Batal pilih semua" : "Pilih semua"}</Text></Pressable>{rows.map(e => <Pressable key={e.id} style={styles.participantRow} onPress={() => toggle(e.id)}><Icon name={selected.includes(e.id) ? "check-box" : "check-box-outline-blank"} color={selected.includes(e.id) ? C.teal : C.slate} size={23} /><View><Text style={styles.rowTitle}>{e.name}</Text><Text style={styles.rowMeta}>{e.id}</Text></View></Pressable>)}<Text style={styles.selectionCount}>{selected.length} pegawai dipilih</Text><Button label="Simpan Peserta" icon="check" onPress={() => { Alert.alert("Berhasil", `${selected.length} peserta dipilih.`); go("activity-form"); }} /></ScreenList>; }
function ActivityDetail({ activity, go, onEdit }: { activity: Activity; go: (s: Screen) => void; onEdit: () => void }) { return <ScreenList title="Detail Kegiatan" back={() => go("activities")}><Text style={styles.pageTitle}>{activity.title || "Kegiatan belum dipilih"}</Text><View style={styles.metaList}><Text style={styles.rowMeta}>{activity.date || "Tanggal belum diisi"}  ·  {activity.time || "Jam belum diisi"}</Text><Text style={styles.rowMeta}>{activity.place || "Lokasi belum diisi"}  ·  Semua Staff</Text></View><View style={styles.card}><SectionTitle title="Deskripsi" /><Text style={styles.announcementBody}>{activity.description || "Deskripsi belum tersedia."}</Text></View><View style={styles.card}><SectionTitle title="Kehadiran" /><View style={styles.attendanceSummary}><View><Text style={styles.metricValue}>0</Text><Text style={styles.rowMeta}>Sudah absen</Text></View><View><Text style={styles.metricValue}>0</Text><Text style={styles.rowMeta}>Belum absen</Text></View><View><Text style={styles.metricValue}>0</Text><Text style={styles.rowMeta}>Terlambat</Text></View></View><Button label="Lihat Kehadiran" onPress={() => go("activity-attendance")} /></View><Button label="Edit Kegiatan" icon="edit" secondary onPress={onEdit} /></ScreenList>; }
function ActivityAttendance({ activityId, go }: { activityId: string; go: (s: Screen) => void }) { const [filter, setFilter] = useState("Semua"); const rows: string[][] = []; const filtered = rows.filter(row => filter === "Semua" || row[2] === filter); return <ScreenList title="Kehadiran Kegiatan" back={() => go("activity-detail")}><Text style={styles.pageTitle}>Kehadiran kegiatan</Text><Text style={styles.rowMeta}>Data akan tampil setelah kegiatan dan peserta tersimpan.</Text><View style={styles.metricGrid}><Metric label="Peserta" value="0" tone={C.teal} icon="groups" onPress={() => {}} /><Metric label="Hadir" value="0" tone={C.success} icon="check-circle-outline" onPress={() => {}} /><Metric label="Belum Absen" value="0" tone={C.slate} icon="help-outline" onPress={() => {}} /><Metric label="Terlambat" value="0" tone={C.warning} icon="schedule" onPress={() => {}} /></View><View style={styles.filterRow}>{["Semua", "Hadir", "Terlambat", "Belum Absen"].map(x => <Chip key={x} label={x} active={filter === x} onPress={() => setFilter(x)} />)}</View><View style={styles.card}><View style={styles.emptyState}><Icon name="fact-check" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada kehadiran kegiatan.</Text></View>{filtered.map(([name, time, status]) => <Pressable key={name} style={styles.attendanceRow} onPress={() => go("activity-attendance-detail")}><View style={styles.attendanceStatus}><Icon name="check" size={17} color={C.success} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{name}</Text><Text style={styles.rowMeta}>{status}</Text></View><Text style={styles.rowTitle}>{time}</Text></Pressable>)}</View></ScreenList>; }
function ActivityAttendanceDetail({ go }: { go: (s: Screen) => void }) { return <ScreenList title="Detail Absen Kegiatan" back={() => go("activity-attendance")}><View style={styles.emptyState}><Icon name="person-outline" color={C.slate} size={30} /><Text style={styles.rowMeta}>Belum ada detail kehadiran.</Text></View></ScreenList>; }

function Approvals({
  go,
  openApproval,
  approvals,
}: {
  go: (s: Screen) => void;
  openApproval: (a: Approval) => void;
  approvals: Approval[];
}) {
  const [filter, setFilter] = useState("Semua");

  const filtered = approvals.filter((a) => {
    if (filter === "Semua") return true;
    return a.type === filter;
  });

  return (
    <ScreenList
      title="Persetujuan"
      back={() => go("dashboard")}
    >
      <Text style={styles.pageIntro}>
        Tinjau cuti, izin, dan perubahan data pegawai.
      </Text>

      <View style={styles.filterRow}>
        {[
          "Semua",
          "CUTI",
          "IZIN",
          "PERUBAHAN PROFIL",
          "PERUBAHAN DOKUMEN",
        ].map((x) => (
          <Chip
            key={x}
            label={x}
            active={filter === x}
            onPress={() => setFilter(x)}
          />
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="task-alt" color={C.slate} size={28} />
          <Text style={styles.rowMeta}>
            Belum ada pengajuan.
          </Text>
        </View>
      )}

      {filtered.map((a) => (
        <Pressable
          key={a.id}
          style={styles.approvalCard}
          onPress={() => openApproval(a)}
        >
          <View style={styles.approvalTag}>
            <Text style={styles.approvalTagText}>
              {a.type}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>
              {a.name}
            </Text>

            <Text style={styles.rowMeta}>
              {a.date}
            </Text>

            <Text
              style={[
                styles.pendingText,
                a.status !== "Menunggu" && {
                  color:
                    a.status === "Disetujui"
                      ? C.success
                      : C.error,
                },
              ]}
            >
              {a.status}
            </Text>
          </View>

          <Icon
            name="chevron-right"
            size={20}
            color={C.slate}
          />
        </Pressable>
      ))}
    </ScreenList>
  );
}
function ApprovalDetail({
  approval,
  go,
  onDecision,
}: {
  approval: Approval;
  go: (s: Screen) => void;
  onDecision: (
    approval: Approval,
    status: "Disetujui" | "Ditolak",
    note?: string,
  ) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const decide = (status: "Disetujui" | "Ditolak") => {
    if (saving) return;

    Alert.alert(
      status === "Disetujui"
        ? "Setujui pengajuan?"
        : "Tolak pengajuan?",
      "Keputusan akan disimpan ke server.",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Lanjutkan",
          onPress: () => {
            void (async () => {
              try {
                setSaving(true);

                await onDecision(
                  approval,
                  status,
                  note.trim() || undefined,
                );

                Alert.alert(
                  "Berhasil",
                  `Pengajuan telah ${status.toLowerCase()}.`,
                  [
                    {
                      text: "OK",
                      onPress: () => go("approvals"),
                    },
                  ],
                );
              } catch (error) {
                console.error(
                  "Gagal memproses persetujuan:",
                  error,
                );

                Alert.alert(
                  "Gagal",
                  error instanceof Error
                    ? error.message
                    : "Pengajuan gagal diproses.",
                );
              } finally {
                setSaving(false);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <ScreenList
      title="Detail Persetujuan"
      back={() => go("approvals")}
    >
      <View style={styles.approvalHeading}>
        <Text style={styles.eyebrow}>
          {approval.type}
        </Text>

        <Text style={styles.pageTitle}>
          {approval.name}
        </Text>

        <Text style={styles.rowMeta}>
          {approval.date}
        </Text>

        <Text
          style={[
            styles.pendingText,
            approval.status !== "Menunggu" && {
              color:
                approval.status === "Disetujui"
                  ? C.success
                  : C.error,
            },
          ]}
        >
          {approval.status}
        </Text>
      </View>

      <DetailBlock
        title="Detail Pengajuan"
        rows={[
          ["Jenis", approval.detail],
          ["Tanggal", approval.date],
          ["Alasan", approval.reason || "-"],
          ["Lampiran", approval.attachment || "-"],
        ]}
      />

      <Field
        label="Catatan Admin"
        value={note}
        onChangeText={setNote}
        placeholder="Tambahkan catatan (opsional)"
        multiline
      />

      {approval.status === "Menunggu" ? (
        <View style={styles.decisionRow}>
          <Pressable
            disabled={saving}
            style={[
              styles.decisionButton,
              {
                backgroundColor: C.error,
                opacity: saving ? 0.6 : 1,
              },
            ]}
            onPress={() => decide("Ditolak")}
          >
            <Icon name="close" color="#fff" />
            <Text style={styles.primaryButtonText}>
              Tolak
            </Text>
          </Pressable>

          <Pressable
            disabled={saving}
            style={[
              styles.decisionButton,
              {
                backgroundColor: C.success,
                opacity: saving ? 0.6 : 1,
              },
            ]}
            onPress={() => decide("Disetujui")}
          >
            <Icon name="check" color="#fff" />
            <Text style={styles.primaryButtonText}>
              Setujui
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Icon name="task-alt" color={C.slate} size={28} />
          <Text style={styles.rowMeta}>
            Pengajuan ini sudah diproses.
          </Text>
        </View>
      )}
    </ScreenList>
  );
}
function Announcements({ go, openAnnouncement, announcements, createAnnouncement }: { go: (s: Screen) => void; openAnnouncement: (a: Announcement) => void; announcements: Announcement[]; createAnnouncement: () => void }) { const [filter, setFilter] = useState("Semua"); const filtered = announcements.filter(a => filter === "Semua" || a.status === filter); return <ScreenList title="Pengumuman" back={() => go("dashboard")}><Text style={styles.pageIntro}>Bagikan informasi penting kepada staff klinik.</Text><View style={styles.filterRow}>{["Semua", "Terbit", "Draft"].map(x => <Chip key={x} label={x} active={filter === x} onPress={() => setFilter(x)} />)}</View>{filtered.length === 0 && <View style={styles.emptyState}><Icon name="campaign" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada pengumuman.</Text></View>}{filtered.map(a => <Pressable key={a.id} style={styles.announcementCard} onPress={() => openAnnouncement(a)}><View style={styles.announcementTop}><View style={styles.announcementIcon}><Icon name="campaign" color={C.teal} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{a.title}</Text><Text style={styles.rowMeta}>{a.audience}  ·  {a.date}</Text></View><Text style={[styles.statusText, { color: a.status === "Terbit" ? C.success : C.warning }]}>{a.status}</Text></View><Text style={styles.announcementBody}>{a.body}</Text></Pressable>)}<Button label="Buat Pengumuman" icon="add" onPress={createAnnouncement} /></ScreenList>; }
function AnnouncementForm({ announcement, go, onSave }: { announcement?: Announcement; go: (s: Screen) => void; onSave: (a: Announcement) => void }) { const [title, setTitle] = useState(announcement?.title ?? ""); const [body, setBody] = useState(announcement?.body ?? ""); const save = (status: "Draft" | "Terbit") => { if (!title.trim() || !body.trim()) { Alert.alert("Data belum lengkap", "Judul dan isi pengumuman wajib diisi."); return; } onSave({ id: announcement?.id ?? `N${Date.now()}`, title, audience: "Semua Staff", date: new Date().toLocaleDateString("id-ID"), body, status }); Alert.alert("Berhasil", status === "Terbit" ? "Pengumuman diterbitkan." : "Draft disimpan."); go("announcements"); }; return <ScreenList title={announcement ? "Edit Pengumuman" : "Buat Pengumuman"} back={() => go("announcements")}><Field label="Judul" value={title} onChangeText={setTitle} placeholder="Masukkan judul pengumuman" /><View style={styles.selectionRow}><Icon name="groups" color={C.teal} /><Text style={[styles.rowTitle, { flex: 1 }]}>Penerima</Text><Text style={styles.tealText}>Semua Staff</Text></View><Field label="Isi Pengumuman" value={body} onChangeText={setBody} placeholder="Tulis informasi yang ingin dibagikan" multiline /><Button label="Terbitkan" icon="campaign" onPress={() => save("Terbit")} /><Button label="Simpan Draft" icon="save" secondary onPress={() => save("Draft")} /></ScreenList>; }
function Notifications({ go }: { go: (s: Screen) => void }) { return <ScreenList title="Notifikasi" back={() => go("dashboard")}><View style={styles.noticeHeader}><Text style={styles.pageTitle}>Pembaruan terbaru</Text></View><View style={styles.emptyState}><Icon name="notifications-none" color={C.slate} size={28} /><Text style={styles.rowMeta}>Belum ada notifikasi.</Text></View></ScreenList>; }
function LoginScreen({ onLogin }: { onLogin: () => void }) { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const submit = () => { if (!email.trim() || !password.trim()) { Alert.alert("Login belum lengkap", "Email dan kata sandi wajib diisi."); return; } onLogin(); }; return <View style={styles.loginScreen}><View style={styles.loginLogo}><Icon name="medical-services" color="#fff" size={30} /></View><Text style={styles.loginTitle}>MEDSTAFF</Text><Text style={styles.loginSubtitle}>Administrasi Klinik Pratama Unimus</Text><View style={styles.loginCard}><Text style={styles.pageTitle}>Selamat datang</Text><Text style={styles.pageIntro}>Masuk untuk mengelola operasional klinik.</Text><Field label="Email" value={email} onChangeText={setEmail} placeholder="admin@klinik.id" /><Field label="Kata sandi" value={password} onChangeText={setPassword} placeholder="Masukkan kata sandi" /><Button label="Masuk sebagai Admin" icon="login" onPress={submit} /></View><Text style={styles.loginHint}>Akses admin internal · Versi 1.0.0</Text></View>; }
function Profile({ go, onLogout, profileImage, onChangePhoto }: { go: (s: Screen) => void; onLogout: () => void; profileImage: string | null; onChangePhoto: (uri: string) => void }) { return <ScreenList title="Profil" back={() => go("dashboard")}><View style={styles.profileHero}><Pressable onPress={() => { void pickProfilePhoto(onChangePhoto); }} style={styles.profilePhotoButton}><View style={styles.profileAvatar}>{profileImage ? <Image source={{ uri: profileImage }} style={styles.profileImage} /> : <Text style={styles.profileAvatarText}>AD</Text>}</View><View style={styles.profileImageEdit}><Icon name="photo-camera" color="#fff" size={15} /></View></Pressable><Text style={styles.profileName}>Profil Admin</Text><Text style={styles.profileRole}>Data profil akan diisi dari akun nyata</Text><Text style={styles.profileUploadHint}>Ketuk foto untuk mengubah</Text></View><DetailBlock title="Informasi Admin" rows={[["Nama", "Belum diatur"], ["Email", "Belum diatur"], ["Telepon", "Belum diatur"], ["Unit", "Belum diatur"]]} /><Button label="Edit Profil" icon="edit" onPress={() => go("profile-form")} /><Pressable style={styles.settingsRow} onPress={() => go("settings")}><Icon name="settings" color={C.navy} /><Text style={[styles.rowTitle, { flex: 1 }]}>Pengaturan</Text><Icon name="chevron-right" color={C.slate} /></Pressable><Pressable style={styles.logoutRow} onPress={() => Alert.alert("Keluar dari akun?", "Anda perlu login kembali untuk mengakses MEDSTAFF.", [{ text: "Batal", style: "cancel" }, { text: "Keluar", style: "destructive", onPress: onLogout }])}><Icon name="logout" color={C.error} /><Text style={styles.logoutText}>Keluar</Text></Pressable></ScreenList>; }
function ProfileForm({ go, profileImage, onChangePhoto }: { go: (s: Screen) => void; profileImage: string | null; onChangePhoto: (uri: string) => void }) { const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); return <ScreenList title="Edit Profil" back={() => go("profile")}><View style={styles.profileFormPhoto}><Pressable onPress={() => { void pickProfilePhoto(onChangePhoto); }} style={styles.profilePhotoButton}><View style={styles.profileAvatar}>{profileImage ? <Image source={{ uri: profileImage }} style={styles.profileImage} /> : <Text style={styles.profileAvatarText}>AD</Text>}</View><View style={styles.profileImageEdit}><Icon name="photo-camera" color="#fff" size={15} /></View></Pressable><Text style={styles.profileUploadHint}>Pilih foto dari galeri atau kamera</Text></View><Field label="Nama" value={name} onChangeText={setName} /><Field label="Email" value={email} onChangeText={setEmail} /><Field label="Telepon" value={phone} onChangeText={setPhone} /><Button label="Simpan Profil" icon="check" onPress={() => { if (!name.trim() || !email.trim()) { Alert.alert("Data belum lengkap", "Nama dan email wajib diisi."); return; } Alert.alert("Berhasil", "Profil diperbarui."); go("profile"); }} /></ScreenList>; }
function Settings({ go }: { go: (s: Screen) => void }) { const [push, setPush] = useState(true); const [email, setEmail] = useState(true); return <ScreenList title="Pengaturan" back={() => go("profile")}><Text style={styles.pageIntro}>Atur pengalaman dan keamanan akun admin.</Text><View style={styles.card}><SectionTitle title="Notifikasi" /><SettingToggle icon="notifications" label="Notifikasi push" value={push} onChange={setPush} /><SettingToggle icon="email" label="Ringkasan melalui email" value={email} onChange={setEmail} /></View><View style={styles.card}><SectionTitle title="Keamanan" /><Pressable style={styles.settingsRow} onPress={() => Alert.alert("Ubah kata sandi", "Tautan perubahan kata sandi akan dikirim ke email admin.")}><Icon name="lock-outline" color={C.navy} /><Text style={[styles.rowTitle, { flex: 1 }]}>Ubah kata sandi</Text><Icon name="chevron-right" color={C.slate} /></Pressable></View><View style={styles.card}><SectionTitle title="Tentang" /><Text style={styles.rowTitle}>MEDSTAFF Admin</Text><Text style={styles.rowMeta}>Versi 1.0.0 · Klinik Pratama Unimus</Text></View></ScreenList>; }
function SettingToggle({ icon, label, value, onChange }: { icon: IconName; label: string; value: boolean; onChange: (v: boolean) => void }) { return <View style={styles.switchRow}><View style={styles.settingLabel}><Icon name={icon} color={C.teal} /><Text style={styles.rowTitle}>{label}</Text></View><Switch value={value} onValueChange={onChange} trackColor={{ false: C.line, true: C.aqua }} thumbColor={value ? C.teal : C.slate} /></View>; }
function ScreenList({ title, back, children }: { title: string; back: () => void; children: React.ReactNode }) { return <><Header title={title} back={back} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>{children}</ScrollView></>; }

function Drawer({ go, close }: { go: (s: Screen) => void; close: () => void }) { const items: [IconName, string, Screen][] = [["dashboard", "Dashboard", "dashboard"], ["groups", "Manajemen Pegawai", "employees"], ["schedule", "Kelola Shift", "shifts"], ["calendar-month", "Jadwal Bulanan", "schedule"], ["fact-check", "Monitoring Absensi", "attendance"], ["event", "Kegiatan", "activities"], ["task-alt", "Persetujuan", "approvals"], ["campaign", "Pengumuman", "announcements"], ["notifications", "Notifikasi", "notifications"], ["person-outline", "Profil", "profile"], ["settings", "Pengaturan", "settings"]]; return <View style={styles.drawerOverlay}><Pressable style={styles.drawerBackdrop} onPress={close} /><View style={styles.drawer}><View style={styles.drawerBrand}><View style={styles.drawerLogo}><Icon name="medical-services" color="#fff" size={22} /></View><View><Text style={styles.drawerTitle}>MEDSTAFF</Text><Text style={styles.drawerSub}>ADMINISTRATOR</Text></View><Pressable onPress={close} style={styles.drawerClose}><Icon name="close" color={C.slate} /></Pressable></View>{items.map(([icon, label, screen]) => <Pressable key={label} style={styles.drawerItem} onPress={() => { close(); go(screen); }}><Icon name={icon} color={label === "Dashboard" ? C.teal : C.slate} /><Text style={[styles.drawerItemText, label === "Dashboard" && { color: C.teal, fontWeight: "800" }]}>{label}</Text></Pressable>)}</View></View>; }

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [loggedIn, setLoggedIn] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | undefined>();

  const [selectedShift, setSelectedShift] =
    useState<Shift | undefined>();

  const [selectedActivity, setSelectedActivity] =
    useState<Activity>({
      id: "",
      title: "",
      date: "",
      time: "",
      place: "",
      people: "Semua Staff",
      description: "",
      ratio: "0 / 0",
    });

  const [participantIds, setParticipantIds] =
    useState<string[]>([]);

  const [selectedApproval, setSelectedApproval] =
    useState<Approval | undefined>();

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | undefined>();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [shifts, setShifts] =
    useState<Shift[]>([]);

  const [assignments, setAssignments] =
    useState<ScheduleAssignment[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [approvals, setApprovals] =
    useState<Approval[]>([]);

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  const go = (s: Screen) => setScreen(s);

  const openEmployee = (e: Employee) => {
    setSelectedEmployee(e);
    go("employee-detail");
  };

  const openShift = (s?: Shift) => {
    setSelectedShift(s);
    go("shift-form");
  };

  const openActivity = (a: Activity) => {
    setSelectedActivity(a);
    go("activity-detail");
  };

  const openApproval = (a: Approval) => {
    setSelectedApproval(a);
    go("approval-detail");
  };

  const openAnnouncement = (a: Announcement) => {
    setSelectedAnnouncement(a);
    go("announcement-form");
  };

  useEffect(() => {
    let mounted = true;

    const loadApprovals = async () => {
      try {
        const [leaveResponse, documentResponse] =
          await Promise.all([
            getAdminLeaveRequests(),
            getAdminDocumentRequests(),
          ]);

        const leaves = Array.isArray(leaveResponse?.data)
          ? leaveResponse.data
          : [];

        const documents = Array.isArray(documentResponse?.data)
          ? documentResponse.data
          : [];

        const mappedLeaves: Approval[] = leaves
          .filter((item: any) => item?.id)
          .map((item: any) => {
            const leaveType =
              String(item.leaveType ?? "").toUpperCase();

            return {
              id: `leave-${item.id}`,
              requestId: item.id,
              source: "leave",
              type:
                leaveType === "CUTI"
                  ? "CUTI"
                  : "IZIN",
              name:
                item.employee?.fullName ??
                item.employee?.employeeId ??
                "-",
              date:
                item.startDate && item.endDate
                  ? `${new Date(item.startDate).toLocaleDateString("id-ID")} - ${new Date(item.endDate).toLocaleDateString("id-ID")}`
                  : "-",
              detail: leaveType || "IZIN",
              reason: item.reason ?? "-",
              status:
                item.status === "APPROVED"
                  ? "Disetujui"
                  : item.status === "REJECTED"
                    ? "Ditolak"
                    : "Menunggu",
              attachment:
                item.attachment ?? null,
              adminNote:
                item.adminNote ?? null,
            };
          });

        const mappedDocuments: Approval[] = documents
          .filter((item: any) => item?.id)
          .map((item: any) => {
            const requestType =
              String(item.requestType ?? "").toUpperCase();

            return {
              id: `document-${item.id}`,
              requestId: item.id,
              source: "document",
              type:
                requestType.includes("DOKUMEN")
                  ? "PERUBAHAN DOKUMEN"
                  : "PERUBAHAN PROFIL",
              name:
                item.employee?.fullName ??
                item.employee?.employeeId ??
                "-",
              date: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("id-ID")
                : "-",
              detail:
                item.requestType ??
                "Perubahan data",
              reason:
                item.description ??
                "-",
              status:
                item.status === "APPROVED"
                  ? "Disetujui"
                  : item.status === "REJECTED"
                    ? "Ditolak"
                    : "Menunggu",
              attachment:
                item.attachment ?? null,
              adminNote:
                item.adminNote ?? null,
            };
          });

        if (mounted) {
          setApprovals([
            ...mappedLeaves,
            ...mappedDocuments,
          ]);
        }
      } catch (error) {
        console.error(
          "Gagal mengambil data persetujuan:",
          error,
        );

        if (mounted) {
          setApprovals([]);
        }
      }
    };
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);

        const response = await getAdminScheduleEmployees();

        const rawEmployees = Array.isArray(response?.data)
          ? response.data
          : [];

        const mappedEmployees: Employee[] =
          rawEmployees
            .filter((item: any) => item?.id || item?.employeeId)
            .map((item: any) => ({
              id: item.id ?? item.employeeId ?? "",
              name: item.fullName ?? "-",
              role: item.position ?? "-",
              unit: item.companyName ?? "-",
              status: "Aktif",
              email: item.email ?? "-",
              phone: item.phone ?? "-",
            }));

        if (mounted) {
          setEmployees(mappedEmployees);
        }
      } catch (error) {
        console.error(
          "Gagal mengambil daftar pegawai:",
          error,
        );

        if (mounted) {
          setEmployees([]);
          Alert.alert(
            "Gagal Memuat Pegawai",
            "Daftar pegawai tidak dapat diambil dari server.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingEmployees(false);
        }
      }
    };

    void loadEmployees();
    const loadShiftsAndSchedules = async () => {
      try {
        const shiftResponse = await getShifts();

        const rawShifts = Array.isArray(shiftResponse?.data)
          ? shiftResponse.data
          : [];

        const mappedShifts: Shift[] = rawShifts.map((item: any) => ({
          id: item.id ?? "",
          name: item.name ?? "-",
          start: item.startTime ?? "-",
          end: item.endTime ?? "-",
          description: item.category ?? "",
          active: item.isActive !== false,
        }));

        if (mounted) {
          setShifts(mappedShifts);
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const employeeResponse =
          await getAdminScheduleEmployees();

        const employeeData = Array.isArray(employeeResponse?.data)
          ? employeeResponse.data
          : [];

        const scheduleResults = await Promise.allSettled(
          employeeData
            .filter((employee: any) => employee?.id)
            .map((employee: any) =>
              getAdminMonthSchedule(
                employee.id,
                year,
                month,
              ),
            ),
        );

        const loadedAssignments: ScheduleAssignment[] = [];

        scheduleResults.forEach((result) => {
          if (result.status !== "fulfilled") {
            return;
          }

          const response = result.value;
          const scheduleData = response?.data;

          const schedules = Array.isArray(scheduleData?.schedules)
            ? scheduleData.schedules
            : [];

          schedules.forEach((schedule: any) => {
            if (!schedule?.scheduleDate) {
              return;
            }

            const date = String(schedule.scheduleDate).slice(0, 10);

            const shiftId =
              schedule.shiftId ??
              schedule.shift?.id ??
              "";

            if (!shiftId) {
              return;
            }

            const existing = loadedAssignments.find(
              (item) =>
                item.date === date &&
                item.shiftId === shiftId,
            );

            if (existing) {
              if (schedule.employeeId) {
                existing.employeeIds = Array.from(
                  new Set([
                    ...existing.employeeIds,
                    schedule.employeeId,
                  ]),
                );
              }
            } else {
              loadedAssignments.push({
                id: `${date}-${shiftId}`,
                date,
                shiftId,
                employeeIds: schedule.employeeId
                  ? [schedule.employeeId]
                  : [],
              });
            }
          });
        });

        if (mounted) {
          setAssignments(loadedAssignments);
        }
      } catch (error) {
        console.error(
          "Gagal memuat shift dan jadwal admin:",
          error,
        );

        if (mounted) {
          setShifts([]);
          setAssignments([]);
        }
      }
    };

    void loadShiftsAndSchedules();

    return () => {
      mounted = false;
    };
  }, []);

  const onShiftSave = (shift: Shift) => {
    setShifts(current =>
      current.some(s => s.id === shift.id)
        ? current.map(s =>
            s.id === shift.id ? shift : s,
          )
        : [...current, shift],
    );
  };

  const onScheduleSave = (
    assignment: ScheduleAssignment,
  ) => {
    setAssignments(current => {
      const existing = current.find(
        a =>
          a.date === assignment.date &&
          a.shiftId === assignment.shiftId,
      );

      if (!existing) {
        return [...current, assignment];
      }

      const employeeIds = Array.from(
        new Set([
          ...existing.employeeIds,
          ...assignment.employeeIds,
        ]),
      );

      return current.map(a =>
        a.id === existing.id
          ? { ...a, employeeIds }
          : a,
      );
    });
  };

  const onActivitySave = (activity: Activity) => {
    setActivities(current =>
      current.some(a => a.id === activity.id)
        ? current.map(a =>
            a.id === activity.id ? activity : a,
          )
        : [...current, activity],
    );
  };

  const onAnnouncementSave = (
    announcement: Announcement,
  ) => {
    setAnnouncements(current =>
      current.some(a => a.id === announcement.id)
        ? current.map(a =>
            a.id === announcement.id
              ? announcement
              : a,
          )
        : [...current, announcement],
    );
  };

  const onDecision = async (
    approval: Approval,
    status: "Disetujui" | "Ditolak",
    note?: string,
  ) => {
    if (approval.source === "leave") {
      if (status === "Disetujui") {
        await approveLeaveRequest(
          approval.requestId,
        );
      } else {
        await rejectLeaveRequest(
          approval.requestId,
        );
      }
    } else {
      await reviewDocumentRequest(
        approval.requestId,
        {
          status:
            status === "Disetujui"
              ? "APPROVED"
              : "REJECTED",
          adminNote: note,
        },
      );
    }

    setApprovals((current) =>
      current.map((item) =>
        item.id === approval.id
          ? {
              ...item,
              status,
              adminNote: note ?? item.adminNote,
            }
          : item,
      ),
    );
  };
  let body: React.ReactNode;

  if (!loggedIn) {
    body = (
      <LoginScreen
        onLogin={() => {
          setLoggedIn(true);
          go("dashboard");
        }}
      />
    );
  } else if (screen === "dashboard") {
    body = (
      <Dashboard
        go={go}
        openMenu={() => setDrawer(true)}
        employees={employees}
      />
    );
  } else if (screen === "employees") {
    body = (
      <EmployeeList
        go={go}
        openEmployee={openEmployee}
        employees={employees}
      />
    );
  } else if (
    screen === "employee-detail" &&
    selectedEmployee
  ) {
    body = (
      <EmployeeDetail
        employee={selectedEmployee}
        go={go}
      />
    );
  } else if (screen === "shifts") {
    body = (
      <ShiftList
        go={go}
        openShift={openShift}
        shifts={shifts}
      />
    );
  } else if (screen === "shift-form") {
    body = (
      <ShiftForm
        key={selectedShift?.id ?? "new"}
        shift={selectedShift}
        go={go}
        onSave={onShiftSave}
      />
    );
  } else if (screen === "schedule") {
    body = (
      <Schedule
        go={go}
        employees={employees}
        shifts={shifts}
        assignments={assignments}
      />
    );
  } else if (screen === "schedule-form") {
    body = (
      <ScheduleForm
        go={go}
        employees={employees}
        shifts={shifts}
        onSave={onScheduleSave}
      />
    );
  } else if (screen === "attendance") {
    body = <Attendance go={go} />;
  } else if (screen === "attendance-detail") {
    body = <AttendanceDetail go={go} />;
  } else if (screen === "activities") {
    body = (
      <ActivityList
        go={go}
        openActivity={openActivity}
        activities={activities}
        createActivity={() => {
          setSelectedActivity({
            id: "",
            title: "",
            date: "",
            time: "",
            place: "",
            people: "Semua Staff",
            description: "",
            ratio: "0 / 0",
          });

          setParticipantIds([]);
          go("activity-form");
        }}
      />
    );
  } else if (screen === "activity-form") {
    body = (
      <ActivityForm
        key={selectedActivity.id || "new"}
        activity={selectedActivity}
        go={go}
        onSave={onActivitySave}
        onDraft={setSelectedActivity}
      />
    );
  } else if (screen === "participants") {
    body = (
      <Participants
        go={go}
        employees={employees}
        selected={participantIds}
        onChange={setParticipantIds}
      />
    );
  } else if (screen === "activity-detail") {
    body = (
      <ActivityDetail
        activity={selectedActivity}
        go={go}
        onEdit={() => go("activity-form")}
      />
    );
  } else if (screen === "activity-attendance") {
    body = (
      <ActivityAttendance
        go={go}
        activityId={selectedActivity.id}
      />
    );
  } else if (
    screen === "activity-attendance-detail"
  ) {
    body = (
      <ActivityAttendanceDetail
        go={go}
      />
    );
  } else if (screen === "approvals") {
    body = (
      <Approvals
        go={go}
        openApproval={openApproval}
        approvals={approvals}
      />
    );
  } else if (
    screen === "approval-detail" &&
    selectedApproval
  ) {
    body = (
      <ApprovalDetail
        approval={selectedApproval}
        go={go}
        onDecision={onDecision}
      />
    );
  } else if (screen === "announcements") {
    body = (
      <Announcements
        go={go}
        openAnnouncement={openAnnouncement}
        announcements={announcements}
        createAnnouncement={() => {
          setSelectedAnnouncement(undefined);
          go("announcement-form");
        }}
      />
    );
  } else if (screen === "announcement-form") {
    body = (
      <AnnouncementForm
        key={selectedAnnouncement?.id ?? "new"}
        announcement={selectedAnnouncement}
        go={go}
        onSave={onAnnouncementSave}
      />
    );
  } else if (screen === "notifications") {
    body = <Notifications go={go} />;
  } else if (screen === "profile") {
    body = (
      <Profile
        go={go}
        profileImage={profileImage}
        onChangePhoto={setProfileImage}
        onLogout={() => {
          setLoggedIn(false);
          setDrawer(false);
        }}
      />
    );
  } else if (screen === "settings") {
    body = <Settings go={go} />;
  } else {
    body = (
      <ProfileForm
        go={go}
        profileImage={profileImage}
        onChangePhoto={setProfileImage}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: C.canvas,
      }}
      edges={["top", "bottom"]}
    >
      {body}

      {loggedIn && (
        <View style={styles.tabBar}>
          <Pressable
            onPress={() => go("dashboard")}
            style={styles.tabItem}
          >
            <Icon
              name="home"
              color={
                screen === "dashboard"
                  ? C.teal
                  : C.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                screen === "dashboard" &&
                  styles.tabLabelActive,
              ]}
            >
              Home
            </Text>
          </Pressable>

          <Pressable
            onPress={() => go("employees")}
            style={styles.tabItem}
          >
            <Icon
              name="groups"
              color={
                screen === "employees" ||
                screen === "employee-detail" ||
                screen === "employee-form"
                  ? C.teal
                  : C.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                (screen === "employees" ||
                  screen === "employee-detail" ||
                  screen === "employee-form") &&
                  styles.tabLabelActive,
              ]}
            >
              Staff
            </Text>
          </Pressable>

          <Pressable
            onPress={() => go("schedule")}
            style={styles.tabItem}
          >
            <Icon
              name="calendar-month"
              color={
                screen === "schedule" ||
                screen === "schedule-form"
                  ? C.teal
                  : C.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                (screen === "schedule" ||
                  screen === "schedule-form") &&
                  styles.tabLabelActive,
              ]}
            >
              Schedule
            </Text>
          </Pressable>

          <Pressable
            onPress={() => go("notifications")}
            style={styles.tabItem}
          >
            <Icon
              name="notifications-none"
              color={
                screen === "notifications" ||
                screen === "approvals" ||
                screen === "approval-detail"
                  ? C.teal
                  : C.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                (screen === "notifications" ||
                  screen === "approvals" ||
                  screen === "approval-detail") &&
                  styles.tabLabelActive,
              ]}
            >
              Notif
            </Text>
          </Pressable>

          <Pressable
            onPress={() => go("profile")}
            style={styles.tabItem}
          >
            <Icon
              name="person-outline"
              color={
                screen === "profile" ||
                screen === "profile-form"
                  ? C.teal
                  : C.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                (screen === "profile" ||
                  screen === "profile-form") &&
                  styles.tabLabelActive,
              ]}
            >
              Profile
            </Text>
          </Pressable>
        </View>
      )}

      {loggedIn && drawer && (
        <Drawer
          go={go}
          close={() => setDrawer(false)}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 110, gap: 14 }, loginScreen: { flex: 1, backgroundColor: C.navy, padding: 22, alignItems: "center", justifyContent: "center", gap: 10 }, loginLogo: { width: 68, height: 68, borderRadius: 22, backgroundColor: C.teal, alignItems: "center", justifyContent: "center", marginBottom: 4 }, loginTitle: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 1 }, loginSubtitle: { color: "#C3DDE2", fontSize: 12, marginBottom: 24 }, loginCard: { width: "100%", backgroundColor: C.surface, borderRadius: 22, padding: 18, gap: 13 }, loginHint: { color: "#9DC7D0", fontSize: 11, marginTop: 10 }, header: { height: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }, headerTitle: { fontSize: 17, fontWeight: "800", color: C.navy, letterSpacing: 0.3 }, iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" }, hero: { backgroundColor: C.navy, borderRadius: 22, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }, eyebrow: { color: "#9DC7D0", fontSize: 10, fontWeight: "800", letterSpacing: 1 }, greeting: { color: "#fff", fontSize: 23, fontWeight: "800", marginTop: 8 }, clinic: { color: "#C3DDE2", fontSize: 13, marginTop: 5 }, avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }, avatarText: { color: "#fff", fontWeight: "800" }, sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }, sectionTitle: { fontSize: 15, fontWeight: "800", color: C.ink, textTransform: "uppercase", letterSpacing: 0.8 }, link: { color: C.teal, fontSize: 12, fontWeight: "800" }, metricGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 }, metricCard: { backgroundColor: C.surface, borderRadius: 18, padding: 14, width: "48%", minHeight: 128, borderWidth: 1, borderColor: C.line }, metricIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 12 }, metricLabel: { color: C.slate, fontSize: 11, fontWeight: "700" }, metricValue: { color: C.ink, fontSize: 28, fontWeight: "800", marginTop: 2 }, metricCaption: { color: C.slate, fontSize: 11 }, card: { backgroundColor: C.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.line }, cardTitle: { fontSize: 15, fontWeight: "800", color: C.ink }, shiftRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 }, shiftDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.teal }, rowTitle: { color: C.ink, fontSize: 14, fontWeight: "700" }, rowMeta: { color: C.slate, fontSize: 12, marginTop: 3 }, count: { color: C.slate, fontSize: 12, marginRight: 2 }, cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, livePill: { flexDirection: "row", gap: 5, alignItems: "center", backgroundColor: "#234563", paddingVertical: 5, paddingHorizontal: 9, borderRadius: 20 }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#63E6BE" }, liveText: { color: "#B8F5E6", fontSize: 9, fontWeight: "800" }, activityHeroTitle: { color: "#fff", fontSize: 21, fontWeight: "800", marginTop: 22 }, activityHeroMeta: { color: "#B7D1D6", fontSize: 12, marginTop: 6 }, progressTrack: { height: 7, borderRadius: 4, backgroundColor: "#2A4B66", marginTop: 20, overflow: "hidden" }, progressFill: { height: "100%", borderRadius: 4, backgroundColor: "#63E6BE" }, attendanceLine: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 }, attendanceMain: { color: "#fff", fontWeight: "800", fontSize: 13 }, attendanceMuted: { color: "#B7D1D6", fontSize: 12 }, primaryButton: { backgroundColor: C.teal, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }, primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 13 }, secondaryButton: { backgroundColor: C.aqua }, secondaryButtonText: { color: C.teal }, approvalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.line }, approvalRight: { flexDirection: "row", alignItems: "center", gap: 9 }, approvalNumber: { color: C.teal, fontWeight: "800", fontSize: 16 }, activityRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 }, smallAvatar: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.aqua, alignItems: "center", justifyContent: "center" }, smallAvatarText: { color: C.teal, fontWeight: "800" }, pageIntro: { color: C.slate, fontSize: 13, lineHeight: 19 }, pageTitle: { color: C.ink, fontSize: 22, fontWeight: "800" }, searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13 }, searchInput: { flex: 1, color: C.ink, paddingVertical: 13, paddingHorizontal: 10, fontSize: 13 }, filterRow: { flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }, chip: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 }, chipActive: { backgroundColor: C.aqua, borderColor: C.aqua }, chipText: { color: C.slate, fontSize: 11, fontWeight: "700" }, chipTextActive: { color: C.teal }, listCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }, employeeAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.aqua, alignItems: "center", justifyContent: "center" }, employeeAvatarText: { color: C.teal, fontWeight: "800" }, statusLine: { flexDirection: "row", gap: 5, alignItems: "center", marginTop: 6 }, statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.success }, statusText: { color: C.success, fontSize: 11, fontWeight: "700" }, shiftBadge: { width: 42, height: 42, backgroundColor: C.aqua, borderRadius: 13, alignItems: "center", justifyContent: "center" }, activityCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 16 }, activityCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }, activityFooter: { borderTopWidth: 1, borderTopColor: C.line, marginTop: 14, paddingTop: 12, flexDirection: "row", justifyContent: "space-between" }, tealText: { color: C.teal, fontWeight: "800" }, approvalCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 17, padding: 14, flexDirection: "row", alignItems: "center", gap: 11 }, approvalTag: { backgroundColor: "#FFF2D8", borderRadius: 9, paddingVertical: 8, paddingHorizontal: 7, width: 74, alignItems: "center" }, approvalTagText: { color: "#A8701D", fontSize: 9, fontWeight: "800", textAlign: "center" }, pendingText: { color: C.warning, fontSize: 11, marginTop: 5, fontWeight: "700" }, noticeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, notificationRow: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 11 }, notificationIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: C.aqua, alignItems: "center", justifyContent: "center" }, unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal }, timeText: { color: C.slate, fontSize: 10, marginTop: 8 }, emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 90, gap: 13 }, detailHero: { alignItems: "center", paddingVertical: 12 }, profileHero: { alignItems: "center", paddingVertical: 24 }, profileFormPhoto: { alignItems: "center", paddingBottom: 12 }, profilePhotoButton: { position: "relative", alignItems: "center", justifyContent: "center" }, profileImage: { width: "100%", height: "100%", borderRadius: 28 }, profileImageEdit: { position: "absolute", right: -2, bottom: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: C.teal, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: C.surface }, profileUploadHint: { color: C.teal, fontSize: 11, fontWeight: "700", marginTop: 8 }, profileAvatar: { width: 86, height: 86, borderRadius: 28, backgroundColor: C.navy, alignItems: "center", justifyContent: "center", marginBottom: 13, overflow: "hidden" }, profileAvatarText: { color: "#fff", fontSize: 25, fontWeight: "800" }, profileName: { fontSize: 23, fontWeight: "800", color: C.ink }, profileRole: { color: C.slate, fontSize: 12, marginTop: 5 }, statusPill: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 7, backgroundColor: C.aqua, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 }, detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }, field: { gap: 6 }, fieldLabel: { color: C.ink, fontSize: 12, fontWeight: "800" }, fieldHint: { color: C.slate, fontSize: 11, marginTop: -8, marginBottom: 12 }, input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 13, color: C.ink, padding: 13, fontSize: 13 }, textArea: { minHeight: 100, textAlignVertical: "top" }, switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }, settingLabel: { flexDirection: "row", alignItems: "center", gap: 12 }, monthHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, monthButton: { backgroundColor: C.aqua, padding: 11, borderRadius: 13 }, dayStrip: { gap: 8 }, dayCell: { width: 48, alignItems: "center", paddingVertical: 10, borderRadius: 13, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }, dayCellActive: { backgroundColor: C.teal, borderColor: C.teal }, dayNumber: { color: C.ink, fontWeight: "800", fontSize: 16 }, dayName: { color: C.slate, fontSize: 10, marginTop: 3 }, dayNumberActive: { color: "#fff" }, scheduleRow: { flexDirection: "row", gap: 11, alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }, scheduleTime: { width: 50, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" }, scheduleTimeText: { color: C.teal, fontWeight: "800", fontSize: 11 }, dateCard: { backgroundColor: C.aqua, borderRadius: 16, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, attendanceRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.line }, attendanceStatus: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" }, locationBox: { backgroundColor: C.canvas, padding: 14, borderRadius: 14, flexDirection: "row", gap: 12, alignItems: "center" }, photoPlaceholder: { height: 150, backgroundColor: C.canvas, borderRadius: 14, alignItems: "center", justifyContent: "center", gap: 8 }, metaList: { gap: 6 }, attendanceSummary: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }, selectionRow: { backgroundColor: C.aqua, borderRadius: 13, padding: 13, flexDirection: "row", gap: 9, alignItems: "center" }, assignmentPreview: { backgroundColor: C.aqua, borderRadius: 16, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }, participantRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line }, selectAll: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 5 }, selectionCount: { color: C.slate, textAlign: "center", fontSize: 12, marginTop: 4 }, approvalHeading: { backgroundColor: C.navy, borderRadius: 18, padding: 18, gap: 7 }, decisionRow: { flexDirection: "row", gap: 10 }, decisionButton: { flex: 1, borderRadius: 14, padding: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7 }, announcementCard: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 17, padding: 15, gap: 12 }, announcementTop: { flexDirection: "row", alignItems: "center", gap: 11 }, announcementIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.aqua, alignItems: "center", justifyContent: "center" }, announcementBody: { color: C.ink, lineHeight: 19, fontSize: 13 }, settingsRow: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }, headerActions: { flexDirection: "row", alignItems: "center", gap: 2 }, headerAvatar: { width: 32, height: 32, borderRadius: 11, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }, headerAvatarText: { color: "#fff", fontSize: 10, fontWeight: "900" }, summaryCard: { backgroundColor: C.surface, borderRadius: 20, padding: 12, borderWidth: 1, borderColor: C.line, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 }, overviewCard: { backgroundColor: C.surface, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: C.line }, overviewTitle: { color: C.ink, fontSize: 14, fontWeight: "800" }, overviewPercent: { color: C.navy, fontSize: 32, fontWeight: "900", textAlign: "center", marginTop: 14 }, overviewProgress: { height: 10, borderRadius: 5, backgroundColor: C.aqua, overflow: "hidden", marginTop: 12 }, overviewProgressFill: { width: "87%", height: "100%", borderRadius: 5, backgroundColor: C.teal }, overviewRows: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 }, overviewLabel: { color: C.slate, fontSize: 11, fontWeight: "700" }, overviewValue: { color: C.ink, fontSize: 18, fontWeight: "900", marginTop: 4 }, quickAccessGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 }, quickAccessItem: { width: "23.5%", minHeight: 84, backgroundColor: C.surface, borderRadius: 15, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center", paddingHorizontal: 4, gap: 7 }, quickAccessIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.aqua, alignItems: "center", justifyContent: "center" }, quickAccessLabel: { color: C.ink, fontSize: 10, fontWeight: "800", textAlign: "center" }, upcomingCard: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.line, paddingHorizontal: 16 }, upcomingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: C.line }, requestsCard: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.line, paddingHorizontal: 16 }, requestRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line }, pendingBadge: { backgroundColor: "#FFF2D8", borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 }, pendingBadgeText: { color: "#A8701D", fontSize: 10, fontWeight: "800" }, logoutRow: { padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 }, logoutText: { color: C.error, fontWeight: "800" }, tabBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 78, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line, flexDirection: "row", justifyContent: "space-around", paddingTop: 10 }, tabItem: { alignItems: "center", gap: 4, minWidth: 54, flex: 1 }, tabLabel: { color: C.slate, fontSize: 10, fontWeight: "700" }, tabLabelActive: { color: C.teal }, drawerOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, flexDirection: "row" }, drawerBackdrop: { flex: 1, backgroundColor: "rgba(16,42,67,0.32)" }, drawer: { width: "84%", backgroundColor: C.surface, paddingTop: 28, paddingHorizontal: 18, shadowColor: C.navy, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 }, drawerBrand: { flexDirection: "row", alignItems: "center", gap: 10, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: C.line }, drawerLogo: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.teal, alignItems: "center", justifyContent: "center" }, drawerTitle: { color: C.navy, fontWeight: "900", fontSize: 17, letterSpacing: 0.7 }, drawerSub: { color: C.slate, fontSize: 9, fontWeight: "800", letterSpacing: 1.1, marginTop: 2 }, drawerClose: { marginLeft: "auto", padding: 7 }, drawerItem: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 12 }, drawerItemText: { color: C.ink, fontSize: 13, fontWeight: "700", flex: 1 }, drawerBadge: { backgroundColor: C.error, borderRadius: 12, minWidth: 23, height: 23, alignItems: "center", justifyContent: "center" }, drawerBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});



















