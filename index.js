const express = require('express');
const bodyParser = require('body-parser');
const { Doctor } = require('././models/DoctorModel');
const { Clinic } = require('././models/ClinicModel');
const { Appointment } = require('././models/AppointmentModel');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());

// Database connection
mongoose
  .connect(
    'mongodb+srv://sagar:sai@cluster0.ycrzv.mongodb.net/doctor-clinic?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection error', err);
  });

app.get('/', (req, res) => {
  const timestamp = Date.now();

  const date = new Date(timestamp);
  res.send(`Server is reachable ${timestamp}  ---  ${date.toLocaleString()}`);
});

// Doctor Routes

app.get('/doctors', (req, res) => {
  Doctor.find()
    .then((doctors) => res.send(doctors))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.post('/doctors', (req, res) => {
  if (req.body.admin) {
    const doctor = new Doctor(req.body);
    try {
      doctor
        .save()
        .then((result) => res.send(result))
        .catch((err) => {
          if ((err.code = '11000')) {
            res.send('Doctor is already present');
          }
        });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  } else {
    res.send('You Are not Admin');
  }
});

app.put('/doctors/:id', (req, res) => {
  if (req.body.admin) {
    const id = req.params.id;
    const updates = req.body;
    Doctor.findByIdAndUpdate(id, updates, { new: true })
      .then((updatedDoctor) => res.send(updatedDoctor))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  } else {
    res.send('You Are not Admin');
  }
});

app.get('/doctors/search', (req, res) => {
  const query = req.query.query;

  console.log(req.query);

  Doctor.find({
    $or: [
      { name: { $regex: query } },
      { email: { $regex: query } },
      { phone: { $regex: query } },
      { specialty: { $regex: query } },
    ],
  })
    .then((doctors) => res.send(doctors))
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal server error');
    });
});

// Clinic Routs

app.post('/clinics', (req, res) => {
  if (req.body.admin) {
    const clinic = new Clinic(req.body);
    try {
      clinic
        .save()
        .then((result) => res.send(result))
        .catch((err) => {
          if ((err.code = '11000')) {
            res.send('Clinic is already present');
            console.log(err);
          }
        });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  } else {
    res.send('You Are not Admin');
  }
});

app.get('/clinics/search', (req, res) => {
  const query = req.query.query;

  console.log(query);

  Clinic.find({
    $or: [
      { name: { $regex: query } },
      { address: { $regex: query } },
      { phone: { $regex: query } },
    ],
  })
    .then((result) => res.send(result))
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal server error');
    });
});

app.put('/clinic/:id', (req, res) => {
  if (req.body.admin) {
    const id = req.params.id;
    const updates = req.body;
    Doctor.findByIdAndUpdate(id, updates, { new: true })
      .then((updatedDoctor) => res.send(updatedDoctor))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  } else {
    res.send('You Are not Admin');
  }
});

// Appointment

app.post('/appointment', (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    appointment.save().then(() => res.send('Appointment is Booked'));
  } catch (error) {
    res.send(error);
  }
});

app.get('/appointments', (req, res) => {
  try {
    Appointment.find().then((result) => {
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

app.put('/appointment/status-change/:id', (req, res) => {
  const id = req.params.id;

  try {
    Appointment.findById(id)
      .then((result) => {
        if (result.status === 'booked') {
          Appointment.findByIdAndUpdate(
            id,
            { status: 'Confirm' },
            { new: true }
          )
            .then((result) => res.send(result))
            .catch((err) => {
              console.log(err);
              res.send(err);
            });
        } else {
          Appointment.findByIdAndUpdate(id, { status: 'booked' }, { new: true })
            .then((result) => res.send(result))
            .catch((err) => {
              console.log(err);
              res.send(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send('id not found');
      });
  } catch (err) {
    console.log(err);

    res.send(err);
  }
});

app.listen(5000, () => {
  console.log('Server is running On port 5000');
});
