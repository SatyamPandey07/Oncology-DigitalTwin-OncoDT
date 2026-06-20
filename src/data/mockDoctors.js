export const MOCK_DOCTORS = [
  {
    id: 'doc-001',
    username: 'dr.mehta',
    password: 'onco2024', // mock auth password
    name: 'Dr. Anjali Mehta, MD, PhD',
    specialty: 'Breast Oncology Specialist',
    hospital: 'Metro Cancer Institute',
    email: 'a.mehta@metrocancer.org',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-002',
    username: 'dr.chen',
    password: 'onco2024',
    name: 'Dr. Robert Chen, MD',
    specialty: 'Thoracic Oncology Specialist',
    hospital: 'Metro Cancer Institute',
    email: 'r.chen@metrocancer.org',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-003',
    username: 'dr.adams',
    password: 'onco2024',
    name: 'Dr. Sarah Adams, MD',
    specialty: 'Gastrointestinal & Gyn Oncology',
    hospital: 'Metro Cancer Institute',
    email: 's.adams@metrocancer.org',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200'
  }
];

export const authenticateDoctor = (username, password) => {
  return MOCK_DOCTORS.find(
    doc => doc.username.toLowerCase() === username.toLowerCase() && doc.password === password
  );
};
