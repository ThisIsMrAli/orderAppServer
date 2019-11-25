const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const config = require("config");
const mongoose = require("mongoose");
const usersRoute = require("./routes/user.route");
const ordersRoute = require("./routes/order.route");
const cors = require('cors');

const app = express();
// app.use(cors({ origin: true }));
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });

if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/orderapp", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', (socket) => {
  console.log('a user is connected')
  console.log(socket.id)
})
app.set('socketio', io);
http.listen(8080, "127.0.0.1");
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use("/users", usersRoute);
app.use("/orders", ordersRoute);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
