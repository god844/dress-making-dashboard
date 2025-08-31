import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Filter, Eye, Save, X, Calendar, Users, Activity, Award, Heart, Dumbbell, Book, Ruler, Scissors, Home, Palette } from 'lucide-react';

const DressMakingDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    gender: '',
    sport: '',
    house: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  // House/Squad colors
  const houses = [
    { id: 'red', name: 'Red Eagles', color: '#dc2626', lightColor: '#fecaca', darkColor: '#991b1b' },
    { id: 'blue', name: 'Blue Hawks', color: '#2563eb', lightColor: '#dbeafe', darkColor: '#1d4ed8' },
    { id: 'green', name: 'Green Lions', color: '#059669', lightColor: '#dcfce7', darkColor: '#047857' },
    { id: 'yellow', name: 'Yellow Tigers', color: '#d97706', lightColor: '#fef3c7', darkColor: '#b45309' },
    { id: 'purple', name: 'Purple Panthers', color: '#7c3aed', lightColor: '#e9d5ff', darkColor: '#5b21b6' },
    { id: 'orange', name: 'Orange Falcons', color: '#ea580c', lightColor: '#fed7aa', darkColor: '#c2410c' }
  ];

  // Sample student database for auto-fill simulation
  const studentDatabase = [
    { registerNumber: 'REG2024001', name: 'Arjun Kumar', class: '12th', division: 'A', dateOfBirth: '2006-05-15', gender: 'Male' },
    { registerNumber: 'REG2024002', name: 'Priya Sharma', class: '11th', division: 'B', dateOfBirth: '2007-03-22', gender: 'Female' },
    { registerNumber: 'REG2024003', name: 'Rahul Singh', class: '12th', division: 'A', dateOfBirth: '2006-08-10', gender: 'Male' },
    { registerNumber: 'REG2024004', name: 'Sneha Patel', class: '10th', division: 'C', dateOfBirth: '2008-01-18', gender: 'Female' },
  ];

  // Medical conditions list
  const medicalConditions = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'asthma', label: 'Asthma' },
    { id: 'heartCondition', label: 'Heart Condition' },
    { id: 'backPain', label: 'Back Pain' },
    { id: 'kneeInjury', label: 'Knee Injury' },
    { id: 'ankleInjury', label: 'Ankle Injury' },
    { id: 'shoulderInjury', label: 'Shoulder Injury' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'epilepsy', label: 'Epilepsy' },
    { id: 'migraines', label: 'Migraines' },
    { id: 'visionProblems', label: 'Vision Problems' }
  ];

  // Initial form state with all measurements
  const initialFormState = {
    // Personal & Academic Data
    name: '', registerNumber: '', rollNumber: '', class: '', division: '',
    dateOfBirth: '', age: '', gender: '', house: '',
    
    // Basic Physical Data
    height: '', weight: '', bmi: '',
    
    // Medical History (checkboxes)
    medicalConditions: {}, customMedicalConditions: '', fitnessRestrictions: '',
    
    // Activities
    ncc: false, nss: false, otherClubs: '',
    
    // Health Records
    pulseRate: '', bloodPressure: '', vision: '', lungCapacity: '',
    
    // Common Body Measurements
    chestBustCircumference: '', waistCircumference: '', hipCircumference: '',
    shoulderWidth: '', armholeCircumference: '', neckCircumference: '',
    shortSleeveLength: '', longSleeveLength: '', armLength: '', backLength: '',
    shirtTopLength: '', trouserPantLength: '', inseam: '', thighCircumference: '',
    kneeCircumference: '',
    
    // Boys Specific
    shortsLength: '',
    
    // Girls Specific
    pinaforeLength: '', skirtLength: '', kurtaTopLength: '', kurtaPantLength: '',
    bustFittingDarts: '', bloomersLength: '',
    
    // Accessories
    shoeSize: '', sockLength: '', beltWaistSize: '', tieLength: '', capSize: '',
    hairAccessorySize: '',
    
    // Fitness Tests
    sprint50m: '', sprint100m: '', longJump: '', highJump: '', shotPut: '',
    endurance600m: '', shuttleRun: '', sitReach: '', pushUps: '', sitUps: '', pullUps: '',
    
    // Sports Data
    primarySport: '', secondarySport: '', tournaments: '', achievements: '', attendance: '',
    
    // Additional Data
    yogaParticipation: false, gymAttendance: '', specialTraining: '', teacherRemarks: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return '';
  };

  // Auto-fill student data from register number
  const handleRegisterNumberChange = (registerNumber) => {
    setFormData(prev => ({ ...prev, registerNumber }));
    
    const student = studentDatabase.find(s => s.registerNumber === registerNumber);
    if (student) {
      const age = calculateAge(student.dateOfBirth);
      setFormData(prev => ({
        ...prev,
        name: student.name,
        class: student.class,
        division: student.division,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        age: age.toString()
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate BMI when weight or height changes
      if (field === 'weight' || field === 'height') {
        updated.bmi = calculateBMI(
          field === 'weight' ? value : prev.weight,
          field === 'height' ? value : prev.height
        );
      }
      
      // Auto-calculate age when date of birth changes
      if (field === 'dateOfBirth') {
        updated.age = calculateAge(value).toString();
      }
      
      return updated;
    });
  };

  // Handle medical conditions
  const handleMedicalConditionChange = (conditionId, checked) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: {
        ...prev.medicalConditions,
        [conditionId]: checked
      }
    }));
  };

  // Save student data
  const saveStudent = () => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.registerNumber === editingStudent.registerNumber ? formData : s));
      setEditingStudent(null);
    } else {
      setStudents(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setFormData(initialFormState);
    setShowForm(false);
    setActiveTab('students');
  };

  // Edit student
  const editStudent = (student) => {
    setFormData(student);
    setEditingStudent(student);
    setShowForm(true);
    setActiveTab('entry');
  };

  // Filter students
  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.class) {
      filtered = filtered.filter(student => student.class === filters.class);
    }
    
    if (filters.gender) {
      filtered = filtered.filter(student => student.gender === filters.gender);
    }
    
    if (filters.sport) {
      filtered = filtered.filter(student => 
        student.primarySport === filters.sport || student.secondarySport === filters.sport
      );
    }

    if (filters.house) {
      filtered = filtered.filter(student => student.house === filters.house);
    }
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, filters]);

  const stats = {
    totalStudents: students.length,
    maleStudents: students.filter(s => s.gender === 'Male').length,
    femaleStudents: students.filter(s => s.gender === 'Female').length,
    activeParticipants: students.filter(s => s.primarySport).length,
    houseStats: houses.map(house => ({
      ...house,
      count: students.filter(s => s.house === house.id).length
    }))
  };

  // Get house colors for a student
  const getHouseColors = (houseId) => {
    const house = houses.find(h => h.id === houseId);
    return house || { color: '#6b7280', lightColor: '#f3f4f6', darkColor: '#4b5563' };
  };

  // Training Guide Component
  const TrainingGuide = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '0.75rem', maxWidth: '64rem',
        width: '100%', maxHeight: '90vh', overflowY: 'auto',
        animation: 'slideInUp 0.4s ease-out', transform: 'translateY(0)'
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center' }}>
              <Book style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem', color: '#2563eb' }} />
              Measurement Training Guide
            </h3>
            <button
              onClick={() => setShowTraining(false)}
              style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={(e) => {
                e.target.style.color = '#dc2626';
                e.target.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#9ca3af';
                e.target.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              <X style={{ height: '1.5rem', width: '1.5rem' }} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2563eb' }}>Basic Body Measurements</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem', animation: 'slideInLeft 0.6s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Height</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Stand straight against wall, measure from floor to top of head</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem', animation: 'slideInLeft 0.7s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Chest/Bust</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Measure around fullest part of chest, tape parallel to floor</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', borderRadius: '0.5rem', animation: 'slideInLeft 0.8s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Waist</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Measure at natural waistline, above hip bones</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', animation: 'slideInLeft 0.9s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Hip</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Measure around fullest part of hips</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#059669' }}>Specialized Measurements</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', animation: 'slideInRight 0.6s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Shoulder Width</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Measure from shoulder point to shoulder point across back</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#eef2ff', borderRadius: '0.5rem', animation: 'slideInRight 0.7s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Sleeve Length</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>From shoulder point to wrist with arm slightly bent</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#fdf2f8', borderRadius: '0.5rem', animation: 'slideInRight 0.8s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Inseam</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>From crotch to ankle along inside of leg</p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '0.5rem', animation: 'slideInRight 0.9s ease-out' }}>
                  <h5 style={{ fontWeight: '500', color: '#1f2937' }}>Back Length</h5>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>From base of neck to desired length point</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', animation: 'fadeIn 1s ease-out' }}>
            <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Measurement Tips</h4>
            <ul style={{ fontSize: '0.875rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: 0, paddingLeft: '1rem' }}>
              <li>Use a flexible measuring tape</li>
              <li>Keep tape snug but not tight</li>
              <li>Take measurements over undergarments</li>
              <li>Record measurements in centimeters</li>
              <li>Double-check important measurements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out' }}>
      {/* Stats Cards with enhanced animations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', padding: '1.5rem',
          borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
          animation: 'slideInUp 0.6s ease-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(219, 234, 254, 0.8)' }}>Total Students</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', animation: 'countUp 1s ease-out' }}>{stats.totalStudents}</p>
            </div>
            <Users style={{ height: '3rem', width: '3rem', color: 'rgba(219, 234, 254, 0.6)' }} />
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '1.5rem',
          borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
          animation: 'slideInUp 0.7s ease-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(167, 243, 208, 0.8)' }}>Male Students</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', animation: 'countUp 1.2s ease-out' }}>{stats.maleStudents}</p>
            </div>
            <Activity style={{ height: '3rem', width: '3rem', color: 'rgba(167, 243, 208, 0.6)' }} />
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', padding: '1.5rem',
          borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
          animation: 'slideInUp 0.8s ease-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(196, 181, 253, 0.8)' }}>Female Students</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', animation: 'countUp 1.4s ease-out' }}>{stats.femaleStudents}</p>
            </div>
            <Heart style={{ height: '3rem', width: '3rem', color: 'rgba(196, 181, 253, 0.6)' }} />
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', padding: '1.5rem',
          borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
          animation: 'slideInUp 0.9s ease-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(254, 215, 170, 0.8)' }}>Measured Students</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 'bold', animation: 'countUp 1.6s ease-out' }}>{stats.activeParticipants}</p>
            </div>
            <Ruler style={{ height: '3rem', width: '3rem', color: 'rgba(254, 215, 170, 0.6)' }} />
          </div>
        </div>
      </div>

      {/* House Distribution Cards */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem', animation: 'slideInUp 1s ease-out' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937', display: 'flex', alignItems: 'center' }}>
          <Home style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#2563eb' }} />
          House/Squad Distribution
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {stats.houseStats.map((house, index) => (
            <div key={house.id} style={{
              padding: '1rem',
              background: `linear-gradient(135deg, ${house.lightColor}, ${house.color}20)`,
              border: `2px solid ${house.color}`,
              borderRadius: '0.75rem',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              animation: `slideInUp ${1.2 + index * 0.1}s ease-out`
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05) translateY(-3px)';
              e.target.style.boxShadow = `0 10px 25px -5px ${house.color}40`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{
                width: '3rem', height: '3rem', margin: '0 auto 0.5rem',
                backgroundColor: house.color, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '1.125rem'
              }}>
                {house.count}
              </div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: house.darkColor }}>{house.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Training Guide Button */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem', animation: 'slideInUp 1.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Quick Access</h3>
            <p style={{ color: '#6b7280' }}>Access training materials and guides</p>
          </div>
          <button
            onClick={() => setShowTraining(true)}
            style={{
              display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem',
              border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1d4ed8';
              e.target.style.transform = 'scale(1.05) translateY(-2px)';
              e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Book style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
            Measurement Training Guide
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{
        backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem', transition: 'box-shadow 0.3s', animation: 'slideInUp 1.6s ease-out'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Recent Activities</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {students.slice(-5).map((student, index) => {
            const houseColors = getHouseColors(student.house);
            return (
              <div key={index} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideInLeft ${0.6 + index * 0.1}s ease-out`
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.transform = 'translateX(0)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2.5rem', height: '2.5rem',
                    background: student.house ? `linear-gradient(135deg, ${houseColors.color}, ${houseColors.darkColor})` : 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontWeight: 'bold',
                    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: '#1f2937' }}>{student.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{student.class} - {student.division}</p>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.875rem', color: '#6b7280', backgroundColor: '#dcfce7',
                  padding: '0.25rem 0.5rem', borderRadius: '9999px'
                }}>Recently added</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDataEntry = () => (
    <div style={{
      backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem', transition: 'box-shadow 0.3s', animation: 'fadeIn 0.6s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center' }}>
          <Scissors style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem', color: '#2563eb' }} />
          {editingStudent ? 'Edit Student Data' : 'Student Data Entry'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowTraining(true)}
            style={{
              display: 'flex', alignItems: 'center', padding: '0.5rem 1rem',
              backgroundColor: '#059669', color: 'white', borderRadius: '0.5rem',
              border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#047857';
              e.target.style.transform = 'scale(1.05) translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'scale(1) translateY(0)';
            }}
          >
            <Book style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
            Training Guide
          </button>
          {editingStudent && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setFormData(initialFormState);
              }}
              style={{
                color: '#dc2626', background: 'none', border: 'none',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#991b1b';
                e.target.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#dc2626';
                e.target.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              <X style={{ height: '1.5rem', width: '1.5rem' }} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Personal & Academic Data */}
        <div style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <h4 style={{
            fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
            color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem',
            display: 'flex', alignItems: 'center'
          }}>
            <Users style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#2563eb' }} />
            Personal & Academic Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Register Number *
              </label>
              <input
                type="text"
                value={formData.registerNumber}
                onChange={(e) => handleRegisterNumberChange(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="REG2024001"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Roll Number
              </label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Class *
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="e.g., 10th, 11th, 12th"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Division *
              </label>
              <input
                type="text"
                value={formData.division}
                onChange={(e) => handleInputChange('division', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="e.g., A, B, C"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                readOnly
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: '#f9fafb'
                }}
              />
            </div>

            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* House Selection */}
            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                House/Squad
              </label>
              <select
                value={formData.house}
                onChange={(e) => handleInputChange('house', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <option value="">Select House/Squad</option>
                {houses.map(house => (
                  <option key={house.id} value={house.id}>{house.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* House Color Preview */}
          {formData.house && (
            <div style={{
              marginTop: '1rem', padding: '0.75rem',
              background: `linear-gradient(135deg, ${getHouseColors(formData.house).lightColor}, ${getHouseColors(formData.house).color}20)`,
              border: `2px solid ${getHouseColors(formData.house).color}`,
              borderRadius: '0.5rem', display: 'flex', alignItems: 'center',
              animation: 'slideInDown 0.4s ease-out'
            }}>
              <Palette style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: getHouseColors(formData.house).darkColor }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: getHouseColors(formData.house).darkColor }}>
                Selected: {houses.find(h => h.id === formData.house)?.name}
              </span>
            </div>
          )}
        </div>

        {/* Basic Physical Data */}
        <div style={{ animation: 'slideInUp 0.7s ease-out' }}>
          <h4 style={{
            fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
            color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem',
            display: 'flex', alignItems: 'center'
          }}>
            <Activity style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#059669' }} />
            Basic Physical Measurements
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>BMI</label>
              <input
                type="text"
                value={formData.bmi}
                readOnly
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: '#f9fafb'
                }}
              />
            </div>
          </div>
        </div>

        {/* Medical History with Checkboxes */}
        <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
          <h4 style={{
            fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
            color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem',
            display: 'flex', alignItems: 'center'
          }}>
            <Heart style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#dc2626' }} />
            Medical History & Health Conditions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {medicalConditions.map((condition, index) => (
                <div key={condition.id} style={{
                  display: 'flex', alignItems: 'center', padding: '0.75rem',
                  backgroundColor: '#f9fafb', borderRadius: '0.5rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                  animation: `slideInLeft ${0.6 + index * 0.05}s ease-out`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'scale(1.02) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.transform = 'scale(1) translateY(0)';
                }}>
                  <input
                    type="checkbox"
                    id={condition.id}
                    checked={formData.medicalConditions[condition.id] || false}
                    onChange={(e) => handleMedicalConditionChange(condition.id, e.target.checked)}
                    style={{
                      marginRight: '0.75rem', height: '1rem', width: '1rem',
                      accentColor: '#2563eb', cursor: 'pointer', transition: 'transform 0.2s'
                    }}
                  />
                  <label htmlFor={condition.id} style={{
                    fontSize: '0.875rem', fontWeight: '500', color: '#374151', cursor: 'pointer'
                  }}>
                    {condition.label}
                  </label>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                  Custom Medical Conditions
                </label>
                <textarea
                  value={formData.customMedicalConditions}
                  onChange={(e) => handleInputChange('customMedicalConditions', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', resize: 'vertical', minHeight: '80px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  placeholder="Any other medical conditions not listed above..."
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.01)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                  Fitness Restrictions
                </label>
                <textarea
                  value={formData.fitnessRestrictions}
                  onChange={(e) => handleInputChange('fitnessRestrictions', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', resize: 'vertical', minHeight: '80px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  placeholder="Any restrictions for physical activities..."
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.01)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <label style={{
                display: 'flex', alignItems: 'center', padding: '0.75rem',
                backgroundColor: '#dbeafe', borderRadius: '0.5rem',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 0.8s ease-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#bfdbfe';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dbeafe';
                e.target.style.transform = 'scale(1) translateY(0)';
              }}>
                <input
                  type="checkbox"
                  checked={formData.ncc}
                  onChange={(e) => handleInputChange('ncc', e.target.checked)}
                  style={{ marginRight: '0.5rem', height: '1rem', width: '1rem', accentColor: '#2563eb' }}
                />
                NCC Participation
              </label>
              
              <label style={{
                display: 'flex', alignItems: 'center', padding: '0.75rem',
                backgroundColor: '#dcfce7', borderRadius: '0.5rem',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 0.9s ease-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#bbf7d0';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dcfce7';
                e.target.style.transform = 'scale(1) translateY(0)';
              }}>
                <input
                  type="checkbox"
                  checked={formData.nss}
                  onChange={(e) => handleInputChange('nss', e.target.checked)}
                  style={{ marginRight: '0.5rem', height: '1rem', width: '1rem', accentColor: '#059669' }}
                />
                NSS Participation
              </label>
              
              <label style={{
                display: 'flex', alignItems: 'center', padding: '0.75rem',
                backgroundColor: '#f3e8ff', borderRadius: '0.5rem',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 1s ease-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e9d5ff';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3e8ff';
                e.target.style.transform = 'scale(1) translateY(0)';
              }}>
                <input
                  type="checkbox"
                  checked={formData.yogaParticipation}
                  onChange={(e) => handleInputChange('yogaParticipation', e.target.checked)}
                  style={{ marginRight: '0.5rem', height: '1rem', width: '1rem', accentColor: '#7c3aed' }}
                />
                Yoga Participation
              </label>
            </div>
          </div>
        </div>

        {/* Health Records */}
        <div style={{ animation: 'slideInUp 0.9s ease-out' }}>
          <h4 style={{
            fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
            color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem',
            display: 'flex', alignItems: 'center'
          }}>
            <Heart style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#ec4899' }} />
            Health Records
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Pulse Rate (bpm)</label>
              <input
                type="number"
                value={formData.pulseRate}
                onChange={(e) => handleInputChange('pulseRate', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="70-100"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Blood Pressure</label>
              <input
                type="text"
                value={formData.bloodPressure}
                onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="120/80"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Vision</label>
              <input
                type="text"
                value={formData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="20/20"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Lung Capacity (ml)</label>
              <input
                type="number"
                value={formData.lungCapacity}
                onChange={(e) => handleInputChange('lungCapacity', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="3000-5000"
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Body Measurements for Dress Making */}
        <div style={{ animation: 'slideInUp 1s ease-out' }}>
          <h4 style={{
            fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
            color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem',
            display: 'flex', alignItems: 'center'
          }}>
            <Ruler style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#4f46e5' }} />
            Body Measurements for Dress Making
          </h4>
          
          {/* Common Measurements */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem', color: '#4f46e5' }}>
              Common Measurements (Both)
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { field: 'chestBustCircumference', label: 'Chest/Bust Circumference (cm)' },
                { field: 'waistCircumference', label: 'Waist Circumference (cm)' },
                { field: 'hipCircumference', label: 'Hip Circumference (cm)' },
                { field: 'shoulderWidth', label: 'Shoulder Width (cm)' },
                { field: 'neckCircumference', label: 'Neck Circumference (cm)' },
                { field: 'armholeCircumference', label: 'Armhole Circumference (cm)' },
                { field: 'shortSleeveLength', label: 'Short Sleeve Length (cm)' },
                { field: 'longSleeveLength', label: 'Long Sleeve Length (cm)' },
                { field: 'backLength', label: 'Back Length (cm)' },
                { field: 'shirtTopLength', label: 'Shirt/Top Length (cm)' },
                { field: 'trouserPantLength', label: 'Trouser/Pant Length (cm)' },
                { field: 'inseam', label: 'Inseam (cm)' },
                { field: 'thighCircumference', label: 'Thigh Circumference (cm)' },
                { field: 'kneeCircumference', label: 'Knee Circumference (cm)' }
              ].map((measurement, index) => (
                <div key={index} style={{
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideInUp ${1 + index * 0.03}s ease-out`
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    {measurement.label}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData[measurement.field]}
                    onChange={(e) => handleInputChange(measurement.field, e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Boys Specific */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem', color: '#2563eb' }}>
              Boys-Specific Measurements
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInLeft 1.2s ease-out'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                  Shorts Length (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.shortsLength}
                  onChange={(e) => handleInputChange('shortsLength', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Girls Specific */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem', color: '#ec4899' }}>
              Girls-Specific Measurements
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { field: 'pinaforeLength', label: 'Pinafore Length (cm)' },
                { field: 'skirtLength', label: 'Skirt/Skorts Length (cm)' },
                { field: 'kurtaTopLength', label: 'Kurta Top Length (cm)' },
                { field: 'kurtaPantLength', label: 'Kurta Pant Length (cm)' },
                { field: 'bustFittingDarts', label: 'Bust Fitting Darts' },
                { field: 'bloomersLength', label: 'Bloomers Length (cm)' }
              ].map((measurement, index) => (
                <div key={index} style={{
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideInRight ${1.3 + index * 0.1}s ease-out`
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    {measurement.label}
                  </label>
                  <input
                    type={measurement.field === 'bustFittingDarts' ? 'text' : 'number'}
                    step={measurement.field === 'bustFittingDarts' ? undefined : '0.5'}
                    value={formData[measurement.field]}
                    onChange={(e) => handleInputChange(measurement.field, e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    placeholder={measurement.field === 'bustFittingDarts' ? 'Dart measurements' : ''}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.75rem', color: '#7c3aed' }}>
              Accessories (Both Boys & Girls)
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 1.8s ease-out'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Shoe Size</label>
                <input
                  type="text"
                  value={formData.shoeSize}
                  onChange={(e) => handleInputChange('shoeSize', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  placeholder="e.g., 8, 9, 10"
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 1.9s ease-out'
              }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Sock Length</label>
                <select
                  value={formData.sockLength}
                  onChange={(e) => handleInputChange('sockLength', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <option value="">Select Length</option>
                  <option value="Ankle">Ankle</option>
                  <option value="Calf">Calf</option>
                  <option value="Knee">Knee</option>
                </select>
              </div>
              
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 2s ease-out'
              }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Belt Waist Size (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.beltWaistSize}
                  onChange={(e) => handleInputChange('beltWaistSize', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 2.1s ease-out'
              }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Tie Length (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.tieLength}
                  onChange={(e) => handleInputChange('tieLength', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 2.2s ease-out'
              }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Cap Size (head circumference in cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.capSize}
                  onChange={(e) => handleInputChange('capSize', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'slideInUp 2.3s ease-out'
              }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Hair Accessory Size (Girls)</label>
                <select
                  value={formData.hairAccessorySize}
                  onChange={(e) => handleInputChange('hairAccessorySize', e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                    borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sports Data */}
        <div style={{ animation: 'slideInUp 2.4s ease-out' }}>
          <h4 style={{
            fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem',
            color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem',
            display: 'flex', alignItems: 'center'
          }}>
            <Award style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#f59e0b' }} />
            Sports & Activities
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'slideInLeft 2.5s ease-out'
            }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Primary Sport</label>
              <select
                value={formData.primarySport}
                onChange={(e) => handleInputChange('primarySport', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <option value="">Select Sport</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Athletics">Athletics</option>
                <option value="Swimming">Swimming</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>
            
            <div style={{
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'slideInRight 2.5s ease-out'
            }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Secondary Sport</label>
              <select
                value={formData.secondarySport}
                onChange={(e) => handleInputChange('secondarySport', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <option value="">Select Sport</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Athletics">Athletics</option>
                <option value="Swimming">Swimming</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>
            
            <div style={{ gridColumn: '1 / -1', animation: 'slideInUp 2.6s ease-out' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Achievements & Awards</label>
              <textarea
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', border: '1px solid #d1d5db',
                  borderRadius: '0.5rem', fontSize: '0.875rem', resize: 'vertical', minHeight: '80px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="List medals, certificates, tournament participations..."
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.01)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', animation: 'slideInUp 2.7s ease-out' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={saveStudent}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: 'white', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #6d28d9)';
                e.target.style.transform = 'scale(1.05) translateY(-3px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Save style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
              {editingStudent ? 'Update Student' : 'Save Student'}
            </button>
            
            <button
              onClick={() => {
                setFormData(initialFormState);
                setEditingStudent(null);
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.75rem 2rem', backgroundColor: '#4b5563', color: 'white',
                borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#374151';
                e.target.style.transform = 'scale(1.05) translateY(-3px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4b5563';
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentsList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.6s ease-out' }}>
      {/* Search and Filter Bar */}
      <div style={{
        backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem', transition: 'box-shadow 0.3s', animation: 'slideInDown 0.6s ease-out'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search by name, register number, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem',
                  border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', padding: '0.75rem 1rem',
                backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '0.5rem',
                border: 'none', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.transform = 'scale(1) translateY(0)';
              }}
            >
              <Filter style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
              Filters
            </button>
            
            <button
              onClick={() => {
                setShowForm(true);
                setActiveTab('entry');
              }}
              style={{
                display: 'flex', alignItems: 'center', padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white',
                borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #6d28d9)';
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Plus style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem' }} />
              Add Student
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{
              marginTop: '1rem', padding: '1rem',
              background: 'linear-gradient(135deg, #f9fafb, #dbeafe)',
              borderRadius: '0.5rem', animation: 'slideInDown 0.4s ease-out'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    Class
                  </label>
                  <select
                    value={filters.class}
                    onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">All Classes</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
                
                <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    Primary Sport
                  </label>
                  <select
                    value={filters.sport}
                    onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">All Sports</option>
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Athletics">Athletics</option>
                  </select>
                </div>

                <div style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateY(0)'}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                    House/Squad
                  </label>
                  <select
                    value={filters.house}
                    onChange={(e) => setFilters(prev => ({ ...prev, house: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                      borderRadius: '0.5rem', fontSize: '0.875rem', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">All Houses</option>
                    {houses.map(house => (
                      <option key={house.id} value={house.id}>{house.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setFilters({ class: '', gender: '', sport: '', house: '' })}
                  style={{
                    padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #4b5563, #374151)',
                    color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                    fontSize: '0.875rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #374151, #1f2937)';
                    e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #4b5563, #374151)';
                    e.target.style.transform = 'scale(1) translateY(0)';
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div style={{
        backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden', transition: 'box-shadow 0.3s', animation: 'slideInUp 0.8s ease-out'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'linear-gradient(135deg, #f9fafb, #dbeafe)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>House</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Physical</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Measurements</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Sport</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {filteredStudents.map((student, index) => {
                const houseColors = getHouseColors(student.house);
                return (
                  <tr key={index} style={{
                    borderTop: '1px solid #e5e7eb',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `slideInLeft ${0.6 + index * 0.1}s ease-out`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = student.house
                      ? `linear-gradient(135deg, ${houseColors.lightColor}, ${houseColors.color}20)`
                      : 'linear-gradient(135deg, #dbeafe, #f3e8ff)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.transform = 'scale(1)';
                  }}>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '3rem', height: '3rem',
                          background: student.house 
                            ? `linear-gradient(135deg, ${houseColors.color}, ${houseColors.darkColor})`
                            : 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white', fontWeight: 'bold',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: student.house ? `2px solid ${houseColors.color}` : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.15) rotate(10deg)';
                          e.target.style.boxShadow = `0 8px 25px -5px ${student.house ? houseColors.color : '#3b82f6'}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1) rotate(0deg)';
                          e.target.style.boxShadow = 'none';
                        }}>
                          {student.name.charAt(0)}
                        </div>
                        <div style={{ marginLeft: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{student.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{student.registerNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>{student.class} - {student.division}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{student.gender}, Age {student.age}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      {student.house ? (
                        <span style={{
                          padding: '0.25rem 0.75rem', display: 'inline-flex', fontSize: '0.75rem',
                          fontWeight: '600', borderRadius: '9999px', alignItems: 'center',
                          background: `linear-gradient(135deg, ${houseColors.lightColor}, ${houseColors.color}20)`,
                          color: houseColors.darkColor, border: `1px solid ${houseColors.color}`
                        }}>
                          <Home style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                          {houses.find(h => h.id === student.house)?.name.split(' ')[0]}
                        </span>
                      ) : (
                        <span style={{
                          padding: '0.25rem 0.75rem', display: 'inline-flex', fontSize: '0.75rem',
                          fontWeight: '600', borderRadius: '9999px',
                          backgroundColor: '#f3f4f6', color: '#6b7280'
                        }}>
                          No House
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                        {student.height && student.weight ? `${student.height}cm, ${student.weight}kg` : 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>BMI: {student.bmi || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                        {student.chestBustCircumference ? `Chest: ${student.chestBustCircumference}cm` : 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {student.waistCircumference ? `Waist: ${student.waistCircumference}cm` : 'Measurements pending'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem', display: 'inline-flex', fontSize: '0.75rem',
                        fontWeight: '600', borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #dcfce7, #dbeafe)', color: '#059669'
                      }}>
                        {student.primarySport || 'None'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '500' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => editStudent(student)}
                          style={{
                            color: '#2563eb', background: 'none', border: 'none',
                            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            padding: '0.25rem', borderRadius: '0.25rem'
                          }}
                          title="Edit Student"
                          onMouseEnter={(e) => {
                            e.target.style.color = '#1d4ed8';
                            e.target.style.transform = 'scale(1.2) rotate(-5deg)';
                            e.target.style.backgroundColor = '#dbeafe';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#2563eb';
                            e.target.style.transform = 'scale(1) rotate(0deg)';
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Edit3 style={{ height: '1.25rem', width: '1.25rem' }} />
                        </button>
                        <button
                          style={{
                            color: '#059669', background: 'none', border: 'none',
                            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            padding: '0.25rem', borderRadius: '0.25rem'
                          }}
                          title="View Details"
                          onMouseEnter={(e) => {
                            e.target.style.color = '#047857';
                            e.target.style.transform = 'scale(1.2)';
                            e.target.style.backgroundColor = '#dcfce7';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#059669';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Eye style={{ height: '1.25rem', width: '1.25rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', animation: 'fadeIn 1s ease-out' }}>
            <div style={{
              width: '5rem', height: '5rem', margin: '0 auto 1rem',
              backgroundColor: '#f3f4f6', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <Users style={{ height: '2.5rem', width: '2.5rem', color: '#9ca3af' }} />
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No students found matching your criteria.</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9, #dbeafe)' }}>
      {/* Enhanced CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
          90% { transform: translateY(-2px); }
        }
      `}</style>

      {/* Training Guide Modal */}
      {showTraining && <TrainingGuide />}

      {/* Header */}
      <header style={{
        backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '2.5rem', height: '2.5rem',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}>
                <Scissors style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
              </div>
              <h1 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                PHYSYCAL EDUCATION DASHBOARD
              </h1>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Student Measurements & Data
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>Welcome, Coach</span>
              <div style={{
                width: '2.5rem', height: '2.5rem',
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: '0.875rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.15) rotate(10deg)';
                e.target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0deg)';
                e.target.style.boxShadow = 'none';
              }}>
                C
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: '4rem', zIndex: 30 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '1rem 0.25rem', borderBottom: activeTab === 'dashboard' ? '3px solid #3b82f6' : '3px solid transparent',
                fontWeight: '500', fontSize: '0.875rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: activeTab === 'dashboard' ? '#2563eb' : '#6b7280',
                backgroundColor: activeTab === 'dashboard' ? '#dbeafe' : 'transparent',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                borderRadius: '0.5rem 0.5rem 0 0'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'dashboard') {
                  e.target.style.color = '#374151';
                  e.target.style.borderBottomColor = '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'dashboard') {
                  e.target.style.color = '#6b7280';
                  e.target.style.borderBottomColor = 'transparent';
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Activity style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Dashboard
            </button>
            
            <button
              onClick={() => {
                setActiveTab('entry');
                if (!showForm) setShowForm(true);
              }}
              style={{
                padding: '1rem 0.25rem', borderBottom: activeTab === 'entry' ? '3px solid #3b82f6' : '3px solid transparent',
                fontWeight: '500', fontSize: '0.875rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: activeTab === 'entry' ? '#2563eb' : '#6b7280',
                backgroundColor: activeTab === 'entry' ? '#dbeafe' : 'transparent',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                borderRadius: '0.5rem 0.5rem 0 0'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'entry') {
                  e.target.style.color = '#374151';
                  e.target.style.borderBottomColor = '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'entry') {
                  e.target.style.color = '#6b7280';
                  e.target.style.borderBottomColor = 'transparent';
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Data Entry
            </button>
            
            <button
              onClick={() => setActiveTab('students')}
              style={{
                padding: '1rem 0.25rem', borderBottom: activeTab === 'students' ? '3px solid #3b82f6' : '3px solid transparent',
                fontWeight: '500', fontSize: '0.875rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: activeTab === 'students' ? '#2563eb' : '#6b7280',
                backgroundColor: activeTab === 'students' ? '#dbeafe' : 'transparent',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                borderRadius: '0.5rem 0.5rem 0 0'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'students') {
                  e.target.style.color = '#374151';
                  e.target.style.borderBottomColor = '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'students') {
                  e.target.style.color = '#6b7280';
                  e.target.style.borderBottomColor = 'transparent';
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Users style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
              Students ({students.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'entry' && renderDataEntry()}
        {activeTab === 'students' && renderStudentsList()}
      </main>
    </div>
  );
};

export default DressMakingDashboard;