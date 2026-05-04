require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');
const Alert = require('./models/Alert');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔥 Connected to MongoDB - Seeding data...');

    // Seed Schemes (25+ full schemes)
    const schemes = [
      { title: 'PM-KISAN', icon: '💰', category: 'सहायता', benefit: '₹6,000/वर्ष', description: 'छोटे किसानों के लिए वार्षिक सहायता', eligibility: '2 एकड़ तक, आधार', documents: 'आधार, बैंक', deadline: 'हमेशा' },
      { title: 'फसल बीमा योजना', icon: '🌾', category: 'बीमा', benefit: '90% प्रीमियम सब्सिडी', description: 'प्राकृतिक आपदा से सुरक्षा', eligibility: 'सभी किसान', documents: 'आधार', deadline: '30 जून' },
      { title: 'सोलर पंप', icon: '☀️', category: 'उपकरण', benefit: '75% सब्सिडी', description: 'सोलर वाटर पंप - बिजली मुफ्त', eligibility: '5 एकड़ से कम', documents: 'आधार, खेत नक्शा', deadline: '31 दिसंबर' },
      { title: 'किसान क्रेडिट कार्ड', icon: '💳', category: 'सहायता', benefit: '4% ब्याज ऋण', description: 'खेती के लिए आसान ऋण', eligibility: 'पंजीकृत किसान', documents: 'आधार', deadline: '31 दिसंबर' },
      { title: 'प्रधानमंत्री फसल बीमा', icon: '🛡️', category: 'बीमा', benefit: '₹5 लाख कवर', description: '2% प्रीमियम पर पूर्ण सुरक्षा', eligibility: 'सभी', documents: 'आधार', deadline: '30 जून' },
      // Add more...
    ];
    await Scheme.deleteMany({});
    await Scheme.insertMany(schemes);
    console.log(`✅ ${schemes.length} Schemes seeded`);

    // Seed Alerts
    const alerts = [
      { title: 'अगले 2 दिन बारिश', category: 'मौसम', description: 'आज सुबह 9 बजे', suggestion: 'खाद डालना टालें', type: 'weather', color: 'blue' },
      { title: 'गेहूं में एफिड कीट', category: 'कीट जोखिम', description: 'कल 2 PM', suggestion: 'नीम तेल स्प्रे करें', type: 'pest', color: 'amber' }
    ];
    await Alert.deleteMany({});
    await Alert.insertMany(alerts);
    console.log(`✅ ${alerts.length} Alerts seeded`);

    // Seed Demo User
    await User.deleteMany({});
    await User.create({
      name: 'राम प्रसाद यादव',
      phone: '+91 98765 43210',
      location: 'मिठापुर, बिहार',
      crops: [
        { name: 'गेहूं', icon: '🌾', area: '2.5 एकड़', progress: 65 },
        { name: 'धान', icon: '🌱', area: '1.5 एकड़', progress: 90 }
      ]
    });
    console.log('✅ Demo User seeded');

    mongoose.connection.close();
    console.log('🎉 Seeding complete! Data in kisan_sahayak DB');
  })
  .catch(err => console.error('❌ Seed error:', err));

