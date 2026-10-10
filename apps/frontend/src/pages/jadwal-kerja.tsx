import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { Calendar as CalendarIcon, Plus, Users, Clock, MapPin, X, Save } from 'lucide-react';

export default function JadwalKerja() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkData, setBulkData] = useState<any>({
    employeeIds: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    shiftType: 'morning',
    startTime: '08:00',
    endTime: '17:00',
    location: 'Office',
  });
  const [formData, setFormData] = useState<any>({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'morning',
    startTime: '08:00',
    endTime: '17:00',
    location: 'Office',
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadEmployees();
    loadSchedules();
  }, [router, selectedDate, selectedEmployee]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await api.schedule.getAll(selectedEmployee || undefined, selectedDate, selectedDate);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await api.employee.getAll('active');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const handleCreate = () => {
    setFormData({
      employeeId: '',
      date: selectedDate,
      shiftType: 'morning',
      startTime: '08:00',
      endTime: '17:00',
      location: 'Office',
      notes: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.schedule.create(formData);
      alert('Jadwal berhasil ditambahkan');
      setShowModal(false);
      loadSchedules();
    } catch (error) {
      console.error('Failed to save schedule:', error);
      alert('Gagal menyimpan jadwal');
    }
  };

  const handleBulkCreate = () => {
    setBulkData({
      employeeIds: [],
      startDate: selectedDate,
      endDate: new Date(new Date(selectedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shiftType: 'morning',
      startTime: '08:00',
      endTime: '17:00',
      location: 'Office',
    });
    setShowBulkModal(true);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkData.employeeIds.length === 0) {
      alert('Pilih minimal 1 karyawan');
      return;
    }
    try {
      await api.schedule.createBulk(bulkData);
      alert(`Jadwal bulk berhasil dibuat untuk ${bulkData.employeeIds.length} karyawan`);
      setShowBulkModal(false);
      loadSchedules();
    } catch (error) {
      console.error('Failed to create bulk schedule:', error);
      alert('Gagal membuat jadwal bulk');
    }
  };

  const toggleEmployee = (empId: string) => {
    setBulkData((prev: any) => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(empId)
        ? prev.employeeIds.filter((id: string) => id !== empId)
        : [...prev.employeeIds, empId],
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus jadwal ini?')) return;
    try {
      await api.schedule.delete(id);
      alert('Jadwal berhasil dihapus');
      loadSchedules();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('Gagal menghapus jadwal');
    }
  };

  const getShiftColor = (shiftType: string) => {
    switch (shiftType) {
      case 'morning': return 'bg-blue-100 text-blue-800';
      case 'afternoon': return 'bg-orange-100 text-orange-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      case 'off': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftLabel = (shiftType: string) => {
    const labels: any = { morning: 'Pagi', afternoon: 'Siang', night: 'Malam', off: 'Libur' };
    return labels[shiftType] || shiftType;
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarIcon className="text-purple-600" size={36} />
              Jadwal Kerja
            </h1>
            <p className="text-gray-600 mt-1">Kelola jadwal shift karyawan</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 shadow-lg"
            >
              <Plus size={20} />
              Tambah Jadwal
            </button>
            <button
              onClick={handleBulkCreate}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-lg"
            >
              <Users size={20} />
              Bulk Schedule
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filter Karyawan:</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Semua Karyawan</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} - {emp.department}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Pilih Tanggal:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <div className="text-gray-700">
                <p className="text-sm font-medium mb-1">Total Jadwal:</p>
                <p className="text-2xl font-bold text-purple-600">{schedules.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">Loading...</div>
          ) : schedules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Belum ada jadwal untuk tanggal ini</p>
            </div>
          ) : (
            schedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {schedule.employee?.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{schedule.employee?.fullName}</h3>
                      <p className="text-sm text-gray-600">{schedule.employee?.department} - {schedule.employee?.position}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getShiftColor(schedule.shiftType)}`}>
                          {getShiftLabel(schedule.shiftType)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={16} />
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={16} />
                          {schedule.location}
                        </span>
                        {/* Attendance Realization */}
                        {schedule.attendance ? (
                          <div className="flex items-center gap-2">
                            {schedule.attendance.checkInTime && (
                              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                ✓ {new Date(schedule.attendance.checkInTime).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                            {schedule.attendance.status === 'late' && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                                Terlambat
                              </span>
                            )}
                            {schedule.attendance.checkOutTime && (
                              <span className="text-xs text-gray-500">
                                (Pulang: {new Date(schedule.attendance.checkOutTime).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })})
                              </span>
                            )}
                            {schedule.attendance.workDuration && (
                              <span className="text-xs text-gray-500">
                                - {Math.floor(schedule.attendance.workDuration / 60)}j {schedule.attendance.workDuration % 60}m
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Belum absen</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                        <MapPin size={14} />
                        <span>{schedule.location}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                {schedule.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{schedule.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="bg-purple-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-white">Tambah Jadwal Kerja</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-purple-700 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Karyawan *</label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Pilih Karyawan</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} - {emp.department}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift *</label>
                    <select
                      required
                      value={formData.shiftType}
                      onChange={(e) => {
                        const shift = e.target.value;
                        let times = { start: '08:00', end: '17:00' };
                        if (shift === 'afternoon') times = { start: '14:00', end: '22:00' };
                        if (shift === 'night') times = { start: '22:00', end: '06:00' };
                        setFormData({ ...formData, shiftType: shift, startTime: times.start, endTime: times.end });
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="morning">Pagi (08:00 - 17:00)</option>
                      <option value="afternoon">Siang (14:00 - 22:00)</option>
                      <option value="night">Malam (22:00 - 06:00)</option>
                      <option value="off">Libur</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jam Mulai</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jam Selesai</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Office">Kantor</option>
                      <option value="Remote">Remote</option>
                      <option value="Field">Lapangan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Save size={18} />
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-green-600 px-6 py-4 flex justify-between items-center rounded-t-xl sticky top-0">
                <h2 className="text-2xl font-bold text-white">Buat Jadwal Bulk</h2>
                <button onClick={() => setShowBulkModal(false)} className="text-white hover:bg-green-700 p-2 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleBulkSubmit} className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-900">
                      Buat jadwal untuk multiple karyawan sekaligus dalam range tanggal tertentu
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai *</label>
                      <input
                        type="date"
                        required
                        value={bulkData.startDate}
                        onChange={(e) => setBulkData({ ...bulkData, startDate: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai *</label>
                      <input
                        type="date"
                        required
                        value={bulkData.endDate}
                        onChange={(e) => setBulkData({ ...bulkData, endDate: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift *</label>
                    <select
                      required
                      value={bulkData.shiftType}
                      onChange={(e) => {
                        const shift = e.target.value;
                        let times = { start: '08:00', end: '17:00' };
                        if (shift === 'afternoon') times = { start: '14:00', end: '22:00' };
                        if (shift === 'night') times = { start: '22:00', end: '06:00' };
                        setBulkData({ ...bulkData, shiftType: shift, startTime: times.start, endTime: times.end });
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="morning">Pagi (08:00 - 17:00)</option>
                      <option value="afternoon">Siang (14:00 - 22:00)</option>
                      <option value="night">Malam (22:00 - 06:00)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jam Mulai</label>
                      <input
                        type="time"
                        value={bulkData.startTime}
                        onChange={(e) => setBulkData({ ...bulkData, startTime: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jam Selesai</label>
                      <input
                        type="time"
                        value={bulkData.endTime}
                        onChange={(e) => setBulkData({ ...bulkData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                    <select
                      value={bulkData.location}
                      onChange={(e) => setBulkData({ ...bulkData, location: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Office">Kantor</option>
                      <option value="Remote">Remote</option>
                      <option value="Field">Lapangan</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pilih Karyawan * ({bulkData.employeeIds.length} dipilih)
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                      {employees.map(emp => (
                        <label key={emp.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bulkData.employeeIds.includes(emp.id)}
                            onChange={() => toggleEmployee(emp.id)}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm">{emp.fullName} - {emp.department}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowBulkModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Save size={18} />
                    Buat Bulk Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
