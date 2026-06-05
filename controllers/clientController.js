const Client = require('../models/Client');
const Product = require('../models/Product');
const Activity = require('../models/Activity');

// Show all clients (with search, filter, pagination)
exports.listClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const interestFilter = req.query.interest; // 'true', 'false', or undefined

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    if (interestFilter !== undefined && interestFilter !== '') {
      filter.interested = interestFilter === 'true';
    }

    const total = await Client.countDocuments(filter);
    const clients = await Client.find(filter)
      .sort({ expectedTimeline: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('clients/index', {
      clients,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      search,
      interestFilter,
      total
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

// Show a single client with their activities
exports.showClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.redirect('/clients');
    }
    
    // Fetch activities for this client
    const activities = await Activity.find({ clientId: client._id })
      .sort({ createdAt: -1 }); // Newest first
    
    res.render('clients/show', { client, activities });
  } catch (err) {
    console.error(err);
    res.redirect('/clients');
  }
};

// Show form to add a new client
exports.newClientForm = (req, res) => {
  res.render('clients/new', { client: null, errors: null });
};

// Save a new client
exports.createClient = async (req, res) => {
  try {
    const { name, mobile, address, interested, productService, expectedAmount, expectedTimeline, remarks, priority, lastVisitDate } = req.body;
    const isInterested = (interested === 'on' || interested === 'true');
    
    const newClient = new Client({
      name,
      mobile,
      address,
      interested: isInterested,
      productService: isInterested ? (productService || '') : undefined,
      expectedAmount: isInterested ? (expectedAmount || 0) : 0,
      expectedTimeline: expectedTimeline || null,
      remarks: remarks || '',
      priority: priority || 'Mid',
      lastVisitDate: lastVisitDate || null,
      status: 'Open' // Default status for new clients
    });
    
    await newClient.save();
    res.redirect('/clients');
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.render('clients/new', { 
        client: req.body, 
        errors: 'Mobile number already exists. Please use a different number.' 
      });
    }
    res.render('clients/new', { client: req.body, errors: err.message });
  }
};

// Show edit form for a client
exports.editClientForm = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.redirect('/clients');
    res.render('clients/edit', { client, errors: null });
  } catch (err) {
    console.error(err);
    res.redirect('/clients');
  }
};

// Update an existing client
exports.updateClient = async (req, res) => {
  try {
    const { name, mobile, address, interested, productService, expectedAmount, expectedTimeline, remarks, priority, lastVisitDate, status } = req.body;
    const isInterested = (interested === 'on' || interested === 'true');
    
    const updateData = {
      name,
      mobile,
      address,
      interested: isInterested,
      productService: isInterested ? (productService || '') : undefined,
      expectedAmount: isInterested ? (expectedAmount || 0) : 0,
      expectedTimeline: expectedTimeline || null,
      remarks: remarks || '',
      priority: priority || 'Mid',
      lastVisitDate: lastVisitDate || null,
      status: status || 'Open'
    };
    
    await Client.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.redirect('/clients');
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      const client = await Client.findById(req.params.id);
      return res.render('clients/edit', { 
        client: { ...client._doc, ...req.body }, 
        errors: 'Mobile number already exists. Please use a different number.' 
      });
    }
    const client = await Client.findById(req.params.id);
    res.render('clients/edit', { client, errors: err.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    // Also delete all activities associated with this client
    await Activity.deleteMany({ clientId: req.params.id });
    await Client.findByIdAndDelete(req.params.id);
    res.redirect('/clients');
  } catch (err) {
    console.error(err);
    res.redirect('/clients');
  }
};

// Dashboard summary with priority lists (no chart)
exports.dashboard = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const interestedCount = await Client.countDocuments({ interested: true });
    const notInterestedCount = totalClients - interestedCount;

    const highPriorityClients = await Client.find({ priority: 'High' })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const midPriorityClients = await Client.find({ priority: 'Mid' })
      .sort({ createdAt: -1 })
      .limit(10);

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const upcoming = await Client.find({
      interested: true,
      expectedTimeline: { $gte: new Date(), $lte: thirtyDaysLater }
    }).sort('expectedTimeline').limit(10);

    res.render('dashboard', {
      totalClients,
      interestedCount,
      notInterestedCount,
      highPriorityClients,
      midPriorityClients,
      upcoming
    });
  } catch (err) {
    console.error(err);
    res.redirect('/clients');
  }
};

// Export all clients as CSV (includes priority and lastVisitDate)
exports.exportClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    let csv = 'Name,Mobile,Address,Priority,Status,Interested,Product/Service,Expected Amount,Expected Timeline,Last Visit Date,Remarks,Created At\n';
    
    clients.forEach(client => {
      const row = [
        `"${client.name.replace(/"/g, '""')}"`,
        client.mobile,
        `"${client.address.replace(/"/g, '""')}"`,
        client.priority || 'Mid',
        client.status || 'Open',
        client.interested ? 'Yes' : 'No',
        `"${(client.productService || '').replace(/"/g, '""')}"`,
        client.expectedAmount || 0,
        client.expectedTimeline ? client.expectedTimeline.toISOString().slice(0,10) : '',
        client.lastVisitDate ? client.lastVisitDate.toISOString().slice(0,10) : '',
        `"${(client.remarks || '').replace(/"/g, '""')}"`,
        client.createdAt ? client.createdAt.toISOString().slice(0,10) : ''
      ].join(',');
      csv += row + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="clients_export.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error exporting clients');
  }
};